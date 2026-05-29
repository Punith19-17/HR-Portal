import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TeachingStaff() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_type: "",
    name: "",
    email_id: "",
    gender: "",
    dob: "",
    mobile_no: "",
    permanent_address: "",
    adhar_number: "",
    department: "",
    designation: "",
    doj: "", // Added DOJ field
    profile_picture: null,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_picture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if employee_id already exists
    try {
      const checkResponse = await axios.get(
        `http://localhost:5000/api/check-employee-id/${formData.employee_id}`
      );
      if (checkResponse.data.exists) {
        setMessage("Employee ID already exists. Please use a different ID.");
        return;
      }
    } catch (error) {
      console.error("Error checking employee ID:", error);
    }
  
    // Proceed with form submission if ID is unique
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/personal-information", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage("Failed to submit data. Please try again.");
    }
  };

  const handleNext = () => {
    navigate("/qualification");
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
          background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
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
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          position: fixed;
          top: 0;
          left: 0;
        }

        .back-button {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 12px 25px;
          border: none;
          border-radius: 6px;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
        }

        .back-button:hover {
          background: linear-gradient(135deg, #764ba2, #667eea);
        }

        .teaching-staff {
          position: relative;
          margin-top: 120px;
          font-size: 1.8rem;
          font-weight: bold;
          color: #333;
          align-self: flex-start;
          margin-left: 40px;
        }

        .form-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 20px;
          width: 100%;
          background: linear-gradient(135deg, #e0eafc, #cfdef3);
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 1.1rem;
          font-weight: bold;
          color: #333;
        }

        .form-group input, .form-group select {
          padding: 8px;
          font-size: 1.1rem;
          border-radius: 6px;
          border: 1px solid #ccc;
          width: 300px;
          color: #333;
          background-color: #fff;
        }

        .submit-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
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
          background: linear-gradient(135deg, #764ba2, #667eea);
        }

        .next-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 10px 40px;
          border: none;
          border-radius: 10px;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          margin-top: 40px;
          align-self: center;
          margin-left: 20px;
        }

        .next-button:hover {
          background: linear-gradient(135deg, #764ba2, #667eea);
        }

        .button-container {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
        }

        .message {
          margin-top: 20px;
          font-size: 1.2rem;
          color: #28a745;
          font-weight: bold;
        }
        .error-message {
            margin-top: 20px;
            font-size: 1.2rem;
            color: #dc3545;
            font-weight: bold;
        }
      `}</style>

      <div className="header">HrPortal</div>
      <button className="back-button" onClick={() => navigate("/Login")}>
        Back
      </button>
      <div className="teaching-staff">Personal Information</div>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="employee_id"
              placeholder="Enter Employee ID"
              value={formData.employee_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Employee Type</label>
            <select
              name="employee_type"
              value={formData.employee_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee Type</option>
              <option>Teaching</option>
              <option>Non-Teaching</option>
            </select>
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email ID</label>
            <input
              type="email"
              name="email_id"
              placeholder="Enter Email ID"
              value={formData.email_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>DOB</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mobile No</label>
            <input
              type="text"
              name="mobile_no"
              placeholder="Enter Mobile No"
              value={formData.mobile_no}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Permanent Address</label>
            <input
              type="text"
              name="permanent_address"
              placeholder="Enter Permanent Address"
              value={formData.permanent_address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Aadhar Number</label>
            <input
              type="text"
              name="adhar_number"
              placeholder="Enter Aadhar Number"
              value={formData.adhar_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              placeholder="Enter Department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              placeholder="Enter Designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Joining</label>
            <input
              type="date"
              name="doj"
              value={formData.doj}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Profile Picture</label>
            <input
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
        </div>

        <div className="button-container">
          <button className="submit-button" type="submit">
            Submit
          </button>
          <button className="next-button" onClick={handleNext}>
            Next
          </button>
        </div>
      </form>

      {message && <div className="message">{message}</div>}
    </>
  );
}

export default TeachingStaff;