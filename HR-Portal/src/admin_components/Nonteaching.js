import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function NonTeachingStaff() {
  const navigate = useNavigate(); // Initialize useNavigate

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
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }

        .header {
          width: 100%;
          text-align: center;
          padding: 15px;
          font-size: 2.5rem;
          font-weight: bold;
          background: linear-gradient(135deg, #8e9eab, rgb(168, 178, 178));
          color: black;
          position: fixed;
          top: 0;
          left: 0;
        }

        .back-button {
          position: absolute;
          top: 15px;
          right: 15px;
          background:linear-gradient(135deg, #6A11CB, #2575FC);
          color: white;
          padding: 12px 25px;
          border: none;
          border-radius: 6px;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
        }

        .back-button:hover {
          background: #66D3FA;
        }

        .Non-teaching-staff {
          position: relative;
          margin-top: 120px;
          font-size: 2.1rem;
          font-weight: bold;
          color: #333;
          align-self: flex-start;
          margin-left: 40px;
        }

        .profile-pic {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid white;
          position: absolute;
          top: 120px;
          left: 40px;
        }

        .form-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 20px;
          width: 100%;
          background: linear-gradient(135deg, #E8F5C8, #9FA5D5);
          padding: 20px;
          border-radius: 10px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 1.1rem;
          font-weight: bold;
          color: white;
        }

        .form-group input, .form-group select {
          padding: 12px;
          font-size: 1.1rem;
          border-radius: 6px;
          border: none;
          width: 300px;
          color: black;
        }

        .submit-button {
          background:   #4CA6D4;
          color: white;
          padding: 10px 40px;
          border: none;
          border-radius: 10px;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          margin-top: 40px;
          align-self: center;
        }

        .submit-button:hover {
          background:  #66D3FA;
        }
      `}</style>

      <div className="header">Staff Leave Hub</div>
      {/* Back Button with Navigation */}
      <button className="back-button" onClick={() => navigate("/A_Dashboard")}>
        Back
      </button>
      <div className="Non-teaching-staff">Non-Teaching Staff</div>

      <img
        className="profile-pic"
        src="https://via.placeholder.com/120"
        alt="Profile"
      />

      <div className="form-container">
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Enter Name" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter Email" />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Phone No</label>
          <input type="text" placeholder="Enter Phone No" />
        </div>
        <div className="form-group">
          <label>DOB</label>
          <input type="date" />
        </div>
        <div className="form-group">
          <label>Department</label>
          <input type="text" placeholder="Enter Department" />
        </div>
        <div className="form-group">
          <label>DOJ</label>
          <input type="date" />
        </div>
        <div className="form-group">
          <label>Designation</label>
          <input type="text" placeholder="Enter Designation" />
        </div>
      </div>

      <button className="submit-button">Submit</button>
    </>
  );
}

export default NonTeachingStaff;