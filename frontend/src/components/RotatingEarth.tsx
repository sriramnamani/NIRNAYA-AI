import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  isContinent?: boolean;
}

export const RotatingEarth: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationAngle = 0;
    let tilt = 0.22; // subtle axial tilt like real Earth (~23.5 degrees)

    // Generate sphere points: latitude/longitude grid + continent approximations
    const points: Point3D[] = [];
    const radius = 175;

    // Grid points
    const latLines = 18;
    const lonLines = 28;
    for (let i = 0; i <= latLines; i++) {
      const lat = (i * Math.PI) / latLines - Math.PI / 2;
      for (let j = 0; j < lonLines; j++) {
        const lon = (j * 2 * Math.PI) / lonLines;
        points.push({
          x: radius * Math.cos(lat) * Math.sin(lon),
          y: radius * Math.sin(lat),
          z: radius * Math.cos(lat) * Math.cos(lon),
          isContinent: false,
        });
      }
    }

    // Dense continent clusters
    const continents = [
      // North America (lat 15 to 65, lon -160 to -50)
      { latMin: 20, latMax: 60, lonMin: -130, lonMax: -60, count: 90 },
      // South America (lat -50 to 10, lon -80 to -35)
      { latMin: -50, latMax: 10, lonMin: -80, lonMax: -35, count: 70 },
      // Europe (lat 36 to 65, lon -10 to 40)
      { latMin: 36, latMax: 65, lonMin: -10, lonMax: 40, count: 85 },
      // Africa (lat -35 to 35, lon -15 to 50)
      { latMin: -35, latMax: 35, lonMin: -15, lonMax: 50, count: 110 },
      // Asia (lat 10 to 70, lon 40 to 140)
      { latMin: 10, latMax: 70, lonMin: 40, lonMax: 140, count: 160 },
      // Australia (lat -40 to -12, lon 115 to 155)
      { latMin: -40, latMax: -12, lonMin: 115, lonMax: 155, count: 50 },
    ];

    continents.forEach(c => {
      for (let k = 0; k < c.count; k++) {
        const latDeg = c.latMin + Math.random() * (c.latMax - c.latMin);
        const lonDeg = c.lonMin + Math.random() * (c.lonMax - c.lonMin);
        const lat = (latDeg * Math.PI) / 180;
        const lon = (lonDeg * Math.PI) / 180;
        points.push({
          x: radius * Math.cos(lat) * Math.sin(lon),
          y: radius * Math.sin(lat),
          z: radius * Math.cos(lat) * Math.cos(lon),
          isContinent: true,
        });
      }
    });

    // Satellites orbiting
    const satellites = [
      { radius: radius * 1.35, speed: 0.02, angle: 0, tilt: 0.6, label: 'Gemini Node Alpha' },
      { radius: radius * 1.45, speed: -0.015, angle: Math.PI / 2, tilt: -0.4, label: 'Citation Verifier' },
      { radius: radius * 1.25, speed: 0.025, angle: Math.PI, tilt: 0.8, label: 'Fact Extractor' },
    ];

    // Resize handler
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      const dpr = window.devicePixelRatio || 1;
      const width = Math.min(container.clientWidth, 520);
      const height = width;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse movement interaction
    let targetTilt = 0.22;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      targetTilt = 0.22 + relY * 0.3;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const render = () => {
      rotationAngle += 0.006;
      tilt += (targetTilt - tilt) * 0.05;

      const width = parseFloat(canvas.style.width || '450');
      const height = parseFloat(canvas.style.height || '450');
      const centerX = width / 2;
      const centerY = height / 2;
      const currentRadius = Math.min(width, height) * 0.36;
      const scale = currentRadius / radius;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw outer atmospheric glow
      const atmosphere = ctx.createRadialGradient(
        centerX, centerY, currentRadius * 0.85,
        centerX, centerY, currentRadius * 1.3
      );
      atmosphere.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
      atmosphere.addColorStop(0.5, 'rgba(56, 189, 248, 0.06)');
      atmosphere.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = atmosphere;
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw globe base sphere outline
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Deep dark globe shading
      const sphereGradient = ctx.createRadialGradient(
        centerX - currentRadius * 0.3,
        centerY - currentRadius * 0.3,
        10,
        centerX,
        centerY,
        currentRadius
      );
      sphereGradient.addColorStop(0, 'rgba(11, 25, 44, 0.9)');
      sphereGradient.addColorStop(0.8, 'rgba(5, 10, 18, 0.95)');
      sphereGradient.addColorStop(1, 'rgba(2, 6, 12, 0.98)');
      ctx.fillStyle = sphereGradient;
      ctx.fill();
      ctx.restore();

      // 3. Draw Orbit Rings behind
      satellites.forEach(sat => {
        sat.angle += sat.speed;
        const satRadius = sat.radius * scale;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(sat.tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, satRadius, satRadius * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.setLineDash([4, 6]);
        ctx.stroke();

        // Calculate satellite position
        const satX = satRadius * Math.cos(sat.angle);
        const satY = satRadius * 0.35 * Math.sin(sat.angle);

        // Satellite node dot
        ctx.fillStyle = '#38BDF8';
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(satX, satY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Little ping circle
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.beginPath();
        ctx.arc(satX, satY, 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      });

      // 4. Project and sort 3D points
      const cosA = Math.cos(rotationAngle);
      const sinA = Math.sin(rotationAngle);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      const projected = points.map(pt => {
        // Rotate around Y axis (azimuth)
        const x1 = pt.x * cosA + pt.z * sinA;
        const y1 = pt.y;
        const z1 = -pt.x * sinA + pt.z * cosA;

        // Rotate around X axis (tilt)
        const x2 = x1;
        const y2 = y1 * cosT - z1 * sinT;
        const z2 = y1 * sinT + z1 * cosT;

        return {
          x: centerX + x2 * scale,
          y: centerY + y2 * scale,
          z: z2,
          isContinent: pt.isContinent,
        };
      });

      // Sort points back to front
      projected.sort((a, b) => a.z - b.z);

      // Render points
      projected.forEach(p => {
        const isFront = p.z > -20;
        const depthAlpha = (p.z + radius) / (2 * radius);
        const alpha = isFront
          ? Math.max(0.2, Math.min(1, depthAlpha * 1.2))
          : Math.max(0.04, depthAlpha * 0.15);

        const pointSize = p.isContinent
          ? (isFront ? 1.8 : 1.0)
          : (isFront ? 1.2 : 0.7);

        ctx.beginPath();
        ctx.arc(p.x, p.y, pointSize, 0, Math.PI * 2);

        if (p.isContinent) {
          ctx.fillStyle = isFront
            ? `rgba(56, 189, 248, ${alpha})`
            : `rgba(14, 116, 144, ${alpha * 0.4})`;
        } else {
          ctx.fillStyle = isFront
            ? `rgba(186, 230, 253, ${alpha * 0.7})`
            : `rgba(56, 189, 248, ${alpha * 0.3})`;
        }
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center w-full max-w-[500px] aspect-square mx-auto">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Canvas Earth */}
      <canvas
        ref={canvasRef}
        className="cursor-grab active:cursor-grabbing drop-shadow-[0_0_35px_rgba(56,189,248,0.25)]"
      />

      {/* Floating Overlay Badge: Live Node Status */}
      <div className="absolute -bottom-2 sm:bottom-2 left-1/2 -translate-x-1/2 bg-[#050A12]/90 backdrop-blur-md border border-sky-500/30 px-4 py-1.5 rounded-full flex items-center space-x-2 text-xs font-mono text-sky-300 shadow-lg shadow-sky-950/50">
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
        <span>GLOBAL SOURCE NETWORK • 100% CITATION LINEAGE</span>
      </div>
    </div>
  );
};
