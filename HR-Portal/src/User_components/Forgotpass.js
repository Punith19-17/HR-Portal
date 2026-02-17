import React, { useState } from "react";

const Login = () => {
  const [empId, setEmpId] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (empId && phone) {
      setOtpSent(true);
    } else {
      alert("Please enter both Employee ID and Phone Number.");
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp) {
      alert("OTP Verified Successfully!");
      // Add your login success logic here
    } else {
      alert("Please enter the OTP.");
    }
  };

  const pageStyle = {
    margin: "0",
    padding: "0",
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(to right, #B0E0E6, #87CEEB)",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const cardStyle = {
    background: "white",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    width: "700px",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "16px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(to right, #0083B0, #00B4DB)",
    color: "white",
    fontSize: "18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    border: "none",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2>Forgot Password</h2>
        <form onSubmit={otpSent ? handleOtpSubmit : handleSubmit}>
          {!otpSent ? (
            <>
              <input
                type="text"
                placeholder="Enter your Employee ID"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="tel"
                placeholder="Enter your Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" style={buttonStyle}>
                Submit
              </button>
            </>
          ) : (
            <>
              <p style={{ color: "green", fontWeight: "bold" }}>
                OTP has been sent to your mobile number.
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" style={buttonStyle}>
                Submit OTP
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
