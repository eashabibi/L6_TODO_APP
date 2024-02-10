import React from "react";
import { Outlet } from "react-router-dom";

import backgroundImg from "../images/backgroungImg.png";

const Home = () => {
  return (
    <div className="flex-c">
      <div>
        <h1 className="title">Schedule your sports </h1>
        <img src={backgroundImg} alt="backgroundImg" />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
