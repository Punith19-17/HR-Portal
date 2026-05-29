import React, { useState } from "react";

function EmployeeForm() {
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    password: "",
  });

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
      const response = await fetch("http://localhost:5000/api/employee", {
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
          name: "",
          password: "",
        });
        window.location.href = "/Login"; // Redirect after successful submission
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

        .employee-form {
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
          width: 400px;
          background: linear-gradient(135deg, #e0eafc, #cfdef3);
          padding: 20px;
          border-radius: 10px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 1.2rem;
          font-weight: bold;
          color: black;
          width: 100%;
        }

        .form-group label {
          margin-bottom: 10px;
        }

        .form-group input {
          padding: 12px;
          font-size: 1.2rem;
          border-radius: 6px;
          border: 1px solid #ccc;
          width: 100%;
          color: #333;
          background-color: white;
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
      `}</style>

      <div className="header">HrPortal</div>
      <div className="employee-form">Employee validation</div>
      <form className="form-container" onSubmit={handleSubmit}>
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
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="submit-button" type="submit">Submit</button>
      </form>
    </>
  );
}

export default EmployeeForm;