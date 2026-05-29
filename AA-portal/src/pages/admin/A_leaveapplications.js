import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Leaveapplication.css';

const LeaveApplications = () => {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        setLoading(true);
        
        const response = await fetch("http://localhost:5000/api/leave-requests", {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorData}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON but got ${contentType}. Response: ${text}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        setLeaveRequests(data.data || []);
        setError(null);
        
      } catch (error) {
        console.error("API Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    if (selectedLeave) {
      setStatus(selectedLeave.status || "Pending");
      console.log("Selected Leave:", selectedLeave);
    }
  }, [selectedLeave]);

  const handleView = (request) => {
    setSelectedLeave(request);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/leave-requests/${selectedLeave.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status
        }),
      });

      if (response.ok) {
        const updatedRequests = leaveRequests.map(request => {
          if (request.id === selectedLeave.id) {
            return {
              ...request,
              status: status
            };
          }
          return request;
        });

        setLeaveRequests(updatedRequests);
        setSelectedLeave({
          ...selectedLeave,
          status: status
        });

        alert("Leave status updated successfully!");
      } else {
        throw new Error("Failed to update leave status");
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert("Error updating leave status");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getLeaveLetterUrl = (letterPath) => {
    if (!letterPath) return null;
    if (letterPath.startsWith('http://') || letterPath.startsWith('https://')) {
      return letterPath;
    }
    return `http://localhost:5000/${letterPath.replace(/^\//, '')}`;
  };

  return (
    <div className="page-style">
      <div className="header-style">
        HrPortal
        {/* Back Button */}
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            right: '20px',
            top: '15px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          Back
        </button>
      </div>
      <h2 className="page-title">
        Leave Applications
      </h2>

      {loading && <p>Loading leave requests...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      <div className="table-container">
        <table className="leave-table">
          <thead>
            <tr className="table-header">
              <th className="table-header-cell">Employee ID</th>
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell">Department</th>
              <th className="table-header-cell">Designation</th>
              <th className="table-header-cell">Leave Type</th>
              <th className="table-header-cell">Start Date</th>
              <th className="table-header-cell">End Date</th>
              <th className="table-header-cell">Reason</th>
              <th className="table-header-cell">Leave Letter</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length > 0 ? (
              leaveRequests.map((request) => {
                const letterUrl = getLeaveLetterUrl(request.leave_letter);
                return (
                  <tr key={request.id} className="table-row">
                    <td className="table-cell">{request.employee_id}</td>
                    <td className="table-cell">{request.name}</td>
                    <td className="table-cell">{request.department}</td>
                    <td className="table-cell">{request.designation}</td>
                    <td className="table-cell">{request.leave_type}</td>
                    <td className="table-cell">{formatDate(request.start_date)}</td>
                    <td className="table-cell">{formatDate(request.end_date)}</td>
                    <td className="table-cell reason-cell">{request.reason || "Not specified"}</td>
                    <td className="table-cell">
                      {letterUrl ? (
                        <a 
                          href={letterUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="letter-link"
                        >
                          View
                        </a>
                      ) : (
                        <span className="no-letter">None</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${request.status?.toLowerCase()}`}>
                        {request.status || "Pending"}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button 
                        className="view-button" 
                        onClick={() => handleView(request)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="11" className="no-data">
                  {loading ? "Loading..." : "No leave requests found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDetails && selectedLeave && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Leave Application Details</h2>
            
            <div className="detail-grid">
              <div className="detail-row">
                <span className="detail-label">Employee ID:</span>
                <span className="detail-value">{selectedLeave.employee_id}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedLeave.name}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Department:</span>
                <span className="detail-value">{selectedLeave.department}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Designation:</span>
                <span className="detail-value">{selectedLeave.designation}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Leave Type:</span>
                <span className="detail-value">{selectedLeave.leave_type}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Start Date:</span>
                <span className="detail-value">{formatDate(selectedLeave.start_date)}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">End Date:</span>
                <span className="detail-value">{formatDate(selectedLeave.end_date)}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Reason:</span>
                <span className="detail-value reason-text">{selectedLeave.reason || "Not specified"}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Leave Letter:</span>
                <span className="detail-value">
                  {selectedLeave.leave_letter ? (
                    <a 
                      href={getLeaveLetterUrl(selectedLeave.leave_letter)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="letter-link"
                    >
                      View Letter
                    </a>
                  ) : (
                    <span className="no-letter">No letter attached</span>
                  )}
                </span>
              </div>
              
              <div className="detail-row status-row">
                <span className="detail-label">Status:</span>
                <select 
                  className="status-select"
                  value={status}
                  onChange={handleStatusChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            <div className="modal-button-container">
              <button className="close-button" onClick={handleCloseDetails}>
                Close
              </button>
              <button className="update-button" onClick={handleStatusUpdate}>
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApplications;