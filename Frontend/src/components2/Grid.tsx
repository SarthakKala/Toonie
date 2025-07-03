import React from "react";

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
        // width: "100%",
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
        }}
      ></div>
      {/* Bottom right box */}
      <div
        style={{
          ...cardStyle,
          gridColumn: "3 / 4",
          gridRow: "2 / 3",
        }}
      ></div>
    </div>
  );
};

export default Grid;