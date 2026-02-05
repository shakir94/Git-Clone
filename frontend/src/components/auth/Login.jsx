
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import "./signup.css";
import logo from "../../assets/gitimg.png";
import { useAuth } from "../../authContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
const Login = () => {
  
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password,
      });

      const token = res.data.token;
      const userId = res.data.userId;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      setCurrentUser(res.data.userId);
      setLoading(false);

      navigate("/")
    } catch (err) {
      console.error(err);
      alert("Login Failed");
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <img src={logo} alt="GitHub" className="github-logo" />
        <h2 className="head">Sign In</h2>
      </div>

      <div className="signup-form-wrapper">
        {/* <h1 className="signup-title">Sign In to GitHub</h1> */}

        <form className="signup-form">
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="off"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="signup-button"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Loading..." : "Log In for GitHub"}
          </button>
        </form>

        <p className="signin-link">
          New to GitHUb? <a href="/signup">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
