import * as dns from 'node:dns/promises';
import * as cheerio from 'cheerio';

export interface ExtractedSource {
  id: string; // e.g. "S1", "S2"
  url: string;
  normalizedUrl: string;
  domain: string;
  title: string;
  textContent: string;
  extractedLength: number;
  publishedDate?: string;
  status: 'success' | 'failed';
  error?: string;
}

export interface ExtractionBatchResult {
  totalSubmitted: number;
  successfulCount: number;
  failedCount: number;
  sources: ExtractedSource[];
}

const TIMEOUT_MS = 10000; // 10 seconds timeout per source
const MAX_CONTENT_LENGTH = 150000; // ~150KB raw text max
const MAX_TEXT_TOKENS_CHAR = 25000; // max ~25k characters extracted text per source

/**
 * Checks if an IP address belongs to private, loopback, link-local or carrier-grade NAT blocks.
 */
function isPrivateOrReservedIp(ip: string): boolean {
  // IPv4 checks
  if (ip.includes('.')) {
    const parts = ip.split('.').map(p => parseInt(p, 10));
    if (parts.length !== 4 || parts.some(isNaN)) return true;

    // 0.0.0.0/8
    if (parts[0] === 0) return true;
    // 10.0.0.0/8 (Private)
    if (parts[0] === 10) return true;
    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    // 169.254.0.0/16 (Link Local)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 172.16.0.0/12 (Private)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16 (Private)
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 100.64.0.0/10 (Carrier grade NAT)
    if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;
    // 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 (TEST-NET)
    if (parts[0] === 192 && parts[1] === 0 && parts[2] === 2) return true;
    if (parts[0] === 198 && parts[1] === 51 && parts[2] === 100) return true;
    if (parts[0] === 203 && parts[1] === 0 && parts[2] === 113) return true;
    // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
    if (parts[0] >= 224) return true;
  }

  // IPv6 checks
  if (ip.includes(':')) {
    const lower = ip.toLowerCase();
    if (lower === '::1' || lower === '::') return true; // loopback / unspecified
    if (lower.startsWith('fe80:')) return true; // link-local
    if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // unique local
    if (lower.startsWith('::ffff:')) {
      const ipv4Part = lower.replace('::ffff:', '');
      return isPrivateOrReservedIp(ipv4Part);
    }
  }

  return false;
}

