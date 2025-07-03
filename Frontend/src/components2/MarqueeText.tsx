import React from "react";

const marqueeText = "This is a sample marquee text scrolling infinitely. ";

const MarqueeText: React.FC = () => {
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                maxWidth: 900,
                margin: "4rem auto 0 auto", // Increased margin above
                overflow: "hidden",
                height: "3.5rem",
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
                    width: "10%",
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
                    width: "10%",
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
                    animation: "marquee 30s linear infinite", // Slower animation
                    fontSize: "1.5rem",
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