// Documents.js – Reimagined Documents Vault
import React, { useState } from 'react';
import '../../styles/Documents.css';

/* ── Data ── */
const INIT_DOCS = [
  { id: 1, name: 'PAN Card.pdf', type: 'Identification', size: '1.2 MB', date: '25 May 2026', status: 'Verified' },
  { id: 2, name: 'Aadhaar Card.pdf', type: 'Identification', size: '2.4 MB', date: '25 May 2026', status: 'Verified' },
  { id: 3, name: 'Aarya Offer Letter.pdf', type: 'Corporate', size: '4.1 MB', date: '26 May 2026', status: 'Verified' },
  { id: 4, name: 'Degree Certificate.pdf', type: 'Educational', size: '3.5 MB', date: '26 May 2026', status: 'Under Review' },
  { id: 5, name: 'Previous Experience Letter.pdf', type: 'Corporate', size: '1.8 MB', date: '26 May 2026', status: 'Action Required' },
];

const CATEGORIES = [
  { key: 'All', emoji: '📁', label: 'All Files' },
  { key: 'Identification', emoji: '🪪', label: 'Identification' },
  { key: 'Corporate', emoji: '🏢', label: 'Corporate' },
  { key: 'Educational', emoji: '🎓', label: 'Educational' },
];

const TYPE_ICON = { Identification: '🪪', Corporate: '📋', Educational: '🎓' };

const statusInfo = s => {
  if (s === 'Verified') return { cls: 'sv', icon: '✅' };
  if (s === 'Under Review') return { cls: 'sr', icon: '🕐' };
  return { cls: 'sa', icon: '⚠️' };
};

/* ── Doc Row ── */
const DocRow = ({ doc, onView, onDelete }) => {
  const si = statusInfo(doc.status);
  return (
    <div className="dv-doc-row" data-type={doc.type}>
      <div className="dv-doc-icon">{TYPE_ICON[doc.type] || '📄'}</div>
      <div className="dv-doc-info">
        <div className="dv-doc-name">{doc.name}</div>
        <div className="dv-doc-meta">
          <span>{doc.size}</span>
          <span className="dv-doc-meta-sep" />
          <span>{doc.date}</span>
        </div>
      </div>
      <span className="dv-type-chip">{doc.type}</span>
      <div className={`dv-status ${si.cls}`}>{si.icon} {doc.status}</div>
      <div className="dv-row-actions">
        <button className="dv-row-btn view-b" title="Preview" onClick={() => onView(doc.name)}>👁</button>
        <button className="dv-row-btn del-b" title="Remove" onClick={() => onDelete(doc.id)}>🗑</button>
      </div>
    </div>
  );
};

