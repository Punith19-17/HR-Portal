// Leave_request.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/LeaveRequest.css";

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
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleClose = () => navigate("/Dashboard/Leave_Dashboard");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Leave request submitted successfully!");
    navigate("/Dashboard/Leave_Dashboard");
  };

  return (
    <div className="fullpage-container">

      {/* ── Header ── */}
      <div className="modal-header">
        <div>
          <h3>Apply for Leave</h3>
          <div className="modal-header-sub">Fill in the details below to submit your leave application</div>
        </div>
        <button className="close-btn" onClick={handleClose} title="Close">✕</button>
      </div>

      {/* ── Body ── */}
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend>Leave Application</legend>

            {/* Section Label */}
            <div className="lr-section-label">
              <div className="lr-section-icon">📝</div>
              <div>
                <div className="lr-section-title">Leave Details</div>
                <div className="lr-section-sub">Please provide accurate information for your request</div>
              </div>
            </div>

            {/* Employee search */}
            <div className="form-row">
              <label>Search Employee</label>
              <input
                type="text"
                name="search"
                placeholder="Search by name or ID..."
                value={formData.search}
                onChange={handleChange}
              />
            </div>

            {/* Two-col grid: leave type + email */}
            <div className="lr-form-grid">
              <div className="form-row">
                <label>Leave Type <span className="required">*</span></label>
                <select
                  name="leave_type"
                  value={formData.leave_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select leave type</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="Earned">Earned Leave</option>
                  <option value="LWP">Leave Without Pay</option>
                  <option value="Sabbatical">Sabbatical Leave</option>
                </select>
              </div>

              <div className="form-row">
                <label>Team / Manager Email</label>
                <input
                  type="email"
                  name="team_email"
                  placeholder="manager@aarya.in"
                  value={formData.team_email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Date range */}
            <div className="form-row">
              <label>Date Range <span className="required">*</span></label>
              <div className="date-fields">
                <div className="date-field">
                  <span>From Date</span>
                  <input
                    type="date"
                    name="from_date"
                    value={formData.from_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="date-field">
                  <span>To Date</span>
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

            {/* Reason */}
            <div className="form-row">
              <label>Reason for Leave</label>
              <textarea
                name="reason"
                placeholder="Briefly describe the reason for your leave..."
                value={formData.reason}
                onChange={handleChange}
              />
            </div>

            {/* File upload */}
            <div className="form-row">
              <label>Supporting Document (Optional)</label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
            </div>

            {/* Action buttons */}
            <div className="buttons">
              <button type="submit" className="submit-btn">
                ✓ Submit Application
              </button>
              <button type="button" className="cancel-btn" onClick={handleClose}>
                ✕ Cancel
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequest;
