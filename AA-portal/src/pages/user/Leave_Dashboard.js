// Leave_Dashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/LeaveDashboard.css";

/* ── Leave types ── */
const LEAVES = [
  { id:"casual", ri:"ri-blue",   tla:"tla-casual", ltb:"ltb-casual", icon:"🏖️", label:"Casual Leave",   available:5, total:5,  booked:0, fillRgba:"rgba(59,130,246,0.08)"  },
  { id:"earned", ri:"ri-teal",   tla:"tla-earned", ltb:"ltb-earned", icon:"✅", label:"Earned Leave",   available:5, total:5,  booked:0, fillRgba:"rgba(13,148,136,0.08)"  },
  { id:"lwp",    ri:"ri-rose",   tla:"tla-lwp",    ltb:"ltb-lwp",    icon:"🚫", label:"Leave W/O Pay",  available:0, total:0,  booked:0, fillRgba:"rgba(244,63,94,0.07)"   },
  { id:"sabbat", ri:"ri-amber",  tla:"tla-sabbat", ltb:"ltb-sabbat", icon:"📚", label:"Sabbatical",     available:0, total:0,  booked:0, fillRgba:"rgba(217,119,6,0.07)"   },
  { id:"sick",   ri:"ri-violet", tla:"tla-sick",   ltb:"ltb-sick",   icon:"🏥", label:"Sick Leave",     available:2, total:5,  booked:3, fillRgba:"rgba(124,58,237,0.08)"  },
];

/* ── Holiday data by month (YYYY-MM) ── */
const HOLIDAYS = {
  "2025-01": [
    { date:"01", day:"Wed", name:"New Year's Day",    type:"national" },
    { date:"14", day:"Tue", name:"Makar Sankranti",   type:"festival" },
    { date:"26", day:"Sun", name:"Republic Day",      type:"national" },
  ],
  "2025-02": [
    { date:"26", day:"Wed", name:"Maha Shivaratri",   type:"festival" },
  ],
  "2025-03": [
    { date:"14", day:"Fri", name:"Holi",              type:"festival" },
    { date:"31", day:"Mon", name:"Eid ul-Fitr",       type:"festival" },
  ],
  "2025-04": [
    { date:"14", day:"Mon", name:"Ambedkar Jayanti",  type:"national" },
    { date:"18", day:"Fri", name:"Good Friday",       type:"festival" },
  ],
  "2025-05": [
    { date:"01", day:"Thu", name:"Labour Day",        type:"national" },
    { date:"12", day:"Mon", name:"Buddha Purnima",    type:"festival" },
  ],
  "2025-06": [
    { date:"07", day:"Sat", name:"Eid ul-Adha",       type:"festival" },
  ],
  "2025-07": [
    { date:"05", day:"Sat", name:"Muharram",          type:"festival" },
  ],
  "2025-08": [
    { date:"15", day:"Fri", name:"Independence Day",  type:"national" },
    { date:"16", day:"Sat", name:"Janmashtami",       type:"festival" },
  ],
  "2025-09": [
    { date:"05", day:"Fri", name:"Milad-un-Nabi",     type:"festival" },
  ],
  "2025-10": [
    { date:"02", day:"Thu", name:"Gandhi Jayanti",    type:"national" },
    { date:"02", day:"Thu", name:"Dussehra",          type:"festival" },
  ],
  "2025-11": [
    { date:"01", day:"Sat", name:"Rajyotsava Day",    type:"state" },
    { date:"05", day:"Wed", name:"Diwali",            type:"festival" },
    { date:"15", day:"Sat", name:"Guru Nanak Jayanti",type:"festival" },
  ],
  "2025-12": [
    { date:"25", day:"Thu", name:"Christmas Day",     type:"national" },
  ],
};

const TYPE_LABEL = { national:"National", festival:"Festival", state:"State" };

/* History data */
const HISTORY = [
  { empId:"P101", name:"Punith A A", leaveType:"Sick Leave",
    ltb:"ltb-sick", tla:"tla-sick", type:"Paid",
    period:"06 Aug 2025 — 08 Aug 2025", daysTaken:"3 Day(s)", requestDate:"11 Aug 2025" },
];

