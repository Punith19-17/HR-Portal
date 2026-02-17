// Dashboard.js 
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../css/Dashboard.css";
import Aimslogo from "./Aimslogo.png";
import LeaveDashboard from "./Leave_Dashboard";
import Leaverequest from "./Leave_request";
import LeaveHistory from "./Leave_History";
import Club_Dashboard from "./Club_Dashboard"; 
import Club_Details from "./Club_Details"; 
const MySpace = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setActiveTab(page === "Dashboard" ? "Dashboard" : "Leave Tracker");

    if (page === "Dashboard") {
      navigate("/Dashboard");
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "Leave_Dashboard":
        return <LeaveDashboard setCurrentPage={setCurrentPage} />;
      case "Leave_request":
        return <Leaverequest />;
      case "Leave_History":
        return <LeaveHistory />;
      case "Club_Dashboard":     // ✅ Club Dashboard content
        return <Club_Dashboard />;
         case "Club_Details":     // ✅ Club Dashboard content
        return <Club_Details />;
      default:
        return (
          <>
            {/* BANNER */}
            <div className="banner" aria-label="space-banner" />

            {/* CONTENT */}
            <div className="content-row">
              {/* LEFT COLUMN */}
              <div className="col-left">
                <div className="card profile-card">
                  <div className="avatar-xl" />
                  <div className="who">
                    1 - <b>Punith A</b>
                  </div>
                  <div className="linkish">Holiday</div>
                  <div className="timer">
                    <span>03</span>
                    <span>:</span>
                    <span>00</span>
                    <span>:</span>
                    <span>00</span>
                  </div>
                  <button
                    className="btn-checkin"
                    onClick={handleCheckIn}
                    style={{
                      backgroundColor: isCheckedIn ? "#eafff3" : "#f0f0f0",
                      color: isCheckedIn ? "#169850" : "#666",
                      border: isCheckedIn ? "1px solid #9fe0bc" : "1px solid #ddd",
                    }}
                  >
                    {isCheckedIn ? "Checked In" : "Check-in"}
                  </button>
                </div>

                <div className="card dept-card">
                  <div className="card-title">Department Members</div>
                  <div className="muted">No Data Found</div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="col-right">
                {/* Future content here */}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="app-shell">
      {/* LEFT SIDEBAR */}
      <aside className="side">
        <div className="side-logo">
          <img
            src={Aimslogo}
            alt="AIMS Logo"
            style={{ width: "50px", height: "auto", borderRadius: "30px" }}
          />
        </div>

        <nav className="side-menu">
          <a
            className={`side-item ${currentPage === "Dashboard" ? "active" : ""}`}
            onClick={() => handleNavigation("Dashboard")}
          >
            <span className="side-ico" data-ico="home" />
            <span className="side-text">Home</span>
          </a>
          <a
            className={`side-item ${currentPage === "Leave_Dashboard" ? "active" : ""}`}
            onClick={() => handleNavigation("Leave_Dashboard")}
          >
            <span className="side-ico" data-ico="leave" />
            <span className="side-text">Leave Tracker</span>
          </a>
          <a
            className="side-item"
            onClick={() => handleNavigation("Attendance")}
          >
            <span className="side-ico" data-ico="check" />
            <span className="side-text">Attendance</span>
          </a>
          <a
            className={`side-item ${currentPage === "Club_Dashboard" ? "active" : ""}`}  
            onClick={() => handleNavigation("Club_Dashboard")}
          >
            <span className="side-ico" data-ico="file" />
            <span className="side-text">Club Activities</span>
          </a>
          <a
            className="side-item"
            onClick={() => handleNavigation("More")}
          >
            <span className="side-ico" data-ico="more" />
            <span className="side-text">More</span>
          </a>
        </nav>

        <nav className="side-menu bottom">
          <a
            className="side-item"
            onClick={() => handleNavigation("Operations")}
          >
            <span className="side-ico" data-ico="ops" />
            <span className="side-text">Operations</span>
          </a>
          <a
            className="side-item"
            onClick={() => handleNavigation("Reports")}
          >
            <span className="side-ico" data-ico="report" />
            <span className="side-text">Reports</span>
          </a>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="main">
        {/* TOP DARK BAR */}
        <header className="topbar">
          <div className="top-center" style={{ flex: 1, justifyContent: "center" }}>
            <span className="top-title">AIMS</span>
          </div>
          {/* 🔍 Notifications ⚙️ Profile are still here */}
        </header>

        {/* WHITE SUB NAV - Only show for Dashboard */}
        {currentPage === "Dashboard" && (
          <div className="subnav">
            <div className="tabs">
              <a
                className={`tab ${activeTab === "Dashboard" ? "active" : ""}`}
                onClick={() => handleTabClick("Dashboard")}
              >
                Dashboard
              </a>
              <a
                className={`tab ${activeTab === "Calendar" ? "active" : ""}`}
                onClick={() => handleTabClick("Calendar")}
              >
                Calendar
              </a>
            </div>
          </div>
        )}

        {/* Render correct page */}
        {renderContent()}

        <Outlet />
      </div>
    </div>
  );
};

export default MySpace;
