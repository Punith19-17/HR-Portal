import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/Leavestatus.css";
import { useNavigate } from 'react-router-dom';

const LeaveHub = ({ employeeId }) => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleBack = () => {
    navigate('/dashboard'); // Navigate to dashboard when back button is clicked
  };

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
        console.error('Error fetching leaves:', err);
        if (err.response?.status === 401) {
          handleBack(); // Navigate to dashboard if unauthorized
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [employeeId]);

  const getStatusColor = (status) => {
    const statusColors = {
      approved: '#4CAF50',
      pending: '#FFC107',
      rejected: '#F44336'
    };
    return statusColors[status.toLowerCase()] || '#9E9E9E';
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeaves = leaves.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(leaves.length / itemsPerPage);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="leave-hub-wrapper">
      <header className="leave-hub-header">
        <h1>Staff Leave Hub</h1>
        <button className="back-button" onClick={handleBack}>
          &larr; Back
        </button>
      </header>

      <div className="leave-hub-content">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : leaves.length === 0 ? (
          <div className="no-leaves">
            <p>No leave records found</p>
            <button onClick={() => window.location.reload()} className="refresh-btn">
              Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="leaves-table-container">
              <table className="leaves-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Leave Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.employee_id}</td>
                      <td>{leave.name}</td>
                      <td>{leave.department}</td>
                      <td>{leave.designation}</td>
                      <td>{leave.leave_type}</td>
                      <td>{formatDate(leave.start_date)}</td>
                      <td>{formatDate(leave.end_date)}</td>
                      <td>{leave.duration}</td>
                      <td className="reason-cell">{leave.reason}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(leave.status) }}
                        >
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
                            View
                          </a>
                        ) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
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