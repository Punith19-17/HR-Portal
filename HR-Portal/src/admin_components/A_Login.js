import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const A_Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email_id: email,
        password: password,
      });
  
      console.log("Server Response:", response.data);

      if (response.data.message === "Login successful") {
        alert("User logged in successfully");
        setEmail("");
        setPassword("");
        console.log("Navigating to /A_Dashboard");
        navigate("/A_Dashboard");
      } else {
        setMessage(response.data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage(error.response?.data?.message || "Login failed.");
    }
  };

  useEffect(() => {
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Message:", message);
  }, [email, password, message]);

  return (
    <div style={{
      margin: "0",
      padding: "0",
      fontFamily: "Arial, sans-serif",
      background: "linear-gradient(135deg, #E4EfE9, #93A5CF)",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}>
      {/* Back Button - Positioned 35px from top */}
      <button
        style={{
          position: "absolute",
          top: "35px",
          right: "25px",
          padding: "10px 20px",
          background: "linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)",
          border: "1px solid #DEE2E6",
          borderRadius: "25px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          color: "#495057",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          zIndex: "10",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
        onMouseOver={(e) => {
          e.target.style.background = "linear-gradient(135deg, #E9ECEF 0%, #DEE2E6 100%)";
          e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
          e.target.style.color = "#212529";
          e.target.style.borderColor = "#ADB5BD";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)";
          e.target.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
          e.target.style.color = "#495057";
          e.target.style.borderColor = "#DEE2E6";
        }}
        onClick={() => navigate("/")}  // Changed to navigate to Home
      >
        ← Back
      </button>

      <h1 style={{
        fontSize: "36px",
        fontWeight: "bold",
        color: "black",
        background: "linear-gradient(135deg, #8e9eab, rgb(168, 178, 178))",
        width: "100%",
        textAlign: "center",
        padding: "20px 0",
        position: "absolute",
        top: "0",
        left: "0",
      }}>
        Staff Leave Hub
      </h1>

      <div style={{
        background: "linear-gradient(135deg, #E8F5C8, #9FA5D5)",
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
        width: "700px",
        textAlign: "center",
        marginTop: "80px",
      }}>
        <h2>Staff Login Page</h2>
        <form onSubmit={handleLogin}>
          <div style={{ textAlign: "left", marginBottom: "20px", position: "relative" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Email Id</label>
            <input
              type="text"
              placeholder="Enter your Email Id"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "6px",
                fontSize: "18px",
                background: "linear-gradient(to right, #ffffff, #e3f2fd)",
                color: "#333",
                outline: "none",
                border: "1px solid #ccc",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ textAlign: "left", marginBottom: "20px", position: "relative" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "6px",
                fontSize: "18px",
                background: "linear-gradient(to right, #ffffff, #e3f2fd)",
                color: "#333",
                outline: "none",
                border: "1px solid #ccc",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              style={{
                position: "absolute",
                right: "15px",
                top: "42px",
                cursor: "pointer",
                fontSize: "18px",
                color: "#555",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🔓" : "🔒"}
            </span>
          </div>

          <button
            type="submit"
            style={{
              width: "60%",
              padding: "14px",
              border: "none",
              background: "linear-gradient(to right, #0083B0, #00B4DB)",
              color: "white",
              fontSize: "20px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.3s",
              fontWeight: "bold",
            }}
          >
            Submit
          </button>

          {message && (
            <div style={{ marginTop: "15px", fontSize: "16px", color: "red" }}>
              {message}
            </div>
          )}

          <div style={{ marginTop: "15px", fontSize: "16px" }}>
            <a href="/A_Forgotpass" style={{ color: "#1E90FF", textDecoration: "none" }}>
              Forgot password?
            </a>
          </div>

          <div style={{ marginTop: "10px", fontSize: "16px" }}>
            <span>Don't have an account? </span>
            <span
              onClick={() => navigate("/A_Signup")}
              style={{ color: "#1E90FF", textDecoration: "none", cursor: "pointer" }}
            >
              Sign up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default A_Login;