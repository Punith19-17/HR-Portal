import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Side-Heddar.css";
import AaryaLogo from "../../pages/user/AaryaLogo.png";
import { 
  Home as HomeIcon, 
  Calendar, 
  CheckSquare, 
  User,
  CreditCard,
  FileText,
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Phone, 
  Mail, 
  MapPin 
} from "lucide-react";

const SideHeader = ({ 
  children, 
  currentPage = "Dashboard", 
  onNavigate, 
  activeTab = "Dashboard", 
  onTabClick,
  showSubnav = true 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigationItem = (page) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      if (page === "Dashboard") {
        navigate("/Dashboard");
      } else if (page === "Profile") {
        navigate("/Dashboard/Profile");
      } else if (page === "Attendance") {
        navigate("/Dashboard/Attendance");
      } else if (page === "Leave_Dashboard") {
        navigate("/Dashboard/Leave_Dashboard");
      } else if (page === "Payslip") {
        navigate("/Dashboard/Payslip");
      } else if (page === "Documents") {
        navigate("/Dashboard/Documents");
      }
    }
    setIsSidebarOpen(false); // Close mobile drawer
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of Aarya Workspace?")) {
      navigate("/Home");
    }
  };

  return (
    <div className="dark-app-shell">
      
      {/* 1. LUXURIOUS FULL-HEIGHT LEFT GLASS SIDEBAR */}
      <aside className={`side-sidebar premium-left-sidebar ${isSidebarOpen ? "open" : ""}`}>
        
        {/* Double-Ring Interlocking logo image & Serif Branding */}
        <div className="sidebar-brand-section">
          <div className="double-ring-logo-badge">
            <div className="logo-inner-ring">
              <img src={AaryaLogo} alt="Aarya Associates Logo" className="brand-logo-img" />
            </div>
          </div>
          <div className="brand-text-sidebar">
            <span className="brand-name-serif">AARYA</span>
            <span className="brand-name-sub-serif">ASSOCIATES</span>
          </div>
        </div>

        {/* Delicate Brand Divider Line */}
        <div className="sidebar-brand-divider"></div>

        {/* Premium Lucide-Powered Navigation Menu */}
        <nav className="sidebar-nav-menu">
          
          <a 
            href="#!"
            className={`sidebar-nav-link ${currentPage === "Dashboard" ? "active" : ""}`}
            onClick={() => handleNavigationItem("Dashboard")}
          >
            <HomeIcon size={16} className="nav-icon" />
            <span className="nav-label">Dashboard</span>
          </a>

          <a 
            href="#!"
            className={`sidebar-nav-link ${currentPage === "Profile" ? "active" : ""}`}
            onClick={() => handleNavigationItem("Profile")}
          >
            <User size={16} className="nav-icon" />
            <span className="nav-label">My Profile</span>
          </a>

          <a 
            href="#!"
            className={`sidebar-nav-link ${currentPage === "Attendance" ? "active" : ""}`}
            onClick={() => handleNavigationItem("Attendance")}
          >
            <CheckSquare size={16} className="nav-icon" />
            <span className="nav-label">Attendance Module</span>
          </a>

          <a 
            href="#!"
            className={`sidebar-nav-link ${currentPage === "Leave_Dashboard" ? "active" : ""}`}
            onClick={() => handleNavigationItem("Leave_Dashboard")}
          >
            <Calendar size={16} className="nav-icon" />
            <span className="nav-label">Leave Tracker</span>
          </a>

          <a 
            href="#!"
            className={`sidebar-nav-link ${currentPage === "Payslip" ? "active" : ""}`}
            onClick={() => handleNavigationItem("Payslip")}
          >
            <CreditCard size={16} className="nav-icon" />
            <span className="nav-label">Payslip Module</span>
          </a>

          <a 
            href="#!"
            className={`sidebar-nav-link ${currentPage === "Documents" ? "active" : ""}`}
            onClick={() => handleNavigationItem("Documents")}
          >
            <FileText size={16} className="nav-icon" />
            <span className="nav-label">Documents</span>
          </a>

        </nav>

        {/* Corporate ID Badge Block for Sneha G */}
        <div className="sidebar-consultant-card">
          <div className="consultant-card-badge-header">
            <div className="badge-avatar-ring">
              <div className="badge-avatar-inner">SG</div>
            </div>
            <div className="badge-title-details">
              <span className="badge-name">Sneha G</span>
              <span className="badge-designation">Consultant</span>
            </div>
          </div>
          
          <div className="badge-contact-list">
            <div className="badge-contact-item">
              <Phone size={10} className="icon-gold" />
              <span>7353211611</span>
            </div>
            <div className="badge-contact-item">
              <Mail size={10} className="icon-gold" />
              <span>aarya.g.associates@gmail.com</span>
            </div>
            <div className="badge-contact-item">
              <MapPin size={10} className="icon-gold" />
              <span className="address-line">No.92/2 Dwarakanagara, BSK 3rd Stage, Bangalore</span>
            </div>
          </div>

          <button className="sidebar-logout-btn-pill" onClick={handleLogout}>
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Mobile Drawer Backdrop overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. FLOATING HEADER CAPSULE (Aligned starting next to full sidebar) */}
      <header className="top-floating-capsule">
        <div className="capsule-left">
          {/* Mobile hamburger menu toggle */}
          <button 
            className="mobile-hamburger-btn" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Sidebar Menu"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <span className="executive-portal-title">Aarya Executive Portal</span>
        </div>

        <div className="capsule-right">
          {showSubnav && currentPage === "Dashboard" && (
            <div className="capsule-subnav">
              <a
                className={`subnav-pill ${activeTab === "Dashboard" ? "active" : ""}`}
                onClick={() => onTabClick && onTabClick("Dashboard")}
              >
                Summary
              </a>
              <a
                className={`subnav-pill ${activeTab === "Calendar" ? "active" : ""}`}
                onClick={() => onTabClick && onTabClick("Calendar")}
              >
                Roster
              </a>
            </div>
          )}

          <div className="capsule-actions">
            <button className="capsule-icon-btn notification-badge" aria-label="Notifications">
              <Bell size={16} />
              <span className="capsule-badge-dot" />
            </button>
            <div className="capsule-user-widget">
              <div className="avatar-mini-glow">PA</div>
              <div className="profile-text-dark">
                <span className="user-name-short">Punith A</span>
                <span className="user-role-short">Consulting Lead</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. GRAND WORKSPACE CONTAINER */}
      <main className="grand-workspace">
        {children}
        <div className="workspace-bottom-padding" />
      </main>

    </div>
  );
};

export default SideHeader;
