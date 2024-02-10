import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";

const Nav = () => {
  const { userEmail, userName, isLogged, setIsLogged } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    setIsLogged(false);
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="nav">
      <div className="header">Sports  Shedular</div>
      <div className="tags">
        <ul>
          {isLogged ? (
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
          ) : (
            ""
          )}
          {isLogged ? (
            <li>
              <a href="/" onClick={handleLogout}>
                Logout
              </a>
            </li>
          ) : (
            ""
          )}
          {isLogged ? (
            <li>
              <div className="profile" to="/profile">
                {userName.charAt(0).toUpperCase()}
              </div>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
    </div>
  );
};

export default Nav;
