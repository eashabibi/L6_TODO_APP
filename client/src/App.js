import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Login from "./components/Login";
import "./App.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./components/UserContext";
import DashBoard from "./components/DashBoard";
import SportsPage from "./components/SportsPage";
import SessionPage from "./components/SessionPage";
function App() {
  return (
    <UserProvider>
      <Router>
        <Nav></Nav>
        <Routes>
          <Route exact path="/" element={<Home />}>
            <Route index element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
          <Route exact path="/dashboard" element={<DashBoard />} />
          <Route exact path="/sport/:id" element={<SportsPage />} />
          <Route
            exact
            path="/sport/:s_id/session/:id"
            element={<SessionPage />}
          />
        </Routes>
        <Footer></Footer>
        <Toaster />
      </Router>
    </UserProvider>
  );
}

export default App;
