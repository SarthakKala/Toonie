import React from "react";

const marqueeText = "• A robot dancing under starlight  • Ocean waves crashing against rocks  • A cat sleeping on a floating leaf  • Fireflies blinking in a forest at night  • A bouncing basketball on a rainy street  • Two planets orbiting each other in deep space  • A fish jumping over lily pads  • A kite flying in a stormy sky  • Leaves swirling in autumn wind  • A train passing through a pixel city  • Butterflies following a glowing trail  ";

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