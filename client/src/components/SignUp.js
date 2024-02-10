import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUserContext } from "./UserContext";

const SignUp = () => {
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();
  const { setUserEmail, setUserName, setIsLogged, setUserId } =
    useUserContext();

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
    if (data.name.length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(data.email)) {
      toast.error("Invalid email");
      return;
    }
    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const response = await fetch(process.env.REACT_APP_SERVER_URL + "/signup", {
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
      toast.success("Account created successfully");
      const user = await response.json();
      setUserEmail(user.email);
      setUserName(user.name);
      setUserId(user.id);
      setIsLogged(true);
      navigate("/dashboard");
    } else if (response.status === 400) {
      toast.error("Email already exists");
    } else {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getCsrfToken();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <p>Welcome to Sport Shedular..!</p>
        <input type="text" name="name" placeholder="Full Name" />
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button className="darkbtn" type="submit">
          Sign Up
        </button>

        <hr className="line" />
        <p>Already have your an account</p>
        <Link to="/">
          <button className="lightbtn">Login</button>
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
