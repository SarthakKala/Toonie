import React, { useState, useEffect } from "react";

const ChevronDown = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "3px", marginTop: "-1px" }}
  >
    <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const navLinkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.55)",
  fontSize: "0.82rem",
  textDecoration: "none",
  transition: "color 0.15s",
  display: "flex",
  alignItems: "center",
  gap: "1px",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
  fontFamily: "inherit",
};

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleHover = (e: React.MouseEvent<HTMLElement>, enter: boolean) => {
    e.currentTarget.style.color = enter ? "#fff" : "rgba(255,255,255,0.55)";
  };

  return (
    <nav
      style={{
        width: "100vw",
        height: "55px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10,
        background: scrolled ? "rgba(22, 22, 24, 0.92)" : "rgba(22, 22, 24, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transition: "background 0.35s ease",
      }}
    >
      {/* Bottom gradient line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100vw",
          height: "2px",
          pointerEvents: "none",
          background: "linear-gradient(to right, transparent 0%, #b0b0b0 48%, #b0b0b0 52%, transparent 100%)",
          opacity: 0.7,
        }}
      />

      {/* 3-column inner layout */}
      <div
        style={{
          width: "90%",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        {/* Left — Brand */}
        <span
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "1.05rem",
            letterSpacing: "-0.03em",
            userSelect: "none",
          }}
        >
          Toonie
        </span>

        {/* Center — Nav links */}
        <div style={{ display: "flex", gap: "1.8rem", alignItems: "center" }}>
          {/* What we offer */}
          <span
            style={navLinkStyle}
            onMouseEnter={e => handleHover(e, true)}
            onMouseLeave={e => handleHover(e, false)}
          >
            What we offer <ChevronDown />
          </span>

          {/* Who's it for */}
          <span
            style={navLinkStyle}
            onMouseEnter={e => handleHover(e, true)}
            onMouseLeave={e => handleHover(e, false)}
          >
            Who's it for <ChevronDown />
          </span>

          {/* GitHub */}
          <a
            href="https://github.com/SarthakKala/Toonie"
            target="_blank"
            rel="noopener noreferrer"
            style={navLinkStyle}
            onMouseEnter={e => handleHover(e, true)}
            onMouseLeave={e => handleHover(e, false)}
          >
            GitHub
          </a>

          {/* About */}
          <a
            href="#"
            style={navLinkStyle}
            onMouseEnter={e => handleHover(e, true)}
            onMouseLeave={e => handleHover(e, false)}
          >
            About
          </a>
        </div>

        {/* Right — Settings button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.38rem 1rem",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.82rem",
              fontWeight: 500,
              textDecoration: "none",
              transition: "background 0.15s, border-color 0.15s, color 0.15s",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.11)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = "rgba(255,255,255,0.85)";
            }}
          >
            Settings
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
