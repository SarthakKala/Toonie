import React from "react";
// Update the path below if IconCloud.tsx is in a different folder
import IconCloudDemo from "../components/ui/IconCloud";

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(120deg, #181818 80%, #232325 100%)",
  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.65)",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.06)",
  minHeight: 300,
  minWidth: 300,
  padding: "2.5rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  overflow: "hidden",
};

const Grid: React.FC = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "24px",
        maxWidth: "100%",
        minHeight: 540,
        margin: "0 auto",
      }}
    >
      {/* Tall left box */}
      <div
        style={{
          ...cardStyle,
          gridColumn: "1 / 2",
          gridRow: "1 / 3",
        }}
      ></div>
      {/* Tall middle box */}
      <div
        style={{
          ...cardStyle,
          gridColumn: "2 / 3",
          gridRow: "1 / 3",
        }}
      ></div>
      



      {/* Top right box */}
      <div
        style={{
          ...cardStyle,
          gridColumn: "3 / 4",
          gridRow: "1 / 2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0.6rem 0.4rem", // Even smaller padding
          minWidth: 0,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <h3
          style={{
            color: "#fff",
            fontSize: "1.05rem", // Smaller heading
            fontWeight: 700,
            marginBottom: "0.4rem",
            letterSpacing: "0.01em",
            lineHeight: 1.2,
            textAlign: "center",
            width: "100%",
            whiteSpace: "normal",
          }}
        >
          Simple 3 step flow:
        </h3>
        <ol
          style={{
            color: "#b3b3b3",
            fontSize: "0.93rem", // Smaller text
            paddingLeft: "1rem",
            margin: 0,
            lineHeight: 1.45,
            wordBreak: "break-word",
            width: "100%",
            textAlign: "left",
          }}
        >
          <li style={{ marginBottom: "0.15rem" }}>
            <span style={{ color: "#7dd3fc", fontWeight: 500 }}>1.</span> Type a prompt
          </li>
          <li style={{ marginBottom: "0.15rem" }}>
            <span style={{ color: "#7dd3fc", fontWeight: 500 }}>2.</span> AI generates <span style={{ color: "#38bdf8", fontWeight: 500 }}>p5.js</span> code
          </li>
          <li style={{ wordBreak: "break-word", whiteSpace: "normal" ,overflowWrap: "break-word" }}>
            <span style={{ color: "#7dd3fc", fontWeight: 500 }}>3.</span>{" "}
            <span style={{ display: "inline" }}>
              Watch, edit and export
              the animated scene
            </span>
          </li>
        </ol>
      </div>

      



      {/* Bottom right box */}
      <div
        style={{
          ...cardStyle,
          gridColumn: "3 / 4",
          gridRow: "2 / 3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0, // Remove extra padding to keep size consistent
          overflow: "hidden",
          zIndex:10
        }}
      >
        <div style={{ width: "60%", height: "60%", display: "flex", alignItems: "left", justifyContent: "center" }}>
          <IconCloudDemo/>
        </div>
        </div>
      </div>

  );
};

export default Grid;



