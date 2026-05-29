// Leavestatus.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../styles/Leavestatus.css";
import { useNavigate } from 'react-router-dom';

const LeaveHub = ({ employeeId }) => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleBack = () => navigate('/dashboard');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employee/leaves', {
          withCredentials: true
        });
        if (response.data.success) {
          setLeaves(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch leave data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leave data. Please try again later.');
        if (err.response?.status === 401) handleBack();
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, [employeeId]);

  const getStatusClass = (status) => {
    const map = { approved: 'ls-approved', pending: 'ls-pending', rejected: 'ls-rejected' };
    return map[status?.toLowerCase()] || 'ls-pending';
  };

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeaves    = leaves.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(leaves.length / itemsPerPage);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="leave-hub-wrapper">

      {/* ── Header ── */}
      <div className="leave-hub-header">
        <div>
          <h1>Leave Applications</h1>
          <p className="lsh-sub">All submitted leave applications and their current status</p>
        </div>
        <button className="back-button" onClick={handleBack}>
          ← Back to Dashboard
        </button>
      </div>

      {/* ── Main Content Card ── */}
      <div className="leave-hub-content">

        {/* Panel Head */}
        <div className="ls-panel-head">
          <div className="ls-panel-left">
            <div className="ls-panel-icon">📋</div>
            <div>
              <div className="ls-panel-title">Leave Records</div>
              <div className="ls-panel-sub">View all your submitted leave applications</div>
            </div>
          </div>
          {!loading && !error && (
            <div className="ls-count-badge">{leaves.length} Records</div>
          )}
        </div>

        {/* States */}
        {loading ? (
          <div className="loading-spinner" />
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : leaves.length === 0 ? (
          <div className="no-leaves">
            <p>No leave records found</p>
            <button className="refresh-btn" onClick={() => window.location.reload()}>
              🔄 Refresh
            </button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="leaves-table-container">
              <table className="leaves-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>
                        <div className="ls-emp">
                          <div className="ls-av">{getInitials(leave.name)}</div>
                          <div>
                            <div className="ls-ename">{leave.name}</div>
                            <div className="ls-eid">{leave.employee_id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{leave.department}</td>
                      <td>{leave.designation}</td>
                      <td>{leave.leave_type}</td>
                      <td>{formatDate(leave.start_date)}</td>
                      <td>{formatDate(leave.end_date)}</td>
                      <td>{leave.duration}</td>
                      <td className="reason-cell">{leave.reason}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(leave.status)}`}>
                          <span className="ls-dot" />
                          {leave.status}
                        </span>
                      </td>
                      <td>
                        {leave.leave_letter ? (
                          <a
                            href={`http://localhost:5000/uploads/${leave.leave_letter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-letter"
                          >
                            📄 View
                          </a>
                        ) : <span style={{ color: '#a0aec0', fontSize: 12 }}>N/A</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeaveHub;