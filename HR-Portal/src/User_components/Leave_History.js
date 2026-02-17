// Leave_History.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../css/LeaveHistory.css";

const LeaveHistory = () => {
  const [searchMonth, setSearchMonth] = useState("");
  const navigate = useNavigate();

  const leaveRequests = [
    {
      empId: "p101",
      name: "Punith A A",
      leaveType: "Sick Leave",
      type: "Paid",
      leavePeriod: "06-Aug-2025 - 08-Aug-2025",
      daysTaken: "3 Day(s)",
      requestDate: "2025-08-11",
    },
  ];

  // Filter by selected month
  const filteredRequests = searchMonth
    ? leaveRequests.filter((req) => req.requestDate.startsWith(searchMonth))
    : leaveRequests;

  // Handle Add Request button
  const handleAddRequest = () => {
    navigate("/Dashboard", { state: { page: "Leave_request" } });
  };

  return (
    <div className="leave-requests-container">
      {/* Top Section with Month Picker + Buttons */}
      <div className="top-bar">
        <input
          type="month"
          className="search-bar small-input"
          value={searchMonth}
          onChange={(e) => setSearchMonth(e.target.value)}
          placeholder="Search by selecting Month"
        />
        <button className="search-btn">Search</button>
        <button className="add-btn" onClick={handleAddRequest}>
          Add Request
        </button>
      </div>

      {/* Leave Requests Table */}
      <table className="leave-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Employee Name</th>
            <th>Leave Type</th>
            <th>Type</th>
            <th>Leave Period</th>
            <th>Days Taken</th>
            <th>Date of Request</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  {req.empId} - <span className="emp-name">{req.name}</span>
                </td>
                <td>{req.leaveType}</td>
                <td>{req.type}</td>
                <td>{req.leavePeriod}</td>
                <td>{req.daysTaken}</td>
                <td>{req.requestDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveHistory;
