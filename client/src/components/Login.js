import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUserContext } from "./UserContext";

const Login = () => {
  // const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();
  const {
    setUserEmail,
    setUserName,
    csrfToken,
    setCsrfToken,
    setIsLogged,
    setUserId,
  } = useUserContext();

  const getCsrfToken = async () => {
    const response = await fetch(
      process.env.REACT_APP_SERVER_URL + "/get-csrf-token",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      }
    );
    const data = await response.json();
    setCsrfToken(data.csrfToken);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // validate
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(data.email)) {
      toast.error("Invalid email");
      return;
    }

    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const response = await fetch(process.env.REACT_APP_SERVER_URL + "/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "xsrf-token": csrfToken,
      },
      body: JSON.stringify(data),
      credentials: "include",
      mode: "cors",
    });
    if (response.ok) {
      toast.success("Logged in successfully");
      const user = await response.json();
      setUserEmail(user.email);
      setUserName(user.name);
      setUserId(user.id);
      setIsLogged(true);
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
  };

  useEffect(() => {
    getCsrfToken();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <p>Welcome back to Sport Shedular..!</p>
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button className="darkbtn" type="submit">
          Login
        </button>

        <hr className="line" />
        <p>Don't have an account</p>
        <Link to="/signup">
          <button className="lightbtn">Sing Up</button>
        </Link>
      </form>
    </div>
  );
};

export default Login;
