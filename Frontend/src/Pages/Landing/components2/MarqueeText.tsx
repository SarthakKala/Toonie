import React from "react";

const marqueeText = "★ A spiral galaxy slowly rotating  ★ Rain falling on a neon-lit city  ★ Particles forming a human face  ★ A DNA helix unraveling in slow motion  ★ Sound waves visualized as glowing rings  ★ A black hole bending light around it  ★ Geometric shapes morphing endlessly  ★ A heartbeat traced across a dark canvas  ★ Stars being born inside a nebula  ★ Liquid metal flowing through a maze  ★ A clock dissolving into particles  ★ Northern lights rippling across the sky  ";

const MarqueeText: React.FC = () => {
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                maxWidth: 1400, // Increased max width
                margin: "4rem auto 0 auto",
                overflow: "hidden",
                height: "4.5rem", // Slightly taller for bigger text
                display: "flex",
                alignItems: "center",
            }}
        >
            {/* Fade left */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "16%", // Increased fade width
                    height: "100%",
                    zIndex: 2,
                    pointerEvents: "none",
                    background: "linear-gradient(to right, #161616 80%, transparent 100%)",
                }}
            />
            {/* Fade right */}
            <div
                style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: "16%", // Increased fade width
                    height: "100%",
                    zIndex: 2,
                    pointerEvents: "none",
                    background: "linear-gradient(to left, #161616 80%, transparent 100%)",
                }}
            />
            {/* Marquee */}
            <div
                style={{
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    animation: "marquee 150s linear infinite",
                    fontSize: "1.2rem", // Increased text size
                    color: "#fff",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    opacity: 0.92,
                }}
            >
                {marqueeText.repeat(10)}
            </div>
            {/* Keyframes */}
            <style>
                {`
                    @keyframes marquee {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-50%); }
                    }
                `}
            </style>
        </div>
    );
};

export default MarqueeText;