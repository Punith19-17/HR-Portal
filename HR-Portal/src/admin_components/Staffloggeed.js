import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoggedStaff = () => {
  const [loggedEmployees, setLoggedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoggedEmployees = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('http://localhost:5000/api/logged-employees', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Only if using cookies/sessions
        });
  
        console.log('API Response:', response); // Debug log
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Network response was not ok');
        }
  
        const result = await response.json();
        console.log('API Data:', result); // Debug log
        
        setLoggedEmployees(result.data);
        
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load logged employees');
      } finally {
        setLoading(false);
      }
    };
  
    fetchLoggedEmployees();
  }, []);

  // Styles
  const pageStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
    padding: '20px'
  };

  const headerStyle = {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
    padding: '20px',
    background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
    color: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '25px',
    marginBottom: '30px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  };

  const thStyle = {
    backgroundColor: '#4a6baf',
    color: 'white',
    padding: '12px',
    textAlign: 'left'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e0e0e0'
  };

  const trHoverStyle = {
    backgroundColor: '#f8f9fa'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '20px',
    color: '#4a6baf'
  };

  const errorStyle = {
    color: '#e74c3c',
    textAlign: 'center',
    padding: '20px'
  };

  const backButtonStyle = {
    padding: '10px 20px',
    background: 'linear-gradient(to right, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontWeight: 'bold',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div style={pageStyle}>
      <button 
        style={backButtonStyle} 
        onClick={() => navigate(-1)}
      >
        ← Back to Dashboard
      </button>

      <div style={headerStyle}>
        <h1>Staff Leave Hub</h1>
        <h2>Logged Staffs</h2>
      </div>

      <div style={cardStyle}>
        {loading ? (
          <div style={loadingStyle}>Loading logged staff data...</div>
        ) : error ? (
          <div style={errorStyle}>Error: {error}</div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Employee ID</th>
                <th style={thStyle}>Login Date</th>
                <th style={thStyle}>Login Time</th>
              </tr>
            </thead>
            <tbody>
              {loggedEmployees.map((employee) => (
                <tr key={employee.id} style={{ ':hover': trHoverStyle }}>
                  <td style={tdStyle}>{employee.id}</td>
                  <td style={tdStyle}>{employee.employee_id}</td>
                  <td style={tdStyle}>{new Date(employee.login_date).toLocaleDateString()}</td>
                  <td style={tdStyle}>{employee.login_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LoggedStaff;