export class SourceExtractor {
  /**
   * Normalizes raw URL by trimming, prepending https:// if missing, and validating.
   */
  public normalizeUrl(raw: string): string {
    let trimmed = raw.trim();
    if (!trimmed) throw new Error('Empty URL provided');

    // Prepend https:// if protocol is missing
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
    }

    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error(`Unsupported protocol: ${parsed.protocol}. Only HTTP/HTTPS allowed.`);
    }

    return parsed.href;
  }

  /**
   * Verifies that the host does not resolve to private or internal addresses (SSRF guard).
   */
  private async validateHostSecurity(hostname: string): Promise<void> {
    const lowerHost = hostname.toLowerCase();

    // Check blacklist names
    if (
      lowerHost === 'localhost' ||
      lowerHost.endsWith('.localhost') ||
      lowerHost.endsWith('.local') ||
      lowerHost.endsWith('.internal') ||
      lowerHost === '0.0.0.0' ||
      lowerHost === '127.0.0.1' ||
      lowerHost === '::1'
    ) {
      throw new Error(`Access to internal/loopback host "${hostname}" is forbidden.`);
    }

    try {
      const lookupResult = await dns.lookup(hostname, { all: true });
      for (const entry of lookupResult) {
        if (isPrivateOrReservedIp(entry.address)) {
          throw new Error(
            `Host "${hostname}" resolved to private/restricted IP (${entry.address}). Request blocked.`
          );
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('forbidden') || msg.includes('resolved to private')) {
        throw err;
      }
      throw new Error(`Could not resolve hostname "${hostname}": ${msg}`);
    }
  }

  /**
   * Fetch a single URL safely with timeout, content size limit, and SSRF security check.
   */
  public async fetchAndExtract(id: string, rawUrl: string): Promise<ExtractedSource> {
    let normalized = '';
    let domain = '';

    try {
      normalized = this.normalizeUrl(rawUrl);
      const parsed = new URL(normalized);
      domain = parsed.hostname;

      // 1. SSRF prevention
      await this.validateHostSecurity(parsed.hostname);

      // 2. Fetch with abort timeout and safe headers
      const controller = new AbortController();
      const timeoutTimer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      let response: Response;
      try {
        response = await fetch(normalized, {
          signal: controller.signal,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 NirnayaAI/1.0 ResearchBot',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          redirect: 'follow',
        });
      } finally {
        clearTimeout(timeoutTimer);
      }

      // Check redirect safety if URL changed
      if (response.url && response.url !== normalized) {
        const redirectUrl = new URL(response.url);
        if (redirectUrl.protocol !== 'http:' && redirectUrl.protocol !== 'https:') {
          throw new Error(`Redirected to unsupported protocol: ${redirectUrl.protocol}`);
        }
        await this.validateHostSecurity(redirectUrl.hostname);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} (${response.statusText || 'Fetch failed'})`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (
        !contentType.includes('text/html') &&
        !contentType.includes('text/plain') &&
        !contentType.includes('application/xhtml+xml') &&
        !contentType.includes('application/xml') &&
        !contentType.includes('application/json')
      ) {
        throw new Error(`Non-text content type: ${contentType}`);
      }

      // Read text with size limit
      const rawBody = await response.text();
      if (!rawBody || rawBody.trim().length === 0) {
        throw new Error('Retrieved page body is empty.');
      }

      const truncatedBody = rawBody.slice(0, MAX_CONTENT_LENGTH);

      // 3. Extract readable text and title using Cheerio
      const $ = cheerio.load(truncatedBody);

      // Remove noise elements
      $(
        'script, style, noscript, nav, footer, header, svg, iframe, form, button, ' +
          'dialog, .ad, .ads, .advertisement, .cookie-banner, .popup, #cookie-notice'
      ).remove();

      // Extract title
      const title =
        $('meta[property="og:title"]').attr('content') ||
        $('title').text().trim() ||
        $('h1').first().text().trim() ||
        domain;

      // Extract published date if available
      const publishedDate =
        $('meta[property="article:published_time"]').attr('content') ||
        $('meta[name="pubdate"]').attr('content') ||
        $('meta[name="publishdate"]').attr('content') ||
        $('time').first().attr('datetime') ||
        $('time').first().text().trim() ||
        undefined;

      // Prefer main article content if exists
      let mainText = '';
      const articleEl = $('article, main, [role="main"], .content, #content, .post-content, .entry-content');
      if (articleEl.length > 0) {
        mainText = articleEl.text();
      } else {
        mainText = $('body').text();
      }

      // Clean up whitespace
      const cleanedText = mainText
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      if (cleanedText.length < 100) {
        throw new Error('Insufficient readable text extracted from page (less than 100 characters).');
      }

      // Truncate cleanly for Gemini context
      const finalText = cleanedText.slice(0, MAX_TEXT_TOKENS_CHAR);

      return {
        id,
        url: rawUrl,
        normalizedUrl: normalized,
        domain,
        title: title.slice(0, 150),
        textContent: finalText,
        extractedLength: finalText.length,
        publishedDate: publishedDate ? publishedDate.slice(0, 40) : undefined,
        status: 'success',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        id,
        url: rawUrl,
        normalizedUrl: normalized || rawUrl,
        domain: domain || 'unknown',
        title: domain || rawUrl,
        textContent: '',
        extractedLength: 0,
        status: 'failed',
        error: msg.replace(/AbortError|aborted/i, 'Request timed out after 10s'),
      };
    }
  }

  /**
   * Batch process multiple source URLs with concurrency limit
   */
  public async extractAll(urls: string[]): Promise<ExtractionBatchResult> {
    const cleanUrls = urls.map(u => u.trim()).filter(Boolean);

    // Limit to 8 sources as per specification
    const limitedUrls = cleanUrls.slice(0, 8);

    // Execute fetches in parallel
    const promises = limitedUrls.map((url, index) => {
      const id = `S${index + 1}`;
      return this.fetchAndExtract(id, url);
    });

    const sources = await Promise.all(promises);
    const successfulCount = sources.filter(s => s.status === 'success').length;
    const failedCount = sources.filter(s => s.status === 'failed').length;

    return {
      totalSubmitted: limitedUrls.length,
      successfulCount,
      failedCount,
      sources,
    };
  }
}

export const sourceExtractor = new SourceExtractor();
