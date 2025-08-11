import React from "react";
// Update the path below if IconCloud.tsx is in a different folder
import IconCloudDemo from "../components/ui/IconCloud";
  
import Ballpit from '../../../blocks/Backgrounds/Ballpit/Ballpit'

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(120deg, #181818 80%, #232325 100%)",
  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.65)",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.06)",
  minHeight: 300,
  minWidth: 100,
  padding: "2.5rem",
  display: "flex",
  flexDirection: "column",
  justifyContent:"flex-start",
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
      >
        <h3 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem" }}>
          What is Animation?
        </h3>
        <p style={{ color: "#b3b3b3", fontSize: "1rem", marginBottom: "1.2rem" }}>
          Animation is the process of creating the illusion of motion and change by displaying a sequence of static images that minimally differ from each other. It transforms ideas, stories, and concepts into engaging visual experiences, making them easier to understand and more memorable.
        </p>
        <p style={{ color: "#b3b3b3", fontSize: "1rem", marginBottom: "1.2rem" }}>
          From hand-drawn cartoons to modern computer-generated graphics, animation is a powerful tool for communication and creativity. It bridges the gap between imagination and reality, allowing creators to express emotions, demonstrate processes, and captivate audiences of all ages.
        </p>
        <h4 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.7rem" }}>
          Everyday Applications of Animation
        </h4>
        <ul style={{ color: "#b3b3b3", fontSize: "0.98rem", paddingLeft: "1.2rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
          <li>
            <strong>--Entertainment:</strong> Movies, cartoons, and video games use animation to tell stories and create immersive worlds.
          </li>
          <li>
            <strong>--Education:</strong> Animated diagrams and interactive lessons help explain complex topics in a simple, visual way.
          </li>
          <li>
            <strong>--UI/UX Design:</strong> Animations make digital interfaces more intuitive and enjoyable, guiding users and providing feedback.
          </li>
          <li>
            <strong>--Advertising:</strong> Brands use animation in commercials and product demos to attract attention and communicate value.
          </li>
          <li>
            <strong>--Art & Expression:</strong> Artists use animation to experiment with movement, style, and storytelling in new and creative ways.
          </li>
        </ul>
        {/* <p style={{ color: "#b3b3b3", fontSize: "1rem" }}>
          In today's digital world, animation is everywhere—from the apps we use to the movies we watch. It enhances communication, boosts engagement, and brings ideas to life. With tools like Toonie, anyone can turn their imagination into animated reality.
        </p> */}
      </div>




      {/* Tall middle box */}
      <div
        style={{
          ...cardStyle,
          gridColumn: "2 / 3",
          gridRow: "1 / 3",
          textAlign: "center" // Center align all content
        }}
      >
        <h3 style={{ 
          color: "#fff", 
          fontSize: "1.5rem", 
          fontWeight: 700, 
          marginBottom: "1.5rem",
          textDecoration: "underline" // Add underline
        }}>
          How to Use Toonie
        </h3>
        
        {/* Step 1 - without serial number */}
        <div style={{ marginBottom: "0.8rem" }}> {/* Reduced bottom margin */}
          <h4 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
            Enter a Prompt
          </h4>
          <p style={{ color: "#b3b3b3", fontSize: "0.9rem" }}>
            Describe the animation you want to create using natural language
          </p>
        </div>
        
        {/* Bigger white arrow */}
        <div style={{ display: "flex", justifyContent: "center", margin: "0.1rem 0" }}> {/* Reduced margin */}
          <div style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold" }}>↓</div>
        </div>
        
        {/* Step 2 */}
        <div style={{ marginBottom: "0.8rem" }}> {/* Reduced bottom margin */}
          <h4 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
            AI Generates Code
          </h4>
          <p style={{ color: "#b3b3b3", fontSize: "0.9rem" }}>
            Toonie's AI transforms your prompt into animation code
          </p>
        </div>
        
        {/* Bigger white arrow */}
        <div style={{ display: "flex", justifyContent: "center", margin: "0.1rem 0" }}> {/* Reduced margin */}
          <div style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold" }}>↓</div>
        </div>
        
        {/* Step 3 */}
        <div style={{ marginBottom: "0.8rem" }}> {/* Reduced bottom margin */}
          <h4 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
            Preview Animation
          </h4>
          <p style={{ color: "#b3b3b3", fontSize: "0.9rem" }}>
            See your animation come to life in real-time
          </p>
        </div>
        
        {/* Bigger white arrow */}
        <div style={{ display: "flex", justifyContent: "center", margin: "0.1rem 0" }}> {/* Reduced margin */}
          <div style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold" }}>↓</div>
        </div>
        
        {/* Step 4 */}
        <div style={{ marginBottom: "0.8rem" }}> {/* Reduced bottom margin */}
          <h4 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
            Edit & Refine
          </h4>
          <p style={{ color: "#b3b3b3", fontSize: "0.9rem" }}>
            Modify code or combine multiple animations in the editor
          </p>
        </div>
        
        {/* Bigger white arrow */}
        <div style={{ display: "flex", justifyContent: "center", margin: "0.1rem 0" }}> {/* Reduced margin */}
          <div style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold" }}>↓</div>
        </div>
        
        {/* Step 5 */}
        <div style={{ marginBottom: "0.8rem" }}> {/* Reduced bottom margin */}
          <h4 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
            Create Multiple Animations
          </h4>
          <p style={{ color: "#b3b3b3", fontSize: "0.9rem" }}>
            Generate several animations for different elements or scenes
          </p>
        </div>
        
        {/* Bigger white arrow */}
        <div style={{ display: "flex", justifyContent: "center", margin: "0.1rem 0" }}> {/* Reduced margin */}
          <div style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold" }}>↓</div>
        </div>
        
        {/* Step 6 */}
        <div>
          <h4 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
            Combine & Export
          </h4>
          <p style={{ color: "#b3b3b3", fontSize: "0.9rem" }}>
            Combine multiple animations in the editor to create one complete animation and export your final creation
          </p>
        </div>
      </div>




      {/* Top right box */}
      <div
        style={{
          ...cardStyle,
          gridColumn: "3 / 4",
          gridRow: "1 / 2"
        }}>
        <div style={{position: 'relative', overflow: 'hidden', minHeight: '400px', maxHeight: '400px', width: '100%'}}>
          <Ballpit
            count={200}
            gravity={0.7}
            friction={0.8}
            wallBounce={0.95}
            followCursor={true}
          />
        </div>
      </div>



{/* Bottom right box - Tech Stack */}
    <div
      style={{
        ...cardStyle,
        gridColumn: "3 / 4",
        gridRow: "2 / 3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1.5rem",
        overflow: "hidden",
        zIndex: 10,
        justifyContent: "center" 
      }}
    >
      <h3 style={{
        color: "#fff", 
        fontSize: "1.5rem", 
        fontWeight: 700, 
      }}>TECH STACK</h3>
      <div style={{ 
        width: "100%", 
        height: "85%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        marginTop: "0.5rem"
      }}>
        <IconCloudDemo />
      </div>
    </div>
    </div>
  );
};

export default Grid;