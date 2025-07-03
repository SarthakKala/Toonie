import React, { useRef } from "react";
import Grid from "./components2/Grid";
import Navbar from "./components2/Navbar";
import MarqueeText from "./components2/MarqueeText";
import { Particles } from "@/components/magicui/particles";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

function App() {
  const blackBoxRef = useRef<HTMLDivElement>(null);
  const handleScrollDown = () => {
    if (blackBoxRef.current) {
      blackBoxRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div
        className="w-full h-full flex flex-col items-center justify-center min-h-screen"
        style={{ backgroundColor: "#161618 " }}
      >
        <SmoothCursor />
        <Navbar />
        <div
          className="relative overflow-hidden w-full h-screen"
          style={{ minHeight: "100vh" }}
        >
          <Particles />

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "32px",
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
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") handleScrollDown();
            }}
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
              ` }
            </style>
          </div>
        </div>
        <div
          ref={blackBoxRef}
          className="w-[85%] mx-auto bg-#161616 mt-20 mb-20 rounded-lg"
          style={{
            backgroundColor: "#161616",
            border: "2px solid #2c2c2e",
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
            className="w-screen flex flex-col items-center justify-center mx-auto"
            style={{
              maxWidth: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <h1
              style={{
                color: "#fff",
                fontSize: "2rem",
                fontWeight: 700,
                marginBottom: "1rem",
                marginTop: "2rem",
                textAlign: "center",
              }}
            >
              Your Heading Here
            </h1>
            <p
              style={{
                color: "#b3b3b3",
                fontSize: "1rem",
                marginBottom: "4.5rem",
                textAlign: "center",
                maxWidth: 700,
              }}
            >
              This is a description or subtitle for your grid section. You can
              add any information here to introduce the content below.
            </p>
            <Grid />
            <MarqueeText />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
