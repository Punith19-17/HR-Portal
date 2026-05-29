// Leave_History.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/LeaveHistory.css";

const leaveRequests = [
  {
    empId: "P101",
    name: "Punith A A",
    leaveType: "Sick Leave",
    typeClass: "lh-sick",
    type: "Paid",
    leavePeriod: "06 Aug 2025 — 08 Aug 2025",
    daysTaken: "3 Day(s)",
    requestDate: "2025-08-11",
  },
];

const LeaveHistory = () => {
  const [searchMonth, setSearchMonth] = useState("");
  const navigate = useNavigate();

  const filteredRequests = searchMonth
    ? leaveRequests.filter((req) => req.requestDate.startsWith(searchMonth))
    : leaveRequests;

  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="leave-requests-container">
      {/* ── Toolbar ── */}
      <div className="top-bar">
        <input
          type="month"
          className="search-bar"
          value={searchMonth}
          onChange={(e) => setSearchMonth(e.target.value)}
          title="Filter by month"
        />
        <button className="search-btn">
          🔍 Search
        </button>
        <button className="add-btn" onClick={() => navigate("/Dashboard/Leave_request")}>
          ＋ New Request
        </button>
      </div>

      {/* ── Table panel ── */}
      <div className="leave-table-panel">
        <div className="leave-table-panel-head">
          <div className="leave-table-panel-icon">🕐</div>
          <div>
            <div className="leave-table-panel-title">Leave History</div>
            <div className="leave-table-panel-sub">Your past and current leave applications</div>
          </div>
        </div>

        <div className="leave-table-scroll">
          <table className="leave-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Pay Type</th>
                <th>Leave Period</th>
                <th>Days Taken</th>
                <th>Request Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req, i) => (
                  <tr key={i}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div className="lh-emp">
                        <div className="lh-av">{getInitials(req.name)}</div>
                        <div>
                          <div className="lh-ename">{req.name}</div>
                          <div className="lh-eid">{req.empId}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`lh-type-badge ${req.typeClass}`}>{req.leaveType}</span>
                    </td>
                    <td>
                      <span className="lh-pay-chip">{req.type}</span>
                    </td>
                    <td>{req.leavePeriod}</td>
                    <td><span className="lh-days">{req.daysTaken}</span></td>
                    <td>{req.requestDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No leave records found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveHistory;
