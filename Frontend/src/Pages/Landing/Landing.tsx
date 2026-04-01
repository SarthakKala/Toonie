import React, { useState, useEffect, useRef } from "react";
import { MessageLoadingDemo } from "./components2/Loader";
import Grid from "./components2/Grid";
import Navbar from "./components2/Navbar";
import MarqueeText from "./components2/MarqueeText";
import { Particles } from "@/Pages/Landing/components/magicui/particles";
import { SmoothCursor } from "@/Pages/Landing/components/ui/smooth-cursor";
import AIChat from "./components2/AIChat";
import { DotPatternDemo } from "./components2/dotPattern";
import "./stylesheet/index.css";

function Landing() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // 3.5 seconds
    return () => clearTimeout(timer);
  }, []);

  const blackBoxRef = useRef<HTMLDivElement>(null);
  const handleScrollDown = () => {
    if (blackBoxRef.current) {
      blackBoxRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            background: "#161616",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.8s",
            zIndex: 9999,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <MessageLoadingDemo />
        </div>
      ) : (
        <div
          style={{
            animation: "fadeIn 1.2s cubic-bezier(.4,0,.2,1)",
            background: "#161616",
            minHeight: "100vh",
          }}
        >
          {/* // Iske upper wala loader hai, neeche se main content start hota hai. */}
          <div
            className="w-full h-full flex flex-col items-center justify-center min-h-screen"
            style={{ backgroundColor: "#161616 " }}
          >
            <SmoothCursor />
            <Navbar />

            {/* //Particles+Arrow */}
            <div
              className="relative overflow-hidden w-full h-screen"
              style={{ minHeight: "100vh" }}
            >

              <div
                style={{
                  position: "absolute",
                  top: "8vh", 
                  left: "50%",
                  transform: "translate(-50%, -10%)", 
                  // zIndex: 20,
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  cursor: "none",
                }}
              >
                <AIChat />
              </div>
              <Particles />

              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: "65px",
                  transform: "translateX(-50%)",
                  cursor: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  opacity: 0.92,
                  transition: "opacity 0.2s",
                }}
                onClick={handleScrollDown}
                tabIndex={0}
                role="button"
                aria-label="Scroll Down"
              >
                {/* Animated arrow only, bigger and slower */}
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  style={{
                    animation: "arrow-bounce 2.2s ease-in-out infinite", // slower animation
                    display: "block",
                  }}
                >
                  <path
                    d="M20 28l12 12 12-12"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <style>
                  {`
                  @keyframes arrow-bounce {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(18px); }
                    100% { transform: translateY(0); }
                  }
              `}
                </style>
              </div>
            </div>

            {/* //BlackBOX */}

            <div
              ref={blackBoxRef}
              id="features"
              className="w-[85%] mx-auto bg-#161616 mt-20 mb-20 rounded-lg"
              style={{
                backgroundColor: "#161616",
                minHeight: "1200px",
                marginTop: "8rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                className="w-full flex flex-col items-center justify-center mx-auto"
                style={{
                  maxWidth: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 2,
                  padding: "0 2rem",
                }}
              >
                {/* Section header */}
                <div style={{ marginTop: "5rem", marginBottom: "4rem", textAlign: "center" }}>
                  {/* Small pill label — persistent border + spark */}
                  <div style={{
                    position: "relative",
                    display: "inline-block",
                    padding: "1.5px",
                    borderRadius: "999px",
                    overflow: "hidden",
                    marginBottom: "1.4rem",
                  }}>
                    {/* Persistent base border (always visible) */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.18)",
                    }} />
                    {/* Rotating spark on top */}
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "260px",
                      height: "260px",
                      marginTop: "-130px",
                      marginLeft: "-130px",
                      background: "conic-gradient(from 0deg, transparent 0deg, transparent 330deg, rgba(160,160,160,0.3) 342deg, rgba(255,255,255,0.9) 350deg, rgba(255,255,255,1) 354deg, rgba(210,210,210,0.5) 358deg, transparent 360deg)",
                      animation: "spark-rotate 3s linear infinite",
                    }} />
                    {/* Inner badge */}
                    <div style={{
                      position: "relative",
                      zIndex: 1,
                      padding: "0.3rem 0.9rem",
                      borderRadius: "999px",
                      background: "#161616",
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase" as const,
                    }}>
                      AI Powered
                    </div>
                  </div>

                  {/* Big headline — two lines */}
                  <h1 style={{
                    color: "#fff",
                    fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                    fontWeight: 800,
                    lineHeight: 1.12,
                    letterSpacing: "-0.03em",
                    marginBottom: "1.2rem",
                  }}>
                    Everything you can describe,<br />
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>animated.</span>
                  </h1>

                  {/* Short descriptor — one line max */}
                  <p style={{
                    color: "rgba(255,255,255,0.38)",
                    fontSize: "1rem",
                    maxWidth: 480,
                    margin: "0 auto",
                    lineHeight: 1.6,
                  }}>
                    Type a prompt. Get live p5.js code, a real-time preview, and a video you can export — no setup, no coding.
                  </p>
                </div>
                <Grid />
                <MarqueeText />
              </div>
            </div>
            
            {/* Footer Section */}

          {/* Footer Section */}
          <footer
            style={{
              position: "relative",
              width: "100%",
              minHeight: "320px",
              background: "#161616",
              overflow: "hidden",
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {/* Dotted background */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
              <DotPatternDemo />
            </div>

            {/* Footer content */}
            <div
              className="relative z-10 w-full h-full flex flex-col justify-between ai-chat-hide-cursor"
              style={{ minHeight: 320, padding: "2.5rem 0 1.5rem 0" }}
            >
              {/* 3-column top section — Product | Tagline | Resources */}
              <div className="w-[90%] mx-auto" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr", gap: "2.5rem", alignItems: "start" }}>

                {/* Col 1 — Product links */}
                <div className="flex flex-col" style={{ gap: "0.6rem" }}>
                  <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                    Product
                  </span>
                  {[
                    { label: "Dashboard", href: "#" },
                    { label: "GitHub", href: "https://github.com/SarthakKala/Toonie" },
                    { label: "Contact", href: "#" },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", textDecoration: "none", padding: "0.2rem 0", transition: "color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                    >
                      {label}
                    </a>
                  ))}
                </div>

                {/* Col 2 — Tagline (centred) */}
                <div className="flex flex-col items-center text-center" style={{ gap: "0.85rem" }}>
                  <h2 style={{
                    color: "#fff",
                    fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)",
                    fontWeight: 800,
                    lineHeight: 1.2,
                    letterSpacing: "-0.03em",
                    margin: 0,
                    textShadow: "0 2px 24px rgba(0,0,0,0.9)",
                  }}>
                    Turn any idea into<br />a 2D animation.
                  </h2>
                  <a
                    href="#"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.55rem 1.2rem",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "rgba(30, 30, 30, 0.95)",
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      marginTop: "0.1rem",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(50, 50, 50, 0.98)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(30, 30, 30, 0.95)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                  >
                    Start Animating →
                  </a>
                </div>

                {/* Col 3 — Resources */}
                <div className="flex flex-col items-end" style={{ gap: "0.6rem" }}>
                  <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                    Resources
                  </span>
                  {[
                    { label: "Open Source", href: "https://github.com/SarthakKala/Toonie" },
                    { label: "Features", href: "#" },
                    { label: "About", href: "#" },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", textDecoration: "none", padding: "0.2rem 0", transition: "color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                    >
                      {label}
                    </a>
                  ))}
                </div>

              </div>

              {/* Large Toonie text — centred */}
              <div className="w-full flex items-end justify-center relative mt-8 mb-2">
                <span
                  className="text-[min(16vw,160px)] font-extrabold text-[#FAF9F6] leading-none tracking-tight opacity-95"
                  style={{
                    fontFamily: "inherit",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  Toonie
                </span>
              </div>

              {/* Bottom bar — glass fill from gradient line to page bottom */}
              <div style={{ position: "relative" }}>
                {/* Solid fill that covers everything from here to bottom — no dots bleed-through */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: "-200px", // extend well past the footer edge
                    background: "#161616",
                    zIndex: 0,
                  }}
                />
                {/* Glass layer on top of solid fill */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    background: "rgba(22, 22, 24, 0.72)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  {/* Gradient line — same as navbar */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "1px",
                      background: "linear-gradient(to right, transparent 0%, #b0b0b0 48%, #b0b0b0 52%, transparent 100%)",
                      opacity: 0.7,
                      pointerEvents: "none",
                    }}
                  />
                  <div className="w-[90%] mx-auto flex flex-row justify-between items-center text-white/80 text-sm" style={{ padding: "1rem 0" }}>
                    <span>Copyright © Toonie. All rights reserved</span>
                    <span>Made with 🤍 from Sarthak</span>
                    <div className="flex gap-8">
                      <a href="#" className="hover:underline">GitHub</a>
                      <a href="#" className="hover:underline">Instagram</a>
                      <a href="#" className="hover:underline">LinkedIn</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
                          
          </div>
        </div>
      )}
      {/* //Iske upper main content hai, neeche se loader start hota hai. */}
      {/* Fade-in animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes spark-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}

export default Landing;