/* SVG circumference for r=33: 2π×33 ≈ 207 */
const CIRC = 207;

/* ── Horizontal Ring Item ── */
const RingItem = ({ leaf }) => {
  const pct     = leaf.total > 0 ? leaf.available / leaf.total : 0;
  const dashEnd = CIRC - pct * CIRC;
  return (
    <div className={`lv-ring-item ${leaf.ri}`}>
      <div className="lv-ring-svg-wrap">
        <svg className="lv-ring-svg" viewBox="0 0 80 80">
          {/* Light transparent inner fill */}
          <circle cx="40" cy="40" r="33" fill={leaf.fillRgba} stroke="none" />
          <circle className="lv-ring-track" cx="40" cy="40" r="33" />
          <circle
            className="lv-ring-fill"
            cx="40" cy="40" r="33"
            style={{ "--dash-end": dashEnd }}
          />
        </svg>
        <div className="lv-ring-center">
          <span className="lv-ring-center-num">{leaf.available}</span>
          <span className="lv-ring-center-sub">avail</span>
        </div>
        <div className="lv-ring-icon">{leaf.icon}</div>
      </div>
      <div className="lv-ring-label">{leaf.label}</div>
      <div className="lv-ring-meta">of {leaf.total} days</div>
      <div className="lv-ring-booked">
        {leaf.booked > 0 ? `${leaf.booked} taken` : "None taken"}
      </div>
    </div>
  );
};

/* ── Timeline history card ── */
const TlCard = ({ rec }) => {
  const initials = rec.name.split(" ").map(n => n[0]).join("").slice(0, 2);
  return (
    <div className="lv-tl-card">
      <div className={`lv-tl-accent ${rec.tla}`} />
      <div className="lv-tl-av">{initials}</div>
      <div className="lv-tl-body">
        <div className="lv-tl-row1">
          <span className="lv-tl-name">{rec.name}</span>
          <span className="lv-tl-id">{rec.empId}</span>
          <span className={`lv-tl-ltype ${rec.ltb}`}>{rec.leaveType}</span>
          <span className="lv-tl-paytype">{rec.type}</span>
        </div>
        <div className="lv-tl-row2">
          <span>📅 {rec.period}</span>
          <span className="lv-tl-days">⏱ {rec.daysTaken}</span>
        </div>
      </div>
      <div className="lv-tl-date">Requested<br />{rec.requestDate}</div>
    </div>
  );
};

