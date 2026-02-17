import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffLeaveHub = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          credentials: 'include',
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        if (!response.ok) {
          console.error('Failed to fetch user data');
          navigate('/login');
          return;
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Failed to load user data</div>;
  }

  const formattedDOB = userData.dob ? new Date(userData.dob).toDateString() : '';
  const profileImageUrl = userData.profile_picture
    ? `http://localhost:5000/${userData.profile_picture}`
    : 'https://via.placeholder.com/150';

  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>Staff Leave Hub</h1>
      <button style={backButtonStyle} onClick={handleBack}>Back</button>

      <div style={cardStyle}>
        <div style={leftPanelStyle}>
          <h2 style={profileHeaderStyle}>Profile Picture</h2>
          <img
            src={profileImageUrl}
            alt="Profile"
            style={profileImageStyle}
            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
          />
        </div>

        <div style={detailsStyle}>
          <div style={rowStyle}><strong>Employee ID:</strong> {userData.employee_id}</div>
          <div style={rowStyle}><strong>Employee Type:</strong> {userData.employee_type || 'Teaching'}</div>
          <div style={rowStyle}><strong>Name:</strong> {userData.name}</div>
          <div style={rowStyle}><strong>Email ID:</strong> {userData.email_id}</div>
          <div style={rowStyle}><strong>Gender:</strong> {userData.gender}</div>
          <div style={rowStyle}><strong>DOB:</strong> {formattedDOB}</div>
          <div style={rowStyle}><strong>Contact No.:</strong> {userData.mobile_no || 'N/A'}</div>
          <div style={rowStyle}><strong>Address:</strong> {userData.permanent_address}</div>
          <div style={rowStyle}><strong>Adhar Number:</strong> {userData.adhar_number}</div>
          <div style={rowStyle}><strong>Department:</strong> {userData.department}</div>
          <div style={rowStyle}><strong>Designation:</strong> {userData.designation}</div>
        </div>
      </div>
    </div>
  );
};

// Styles
const pageStyle = {
  margin: 0,
  padding: 0,
  fontFamily: 'Arial, sans-serif',
  background: 'linear-gradient(to right, #B0E0E6, #87CEEB)',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'relative',
};

const headerStyle = {
  fontSize: '40px',
  fontWeight: 'bold',
  margin: '40px 0 20px 0', // Added top margin for content shift
  color: 'black',
};

const backButtonStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  padding: '10px 20px',
  fontSize: '18px',
  cursor: 'pointer',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};

const cardStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '40px',
  background: 'white',
  borderRadius: '15px',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
  maxWidth: '1200px',
  width: '90%',
  marginBottom: '20px',
};

const leftPanelStyle = {
  flex: '1',
  marginRight: '40px',
};

const profileHeaderStyle = {
  marginBottom: '20px',
  fontSize: '24px',
  fontWeight: 'bold',
};

const profileImageStyle = {
  width: '200px',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '20px',
};

const detailsStyle = {
  flex: '2',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  textAlign: 'left',
};

const rowStyle = {
  fontSize: '20px',
};

export default StaffLeaveHub;
