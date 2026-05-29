import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function TeachingStaff() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_id:'',
    qualification: '',
    specialization: '',
    year_of_pass: '',
    qualification_documents: null
  });

  const fileInputRef = useRef(null);

  const handleNext = () => {
    // Validate all fields before navigating
    const { employee_id, qualification, specialization, year_of_pass, qualification_documents } = formData;
    
    if (!employee_id || !qualification || !specialization || !year_of_pass || !qualification_documents) {
      alert('Please fill in all fields before proceeding.');
      return;
    }

    // Validate year format (4 digits)
    if (!/^\d{4}$/.test(year_of_pass)) {
      alert('Year of passing must be a 4-digit year');
      return;
    }

    // If all validations pass, navigate
    navigate("/A_Service");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'qualification_documents') {
      const file = files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, DOC, and DOCX files are allowed.');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB.');
        return;
      }
      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('employee_id', formData.employee_id);
    formDataToSend.append('qualification', formData.qualification);
    formDataToSend.append('specialization', formData.specialization);
    formDataToSend.append('year_of_pass', formData.year_of_pass);
    formDataToSend.append('qualification_documents', formData.qualification_documents);

    try {
      const response = await fetch('http://localhost:5000/submit-qualification', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        alert('Data submitted successfully');
        setFormData({
          employee_id:'',
          qualification: '',
          specialization: '',
          year_of_pass: '',
          qualification_documents: null
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert(`Error: ${result.message || 'Failed to submit data'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting data');
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

        .teaching-staff {
          position: relative;
          margin-top: 150px;
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          align-self: center;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
          width: 100%;
          max-width: 1100px;
          background: linear-gradient(135deg, #E8F5C8, #9FA5D5);
          padding: 50px;
          border-radius: 10px;
        }

        .form-row {
          display: flex;
          gap: 40px;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: 1.3rem;
          font-weight: bold;
          color: white;
        }

        .form-group input, .form-group select {
          padding: 12px;
          font-size: 1.2rem;
          border-radius: 8px;
          border: none;
          width: 100%;
          color: black;
        }

        .submit-button, .next-button {
          background: linear-gradient(135deg, #6A11CB, #2575FC);
          color: white;
          padding: 12px 50px;
          border: none;
          border-radius: 10px;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          align-self: center;
        }

        .submit-button:hover, .next-button:hover {
          background: #66D3FA;
        }

        .button-container {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
        }
      `}</style>

      <div className="header">HrPortal</div>
      <div className="teaching-staff">Qualification Details</div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                name="employee_id"
                placeholder="Enter Employee ID"
                required
                value={formData.employee_id}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Qualification</label>
              <input
                type="text"
                name="qualification"
                placeholder="Enter Qualification"
                required
                value={formData.qualification}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Specialization</label>
              <input
                type="text"
                name="specialization"
                placeholder="Enter Specialization"
                required
                value={formData.specialization}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Year of Passing</label>
              <input
                type="text"
                name="year_of_pass"
                placeholder="Enter Year of Passing"
                required
                value={formData.year_of_pass}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Qualification Documents</label>
              <input
                type="file"
                name="qualification_documents"
                accept=".pdf,.doc,.docx"
                required
                onChange={handleChange}
                ref={fileInputRef}
              />
            </div>
          </div>

          <div className="button-container">
            <button className="submit-button" type="submit">Submit</button>
            <button className="next-button" type="button" onClick={handleNext}>Next</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default TeachingStaff;