/* ── Main ── */
const Documents = () => {
  const [docs, setDocs] = useState(INIT_DOCS);
  const [active, setActive] = useState('All');
  const [drag, setDrag] = useState(false);

  const filtered = active === 'All' ? docs : docs.filter(d => d.type === active);
  const countFor = k => k === 'All' ? docs.length : docs.filter(d => d.type === k).length;

  /* Upload helpers — uploads to the currently selected category */
  const uploadCategory = active === 'All' ? 'Corporate' : active;

  const upload = (name, bytes) => {
    const size = bytes ? `${(bytes / 1048576).toFixed(1)} MB` : '1.5 MB';
    setDocs(prev => [{
      id: Date.now(), name, type: uploadCategory, size,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Under Review'
    }, ...prev]);
    alert(`"${name}" uploaded to ${uploadCategory}. Pending compliance review.`);
  };

  const onDrag = e => { e.preventDefault(); e.stopPropagation(); setDrag(e.type === 'dragenter' || e.type === 'dragover'); };
  const onDrop = e => { e.preventDefault(); e.stopPropagation(); setDrag(false); if (e.dataTransfer.files?.[0]) upload(e.dataTransfer.files[0].name, e.dataTransfer.files[0].size); };
  const onFile = e => { if (e.target.files?.[0]) upload(e.target.files[0].name, e.target.files[0].size); };

  const onView = name => alert(`Opening preview of "${name}"…`);
  const onDelete = id => { if (window.confirm('Archive this document?')) setDocs(prev => prev.filter(d => d.id !== id)); };

  /* Category-specific upload config */
  const uploadConfig = {
    All: { title: 'Upload Documents', desc: 'Select a category to upload to a specific section', icon: '📤' },
    Identification: { title: 'Upload ID Documents', desc: 'PAN, Aadhaar, Passport, Voter ID', icon: '🪪' },
    Corporate: { title: 'Upload Corporate Docs', desc: 'Offer letters, NDAs, Contracts', icon: '🏢' },
    Educational: { title: 'Upload Certificates', desc: 'Degrees, Diplomas, Transcripts', icon: '🎓' },
  };
  const uc = uploadConfig[active];

  return (
    <div className="dv-wrap">

      {/* ══ PAGE TITLE ══ */}
      <h1 className="dv-page-title">My Documents Vault</h1>

      {/* ══ CATEGORY NAV BAR ══ */}
      <div className="dv-navbar">
        <div className="dv-navbar-label">Filter by Category</div>
        <div className="dv-navbar-tabs">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={`dv-nav-tab ${active === c.key ? 'active' : ''}`}
              onClick={() => setActive(c.key)}
            >
              <span className="dv-nav-emoji">{c.emoji}</span>
              <span className="dv-nav-text">{c.label}</span>
              <span className="dv-nav-count">{countFor(c.key)}</span>
            </button>
          ))}
        </div>

      </div>

      {/* ══ MAIN LAYOUT: File List + Upload Sidebar ══ */}
      <div className="dv-body">

        {/* ── LEFT: File List ── */}
        <div className="dv-filelist">
          <div className="dv-list-head">
            <div className="dv-list-title">
              {active === 'All' ? 'All Documents' : `${active} Files`}
            </div>
            <div className="dv-list-count">
              {filtered.length} file{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="dv-empty">
              <div className="dv-empty-emoji">📭</div>
              <div className="dv-empty-txt">No documents in this category.</div>
            </div>
          ) : (
            filtered.map(doc => (
              <DocRow key={doc.id} doc={doc} onView={onView} onDelete={onDelete} />
            ))
          )}
        </div>

        {/* ── RIGHT: Upload Sidebar ── */}
        <div
          className={`dv-upload-sidebar ${drag ? 'drag-on' : ''}`}
          onDragEnter={onDrag}
          onDragOver={onDrag}
          onDragLeave={onDrag}
          onDrop={onDrop}
        >
          {/* Header */}
          <div className="dv-us-header">
            <div className="dv-us-icon">{uc.icon}</div>
            <div className="dv-us-title">{uc.title}</div>
            <div className="dv-us-desc">{uc.desc}</div>
          </div>

          {/* Drop zone */}
          <div className="dv-us-dropzone">
            <div className="dv-us-drop-icon">📂</div>
            <div className="dv-us-drop-text">Drag & drop files here</div>
            <div className="dv-us-drop-or">or</div>
            <label className="dv-us-browse-btn">
              Browse Files
              <input type="file" onChange={onFile} style={{ display: 'none' }} />
            </label>
          </div>

          {/* File type tiles */}
          <div className="dv-us-formats">
            <div className="dv-us-formats-label">Accepted Formats</div>
            <div className="dv-us-tile-grid">
              {[
                { cls: 'tt-pdf', icon: '📄', name: 'PDF', accept: '.pdf' },
                { cls: 'tt-img', icon: '🖼️', name: 'Image', accept: 'image/*' },
                { cls: 'tt-doc', icon: '📝', name: 'Doc', accept: '.doc,.docx,.txt' },
                { cls: 'tt-any', icon: '📁', name: 'Any', accept: undefined },
              ].map(t => (
                <label key={t.name} className={`dv-us-tile ${t.cls}`}>
                  <span className="dv-ust-icon">{t.icon}</span>
                  <span className="dv-ust-name">{t.name}</span>
                  <input type="file" accept={t.accept} onChange={onFile} style={{ display: 'none' }} />
                </label>
              ))}
            </div>
          </div>

          {/* Upload target indicator */}
          {active !== 'All' && (
            <div className="dv-us-target">
              <span className="dv-us-target-dot" />
              Uploading to <strong>{active}</strong>
            </div>
          )}

          {/* Security footer */}
          <div className="dv-us-security">
            <span>🔒 AES-256 Encrypted</span>
            <span>✓ Auto compliance scan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
