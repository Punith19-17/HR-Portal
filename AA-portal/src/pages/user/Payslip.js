// Payslip.js – Premium redesigned Payslip Module
import React, { useState } from 'react';
import '../../styles/Payslip.css';

/* ── Data ── */
const PAYSLIPS = [
  { month:'May 2026',      mo:'May', day:'26', basic:45000, hra:18000, special:12000, pf:5400, tax:2500, net:67100 },
  { month:'April 2026',    mo:'Apr', day:'26', basic:45000, hra:18000, special:12000, pf:5400, tax:2500, net:67100 },
  { month:'March 2026',    mo:'Mar', day:'26', basic:45000, hra:18000, special:10500, pf:5400, tax:2300, net:65800 },
  { month:'February 2026', mo:'Feb', day:'26', basic:45000, hra:18000, special:10500, pf:5400, tax:2300, net:65800 },
  { month:'January 2026',  mo:'Jan', day:'26', basic:45000, hra:18000, special:11000, pf:5400, tax:2400, net:66200 },
];

const fmt = n => `₹${n.toLocaleString('en-IN')}`;

const handleDownload = month => alert(`Downloading payslip for ${month}.pdf`);

/* ── Earnings config ── */
const earnings = slip => [
  { label:'Basic Salary',    icon:'🏦', ic:'ic-basic',   val:slip.basic,   pct:60,  bar:'bf-green',  cls:'earn-val' },
  { label:'House Rent (HRA)',icon:'🏠', ic:'ic-hra',     val:slip.hra,     pct:24,  bar:'bf-amber',  cls:'earn-val' },
  { label:'Special Allowance',icon:'⭐',ic:'ic-special', val:slip.special, pct:16,  bar:'bf-blue',   cls:'earn-val' },
];
const deductions = slip => [
  { label:'Provident Fund (PF)', icon:'🔒', ic:'ic-pf',  val:slip.pf,  pct:68, bar:'bf-red',    cls:'ded-val' },
  { label:'Professional Tax',    icon:'📄', ic:'ic-tax', val:slip.tax, pct:32, bar:'bf-violet',  cls:'ded-val' },
];

