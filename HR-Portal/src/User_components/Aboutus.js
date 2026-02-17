import React from "react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/Home");
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerTitle}>Staff Leave Hub</div>
        <button 
          style={styles.backButton}
          onClick={handleBackClick}
        >
          Back to Home
        </button>
      </header>

      {/* Main Content */}
      <div style={styles.content}>
        {/* About Us Section */}
        <h2 style={{ ...styles.title, marginTop: "0px" }}>About Us</h2>
        <p style={{ ...styles.text, marginTop: "20px" }}>
          This project is developed by 3rd sem MCA students under the guidance
          of
          <span style={styles.bold}> Seethalakshmi</span>, Assistant Professor.
        </p>

        {/* Team Members Section */}
        <h2 style={{ ...styles.title, marginTop: "30px" }}>
          OUR TEAM MEMBERS ARE
        </h2>
        <p style={styles.teamMember}>Punith A</p>
        <p style={styles.teamMember}>Pavithra H</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
    paddingTop: "120px",
  },
  header: {
    width: "100%",
    color: "black",
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    padding: "20px 0",
    background: "linear-gradient(135deg, #a8c0ff, #3f2b96)",
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "white",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
  },
  backButton: {
    position: "absolute",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "8px 16px",
    fontSize: "1rem",
    cursor: "pointer",
    border: "none",
    backgroundColor: "white",
    color: "#3f2b96",
    borderRadius: "5px",
    transition: "all 0.3s ease",
    fontWeight: "600",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  },
  content: {
    width: "95%",
    maxWidth: "1000px",
    padding: "80px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
    marginTop: "20px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#2c3e50",
  },
  text: {
    fontSize: "1.5rem",
    marginTop: "15px",
    color: "#34495e",
  },
  bold: {
    fontWeight: "bold",
    color: "#2980b9",
  },
  teamMember: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginTop: "15px",
    color: "#2c3e50",
  },
};

export default AboutUs;