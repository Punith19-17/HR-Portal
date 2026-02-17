import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendErrorDetails, setBackendErrorDetails] = useState("");
  const navigate = useNavigate();

  // Clear error messages when user starts typing
  useEffect(() => {
    if (employeeId || password) {
      setErrorMessage("");
      setBackendErrorDetails("");
    }
  }, [employeeId, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setBackendErrorDetails("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (data.success) {
        setSuccessMessage("Login successful! Redirecting...");
        setShowModal(true);
        
        try {
          const currentDate = new Date();
          const loginRecord = {
            employee_id: employeeId,
            login_date: currentDate.toISOString().split('T')[0],
            login_time: currentDate.toTimeString().split(' ')[0]
          };

          const recordResponse = await fetch("http://localhost:5000/api/record-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginRecord),
            credentials: 'include'
          });

          if (!recordResponse.ok) {
            const errorData = await recordResponse.json();
            console.warn("Login record warning:", errorData);
            setBackendErrorDetails(
              errorData.sqlError 
                ? `System note: ${errorData.sqlError}`
                : "Note: Login time not recorded (non-critical)"
            );
          }
        } catch (recordError) {
          console.error("Error recording login:", recordError);
          setBackendErrorDetails("Note: Login time recording failed (non-critical)");
        }
        
        setTimeout(() => {
          setShowModal(false);
          navigate("/Dashboard");
        }, 1500);
      } else {
        throw new Error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    // Try both methods to ensure navigation works
    navigate("/Home", { replace: true });
    window.location.href = "/Home"; // Fallback
  };

  // Styles
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
    position: "relative",
  };

  const headerStyle = {
    fontSize: "40px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "black",
  };

  const backButtonStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "10px 20px",
    background: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "#00695C",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 2px 5px rgba(0, 131, 143, 0.2)",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const backButtonHoverStyle = {
    background: "linear-gradient(135deg, #B2EBF2 0%, #80DEEA 50%, #4DD0E1 100%)",
    boxShadow: "0 4px 8px rgba(0, 131, 143, 0.3)",
    transform: "translateY(-1px)",
    color: "#004D40",
  };

  const cardStyle = {
    background: "white",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    width: "700px",
    maxWidth: "90%",
    textAlign: "center",
  };

  const inputGroupStyle = {
    textAlign: "left",
    marginBottom: "20px",
    position: "relative",
  };

  const labelStyle = {
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "18px",
    background: "linear-gradient(to right, #ffffff, #e3f2fd)",
    color: "#333",
    outline: "none",
    transition: "box-shadow 0.3s ease",
  };

  const inputHoverStyle = {
    boxShadow: "0 0 8px rgba(0, 0, 255, 0.4)",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    border: "none",
    background: "linear-gradient(to right, #0083B0, #00B4DB)",
    color: "black",
    fontSize: "20px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s",
    fontWeight: "bold",
    position: "relative",
  };

  const buttonHoverStyle = {
    background: "linear-gradient(to right, #005f73, #0a9396)",
  };

  const loadingButtonStyle = {
    ...buttonStyle,
    cursor: "not-allowed",
    opacity: 0.8,
  };

  const eyeIconStyle = {
    position: "absolute",
    right: "15px",
    top: "42px",
    cursor: "pointer",
    fontSize: "18px",
    color: "#555",
  };

  const errorMessageStyle = {
    color: "red",
    marginBottom: "15px",
    fontSize: "16px",
  };

  const backendErrorStyle = {
    color: "#FF8C00",
    marginBottom: "15px",
    fontSize: "14px",
    fontStyle: "italic",
  };

  const successMessageStyle = {
    color: "green",
    marginBottom: "15px",
    fontSize: "16px",
  };

  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    zIndex: 1000,
    minWidth: "300px",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  };

  const loadingSpinnerStyle = {
    display: "inline-block",
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255,255,255,.3)",
    borderRadius: "50%",
    borderTopColor: "#fff",
    animation: "spin 1s ease-in-out infinite",
    marginLeft: "10px",
  };

  return (
    <div style={pageStyle}>
      <button
        style={backButtonStyle}
        onMouseOver={(e) => Object.assign(e.target.style, backButtonHoverStyle)}
        onMouseOut={(e) => {
          e.target.style.background = "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)";
          e.target.style.boxShadow = "0 2px 5px rgba(0, 131, 143, 0.2)";
          e.target.style.transform = "none";
          e.target.style.color = "#00695C";
        }}
        onClick={handleBackClick}
      >
        ← Back
      </button>
      
      <h1 style={headerStyle}>Staff Leave Hub</h1>
      <div style={cardStyle}>
        <h2>Staff Login </h2>
        {errorMessage && <div style={errorMessageStyle}>{errorMessage}</div>}
        {backendErrorDetails && <div style={backendErrorStyle}>{backendErrorDetails}</div>}
        {successMessage && <div style={successMessageStyle}>{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Employee ID</label>
            <input
              type="text"
              placeholder="Enter your employee ID"
              style={inputStyle}
              onFocus={(e) => (e.target.style.boxShadow = inputHoverStyle.boxShadow)}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              style={inputStyle}
              onFocus={(e) => (e.target.style.boxShadow = inputHoverStyle.boxShadow)}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <span
              style={eyeIconStyle}
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          <button
            type="submit"
            style={isLoading ? loadingButtonStyle : buttonStyle}
            onMouseOver={(e) => !isLoading && (e.target.style.background = buttonHoverStyle.background)}
            onMouseOut={(e) => !isLoading && (e.target.style.background = "linear-gradient(to right, #0083B0, #00B4DB)")}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                Logging in...
                <span style={loadingSpinnerStyle}></span>
              </>
            ) : (
              "Login"
            )}
          </button>
          <div style={{ marginTop: "15px", fontSize: "16px" }}>
            <a href="/Forgotpass" style={{ color: "#1E90FF", textDecoration: "none" }}>Forgot password?</a>
          </div>
          <div style={{ marginTop: "10px", fontSize: "16px" }}>
            <span>Don't have an account? </span>
            <a href="/Signup" style={{ color: "#1E90FF", textDecoration: "none" }}>Sign up</a>
          </div>
        </form>
      </div>

      {showModal && (
        <>
          <div style={overlayStyle}></div>
          <div style={modalStyle}>
            <p>{successMessage}</p>
          </div>
        </>
      )}

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;