/* ── Main ── */
const LeaveDashboard = () => {
  const [activeTab, setActiveTab]     = useState("summary");
  const [searchMonth, setSearchMonth] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2025-11");
  const navigate = useNavigate();


  const filtered = searchMonth
    ? HISTORY.filter(r => r.requestDate.toLowerCase().includes(searchMonth))
    : HISTORY;

  const monthHolidays = HOLIDAYS[selectedMonth] || [];

  const monthLabel = selectedMonth
    ? new Date(selectedMonth + "-01").toLocaleString("default", { month: "long", year: "numeric" })
    : "Select a month";

  return (
    <div className="leave-container">



      {/* ══ LEAVE BALANCE PANEL — Horizontal rings ══ */}
      <div className="lv-balance-panel">
        <div className="lv-balance-panel-head">
          <div className="lv-balance-panel-title">
            <div className="lv-balance-panel-icon">⚖️</div>
            <div>
              <div className="lv-balance-panel-label">Leave Balance Overview</div>
              <div className="lv-balance-panel-sub">Circle fill shows days taken · outer ring shows remaining</div>
            </div>
          </div>
          <div className="lv-balance-year">📅 &nbsp;Jan — Dec 2025</div>
        </div>
        <div className="lv-ring-row">
          {LEAVES.map(l => <RingItem key={l.id} leaf={l} />)}
        </div>
      </div>

      {/* ══ TAB BAR ══ */}
      <div className="lv-tab-bar">
        <button className={`lv-tab ${activeTab === "summary" ? "active" : ""}`} onClick={() => setActiveTab("summary")}>
          📅 Leaves &amp; Holidays
        </button>
        <button className={`lv-tab ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
          🕐 Leave History
        </button>
      </div>

      {/* ══ SUMMARY TAB — Upcoming + Holidays ══ */}
      {activeTab === "summary" && (
        <div className="lv-upcoming-panel">
          {/* Panel header */}
          <div className="lv-panel-head">
            <div className="lv-panel-left">
              <div className="lv-panel-icon">🗓️</div>
              <div>
                <div className="lv-panel-title">Upcoming Leaves &amp; Holidays</div>
                <div className="lv-panel-sub">Select a month to view holidays</div>
              </div>
            </div>
            <div className="lv-panel-controls">
              {/* Month picker */}
              <input
                type="month"
                className="lv-month-picker"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                title="Select month to view holidays"
              />
              {/* Apply Leave CTA */}
              <button className="lv-apply-sm" onClick={() => navigate("/Dashboard/Leave_request")}>
                ＋ Apply Leave
              </button>
            </div>
          </div>

          {/* Holiday grid */}
          <div className="lv-holiday-body">
            {/* Month label */}
            <div className="lv-holiday-month-label">
              <span className="lv-hml-badge">📌</span>
              Holidays in <strong>{monthLabel}</strong>
              <span className="lv-hml-count">{monthHolidays.length} holiday{monthHolidays.length !== 1 ? "s" : ""}</span>
            </div>

            {monthHolidays.length > 0 ? (
              <div className="lv-holiday-grid">
                {monthHolidays.map((h, i) => (
                  <div key={i} className={`lv-hol-card hol-${h.type}`}>
                    {/* Date block */}
                    <div className="lv-hol-date-block">
                      <span className="lv-hol-day-num">{h.date}</span>
                      <span className="lv-hol-day-name">{h.day}</span>
                    </div>
                    {/* Info */}
                    <div className="lv-hol-info">
                      <div className="lv-hol-name">{h.name}</div>
                      <div className={`lv-hol-type htype-${h.type}`}>{TYPE_LABEL[h.type]}</div>
                    </div>
                    {/* Icon */}
                    <div className="lv-hol-icon">
                      {h.type === "national" ? "🇮🇳" : h.type === "festival" ? "🎉" : "🏛️"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="lv-holiday-empty">
                <div className="lv-he-icon">🌟</div>
                <p className="lv-he-text">No holidays in {monthLabel}</p>
                <p className="lv-he-sub">Select a different month to view holidays</p>
              </div>
            )}

            {/* Upcoming personal leaves */}
            <div className="lv-my-leaves-head">
              <span>🗂️</span> My Scheduled Leaves
            </div>
            <div className="lv-my-leaves-empty">
              <span>✈️</span> No personal leaves scheduled.
              <button className="lv-apply-inline" onClick={() => navigate("/Dashboard/Leave_request")}>
                ＋ Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ HISTORY TAB ══ */}
      {activeTab === "history" && (
        <>
          <div className="lv-timeline-toolbar">
            <input type="month" className="lv-month-input" value={searchMonth}
              onChange={e => setSearchMonth(e.target.value)} title="Filter by month" />
            <button className="lv-search-btn">🔍 Search</button>
            <button className="lv-new-btn" onClick={() => navigate("/Dashboard/Leave_request")}>
              ＋ New Request
            </button>
          </div>
          <div className="lv-timeline-panel">
            <div className="lv-timeline-head">
              <div className="lv-timeline-icon">🕐</div>
              <div>
                <div className="lv-timeline-title">Leave History</div>
                <div className="lv-timeline-sub">Your past and current leave applications</div>
              </div>
            </div>
            <div className="lv-timeline-body">
              {filtered.length > 0 ? (
                <div className="lv-timeline-list">
                  {filtered.map((r, i) => <TlCard key={i} rec={r} />)}
                </div>
              ) : (
                <div className="lv-timeline-empty">
                  <div style={{ fontSize: 36 }}>📭</div>
                  <p>No leave records found for the selected period</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaveDashboard;
