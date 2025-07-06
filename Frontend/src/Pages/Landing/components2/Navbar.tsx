import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav
    style={{
      width: "100vw",
      height: "55px",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 10,
      background: "rgba(22, 22, 24, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(8px)",
    }}
    >
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

      {/* No text for now */}
      
    </nav>
  );
};

export default Navbar;