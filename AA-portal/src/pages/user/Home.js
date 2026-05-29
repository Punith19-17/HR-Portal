import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users,
  Sparkles, 
  Clock,
  ArrowRight,
  Award,
  DollarSign,
  Receipt,
  CheckSquare,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import cornerPic from './Cornerpic.jpeg';
import '../../styles/Home.css';
import '../../styles/Login.css';

const HrPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Date & Time Ticker
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Announcement Modal state
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Unified Visual state for right visual pane: 'bulletin', 'employee-login', 'admin-login'
  const [rightPaneView, setRightPaneView] = useState('bulletin');

  // Employee Login form state
  const [employeeId, setEmployeeId] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [showEmployeePassword, setShowEmployeePassword] = useState(false);

  // Admin Login form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Refs and states for 3D Perspective scroll animations
  const payrollRef = React.useRef(null);
  const gstRef = React.useRef(null);
  const [isPayrollVisible, setIsPayrollVisible] = useState(false);
  const [isGstVisible, setIsGstVisible] = useState(false);

  // Inactivity tracking for 5-second attention grabber
  const [showInactivityNudge, setShowInactivityNudge] = useState(false);
  const [showOrientationGuide, setShowOrientationGuide] = useState(false);

  useEffect(() => {
    let idleTimer;

    const resetIdleTimer = () => {
      setShowInactivityNudge(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setShowInactivityNudge(true);
        setShowOrientationGuide(true);
      }, 5000);
    };

    // Initialize timer
    resetIdleTimer();

    // Event listeners to detect activity and reset timer
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach(evt => {
      window.addEventListener(evt, resetIdleTimer);
    });

    return () => {
      clearTimeout(idleTimer);
      activityEvents.forEach(evt => {
        window.removeEventListener(evt, resetIdleTimer);
      });
    };
  }, []);

  // Sync url routes perfectly to pane states (Enables browser back/forward and smooth morphing)
  useEffect(() => {
    if (location.pathname === '/login') {
      setRightPaneView('employee-login');
    } else if (location.pathname === '/A_Login') {
      setRightPaneView('admin-login');
    } else {
      setRightPaneView('bulletin');
    }
  }, [location.pathname]);

  // IntersectionObserver scroll trigger effect
  useEffect(() => {
    const currentPayroll = payrollRef.current;
    const currentGst = gstRef.current;

    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.target === currentPayroll) {
          if (entry.isIntersecting) {
            setIsPayrollVisible(true);
          }
        } else if (entry.target === currentGst) {
          if (entry.isIntersecting) {
            setIsGstVisible(true);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    if (currentPayroll) observer.observe(currentPayroll);
    if (currentGst) observer.observe(currentGst);

    return () => {
      if (currentPayroll) observer.unobserve(currentPayroll);
      if (currentGst) observer.unobserve(currentGst);
    };
  }, []);

  // List of HR Announcements
  const announcements = [
    {
      id: 1,
      title: "Summer Shift Timing Adjustments",
      desc: "To beat the rising heat indices, shift clock-in times will slide 15 minutes earlier starting next Monday. All department heads should verify associate rosters.",
      meta: "HR Operations • 25 May 2026"
    },
    {
      id: 2,
      title: "Updated Leave Allocation Policy",
      desc: "Great news! The management has approved 2 additional Sick Leaves for all full-time associates, effective immediately. Balance sheets have been updated in your profile summaries.",
      meta: "Policy Update • 22 May 2026"
    }
  ];

  // List of upcoming holidays
  const holidays = [
    { date: "Oct 2", name: "Gandhi Jayanti", emerald: false },
    { date: "Dec 25", name: "Christmas", emerald: true }
  ];

  // Ticking time clock interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatClockTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Submit handers
  const handleEmployeeLoginSubmit = (e) => {
    e.preventDefault();
    if (employeeId && employeePassword) {
      alert("Login Successful");
      navigate('/Dashboard');
    } else {
      alert("Please enter Employee ID and Password");
    }
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminEmail && adminPassword) {
      alert("Admin Login Successful");
      navigate('/A_Dashboard');
    } else {
      alert("Please enter Email and Password");
    }
  };

  return (
    <div className="portal-landing">
      
      {/* 1. Hero Split Section (Brand Pane & Cover Visual) */}
      <div className="hero-split-container">
        
        {/* Left Branding & Portal Entry Pane (58% Width) */}
        <section className="brand-pane">
          
          {/* Top: Minimal Brand Logo & Navigation */}
          <div className="brand-logo-section">
            <div className={`brand-logo ${showInactivityNudge ? 'nudge-active' : ''}`} onClick={() => navigate('/Home')}>
              <div className="logo-wrapper">
                <Users size={18} className="logo-icon" />
              </div>
              <span className="brand-name">
                Aarya <span>Associates</span>
              </span>
            </div>

            <div className="header-nav">
              <span className="nav-link" onClick={() => navigate('/Aboutus')}>About Us</span>
              <span className="nav-link" onClick={() => navigate('/Staffholidays')}>Holidays</span>
              <span className="nav-link" onClick={() => navigate('/Aboutus')}>Consulting</span>
            </div>
          </div>

          {/* Center: Editorial Hero Callout */}
          <div className="editorial-hero-content">
            <span className="editorial-tagline">Management & Advisory Group</span>
            <h1 className="editorial-title">
              <span className="base-word">Strategic </span><em>Capital</em>.<br />
              <span className="base-word">Precision </span><em>Workspaces</em>.
            </h1>
            <p className="editorial-desc">
              Aarya Associates drives efficiency and compliance for high-performance consultancies. Log in to launch your automated shift rosters, check leave ledgers, and access tech committees.
            </p>

            {/* Premium Workspace Entrance Cards */}
            <div className="gateway-cards-grid">
              <div 
                className={`gateway-action-card ${rightPaneView === 'employee-login' ? 'active-gateway' : ''} ${showInactivityNudge ? 'nudge-active' : ''}`} 
                onClick={() => navigate('/login')}
              >
                <div>
                  <h3>Employee Workspace</h3>
                  <p>Submit leave sheets, clock shift hours, and view team rosters.</p>
                </div>
                <span className="gateway-card-arrow">
                  Launch Workspace <ArrowRight size={13} />
                </span>
              </div>

              <div 
                className={`gateway-action-card ${rightPaneView === 'admin-login' ? 'active-gateway' : ''} ${showInactivityNudge ? 'nudge-active' : ''}`} 
                onClick={() => navigate('/A_Login')}
              >
                <div>
                  <h3> Admin Console</h3>
                  <p>Track department statistics, modify schedules, and manage rosters.</p>
                </div>
                <span className="gateway-card-arrow">
                  Enter Console <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>

          {/* Spacer to align elegantly */}
          <div style={{ minHeight: '30px' }}></div>

        </section>

        {/* Right Full-Bleed Corporate Visual Pane (42% Width) */}
        <section 
          className="visual-pane" 
          style={{ backgroundImage: `url(${cornerPic})` }}
        >
          {/* View 1: Glassmorphic Intranet Bulletin Card */}
          {rightPaneView === 'bulletin' && (
            <div className="glass-bulletin-card card-sweep-active">
              
              <div className="bulletin-header-row">
                <span className="bulletin-label">Associate bulletins</span>
                <div className="live-time-ticker">
                  <Clock size={12} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block' }} />
                  {formatClockTime(currentDateTime)}
                </div>
              </div>

              {/* Executive Consulting & Academic Spotlight */}
              <div className="spotlight-widget">
                <div className="spotlight-title">
                  <Award size={13} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline-block' }} />
                  Advisory Case Spotlight
                </div>
                <p className="spotlight-desc">
                  Guiding computer applications research circles and administrative scheduling rosters at Aarya Associates.
                </p>
              </div>

              {/* Notices Bulletins */}
              <div className="bulletin-news-list">
                {announcements.map((item) => (
                  <div 
                    key={item.id} 
                    className="news-item"
                    onClick={() => setSelectedNotice(item)}
                  >
                    <div className="news-icon-wrapper">
                      <Sparkles size={15} />
                    </div>
                    <div className="news-details">
                      <h4>{item.title}</h4>
                      <p>{item.desc.substring(0, 70)}...</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming Holidays */}
              <div className="holiday-list">
                {holidays.map((h, i) => (
                  <div key={i} className={`holiday-item ${h.emerald ? 'emerald' : ''}`}>
                    <span className="holiday-date">{h.date}</span>
                    <span className="holiday-name">{h.name}</span>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* View 2: Employee Workspace Login Panel */}
          {rightPaneView === 'employee-login' && (
            <div className="login-glass-card card-sweep-active">
              <button 
                className="back-bulletin-btn" 
                onClick={() => navigate('/Home')}
                aria-label="Back to bulletins"
              >
                <X size={15} />
              </button>

              <div className="login-header-section">
                <h2>Staff Workspace</h2>
                <p>Access shift sheets, rosters, and leave ledgers.</p>
              </div>

              <form onSubmit={handleEmployeeLoginSubmit} className="login-form">
                <div className="input-group">
                  <label htmlFor="employeeId">Employee ID</label>
                  <input 
                    id="employeeId"
                    type="text" 
                    placeholder="Enter Employee ID"
                    className="login-input"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="employeePassword">Security Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      id="employeePassword"
                      type={showEmployeePassword ? "text" : "password"} 
                      placeholder="Enter Password"
                      className="login-input"
                      value={employeePassword}
                      onChange={(e) => setEmployeePassword(e.target.value)}
                    />
                    <span 
                      className="password-toggle-btn"
                      onClick={() => setShowEmployeePassword(!showEmployeePassword)}
                    >
                      {showEmployeePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </span>
                  </div>
                </div>

                <div className="login-remember-row">
                  <label className="custom-checkbox-container">
                    <input type="checkbox" defaultChecked />
                    <span className="checkbox-checkmark"></span>
                    Remember me
                  </label>
                  <span className="forgot-pass-trigger" onClick={() => navigate('/Forgotpass')}>
                    Forgot Password?
                  </span>
                </div>

                <button type="submit" className="login-action-btn">
                  Launch Workspace <ArrowRight size={14} />
                </button>
              </form>

              <div className="login-footer-links">
                <span className="login-link-item" onClick={() => navigate('/Signup')}>
                  New Associate? <span>Request Workspace Account</span>
                </span>
              </div>
            </div>
          )}

          {/* View 3: Admin Command Room Login Panel */}
          {rightPaneView === 'admin-login' && (
            <div className="login-glass-card card-sweep-active">
              <button 
                className="back-bulletin-btn" 
                onClick={() => navigate('/Home')}
                aria-label="Back to bulletins"
              >
                <X size={15} />
              </button>

              <div className="login-header-section">
                <h2>Command Console</h2>
                <p>Manage rosters, department stats, and compliance logs.</p>
              </div>

              <form onSubmit={handleAdminLoginSubmit} className="login-form">
                <div className="input-group">
                  <label htmlFor="adminEmail">Corporate Email</label>
                  <input 
                    id="adminEmail"
                    type="email" 
                    placeholder="Enter Corporate Email"
                    className="login-input"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="adminPassword">Console Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      id="adminPassword"
                      type={showAdminPassword ? "text" : "password"} 
                      placeholder="Enter Password"
                      className="login-input"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                    <span 
                      className="password-toggle-btn"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                    >
                      {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </span>
                  </div>
                </div>

                <div className="login-remember-row">
                  <label className="custom-checkbox-container">
                    <input type="checkbox" defaultChecked />
                    <span className="checkbox-checkmark"></span>
                    Remember Console
                  </label>
                  <span className="forgot-pass-trigger" onClick={() => navigate('/A_Forgotpass')}>
                    Reset Password?
                  </span>
                </div>

                <button type="submit" className="login-action-btn">
                  Enter Console <ArrowRight size={14} />
                </button>
              </form>

              <div className="login-footer-links">
                <span className="login-link-item" onClick={() => navigate('/A_Signup')}>
                  New Administrator? <span>Register Account</span>
                </span>
              </div>
            </div>
          )}

        </section>

      </div>

      {/* 2. Below-The-Fold: Payroll & GST Accounting Advisory Hub */}
      <section className="advisory-services-section">
        
        <div className="advisory-title-wrapper">
          <span className="advisory-tagline">Corporate Services</span>
          <h2 className="advisory-main-title">
            <span className="base-word">Financial Operations & </span><em>Advisory Suite</em>
          </h2>
          <p className="advisory-subtitle">
            Aarya Associates delivers bespoke regulatory advisory, TDS management, and ledger accounting services designed for modern consulting environments.
          </p>
        </div>

        {/* 2-Column Advisory Cards Grid */}
        <div className="advisory-grid">
          
          {/* Card 1: Payroll Operations */}
          <div 
            ref={payrollRef} 
            className={`advisory-card ${isPayrollVisible ? 'animate-scroll-payroll' : ''}`}
          >
            <div>
              <div className="advisory-card-header">
                <div className="advisory-icon-wrapper">
                  <DollarSign size={22} />
                </div>
                <h3>Payroll & Benefits Management</h3>
              </div>
              <p className="advisory-card-desc">
                Automate complex compensation architectures, monthly TDS audits, tax declarations, and employee benefit allocations with full regulatory alignment.
              </p>
              
              <ul className="advisory-features-list">
                <li>
                  <CheckSquare size={16} className="advisory-check-icon" />
                  <span>Custom Salary Structure Designing</span>
                </li>
                <li>
                  <CheckSquare size={16} className="advisory-check-icon" />
                  <span>Automated TDS & Form 16 Compliance</span>
                </li>
                <li>
                  <CheckSquare size={16} className="advisory-check-icon" />
                  <span>Roster & Shift Overtime Processing</span>
                </li>
              </ul>
            </div>

            <div className="advisory-card-action" onClick={() => navigate('/Aboutus')}>
              Explore Payroll Advisory <ArrowRight size={14} />
            </div>
          </div>

          {/* Card 2: GST Accounting Advisory */}
          <div 
            ref={gstRef} 
            className={`advisory-card teal-top ${isGstVisible ? 'animate-scroll-gst' : ''}`}
          >
            <div>
              <div className="advisory-card-header">
                <div className="advisory-icon-wrapper">
                  <Receipt size={22} />
                </div>
                <h3>GST Consulting & Tax Ledger</h3>
              </div>
              <p className="advisory-card-desc">
                Streamline GST filings, annual reconciliations, business ledger books, balance sheets, and tax compliance auditing to secure absolute financial transparency.
              </p>
              
              <ul className="advisory-features-list">
                <li>
                  <CheckSquare size={16} className="advisory-check-icon" />
                  <span>Seamless GST Returns Filing</span>
                </li>
                <li>
                  <CheckSquare size={16} className="advisory-check-icon" />
                  <span>Active Purchase & Sales Reconciliation</span>
                </li>
                <li>
                  <CheckSquare size={16} className="advisory-check-icon" />
                  <span>Technical Audit & Ledger Accuracy</span>
                </li>
              </ul>
            </div>

            <div className="advisory-card-action" onClick={() => navigate('/Aboutus')}>
              Explore Accounting Advisory <ArrowRight size={14} />
            </div>
          </div>

        </div>

        {/* 3. Detailed Corporate Footer (At Bottom of Scroll) */}
        <footer className="editorial-footer">
          <p className="copyright-text">
            &copy; 2026 Aarya Associates. All rights reserved. Consulting & Advisory Solutions.
          </p>
          <div className="footer-nav">
            <span onClick={() => navigate('/Aboutus')}>Firm Guidelines</span>
            <span onClick={() => navigate('/Staffholidays')}>Holidays List</span>
          </div>
        </footer>

      </section>

      {/* Detailed Bulletin Notice Modal */}
      {selectedNotice && (
        <div className="modal-overlay" onClick={() => setSelectedNotice(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-banner">
              <h3>{selectedNotice.title}</h3>
              <p>Corporate Memorandum • Aarya Associates HR</p>
              <button 
                className="modal-close-btn" 
                onClick={() => setSelectedNotice(null)}
                aria-label="Close Notice"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-notice-content">
                {selectedNotice.desc}
              </div>
              <span className="notice-meta-tag">
                {selectedNotice.meta}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Workspace Orientation Toast Guide */}
      {showOrientationGuide && rightPaneView === 'bulletin' && (
        <div className="orientation-nudge-bubble">
          <div className="nudge-avatar-wrapper">
            <Sparkles size={16} className="nudge-sparkle-icon" />
          </div>
          <div className="nudge-bubble-content">
            <h5>Associate Orientation</h5>
            <p>Select <strong>Employee Workspace</strong> or <strong>Admin Console</strong> above to log in.</p>
          </div>
          <button 
            className="nudge-dismiss-btn" 
            onClick={() => setShowOrientationGuide(false)}
            aria-label="Dismiss guide"
          >
            <X size={12} />
          </button>
        </div>
      )}

    </div>
  );
};

export default HrPortal;