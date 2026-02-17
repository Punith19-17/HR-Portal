// Leave_request.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LeaveHistory.css";

const LeaveRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    search: "",
    leave_type: "",
    from_date: "",
    to_date: "",
    team_email: "",
    reason: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // FIXED: Go back to LeaveDashboard correctly
  const handleClose = () => {
    navigate("/Dashboard", { state: { page: "Leave_Dashboard" } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Leave request submitted successfully!");
    navigate("/Dashboard", { state: { page: "Leave_History" } });
  };

  return (
    <div className="fullpage-container">
      {/* Header */}
      <div className="modal-header">
        <h3>Apply Leave</h3>
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
      </div>

      {/* Body */}
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend>Leave</legend>

            {/* Search bar */}
            <div className="form-row">
              <label>Search</label>
              <input
                type="text"
                name="search"
                placeholder="Search..."
                value={formData.search}
                onChange={handleChange}
              />
            </div>

            {/* Leave type */}
            <div className="form-row">
              <label>
                Leave type <span className="required">*</span>
              </label>
              <select
                name="leave_type"
                value={formData.leave_type}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Sick">Sick Leave</option>
                <option value="Casual">Casual Leave</option>
                <option value="Annual">Annual Leave</option>
              </select>
            </div>

            {/* Dates */}
            <div className="form-row">
              <label>
                Date <span className="required">*</span>
              </label>
              <div className="date-fields">
                <div className="date-field">
                  <span>From</span>
                  <input
                    type="date"
                    name="from_date"
                    value={formData.from_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="date-field">
                  <span>To</span>
                  <input
                    type="date"
                    name="to_date"
                    value={formData.to_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Team Email ID */}
            <div className="form-row">
              <label>Team Email ID</label>
              <input
                type="email"
                name="team_email"
                placeholder="Enter team email"
                value={formData.team_email}
                onChange={handleChange}
              />
            </div>

            {/* Reason */}
            <div className="form-row">
              <label>Reason for leave</label>
              <textarea
                name="reason"
                placeholder="Enter reason for leave"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>

            {/* Upload file */}
            <div className="form-row">
              <label>Upload File</label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
            </div>
          </fieldset>

          {/* Buttons */}
          <div className="buttons">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            {/* Cancel button at bottom removed */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequest;
