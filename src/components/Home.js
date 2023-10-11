import React from "react";
import Logo from "../assets/logo.png";

const Home = () => {
  return (
    <div className="home">
      <img src={Logo} alt="logo" />
      <div className="button">
        Get your honest answers -<span>&gt;</span>
      </div>
    </div>
  );
};

export default Home;
