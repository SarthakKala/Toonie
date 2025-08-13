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
                    marginTop: "5rem",
                    textAlign: "center",
                  }}
                >
                  What is Toonie
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
                  Toonie is an AI-powered web app that transforms your ideas into beautiful 2D animations. Just by typing a prompt! Toonie uses AI to generate modular animation scenes in p5.js, complete with narration, code, and a visual preview.
                  You can refine scenes, view the generated code, combine multiple animations in a timeline editor - all just by using Toonie :)
                </p>
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
              minHeight: "260px",
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
              style={{ minHeight: 260, padding: "2.5rem 0 1.5rem 0" }}
            >
              <div className="flex flex-row justify-between w-[90%] mx-auto items-start">
                {/* Left links */}
                <div className="flex flex-col gap-2">
                  <a href="#" className="text-white text-xl font-semibold mb-2 hover:underline transition">Chat</a>
                  <a href="#" className="text-white text-xl font-semibold mb-2 hover:underline transition">Features</a>
                  <a href="#" className="text-white text-xl font-semibold hover:underline transition">Contact</a>
                </div>
                {/* Right newsletter */}
                <div className="flex flex-col items-end gap-2 max-w-[340px] w-full">
                  <span className="text-white text-base mb-2 text-right opacity-90">
                    Get industry insights and creative inspiration straight to your inbox.
                  </span>
                  <form className="flex flex-row w-full border-b border-white/30">
                    <input
                      type="email"
                      placeholder="Email address"
                      className="bg-transparent outline-none border-none text-white placeholder:text-white/60 flex-1 py-2 px-0 text-base"
                    />
                    <button
                      type="submit"
                      className="text-white text-xl px-2 hover:opacity-80 transition"
                      aria-label="Subscribe"
                    >
                      →
                    </button>
                  </form>
                </div>
              </div>

              {/* Large Toonie text */}
              <div className="w-full flex items-end justify-start relative mt-8 mb-2">
                <span
                  className="text-[min(16vw,160px)] font-extrabold text-[#FAF9F6] leading-none tracking-tight opacity-95"
                  style={{
                    fontFamily: "inherit",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    userSelect: "none",
                    marginLeft: "5%", // ensure left alignment
                  }}
                >
                  Toonie
                </span>
              </div>

              {/* Bottom bar */}
              <div className="w-[90%] mx-auto border-t border-white/20 pt-3 flex flex-row justify-between items-center text-white/80 text-sm">
                <span>Copyright © Toonie. All rights reserved</span>
                <span>Jaipur, Rajasthan, India</span>
                <div className="flex gap-8">
                  <a href="#" className="hover:underline">GitHub</a>
                  <a href="#" className="hover:underline">Instagram</a>
                  <a href="#" className="hover:underline">LinkedIn</a>
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
        `}
      </style>
    </>
  );
}

export default Landing;
