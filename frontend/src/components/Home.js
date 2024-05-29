import React from "react";
import HeroGraphic from "../assets/heroGraphic.svg";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      {/* Hero Section with Call-to-Action */}
      <div className="flex-grow relative">
        <div
          className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-cover"
          style={{ backgroundImage: `url(${HeroGraphic})` }}
        />
      </div>
      {/* Footer Section */}
      <Footer className="h-16 bg-gray-800" />
    </div>
  );
}

export default Home;
