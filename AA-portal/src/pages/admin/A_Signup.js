import React, { useState } from "react";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <>
      <style>{`
        {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #E4EfE9, #93A5CF);
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .header {
          width: 100%;
          text-align: center;
          padding: 30px;
          font-size: 40px;
          font-weight: bold;
          background: linear-gradient(135deg, #8e9eab,rgb(168, 178, 178));
          color: #000;
          position: absolute;
          top: 0;
          left: 0;
        }

        .signup-container {
          background: linear-gradient(135deg, #E8F5C8, #9FA5D5);
          padding: 50px;
          border-radius: 20px;
          box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.3);
          text-align: center;
          width: 800px;
          margin-top: 100px;
        }

        .signup-container h2 {
          font-size: 30px;
          margin-bottom: 25px;
          color: #333;
          font-weight: bold;
        }

        .input-field {
          width: 80%;
          padding: 18px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1rem;
        }

        .input-field:focus {
          outline: none;
          border: 1px solid transparent;
          box-shadow: 0 0 8px rgba(60, 102, 129, 0.8), 0 0 8px rgba(255, 165, 0, 0.8), 0 0 8px rgba(0, 255, 0, 0.8), 0 0 8px rgba(0, 0, 255, 0.8), 0 0 8px rgba(75, 0, 130, 0.8), 0 0 8px rgba(238, 130, 238, 0.8);
        }

        .signup-button {
          background: #4CA6D4;
          color: white;
          padding: 13px;
          width: 30%;
          border: none;
          border-radius: 10px;
          font-size: 26px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 15px;
        }
          .back-button {
          background: #4CA6D4;
          color: white;
          padding: 13px;
          width: 10%;
          border: none;
          border-radius: 10px;
          font-size: 26px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 15px;

        .signup-button:hover, .back-button:hover {
          background: #66D3FA;
        }
      `}</style>

      <div className="header">HrPortal</div>

      <div className="signup-container">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="User name"
          className="input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="signup-button" onClick={handleSubmit}>
          Sign Up
        </button>
        <button className="back-button" onClick={() => window.history.back()}>
          Back
        </button>
      </div>
    </>
  );
}

export default Signup;
