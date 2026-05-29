import React, { useState } from "react";

function Forgotpassword() {
  const [employeeId, setEmployeeId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId || !phoneNumber) {
      alert("Please fill in all fields.");
      return;
    }
    
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #E4EfE9, #93A5CF);
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .header {
          width: 100%;
          text-align: center;
          padding: 20px;
          font-size: 2rem;
          font-weight: bold;
          background: linear-gradient(135deg, #8e9eab,rgb(168, 178, 178));
          color: #333;
          position: absolute;
          top: 0;
          left: 0;
        }

        .forgot-container {
          background: linear-gradient(135deg, #E8F5C8, #9FA5D5);
          padding: 40px;
          border-radius: 10px;
          box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2);
          text-align: center;
          width: 800px;
          margin-top: 80px;
        }

        .forgot-container h2 {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #333;
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

        .submit-button{
          width: 60%;
          padding: 13px;
          margin-top: 15px;
          font-size: 26px;
          font-weight: bold;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          background: #4CA6D4;
          color: white;
        }

        .back-button {
          width: 10%;
          padding: 10px;
          margin-top: 5px;
          font-size: 26px;
          font-weight: bold;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          background: #4CA6D4;
          color: white;
        }

        .submit-button:hover, .back-button:hover {
          background:  #66D3FA;
        }
      `}</style>

      <div className="header">HrPortal</div>

      <div className="forgot-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your Employee ID"
            className="input-field"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Enter your Phone Number"
            className="input-field"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
          <button
            type="button"
            className="back-button"
            onClick={() => window.history.back()}
          >
            Back
          </button>
        </form>
      </div>
    </>
  );
}

export default Forgotpassword;