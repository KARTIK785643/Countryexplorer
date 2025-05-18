import React from "react";
import "./Sidebar.css";

function Home({ onExploreClick }) {
  return (
    <>
 <div className="moving-text">
  <span>
    🌍 Compare countries side by side — population, economy, health, education, and more. Get detailed insights to explore the world smarter!
  </span>
</div>




    <div className="home-container">
      
      <h1>Welcome to Country Explorer</h1>
      <p>Your gateway to explore countries, flags, and latest news worldwide.</p>
      <button className="explore-btn" onClick={onExploreClick}>
        Developed by Kartik
      </button>
    </div>
    </>
  );
}

export default Home;
