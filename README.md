# NIRNAYA AI 🧭

> **"Know More. Question Better. Decide Smarter."**

*A solo hackathon project engineered for rigorous multi-source research interrogation, critical claim triangulation, and audit-ready decision synthesis.*

---

## 💡 Overview

In Sanskrit and Hindi, **"NIRNAYA" (निर्णय)** denotes definitive judgment and resolution reached through inquiry and evidence. 

Most modern AI chat tools suffer from "sycophancy bias"—they blindly summarize whichever links you feed them without challenging conflicting facts, uncovering unsupported claims, or testing counter-hypotheses. **NIRNAYA AI** inverses this approach by acting as an intellectual interrogator:

- Ingests 1 to 8 independent research reports, URLs, and documentation sources.
- Normalizes URLs (e.g. prepending `https://` if omitted).
- Fetches live web pages with timeouts, content-length limits, and strict SSRF defenses (blocks `localhost`, loopback, and private IPv4/IPv6 ranges).
- Extracts clean, readable text using Cheerio (removing scripts, styles, navigation, ads, cookie banners).
- Connects to Google Gemini server-side using the official `@google/genai` SDK.
- Synthesizes an audit-ready dossier:
  - Evidence-backed findings with specific source IDs (`[S1]`, `[S2]`) and verbatim supporting excerpts
  - Information gaps and their impact on decisions
  - Contradictory claims with explicit side-by-side statements and interrogation notes
  - Potentially outdated information with date references
  - Unanswered questions to probe
  - Prioritized verification checklist
  - Executive decision summary
- Keeps all API credentials strictly isolated in `backend/.env`.

---

## ⚡ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, Lucide React Icons |
| **Hero Visualization** | Custom 3D Canvas Rotating Earth Mesh with Orbiting Data Nodes |
| **Backend API** | Node.js, Express, TypeScript, CORS, Cheerio, Dotenv |
| **AI Engine** | Google Gemini (`@google/genai`) configured server-side |
| **Security & Privacy** | SSRF prevention (DNS IP inspection), server-side key isolation, zero client-side secrets |

---

## 📁 Repository Structure

```text
NIRNAYA-AI/
├── .env.example             # Root environment reference
├── .gitignore               # Comprehensive Git ignore rules (node_modules, .env, dist)
├── README.md                # Project documentation & execution guide
├── package.json             # Root convenience scripts (install:all, dev, build)
│
├── frontend/                # React + Vite + TypeScript frontend
│   ├── index.html           # Document shell with custom branding & metadata
│   ├── package.json         # Frontend dependencies & build scripts
│   ├── tsconfig.json        # Frontend TypeScript config
│   ├── vite.config.ts       # Vite configuration with Tailwind CSS & API proxy
│   ├── public/
│   │   └── favicon.svg      # NIRNAYA compass brand favicon
│   └── src/
│       ├── main.tsx         # React root mounting
│       ├── App.tsx          # Main application layout & sections
│       ├── index.css        # Tailwind CSS theme & custom glowing styles
│       ├── services/
│       │   └── api.ts       # API service for health check & live research analysis
│       └── components/
│           ├── Navbar.tsx        # Sticky responsive navbar with live API status
│           ├── RotatingEarth.tsx # 3D HTML5 Canvas rotating Earth globe
│           ├── Hero.tsx          # Hero section with tagline, CTAs & Earth canvas
│           ├── HowItWorks.tsx    # 4-stage pipeline breakdown
│           ├── Features.tsx      # 6 core capability cards
│           ├── UseCases.tsx      # Real-world strategic workflows
│           ├── ResearchForm.tsx  # Dynamic intake form & full analysis dashboard
│           ├── About.tsx         # Project origin, solo hackathon narrative & stack
│           ├── FAQ.tsx           # Accordion FAQ
│           └── Footer.tsx        # Branding, navigation links & copyright
│
└── backend/                 # Node.js + Express backend
    ├── package.json         # Backend dependencies & scripts
    ├── tsconfig.json        # Backend TypeScript config
    ├── .env.example         # Server-side environment configuration template
    ├── .env                 # Server-side environment file (GIT IGNORED)
    └── src/
        ├── server.ts        # Express app entrypoint & middleware
        ├── config/
        │   └── index.ts     # Safe environment variable configuration
        ├── routes/
        │   ├── health.ts    # GET /api/health endpoint
        │   └── research.ts  # POST /api/research/validate & /api/analyze
        ├── controllers/
        │   └── researchController.ts # Ingestion, extraction, and Gemini orchestration
        └── services/
            ├── geminiService.ts   # Modular Google Gemini SDK integration
            └── sourceExtractor.ts # SSRF-safe URL fetcher & Cheerio text extractor
```

---

## 🚀 Getting Started & Configuration

### Prerequisites

- **Node.js** (v18.0.0 or higher, verified on Node v26)
- **npm** (v9.0.0 or higher)

### 1. Install Dependencies

You can install all dependencies from the root directory:

```bash
npm run install:all
```

Or separately:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Gemini API Key

Open `backend/.env` (or copy from `backend/.env.example` if not already created):

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Put your Google Gemini API key below:
# Obtain from Google AI Studio: https://aistudio.google.com/
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

> **Security Note:** `GEMINI_API_KEY` is strictly maintained on the Express backend server. It is never exposed in client bundles, browser requests, logs, or Git commits.

### 3. Run Development Servers

Run backend and frontend in two separate terminals:

**Terminal 1 (Backend API):**
```bash
npm run dev:backend
# Starts Express server on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev:frontend
# Starts Vite dev server on http://localhost:5173
```

---

## 🧪 Testing a Complete Analysis

### Option A: Via the Web UI
1. Navigate to `http://localhost:5173`.
2. Scroll to the **Execute Multi-Source Interrogation** section (or click **Launch Research** in the navbar).
3. Click **"Load Verified Sample (Wikipedia Quantum)"** to pre-fill the topic, goal, and sample URLs.
4. Click **"Execute Live End-to-End Analysis"**:
   - The backend validates the inputs.
   - It fetches the live Wikipedia pages, filters out navigation/noise, and verifies SSRF safety.
   - If `GEMINI_API_KEY` is configured in `backend/.env`, it sends the extracted content to Gemini and displays the complete interactive dossier.
   - If `GEMINI_API_KEY` is missing, it displays the setup requirement card alongside the successfully extracted sources (character count, titles, domains).

### Option B: Via Command Line (Health & Analysis Test)

**1. Check Health Endpoint:**
```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/health -Method Get | ConvertTo-Json
```

**2. Test Live Web Extraction & Analysis:**
```powershell
$body = @{
  topic = "Quantum Computing Scalability"
  goal = "Identify primary hardware bottlenecks for fault-tolerant qubits"
  sourceUrls = @(
    "https://en.wikipedia.org/wiki/Quantum_computing",
    "https://en.wikipedia.org/wiki/Qubit"
  )
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/analyze -Method Post -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 6
```

---

## 🔒 Security Features

1. **SSRF Guard:** Checks hostnames against loopback, private RFC1918 blocks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), link-local (`169.254.0.0/16`), carrier-grade NAT, and IPv6 unique local/loopback.
2. **Fetch Timeout & Payload Cap:** 10-second timeout per source with size limitations to prevent memory exhaustion and hanging connections.
3. **No Synthetic Citations:** Gemini prompt strictly enforces citing only the provided sources with source IDs (`[S1]`, `[S2]`) and verbatim excerpts.
4. **Server-Side Key Isolation:** Client communicates only with `/api/analyze` and `/api/health`.

---

## 📄 License

MIT License. Developed for the Solo Hackathon.
