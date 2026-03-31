import React, { useRef, useEffect } from "react";
import IconCloudDemo from "../components/ui/IconCloud";

// ─── Shared card style ────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "linear-gradient(120deg, #181818 80%, #1e1e1e 100%)",
  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.65)",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.06)",
  overflow: "hidden",
  position: "relative",
};

const label: React.CSSProperties = {
  color: "rgba(255,255,255,0.3)",
  fontSize: "0.65rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  marginBottom: "0.75rem",
};

// ─── Generative wave canvas ───────────────────────────────────────────────────
const GenerativeCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      // Slow trail so old lines fade gently
      ctx.fillStyle = "rgba(24, 24, 24, 0.10)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const N = 16;
      for (let i = 0; i < N; i++) {
        ctx.beginPath();
        const opacity = 0.06 + (i / N) * 0.32;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 0.9;

        for (let x = 0; x <= canvas.width; x += 2) {
          const freq = 0.005 + i * 0.0014;
          const amp = 14 + i * 5;
          const phase = t * 0.016 + i * 0.42;
          const y =
            canvas.height / 2 +
            Math.sin(x * freq + phase) * amp +
            Math.sin(x * freq * 0.6 + phase * 1.4) * (amp * 0.35) +
            (i - N / 2) * 13;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      t++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
};

// ─── Timeline mockup ──────────────────────────────────────────────────────────
const TimelineMockup: React.FC = () => {
  const tracks = [
    [
      { left: "0%", width: "38%" },
      { left: "42%", width: "44%" },
    ],
    [
      { left: "4%", width: "22%" },
      { left: "30%", width: "28%" },
      { left: "62%", width: "30%" },
    ],
    [
      { left: "10%", width: "50%" },
    ],
  ];

  return (
    <div style={{ width: "100%", userSelect: "none" }}>
      {/* Ruler */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          paddingBottom: "6px",
          marginBottom: "8px",
        }}
      >
        {["0s", "2s", "4s", "6s", "8s", "10s"].map((t) => (
          <span key={t} style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.6rem" }}>
            {t}
          </span>
        ))}
      </div>

      {/* Tracks + playhead */}
      <div style={{ position: "relative" }}>
        {tracks.map((clips, ti) => (
          <div
            key={ti}
            style={{
              position: "relative",
              height: "26px",
              background: "rgba(255,255,255,0.025)",
              borderRadius: "5px",
              marginBottom: "6px",
              overflow: "hidden",
            }}
          >
            {clips.map((c, ci) => (
              <div
                key={ci}
                style={{
                  position: "absolute",
                  left: c.left,
                  width: c.width,
                  height: "100%",
                  background:
                    ti === 0
                      ? "rgba(255,255,255,0.13)"
                      : ti === 1
                      ? "rgba(255,255,255,0.09)"
                      : "rgba(255,255,255,0.06)",
                  borderRadius: "4px",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>
        ))}

        {/* Playhead */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "31%",
            width: "1px",
            height: "calc(100% + 6px)",
            background: "rgba(255,255,255,0.55)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-1px",
              left: "-4px",
              width: 0,
              height: 0,
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: "5px solid rgba(255,255,255,0.55)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Code snippet ─────────────────────────────────────────────────────────────
const CodeSnippet: React.FC = () => {
  // Opacity-only "syntax highlight" — no colour, only white/grey shades
  const lines: { text: string; op: number }[] = [
    { text: "function sketch(p) {", op: 0.28 },
    { text: "  p.setup = () => {", op: 0.45 },
    { text: "    p.createCanvas(800, 400);", op: 0.6 },
    { text: "    p.background(0);", op: 0.5 },
    { text: "  };", op: 0.45 },
    { text: "  p.draw = () => {", op: 0.45 },
    { text: "    p.stroke(255, 160);", op: 0.75 },
    { text: "    p.noFill();", op: 0.55 },
    { text: "    for (let i = 0; i < 12; i++) {", op: 0.7 },
    { text: "      p.circle(p.width/2, p.height/2, i * 36);", op: 0.6 },
    { text: "    }", op: 0.55 },
    { text: "  };", op: 0.45 },
    { text: "}", op: 0.28 },
  ];

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.35)",
        borderRadius: "10px",
        padding: "0.9rem 1.1rem",
        fontFamily: "'Fira Mono', 'Consolas', monospace",
        fontSize: "0.75rem",
        lineHeight: 1.65,
        position: "relative",
        overflow: "hidden",
        flex: 1,
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ color: `rgba(255,255,255,${l.op})`, whiteSpace: "pre" }}>
          {l.text}
        </div>
      ))}
      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "55%",
          background: "linear-gradient(to top, rgba(10,10,10,0.96) 0%, transparent 100%)",
          borderRadius: "0 0 10px 10px",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

// ─── Grid ─────────────────────────────────────────────────────────────────────
const Grid: React.FC = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "300px 220px 240px",
        gap: "16px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* ── 1. Live canvas — col 1, rows 1-2 ── */}
      <div style={{ ...card, gridColumn: "1 / 2", gridRow: "1 / 3", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          <GenerativeCanvas />
        </div>
        <div
          style={{
            padding: "1rem 1.4rem 1.4rem",
            background: "linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.85) 100%)",
            flexShrink: 0,
          }}
        >
          <p style={label}>Live Preview</p>
          <p style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600, lineHeight: 1.4 }}>
            AI generates this from a single line of text
          </p>
        </div>
      </div>

      {/* ── 2. Timeline — col 2, row 1 ── */}
      <div
        style={{
          ...card,
          gridColumn: "2 / 3",
          gridRow: "1 / 2",
          padding: "1.4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p style={label}>Timeline Editor</p>
        <TimelineMockup />
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", marginTop: "0.9rem" }}>
          Arrange clips, trim, and compose your final video
        </p>
      </div>

      {/* ── 3. Speed stat — col 3, row 1 ── */}
      <div
        style={{
          ...card,
          gridColumn: "3 / 4",
          gridRow: "1 / 2",
          padding: "1.4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p style={label}>Speed</p>
        <div>
          <p
            style={{
              color: "#fff",
              fontSize: "5rem",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
          >
            30s
          </p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", marginTop: "0.5rem" }}>
            From prompt to animation
          </p>
        </div>
      </div>

      {/* ── 4. Zero code — col 4, row 1 ── */}
      <div
        style={{
          ...card,
          gridColumn: "4 / 5",
          gridRow: "1 / 2",
          padding: "1.4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p style={label}>Accessibility</p>
        <div>
          {/* Chat bubble icon — type a prompt, get an animation */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            style={{ marginBottom: "0.85rem" }}
          >
            <rect x="1" y="1" width="30" height="22" rx="6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            <path d="M7 28 L4 36 L14 30" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            <line x1="7" y1="8" x2="23" y2="8" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="7" y1="13" x2="19" y2="13" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
            {/* blinking cursor dot */}
            <rect x="20" y="11" width="1.5" height="4" rx="0.75" fill="rgba(255,255,255,0.5)" />
          </svg>
          <p style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 700 }}>
            No coding knowledge needed
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", marginTop: "0.35rem" }}>
            Just describe what you want
          </p>
        </div>
      </div>

      {/* ── 5. Code transparency — col 2-4, row 2 ── */}
      <div
        style={{
          ...card,
          gridColumn: "2 / 5",
          gridRow: "2 / 3",
          padding: "1.4rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p style={label}>Code Transparency</p>
        <CodeSnippet />
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", marginTop: "0.75rem" }}>
          Every animation is backed by real, editable p5.js code — see and modify exactly what AI writes
        </p>
      </div>

      {/* ── 6. Tech stack — col 1, row 3 ── */}
      <div
        style={{
          ...card,
          gridColumn: "1 / 2",
          gridRow: "3 / 4",
          padding: "1.2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          overflow: "hidden",
        }}
      >
        <p style={{ ...label, marginBottom: "0.2rem" }}>Built With</p>
        {/* Canvas is hardcoded 400×400 — scale it down to fill the card */}
        <div style={{ flex: 1, width: "100%", minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ width: 400, height: 400, transform: "scale(0.73)", transformOrigin: "center center", flexShrink: 0 }}>
            <IconCloudDemo />
          </div>
        </div>
      </div>

      {/* ── 7. Built for creators — col 2, row 3 ── */}
      <div
        style={{
          ...card,
          gridColumn: "2 / 3",
          gridRow: "3 / 4",
          padding: "1.4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p style={label}>Built For</p>
        <div>
          <p style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>
            Every kind of creator
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {["Designers", "Developers", "Students", "Marketers"].map((name) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.4)",
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.84rem" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 8. Export formats — col 3, row 3 ── */}
      <div
        style={{
          ...card,
          gridColumn: "3 / 4",
          gridRow: "3 / 4",
          padding: "1.4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p style={label}>Export</p>
        <div>
          <p style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 700, marginBottom: "1rem" }}>
            Export in any format
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {["MP4", "WebM", "GIF"].map((fmt) => (
              <div
                key={fmt}
                style={{
                  padding: "0.35rem 0.85rem",
                  borderRadius: "5px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  fontFamily: "monospace",
                  letterSpacing: "0.04em",
                }}
              >
                {fmt}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 9. GitHub / open source — col 4, row 3 ── */}
      <div
        style={{
          ...card,
          gridColumn: "4 / 5",
          gridRow: "3 / 4",
          padding: "1.4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p style={label}>Open Source</p>
        <div>
          {/* GitHub SVG icon */}
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="rgba(255,255,255,0.6)"
            style={{ marginBottom: "0.75rem" }}
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <p style={{ color: "#fff", fontSize: "0.92rem", fontWeight: 700, marginBottom: "0.3rem" }}>
            Open Source
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
            View the code, contribute, and star the repo
          </p>
        </div>
      </div>
    </div>
  );
};

export default Grid;
