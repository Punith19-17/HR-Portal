import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TeachingStaff() {
  const [formData, setFormData] = useState({
    employee_id: "",
    name_of_organization: "",
    s_from: "",
    s_to: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/experience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
        setFormData({
          employee_id: "",
          name_of_organization: "",
          s_from: "",
          s_to: "",
        });
      } else {
        alert("Failed to submit data.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while submitting data.");
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
          background: #66D3FA;
        }

        .teaching-staff {
          position: relative;
          margin-top: 120px;
          font-size: 1.8rem;
          font-weight: bold;
          color: #333;
          align-self: center;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
          width: 120%;
          background: linear-gradient(135deg, #E8F5C8, #9FA5D5);
          padding: 20px;
          border-radius: 10px;
          margin-left: -60px;
        }

        .form-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 1.2rem;
          font-weight: bold;
          color: white;
          width: 100%;
        }

        .form-group label {
          margin-bottom: 10px;
        }

        .form-group input {
          padding: 12px;
          font-size: 1.2rem;
          border-radius: 6px;
          border: none;
          width: 100%;
          color: black;
        }

        .submit-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 12px 50px;
          border: none;
          border-radius: 10px;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          margin-top: 40px;
          align-self: center;
        }

        .submit-button:hover {
          background: #66D3FA;
        }

        .button-container {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
        }
      `}</style>

      <div className="header">Staff Leave Hub</div>
      <button className="back-button" onClick={() => navigate(-4)}>
        Back
      </button>
      <div className="teaching-staff">Service Details</div>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-row">
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
            <label>Name of Organization</label>
            <input
              type="text"
              name="name_of_organization"
              placeholder="Enter Name of Organization"
              value={formData.name_of_organization}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Service From</label>
            <input
              type="date"
              name="s_from"
              value={formData.s_from}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Service To</label>
            <input
              type="date"
              name="s_to"
              value={formData.s_to}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="button-container">
          <button className="submit-button" type="submit">Submit</button>
        </div>
      </form>
    </>
  );
}

export default TeachingStaff;