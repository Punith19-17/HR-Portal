import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Profile.css';
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, Shield,
  BadgeCheck, Edit3, Save, X, Camera, Lock, ChevronRight
} from 'lucide-react';

const MOCK_USER = {
  employee_id:'AA-EMP-001', employee_type:'Consulting', name:'Punith A',
  email_id:'punith.a@aarya.associates', gender:'Male', dob:'1995-08-15',
  mobile_no:'9876543210',
  permanent_address:'No.92/2 Dwarakanagara, BSK 3rd Stage, Bangalore - 560085',
  adhar_number:'XXXX-XXXX-3456', department:'Finance & Tax Advisory',
  designation:'Consulting Lead', profile_picture:null,
};

const Profile = () => {
  const [userData, setUserData]     = useState(null);
  const [loading,  setLoading]      = useState(true);
  const [activeTab,setActiveTab]    = useState('personal');
  const [editMode, setEditMode]     = useState(false);
  const [editData, setEditData]     = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch('http://localhost:5000/api/profile', { credentials:'include' });
        if (!r.ok) { setUserData(MOCK_USER); return; }
        setUserData(await r.json());
      } catch { setUserData(MOCK_USER); }
      finally   { setLoading(false); }
    };
    load();
    const t = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  if (loading) return (
    <div className="prof-loading">
      <div className="prof-spinner"/>
      <p>Loading profile…</p>
    </div>
  );

  const u   = userData || MOCK_USER;
  const ini = u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'PA';
  const dob = u.dob  ? new Date(u.dob).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : '—';

  const startEdit  = () => { setEditData({...u}); setEditMode(true); };
  const cancelEdit = () => { setEditMode(false); setEditData({}); };
  const saveEdit   = () => {
    setUserData({...editData});
    setEditMode(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const Field = ({ icon, label, field, value }) => (
    <div className="prof-field">
      <div className="prof-field-icon">{icon}</div>
      <div className="prof-field-body">
        <span className="prof-field-label">{label}</span>
        {editMode && field
          ? <input className="prof-field-input" value={editData[field]||''} onChange={e => setEditData(p => ({...p,[field]:e.target.value}))}/>
          : <span className="prof-field-value">{value}</span>}
      </div>
    </div>
  );

  const tabs = [
    { id:'personal',     label:'Personal Info' },
    { id:'professional', label:'Professional'  },
    { id:'security',     label:'Security'      },
  ];

  return (
    <div className="prof-page">

      {/* ── HERO: Light-Gradient Split-Panel ID Card ── */}
      <div className="prof-hero-banner">
        <div className="prof-orb prof-orb-1"/>
        <div className="prof-orb prof-orb-2"/>
        <div className="prof-orb prof-orb-3"/>

        {/* Left: Avatar panel */}
        <div className="prof-hero-left">
          <div className="prof-accent-bar"/>
          <div className="prof-avatar-wrap">
            <div className="prof-avatar-outer-ring"/>
            <div className="prof-avatar-ring">
              {u.profile_picture
                ? <img src={`http://localhost:5000/${u.profile_picture}`} alt="avatar" className="prof-avatar-img" onError={e => e.target.style.display='none'}/>
                : <div className="prof-avatar-fallback">{ini}</div>}
            </div>
            <button className="prof-cam-btn" title="Change photo"><Camera size={13}/></button>
            <div className="prof-online-dot"/>
          </div>
          <h2 className="prof-left-name">{u.name}</h2>
          <p className="prof-left-role">{u.designation}</p>
          <div className="prof-verified-stamp">
            <BadgeCheck size={13} style={{color:'#0b684c'}}/>
            <span>Verified</span>
          </div>
        </div>

        {/* Divider */}
        <div className="prof-hero-divider"/>

        {/* Right: Details panel */}
        <div className="prof-hero-right">
          <div className="prof-hero-right-top">
            <div className="prof-dept-tag">
              <Briefcase size={11} style={{marginRight:5,color:'#a47230'}}/>
              {u.department}
            </div>
            {!editMode ? (
              <button className="prof-btn-edit" onClick={startEdit}>
                <Edit3 size={13} style={{marginRight:6}}/> Edit Profile
              </button>
            ) : (
              <div style={{display:'flex',gap:8}}>
                <button className="prof-btn-save" onClick={saveEdit}><Save size={13} style={{marginRight:5}}/> Save</button>
                <button className="prof-btn-cancel" onClick={cancelEdit}><X size={13} style={{marginRight:5}}/> Cancel</button>
              </div>
            )}
          </div>

          <p className="prof-hero-id">
            <span className="prof-id-dot"/>{u.employee_id}
          </p>

          <div className="prof-stats-row">
            {[
              {label:'Employee Type', val:u.employee_type||'Consulting', color:'#0b684c', bg:'linear-gradient(135deg,#e8fdf5,#d1f7ea)'},
              {label:'Gender',        val:u.gender,                      color:'#6d4cad', bg:'linear-gradient(135deg,#f3eeff,#e9d8fd)'},
              {label:'Status',        val:'Active',                      color:'#065f46', bg:'linear-gradient(135deg,#ecfdf5,#d1fae5)'},
              {label:'Department',    val:'Finance',                     color:'#a47230', bg:'linear-gradient(135deg,#fffbeb,#fef3c7)'},
            ].map(s => (
              <div key={s.label} className="prof-stat-card" style={{background:s.bg}}>
                <span className="prof-stat-label">{s.label}</span>
                <span className="prof-stat-val" style={{color:s.color}}>{s.val}</span>
              </div>
            ))}
          </div>

          <div className="prof-email-row">
            <Mail size={12} style={{color:'#a47230',marginRight:7}}/>
            <span className="prof-email-text">{u.email_id}</span>
            <span className="prof-divider-dot">·</span>
            <Phone size={12} style={{color:'#a47230',marginRight:7}}/>
            <span className="prof-email-text">{u.mobile_no||'—'}</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      {saveSuccess && (
        <div className="prof-toast">
          <BadgeCheck size={15} style={{marginRight:8,color:'#10b981'}}/>
          Profile updated successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="prof-tabs-row">
        {tabs.map(t => (
          <button key={t.id} className={`prof-tab${activeTab===t.id?' active':''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
            {activeTab===t.id && <div className="prof-tab-underline"/>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="prof-content-grid">

        {activeTab==='personal' && (
          <>
            <div className="prof-card">
              <div className="prof-card-header">
                <div className="prof-card-header-left">
                  <div className="prof-card-icon"><User size={16} color="#0b684c"/></div>
                  <div>
                    <h3 className="prof-card-title">Personal Information</h3>
                    <p className="prof-card-subtitle">Basic identity and contact details</p>
                  </div>
                </div>
                {editMode && <span className="prof-editing-badge"><Edit3 size={10} style={{marginRight:4}}/>Editing</span>}
              </div>
              <div className="prof-fields-grid">
                <Field icon={<Mail size={15}/>}     label="Email Address"     field="email_id"          value={u.email_id}/>
                <Field icon={<Phone size={15}/>}    label="Mobile Number"     field="mobile_no"         value={u.mobile_no||'—'}/>
                <Field icon={<Calendar size={15}/>} label="Date of Birth"                               value={dob}/>
                <Field icon={<User size={15}/>}     label="Gender"            field="gender"            value={u.gender}/>
                <Field icon={<MapPin size={15}/>}   label="Permanent Address" field="permanent_address" value={u.permanent_address}/>
                <Field icon={<Shield size={15}/>}   label="Aadhaar Number"                              value={u.adhar_number||'—'}/>
              </div>
            </div>

            <div className="prof-side-card">
              <h3 className="prof-card-title">Profile Completion</h3>
              <div className="prof-completion-bar"><div className="prof-completion-fill"/></div>
              <p className="prof-completion-text">85% Complete</p>
              <div className="prof-tips">
                {['Add profile picture','Verify mobile number','Add emergency contact'].map(tip => (
                  <div key={tip} className="prof-tip">
                    <ChevronRight size={12} color="#c58f47" style={{marginRight:6,flexShrink:0}}/>{tip}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab==='professional' && (
          <>
            <div className="prof-card">
              <div className="prof-card-header">
                <div className="prof-card-header-left">
                  <div className="prof-card-icon"><Briefcase size={16} color="#0b684c"/></div>
                  <div>
                    <h3 className="prof-card-title">Professional Details</h3>
                    <p className="prof-card-subtitle">Corporate role and organizational information</p>
                  </div>
                </div>
              </div>
              <div className="prof-fields-grid">
                <Field icon={<BadgeCheck size={15}/>} label="Employee ID"   value={u.employee_id}/>
                <Field icon={<Briefcase size={15}/>}  label="Designation"   value={u.designation}/>
                <Field icon={<Shield size={15}/>}     label="Department"    value={u.department}/>
                <Field icon={<User size={15}/>}       label="Employee Type" value={u.employee_type||'Consulting'}/>
              </div>
            </div>

            <div className="prof-side-card">
              <h3 className="prof-card-title">Work Summary</h3>
              {[
                {label:'Department', val:u.department, color:'#0b684c'},
                {label:'Role Level', val:'Lead',        color:'#c58f47'},
                {label:'Status',     val:'Active',      color:'#10b981'},
              ].map(s => (
                <div key={s.label} className="prof-summary-row">
                  <span style={{fontSize:12,color:'#718096'}}>{s.label}</span>
                  <span style={{fontSize:12,fontWeight:700,color:s.color}}>{s.val}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab==='security' && (
          <div className="prof-card" style={{gridColumn:'1 / -1'}}>
            <div className="prof-card-header">
              <div className="prof-card-header-left">
                <div className="prof-card-icon"><Lock size={16} color="#0b684c"/></div>
                <div>
                  <h3 className="prof-card-title">Security Settings</h3>
                  <p className="prof-card-subtitle">Manage your account security</p>
                </div>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:16,marginTop:8}}>
              {[
                {title:'Change Password',           desc:'Update your login password regularly for security.'},
                {title:'Two-Factor Authentication', desc:'Add an extra layer of security to your account.'},
                {title:'Login Activity',            desc:'Review recent login sessions and devices.'},
              ].map(item => (
                <div key={item.title} className="prof-security-row">
                  <div>
                    <p style={{fontSize:14,fontWeight:700,color:'#2d3748',margin:'0 0 2px'}}>{item.title}</p>
                    <p style={{fontSize:12,color:'#718096',margin:0}}>{item.desc}</p>
                  </div>
                  <button className="prof-sec-btn">Manage <ChevronRight size={12}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
