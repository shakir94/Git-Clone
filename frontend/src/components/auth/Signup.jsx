import React from "react";
import axios from "axios";
import { useState,useEffect } from "react";
import "./signup.css";
import logo from "../../assets/gitimg.png";
import { useAuth } from "../../authContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
const Signup = () => {

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const[loading, setLoading] = useState(false)

  const navigate = useNavigate()

const {setCurrentUser} = useAuth()

  const handleSignup =async(e) =>{
        e.preventDefault()

        try{
          setLoading(true)
          const res = await axios.post(`${API_URL}/signup`,{
            email: email,
            password: password,
            username: username
          })
          const token = res.data.token;
          const userId = res.data.userId;
          localStorage.setItem("token",token)
          localStorage.setItem("userId",userId)

          setCurrentUser(res.data.userId)
          setLoading(false)

          navigate("/")
        }catch(err){
          console.error(err)
          alert("User already exists")
          setLoading(false)
        }
  }
  return (
    <div className="signup-container">
      <div className="signup-header">
        <img src={logo} alt="GitHub" className="github-logo" />
        <h2 className="head">Sign Up</h2>
      </div>

      <div className="signup-form-wrapper">
        {/* <h1 className="signup-title">Sign up to GitHub</h1> */}
        
        <form className="signup-form">
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="off"
              className="form-input"
               value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              className="form-input"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
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
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="signup-button" disabled={loading} onClick={handleSignup}>
           {loading ? "Loading..." : "Sign up for GitHub"}
          </button>
        </form>

        <p className="signin-link">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
