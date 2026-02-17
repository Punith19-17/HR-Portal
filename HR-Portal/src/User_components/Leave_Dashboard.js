// Leave_Dashboard.js
import React, { useState } from "react";
import "../css/LeaveDashboard.css";
import LeaveHistory from "./Leave_History"; // import your Leave_History.js

const LeaveDashboard = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState("Leave Summary");

  const handleApplyLeave = () => {
    setCurrentPage("Leave_request"); // only for Apply Leave
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="leave-container">
      {/* Top Navigation */}
      <div className="leave-topnav">
        <div className="tabs">
          <span
            className={`tab ${activeTab === "Leave Summary" ? "active" : ""}`}
            onClick={() => handleTabClick("Leave Summary")}
          >
            Leave Summary
          </span>
          <span
            className={`tab ${activeTab === "Leave_History" ? "active" : ""}`}
            onClick={() => handleTabClick("Leave_History")}
          >
            Leave History
          </span>
        </div>
      </div>

      {/* Leave Summary Content */}
      {activeTab === "Leave Summary" && (
        <>
          <div className="leave-summary-info">
            Leave booked this year : <b>3 day(s)</b> | Absent : <b>0</b>
          </div>

          <div className="leave-header">
            <div className="date-range">
              <button className="nav-btn">{"<"}</button>
              <span>01-Jan-2025 - 31-Dec-2025</span>
              <button className="nav-btn">{">"}</button>
            </div>
            <button className="apply-btn" onClick={handleApplyLeave}>
              Apply Leave
            </button>
          </div>

          {/* Cards */}
          <div className="leave-cards">
            <div className="leave-card blue">
              <p>Casual Leave</p>
              <div className="leave-status">
                <span>Available <b>5</b></span>
                <span>Booked <b>0</b></span>
              </div>
            </div>

            <div className="leave-card green">
              <p>Earned Leave</p>
              <div className="leave-status">
                <span>Available <b>5</b></span>
                <span>Booked <b>0</b></span>
              </div>
            </div>

            <div className="leave-card red">
              <p>Leave Without Pay</p>
              <div className="leave-status">
                <span>Available <b>0</b></span>
                <span>Booked <b>0</b></span>
              </div>
            </div>

            <div className="leave-card yellow">
              <p>Sabbatical Leave</p>
              <div className="leave-status">
                <span>Available <b>0</b></span>
                <span>Booked <b>0</b></span>
              </div>
            </div>

            <div className="leave-card purple">
              <p>Sick Leave</p>
              <div className="leave-status">
                <span>Available <b>2</b></span>
                <span>Booked <b>3</b></span>
              </div>
            </div>
          </div>

          {/* Upcoming Leaves */}
          <div className="upcoming-section">
            <select className="dropdown">
              <option>Upcoming Leave & Holidays</option>
            </select>
            <div className="no-data">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="no data"
              />
              <p>No Data Found</p>
            </div>
          </div>
        </>
      )}

      {/* Leave History Content */}
      {activeTab === "Leave_History" && <LeaveHistory />}
    </div>
  );
};

export default LeaveDashboard;
