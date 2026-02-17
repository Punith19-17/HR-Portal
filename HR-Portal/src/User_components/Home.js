import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const StaffLeaveHub = () => {
  const setActive = (event) => {
    const links = document.querySelectorAll('.navbar a');
    links.forEach((link) => link.classList.remove('active'));
    event.target.classList.add('active');
  };

  return (
    <div className="body">
      {/* Header */}
      <header className="header">
        Staff Leave Hub
      </header>

      {/* Navbar */}
      <nav className="navbar-container">
        <div className="navbar">
          <a href="#" className="active" onClick={setActive}>Home</a>
          <a href="/Login" onClick={setActive}>Staff Login</a>
          <a href="/A_Login" onClick={setActive}>Admin Login</a>
          <a href="/Aboutus" onClick={setActive}>About Us</a>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Section 1 - Image Left */}
        <section className="content-section">
          <img
            src="leave1.png"
            alt="Leave Management Dashboard"
            className="content-image"
          />
          <div className="content-info">
            <h2>Employee Applying Leave</h2>
            <p>
              Streamline your leave management process with our intuitive system:
            </p>
            <ul>
              <li>Login to the system using employee credentials.</li>
              <li>Go to the 'Leave Application' section in the dashboard.</li>
              <li>Select the leave start date and end date.</li>
              <li>Enter the reason for taking leave.
                (Optional) Upload a document if required</li>
            </ul>
          </div>
        </section>

        {/* Section 2 - Image Right */}
        <section className="content-section reverse">
          <img
            src="leave2.jpg"
            alt="Team Collaboration"
            className="content-image"
          />
          <div className="content-info">
            <h2>Empolyee Attendance</h2>
            <p>
              Features designed to enhance empolyee attendance:
            </p>
            <ul>
              <li>Shared team calendars</li>
              <li>Customizable notifications</li>
              <li>Availability indicators</li>
              <li>Shift coverage tools</li>
            </ul>
          </div>
        </section>

        {/* Section 3 - Image Left */}
        <section className="content-section">
          <img
            src="leave3.jpg"
            alt="Analytics Dashboard"
            className="content-image"
          />
          <div className="content-info">
            <h2>Advanced Analytics</h2>
            <p>
              Data-driven insights for better decision making:
            </p>
            <ul>
              <li>Leave trend analysis</li>
              <li>Custom reporting</li>
              <li>Staffing forecasts</li>
              <li>Peak period identification</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Staff Leave Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StaffLeaveHub;