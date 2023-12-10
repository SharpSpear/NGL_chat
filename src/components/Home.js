import React from "react";
import Logo from "../assets/logo.png";

const Home = () => {
  return (
    <div className="home">
      <img src={Logo} alt="logo" />
      <div className="button">Get your answers&nbsp;&nbsp;➜</div>
    </div>
  );
};

export default Home;
