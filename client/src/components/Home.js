import React from "react";
import { Outlet } from "react-router-dom";
import BasketBall from "../images/basketball.svg";

const Home = () => {
  return (
    <div className="flex-c">
      <div>
        <h1 className="title">Sports Shedular</h1>
        <img src={BasketBall} alt="Basketball" />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
