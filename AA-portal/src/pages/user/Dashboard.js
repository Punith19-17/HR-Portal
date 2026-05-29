import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../../styles/Dashboard.css";
import SideHeader from "../../components/layout/Side-Heddar";
import { 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  FileText
} from "lucide-react";

const MySpace = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const location = useLocation();

  // Determine current active page based on URL pathname
  let currentPage = "Dashboard";
  if (location.pathname.includes("/Leave_Dashboard") || location.pathname.includes("/Leave_request") || location.pathname.includes("/Leave_History")) {
    currentPage = "Leave_Dashboard";
  } else if (location.pathname.includes("/Profile")) {
    currentPage = "Profile";
  } else if (location.pathname.includes("/Attendance")) {
    currentPage = "Attendance";
  } else if (location.pathname.includes("/Payslip")) {
    currentPage = "Payslip";
  } else if (location.pathname.includes("/Documents")) {
    currentPage = "Documents";
  }
  
  // Workstation shift clock-in action state
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(10800); // 3 Hours logged by default

  // Shift watch dynamic ticking increment
  useEffect(() => {
    let intervalId;
    if (isCheckedIn) {
      intervalId = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isCheckedIn]);

  // Clock formatter helper
  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return {
      hours: String(hrs).padStart(2, '0'),
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0')
    };
  };

  const formattedTime = formatTimer(timerSeconds);

  return (
    <SideHeader 
      currentPage={currentPage} 
      activeTab={activeTab} 
      onTabClick={setActiveTab}
    >
      {(location.pathname === "/Dashboard" || location.pathname === "/Dashboard/") ? (
        <div className="world-class-dashboard-container">
          
          {/* 1. HERO ANALYTICS WELCOME CARD (Top, Full-Width) */}
          <div className="executive-hero-banner">
            <div className="hero-gradient-overlay" />
            
            <div className="hero-content-frame">
              <div className="hero-meta-badge">
                <Sparkles size={11} className="badge-spark-icon" />
                <span>EXECUTIVE PORTAL VERIFICATION</span>
              </div>
              <h1 className="hero-title">Strategic Insights, Punith A</h1>
              <p className="hero-desc">
                Your consultant terminal is fully synchronized with Aarya Associates. Compliance accuracy ratings, ESI/PF ledgers, and tax advisory modules are operational.
              </p>

              {/* Floating Glass Metrics Capsules */}
              <div className="hero-floating-capsules-row">
                
                <div className={`glass-metric-capsule status-capsule ${isCheckedIn ? "in" : "out"}`}>
                  <span className={`pulsing-bead ${isCheckedIn ? "active" : ""}`} />
                  <div className="capsule-details">
                    <span className="cap-label">SHIFT STATUS</span>
                    <span className="cap-val">{isCheckedIn ? "Clocked In" : "Clocked Out"}</span>
                  </div>
                </div>

                <div className="glass-metric-capsule timer-capsule">
                  <Clock size={14} className="cap-icon-gold" />
                  <div className="capsule-details">
                    <span className="cap-label">SHIFT TIMER</span>
                    <span className="cap-val timer-digits">
                      {formattedTime.hours}:{formattedTime.minutes}:{formattedTime.seconds}
                    </span>
                  </div>
                </div>

                <div className="glass-metric-capsule compliance-capsule">
                  <ShieldCheck size={14} className="cap-icon-gold" />
                  <div className="capsule-details">
                    <span className="cap-label">COMPLIANCE RATIO</span>
                    <span className="cap-val">98.4% Acc Reconciled</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="hero-action-panel">
              <button 
                className={`btn-hero-shift-toggle ${isCheckedIn ? "logging" : ""}`}
                onClick={() => setIsCheckedIn(!isCheckedIn)}
              >
                {isCheckedIn ? "End Active Shift Logging" : "Begin Corporate Shift Logging"}
              </button>
            </div>
          </div>

          {/* 2. MAIN 2-COLUMN OPERATIONS GRID */}
          <div className="executive-dashboard-grid">
            
            {/* Left Column: Filings ledger center (2/3 width) */}
            <div className="grid-primary-column">
              <div className="premium-glass-card filings-ledger-card">
                <div className="card-header-row">
                  <div>
                    <h3>Aarya Compliance Operations</h3>
                    <p className="card-subtitle">Active service lines and tax audit filings directories</p>
                  </div>
                  <span className="compliance-ratio-chip">
                    <Sparkles size={11} className="chip-spark-icon" />
                    94% Filing Rated
                  </span>
                </div>

                <div className="filings-ledger-list">
                  
                  {/* Row 1: Payroll Processing */}
                  <div className="filing-ledger-row">
                    <div className="row-brand-left">
                      <div className="brand-dot-marker" />
                      <div className="row-text-info">
                        <h4>Payroll Processing & Benefits</h4>
                        <p>Compensation structures, Form 16, and ESI/PF ledger disbursements</p>
                      </div>
                    </div>
                    <div className="row-brand-right">
                      <div className="row-progress-block">
                        <div className="progress-value-row">
                          <span>Reconciliation</span>
                          <strong>94%</strong>
                        </div>
                        <div className="progress-track-bar">
                          <div className="progress-fill" style={{ width: "94%" }} />
                        </div>
                      </div>
                      <span className="status-chip active">Active Ledger</span>
                      <span className="view-audit-link">View Audit <ArrowRight size={10} /></span>
                    </div>
                  </div>

                  {/* Row 2: ESI & PF */}
                  <div className="filing-ledger-row">
                    <div className="row-brand-left">
                      <div className="brand-dot-marker" />
                      <div className="row-text-info">
                        <h4>ESI & PF Registration & Filing</h4>
                        <p>Statutory employee provident ledger book submissions</p>
                      </div>
                    </div>
                    <div className="row-brand-right">
                      <div className="row-progress-block">
                        <div className="progress-value-row">
                          <span>Submissions</span>
                          <strong>100%</strong>
                        </div>
                        <div className="progress-track-bar">
                          <div className="progress-fill" style={{ width: "100%" }} />
                        </div>
                      </div>
                      <span className="status-chip active">Completed</span>
                      <span className="view-audit-link">View Audit <ArrowRight size={10} /></span>
                    </div>
                  </div>

                  {/* Row 3: GST Registration & Filing */}
                  <div className="filing-ledger-row">
                    <div className="row-brand-left">
                      <div className="brand-dot-marker" />
                      <div className="row-text-info">
                        <h4>GST Registration & Filing</h4>
                        <p>Purchase sales accounting ledger books reconciliations</p>
                      </div>
                    </div>
                    <div className="row-brand-right">
                      <div className="row-progress-block">
                        <div className="progress-value-row">
                          <span>Tax Ledgers</span>
                          <strong>80%</strong>
                        </div>
                        <div className="progress-track-bar">
                          <div className="progress-fill" style={{ width: "80%" }} />
                        </div>
                      </div>
                      <span className="status-chip in-progress">In Progress</span>
                      <span className="view-audit-link">View Audit <ArrowRight size={10} /></span>
                    </div>
                  </div>

                  {/* Row 4: TDS Filling */}
                  <div className="filing-ledger-row">
                    <div className="row-brand-left">
                      <div className="brand-dot-marker" />
                      <div className="row-text-info">
                        <h4>TDS Filing Audit Logs</h4>
                        <p>Form 24Q quarterly compliance verification logs</p>
                      </div>
                    </div>
                    <div className="row-brand-right">
                      <div className="row-progress-block">
                        <div className="progress-value-row">
                          <span>Quarterly Reviews</span>
                          <strong>65%</strong>
                        </div>
                        <div className="progress-track-bar">
                          <div className="progress-fill" style={{ width: "65%" }} />
                        </div>
                      </div>
                      <span className="status-chip pending">Under Review</span>
                      <span className="view-audit-link">View Audit <ArrowRight size={10} /></span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column: Memorandums & Online Active List (1/3 width) */}
            <div className="grid-side-column">
              
              {/* Notice Memorandums Card */}
              <div className="premium-glass-card notices-card">
                <div className="card-header-row">
                  <h3>Corporate Memorandums</h3>
                  <span className="side-badge orange">2 Active</span>
                </div>
                
                <div className="bulletin-list">
                  <div className="bulletin-item">
                    <div className="item-icon-wrapper red">
                      <AlertCircle size={14} />
                    </div>
                    <div className="item-details">
                      <h4>Summer Shift Adjustments</h4>
                      <p>Shift clock-in times slide 15 minutes earlier next Monday.</p>
                      <span className="meta">HR Operations • 25 May 2026</span>
                    </div>
                  </div>

                  <div className="bulletin-item">
                    <div className="item-icon-wrapper gold">
                      <ShieldCheck size={14} />
                    </div>
                    <div className="item-details">
                      <h4>Leave Allocation Policy</h4>
                      <p>Management approved 2 additional Sick Leaves immediately.</p>
                      <span className="meta">Policy Update • 22 May 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Online Teammates Card */}
              <div className="premium-glass-card consultants-card">
                <div className="card-header-row">
                  <h3>Active Consultants</h3>
                  <span className="side-badge green">3 Online</span>
                </div>

                <div className="consultants-vertical-list">
                  <div className="consultant-item-row">
                    <div className="c-avatar me">PA</div>
                    <div className="c-info">
                      <span className="name">Punith A <span className="me-chip">Me</span></span>
                      <span className="role">Consultant Lead</span>
                    </div>
                    <span className="status-indicator-dot online" />
                  </div>

                  <div className="consultant-item-row">
                    <div className="c-avatar">SG</div>
                    <div className="c-info">
                      <span className="name">Sneha G</span>
                      <span className="role">Senior GST Consultant</span>
                    </div>
                    <span className="status-indicator-dot online" />
                  </div>

                  <div className="consultant-item-row">
                    <div className="c-avatar">AS</div>
                    <div className="c-info">
                      <span className="name">Aarya S</span>
                      <span className="role">Advisory Director</span>
                    </div>
                    <span className="status-indicator-dot online" />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        <Outlet />
      )}
    </SideHeader>
  );
};

export default MySpace;