/* ── Main ── */
const Payslip = () => {
  const [selected, setSelected] = useState(PAYSLIPS[0].month);
  const slip = PAYSLIPS.find(p => p.month === selected) || PAYSLIPS[0];

  const gross = slip.basic + slip.hra + slip.special;
  const totalDed = slip.pf + slip.tax;

  return (
    <div className="ps-wrap">

      {/* ══ PAGE HEADER ══ */}
      <h1 className="ps-header-title">My Payslips</h1>


      {/* ══ PAY OVERVIEW CARD — glassmorphism ══ */}
      <div className="ps-overview-card">

        {/* A: Employee Identity */}
        <div className="ps-ov-emp">
          <div className="ps-ov-avatar">PA</div>
          <div className="ps-ov-emp-info">
            <div className="ps-ov-emp-name">Punith A A</div>
            <div className="ps-ov-emp-role">
              Consulting Lead &nbsp;<span>EMP-P101</span>
            </div>
            <div className="ps-ov-emp-chips">
              <span className="ps-ov-chip chip-green">✅ Active</span>
              <span className="ps-ov-chip chip-blue">🏢 Full Time</span>
            </div>
          </div>
        </div>

        <div className="ps-ov-divider" />

        {/* B: Salary Trend mini chart */}
        <div className="ps-ov-trend">
          <div className="ps-ov-trend-title">Net Pay Trend — Last 5 Months</div>
          <div className="ps-trend-bars">
            {PAYSLIPS.slice().reverse().map((p, i, arr) => {
              const maxNet = Math.max(...arr.map(x => x.net));
              const h = Math.round((p.net / maxNet) * 100);
              const isActive = p.month === selected;
              return (
                <div key={p.month} className="ps-trend-bar-wrap" onClick={() => setSelected(p.month)}>
                  <div
                    className={`ps-trend-bar-col ${isActive ? 'active' : ''}`}
                    style={{ height: `${h}%`, cursor: 'pointer' }}
                    title={`${p.month}: ₹${p.net.toLocaleString('en-IN')}`}
                  />
                  <span className={`ps-trend-bar-lbl ${isActive ? 'active-lbl' : ''}`}>{p.mo}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ps-ov-divider" />

        {/* C: CTC + Quick Actions */}
        <div className="ps-ov-actions">
          <div className="ps-ov-ctc-row">
            <div className="ps-ov-ctc-item">
              <div className="ps-ov-ctc-label">Annual CTC</div>
              <div className="ps-ov-ctc-val">₹9.0L <small>/yr</small></div>
            </div>
            <div className="ps-ov-ctc-sep" />
            <div className="ps-ov-ctc-item">
              <div className="ps-ov-ctc-label">Monthly Net</div>
              <div className="ps-ov-ctc-val">{fmt(slip.net)}</div>
            </div>
          </div>
          <div className="ps-ov-btns">
            <button className="ps-ov-btn btn-primary" onClick={() => handleDownload(slip.month)}>
              ⬇ Download Slip
            </button>
            <button className="ps-ov-btn btn-ghost">
              📧 Email Copy
            </button>
          </div>
        </div>
      </div>



      {/* ══ MAIN GRID ══ */}
      <div className="ps-main-grid">

        {/* ── LEFT: Slip list ── */}
        <div className="ps-slip-panel">
          <div className="ps-panel-head">
            <div className="ps-panel-head-icon">📋</div>
            <div>
              <div className="ps-panel-head-title">Monthly Ledger Sheets</div>
              <div className="ps-panel-head-sub">Click a month to view the full breakdown</div>
            </div>
          </div>

          <div className="ps-slip-list">
            {PAYSLIPS.map(p => {
              const g = p.basic + p.hra + p.special;
              const d = p.pf + p.tax;
              const isActive = p.month === selected;
              return (
                <div
                  key={p.month}
                  className={`ps-slip-row ${isActive ? 'active' : ''}`}
                  onClick={() => setSelected(p.month)}
                >
                  {/* Month badge */}
                  <div className="ps-slip-month-badge">
                    <span className="ps-sbm-num">{p.day}</span>
                    <span className="ps-sbm-mon">{p.mo}</span>
                  </div>

                  {/* Info */}
                  <div className="ps-slip-info">
                    <div className="ps-slip-name">{p.month}</div>
                    <div className="ps-slip-meta">
                      <span className="ps-slip-gross">Gross: {fmt(g)}</span>
                      <span className="ps-slip-net">Net: {fmt(p.net)}</span>
                      <span className="ps-slip-ded">−{fmt(d)}</span>
                    </div>
                  </div>

                  {/* Download */}
                  <button
                    className="ps-dl-btn"
                    onClick={e => { e.stopPropagation(); handleDownload(p.month); }}
                  >
                    ⬇ PDF
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Month Selector + Summary Card ── */}
        <div className="ps-detail-panel">

          {/* Month selector header */}
          <div className="ps-detail-head">
            <div className="ps-detail-head-icon">📅</div>
            <div>
              <div className="ps-detail-head-title">Select Pay Period</div>
              <div className="ps-detail-head-sub">FY 2025 – 2026</div>
            </div>
          </div>

          {/* Month pill grid */}
          <div className="ps-month-grid">
            {PAYSLIPS.map(p => (
              <button
                key={p.month}
                className={`ps-month-pill ${p.month === selected ? 'active' : ''}`}
                onClick={() => setSelected(p.month)}
              >
                <span className="ps-mp-mo">{p.mo}</span>
                <span className="ps-mp-yr">{p.day === '26' ? p.month.split(' ')[1] : ''}</span>
              </button>
            ))}
          </div>

          {/* Summary card for selected month */}
          <div className="ps-sum-card">
            {/* Period */}
            <div className="ps-sum-period">
              <span className="ps-sum-cal">🗓️</span>
              <div>
                <div className="ps-sum-period-label">Pay Period</div>
                <div className="ps-sum-period-val">{slip.month}</div>
              </div>
              <button className="ps-sum-dl" onClick={() => handleDownload(slip.month)}>⬇ PDF</button>
            </div>

            {/* Net pay hero */}
            <div className="ps-sum-net">
              <div className="ps-sum-net-label">Net Take-Home</div>
              <div className="ps-sum-net-val">₹{slip.net.toLocaleString('en-IN')}</div>
            </div>

            {/* Earnings / Deductions chips row */}
            <div className="ps-sum-chips">
              <div className="ps-sum-chip earn-chip">
                <div className="ps-scc-icon">📈</div>
                <div>
                  <div className="ps-scc-label">Gross Earnings</div>
                  <div className="ps-scc-val earn-c">{fmt(gross)}</div>
                </div>
              </div>
              <div className="ps-sum-chip ded-chip">
                <div className="ps-scc-icon">📉</div>
                <div>
                  <div className="ps-scc-label">Total Deductions</div>
                  <div className="ps-scc-val ded-c">{fmt(totalDed)}</div>
                </div>
              </div>
            </div>

            {/* Clean two-column breakdown table */}
            <div className="ps-sum-table">
              <div className="ps-sum-col">
                <div className="ps-sum-col-head earn-head">💚 Earnings</div>
                {earnings(slip).map(e => (
                  <div key={e.label} className="ps-sum-row">
                    <span className="ps-sr-icon">{e.icon}</span>
                    <span className="ps-sr-label">{e.label}</span>
                    <span className="ps-sr-val earn-c">{fmt(e.val)}</span>
                  </div>
                ))}
              </div>
              <div className="ps-sum-divider" />
              <div className="ps-sum-col">
                <div className="ps-sum-col-head ded-head">🔻 Deductions</div>
                {deductions(slip).map(d => (
                  <div key={d.label} className="ps-sum-row">
                    <span className="ps-sr-icon">{d.icon}</span>
                    <span className="ps-sr-label">{d.label}</span>
                    <span className="ps-sr-val ded-c">{fmt(d.val)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="ps-disclaimer">🔒 Computer-generated payslip. No physical signature required.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payslip;
