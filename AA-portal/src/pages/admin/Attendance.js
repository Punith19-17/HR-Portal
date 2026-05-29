import React, { useState, useMemo } from 'react';
import { Calendar, Plus, CheckCircle, X, LogIn, LogOut, User, Download, Search } from 'lucide-react';
import '../../styles/Attendance.css';

/* ── Logged-in Employee ─────────────────────────────────── */
const ME = { id:'AA-001', name:'Punith A', dept:'Finance & Tax Advisory', designation:'Consulting Lead' };

/* ── This employee's attendance records by date ─────────── */
const MY_RECORDS_STATIC = {
  '2025-10-01':{ checkIn:'09:01 AM', checkOut:'06:05 PM', hours:9.1,  status:'Present'  },
  '2025-10-02':{ checkIn:'-',        checkOut:'-',        hours:0,    status:'Holiday'  },
  '2025-10-03':{ checkIn:'09:20 AM', checkOut:'06:30 PM', hours:9.2,  status:'Late'     },
  '2025-10-06':{ checkIn:'08:55 AM', checkOut:'06:00 PM', hours:9.1,  status:'Present'  },
  '2025-10-07':{ checkIn:'08:50 AM', checkOut:'06:10 PM', hours:9.3,  status:'Present'  },
  '2025-10-08':{ checkIn:'09:00 AM', checkOut:'06:00 PM', hours:9.0,  status:'Present'  },
  '2025-10-09':{ checkIn:'09:05 AM', checkOut:'06:15 PM', hours:9.2,  status:'Present'  },
  '2025-10-10':{ checkIn:'08:58 AM', checkOut:'06:02 PM', hours:9.1,  status:'Present'  },
  '2025-10-11':{ checkIn:'-',        checkOut:'-',        hours:0,    status:'Holiday'  },
  '2025-10-13':{ checkIn:'09:18 AM', checkOut:'06:20 PM', hours:9.0,  status:'Late'     },
  '2025-10-14':{ checkIn:'09:00 AM', checkOut:'01:00 PM', hours:4.0,  status:'Half Day' },
  '2025-10-15':{ checkIn:'08:52 AM', checkOut:'06:08 PM', hours:9.3,  status:'Present'  },
  '2025-10-16':{ checkIn:'09:02 AM', checkOut:'06:00 PM', hours:9.0,  status:'Present'  },
  '2025-10-17':{ checkIn:'09:00 AM', checkOut:'06:05 PM', hours:9.1,  status:'Present'  },
  '2025-10-20':{ checkIn:'09:03 AM', checkOut:'06:12 PM', hours:9.2,  status:'Present'  },
  '2025-10-21':{ checkIn:'08:59 AM', checkOut:'06:00 PM', hours:9.0,  status:'Present'  },
  '2025-10-22':{ checkIn:'09:00 AM', checkOut:'06:00 PM', hours:9.0,  status:'Present'  },
  '2025-10-23':{ checkIn:'-',        checkOut:'-',        hours:0,    status:'Absent'   },
  '2025-10-24':{ checkIn:'09:00 AM', checkOut:'06:00 PM', hours:9.0,  status:'Present'  },
  '2025-10-27':{ checkIn:'08:50 AM', checkOut:'06:05 PM', hours:9.2,  status:'Present'  },
  '2025-10-28':{ checkIn:'08:58 AM', checkOut:'06:00 PM', hours:9.0,  status:'Present'  },
  '2025-10-29':{ checkIn:'09:00 AM', checkOut:'06:05 PM', hours:9.1,  status:'Present'  },
  '2025-10-30':{ checkIn:'09:02 AM', checkOut:'06:10 PM', hours:9.1,  status:'Present'  },
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const badgeClass = s => ({ Present:'ab-present', Late:'ab-late', Absent:'ab-absent', 'Half Day':'ab-halfday', Holiday:'ab-holiday' }[s] || '');
const pad2       = n => String(n).padStart(2, '0');
const nowTime    = () => { const n=new Date(); let h=n.getHours(),m=n.getMinutes(),a=h>=12?'PM':'AM'; h=h%12||12; return `${pad2(h)}:${pad2(m)} ${a}`; };
const hoursWidth = h => Math.min(100,(h/9.5)*100)+'%';
const hoursClass = h => h>=8?'bf-full':h>0?'bf-part':'bf-zero';

const calBg = s => ({ Present:'present', Late:'late', Absent:'absent', 'Half Day':'halfday', Holiday:'holiday' }[s] || '');
const calLetter = s => ({ Present:'P', Late:'L', Absent:'A', 'Half Day':'½', Holiday:'H' }[s] || '');

const AttendanceModule = () => {
  const [month,     setMonth]     = useState(9);
  const [year,      setYear]      = useState(2025);
  const [selDate,   setSelDate]   = useState('2025-10-30');
  const [extraRec,  setExtraRec]  = useState({});
  const [showMark,  setShowMark]  = useState(false);
  const [markType,  setMarkType]  = useState('checkin');
  const [markTime,  setMarkTime]  = useState(nowTime());
  const [markNote,  setMarkNote]  = useState('');
  const [toast,     setToast]     = useState(null);
  const [search,    setSearch]    = useState('');

  /* Merge static + user-added records */
  const allRecords = { ...MY_RECORDS_STATIC, ...extraRec };

  /* Monthly summary for this employee */
  const monthlySummary = useMemo(() => {
    const prefix = `${year}-${pad2(month+1)}`;
    const days = Object.entries(allRecords).filter(([k]) => k.startsWith(prefix));
    return {
      present:  days.filter(([,v]) => v.status==='Present').length,
      late:     days.filter(([,v]) => v.status==='Late').length,
      absent:   days.filter(([,v]) => v.status==='Absent').length,
      halfday:  days.filter(([,v]) => v.status==='Half Day').length,
      working:  days.filter(([,v]) => v.status!=='Holiday').length,
    };
  }, [allRecords, month, year]);

  /* Selected date record */
  const selRecord = allRecords[selDate] || null;

  /* All records sorted newest first (for the table) */
  const historyList = useMemo(() =>
    Object.entries(allRecords)
      .sort(([a],[b]) => b.localeCompare(a))
      .map(([date,rec]) => ({ date, ...rec }))
  , [allRecords]);

  /* Filtered list based on search */
  const filteredList = useMemo(() => {
    if(!search.trim()) return historyList;
    const q = search.toLowerCase();
    return historyList.filter(r =>
      r.date.includes(q) ||
      r.status.toLowerCase().includes(q) ||
      r.checkIn.toLowerCase().includes(q) ||
      r.checkOut.toLowerCase().includes(q)
    );
  }, [historyList, search]);

  /* Export all records to CSV (opens in Excel) */
  const exportToCSV = () => {
    const headers = ['Date','Check In','Check Out','Hours Worked','Status'];
    const rows = historyList.map(r => [
      new Date(r.date+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),
      r.checkIn, r.checkOut,
      r.hours > 0 ? r.hours+'h' : '—',
      r.status
    ]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `Attendance_PunithA_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  /* Calendar grid */
  const weeks = useMemo(() => {
    const first=new Date(year,month,1), last=new Date(year,month+1,0), prev=new Date(year,month,0);
    const fdow=first.getDay(), days=[];
    for(let i=fdow;i>0;i--) days.push({d:prev.getDate()-i+1,m:-1});
    for(let i=1;i<=last.getDate();i++){
      const dow=new Date(year,month,i).getDay();
      const key=`${year}-${pad2(month+1)}-${pad2(i)}`;
      const rec=allRecords[key];
      const bg =dow===0?'holiday':(rec?calBg(rec.status):'');
      const s  =dow===0?'H':(rec?calLetter(rec.status):'');
      const isSel=selDate===key;
      const isToday=key==='2025-10-30';
      days.push({d:i,m:0,key,isToday,isSun:dow===0,isSel,bg,s});
    }
    const fill=(7-(days.length%7))%7;
    for(let i=1;i<=fill;i++) days.push({d:i,m:1});
    const r=[];
    for(let i=0;i<days.length;i+=7) r.push(days.slice(i,i+7));
    return r;
  },[month,year,selDate,allRecords]);

  const navMonth = d => { let m=month+d,y=year; if(m>11){m=0;y++;} else if(m<0){m=11;y--;} setMonth(m);setYear(y); };

  const handleDateChange = e => {
    const d=e.target.value; if(!d) return;
    setSelDate(d);
    const p=new Date(d); setMonth(p.getMonth()); setYear(p.getFullYear());
  };

  const handleCalClick = day => {
    if(day.m!==0) return;
    setSelDate(day.key);
  };

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null),3500); };

  const handleMark = () => {
    const todayKey = new Date().toISOString().slice(0,10);
    const existing = extraRec[todayKey] || MY_RECORDS_STATIC[todayKey] || { checkIn:'-', checkOut:'-', hours:0, status:'Absent' };
    const rec = {...existing};

    if(markType==='checkin'){
      if(rec.checkIn!=='-'){ showToast('Already checked in today!'); setShowMark(false); return; }
      rec.checkIn=markTime; rec.status='Present';
    } else {
      if(rec.checkIn==='-'){ showToast('Please check in first!'); setShowMark(false); return; }
      rec.checkOut=markTime;
      const parse=t=>{ const[hm,ap]=t.split(' '); let[h,m]=hm.split(':').map(Number); if(ap==='PM'&&h!==12)h+=12; if(ap==='AM'&&h===12)h=0; return h*60+m; };
      rec.hours=Math.round(Math.max(0,(parse(markTime)-parse(rec.checkIn))/60)*10)/10;
    }

    setExtraRec(prev=>({...prev,[todayKey]:rec}));
    showToast(`✓ ${markType==='checkin'?'Check-in':'Check-out'} recorded at ${markTime}${markNote?' — '+markNote:''}`);
    setSelDate(todayKey);
    const d=new Date(todayKey); setMonth(d.getMonth()); setYear(d.getFullYear());
    setShowMark(false); setMarkNote('');
  };

  const { present, late, absent, halfday, working } = monthlySummary;
  const todayLabel = new Date('2025-10-30T00:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  const selLabel   = new Date(selDate+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});

  return (
    <div className="att-wrap">

      {/* Toast */}
      {toast && <div className="att-toast">{toast}</div>}

      {/* ── HERO — this employee's monthly summary ── */}
      <div className="att-hero">
        <div className="att-hero-top">
          <div>
            <h1 className="att-hero-title">Attendance Command Center</h1>
            <p className="att-hero-sub">My attendance overview for {MONTHS[month]} {year}</p>
          </div>
          <div className="att-hero-date"><Calendar size={13}/>{todayLabel}</div>
        </div>
        <div className="att-hero-stats">
          {[
            {num:present, label:'Days Present',  fill:'fill-green',  pct:working?Math.round(present/working*100)+'%':'0%',  pcls:'pct-green'  },
            {num:late,    label:'Late Arrivals',  fill:'fill-amber',  pct:working?Math.round(late/working*100)+'%':'0%',     pcls:'pct-amber'  },
            {num:absent,  label:'Days Absent',    fill:'fill-red',    pct:working?Math.round(absent/working*100)+'%':'0%',   pcls:'pct-red'    },
            {num:halfday, label:'Half Days',       fill:'fill-violet', pct:working?Math.round(halfday/working*100)+'%':'0%', pcls:'pct-violet' },
          ].map((s,i)=>(
            <div key={i} className="att-hstat">
              <p className="att-hstat-label">{s.label}</p>
              <p className="att-hstat-num">{s.num}</p>
              <div className="att-hstat-bar"><div className={`att-hstat-fill ${s.fill}`} style={{width:s.pct}}/></div>
              <p className={`att-hstat-pct ${s.pcls}`}>{s.pct} of working days</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ACTION BAR ── */}
      <div className="att-actions">
        <div className="att-actions-left">
          <input type="date" value={selDate} onChange={handleDateChange} className="att-date-in"/>
          <button className="att-abtn att-abtn-ghost"><Calendar size={13}/>View Calendar</button>
        </div>
        <div className="att-actions-right">
          <button className="att-abtn att-abtn-primary" onClick={()=>{setMarkTime(nowTime());setShowMark(true);}}>
            <Plus size={13}/>Mark Attendance
          </button>
        </div>
      </div>

      {/* ── MARK ATTENDANCE MODAL ── */}
      {showMark && (
        <div className="att-modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowMark(false)}>
          <div className="att-modal">
            <div className="att-modal-head">
              <div>
                <p className="att-modal-title">Mark My Attendance</p>
                <p className="att-modal-sub">{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
              </div>
              <button className="att-modal-close" onClick={()=>setShowMark(false)}><X size={16}/></button>
            </div>
            <div className="att-modal-emp">
              <div className="att-av" style={{width:40,height:40,fontSize:14,borderRadius:12,flexShrink:0}}>PA</div>
              <div>
                <p style={{margin:0,fontWeight:700,fontSize:14,color:'#1a202c'}}>{ME.name}</p>
                <p style={{margin:0,fontSize:11,color:'#718096'}}>{ME.id} · {ME.dept}</p>
              </div>
            </div>
            <div className="att-modal-type-row">
              <button className={`att-type-btn${markType==='checkin'?' active-in':''}`} onClick={()=>setMarkType('checkin')}>
                <LogIn size={15}/>Check In
              </button>
              <button className={`att-type-btn${markType==='checkout'?' active-out':''}`} onClick={()=>setMarkType('checkout')}>
                <LogOut size={15}/>Check Out
              </button>
            </div>
            <div className="att-modal-time-row">
              <label className="att-modal-label">Time</label>
              <input className="att-modal-time-input" value={markTime} onChange={e=>setMarkTime(e.target.value)} placeholder="09:00 AM"/>
              <button className="att-now-btn" onClick={()=>setMarkTime(nowTime())}>Now</button>
            </div>
            <div style={{marginBottom:18}}>
              <label className="att-modal-label" style={{display:'block',marginBottom:6}}>Note (optional)</label>
              <input className="att-modal-time-input" style={{width:'100%',boxSizing:'border-box'}}
                value={markNote} onChange={e=>setMarkNote(e.target.value)} placeholder="e.g. Working from home"/>
            </div>
            <div className="att-modal-footer">
              <button className="att-abtn att-abtn-outline" style={{flex:1}} onClick={()=>setShowMark(false)}>Cancel</button>
              <button className="att-abtn att-abtn-primary" style={{flex:2}} onClick={handleMark}>
                {markType==='checkin'?<><LogIn size={13}/>Confirm Check In</>:<><LogOut size={13}/>Confirm Check Out</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN GRID ── */}
      <div className="att-main">

        {/* Calendar — shows THIS employee's status per day */}
        <div className="att-cal-panel">
          <div className="att-cal-head">
            <p className="att-cal-title">{MONTHS[month]} {year}</p>
            <div className="att-cal-nav">
              <button className="att-cal-btn" onClick={()=>navMonth(-1)}>‹</button>
              <span className="att-cal-month">Monthly View</span>
              <button className="att-cal-btn" onClick={()=>navMonth(1)}>›</button>
            </div>
          </div>
          <div className="att-cal-grid-wrap">
            <div className="att-cal-dh">
              {['S','M','T','W','T','F','S'].map((d,i)=>(
                <div key={i} className={`att-cal-dl${i===0?' sun':''}`}>{d}</div>
              ))}
            </div>
            <div className="att-cal-weeks">
              {weeks.map((wk,wi)=>(
                <div key={wi} className="att-cal-wrow">
                  {wk.map((day,di)=>{
                    let cls='att-cal-day';
                    if(day.m!==0) cls+=' other';
                    if(day.bg==='present') cls+=' d-present';
                    if(day.bg==='late')    cls+=' d-late';
                    if(day.bg==='absent')  cls+=' d-absent';
                    if(day.bg==='halfday') cls+=' d-halfday';
                    if(day.bg==='holiday') cls+=' d-holiday';
                    if(day.isToday) cls+=' d-today';
                    if(day.isSun)   cls+=' d-sun';
                    if(day.isSel && day.m===0) cls+=' d-selected';
                    return(
                      <div key={di} className={cls}
                        style={{cursor:day.m===0?'pointer':'default'}}
                        onClick={()=>handleCalClick(day)}
                      >
                        <span className="att-cdn">{day.d}</span>
                        {day.m===0&&day.s&&<span className="att-cds">{day.s}</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Selected day detail */}
          {selRecord && (
            <div className="att-day-detail">
              <p className="att-day-detail-title">{selLabel}</p>
              <div className="att-day-detail-grid">
                <div className="att-day-chip"><LogIn  size={11} style={{color:'#059669'}}/>{selRecord.checkIn}</div>
                <div className="att-day-chip"><LogOut size={11} style={{color:'#dc2626'}}/>{selRecord.checkOut}</div>
                <div className="att-day-chip"><Calendar size={11} style={{color:'#0b684c'}}/>{selRecord.hours>0?selRecord.hours+'h worked':'—'}</div>
                <span className={`att-badge ${badgeClass(selRecord.status)}`} style={{fontSize:10}}>
                  <span className="att-bdot"/>{selRecord.status}
                </span>
              </div>
            </div>
          )}
          {!selRecord && (
            <div className="att-day-detail">
              <p className="att-day-detail-title">{selLabel}</p>
              <p className="att-day-detail-empty">No attendance record for this date</p>
            </div>
          )}

          <div className="att-cal-legend">
            {[
              {c:'ld-p', code:'P',l:'Present'},{c:'ld-late',code:'L',l:'Late'},
              {c:'ld-a', code:'A',l:'Absent'}, {c:'ld-hd', code:'½',l:'Half Day'},
              {c:'ld-h', code:'H',l:'Holiday'},
            ].map(x=>(
              <div key={x.code} className="att-leg-item">
                <span className={`att-leg-dot ${x.c}`}>{x.code}</span>{x.l}
              </div>
            ))}
          </div>
        </div>

        {/* My Attendance History — scrollable */}
        <div className="att-table-panel">
          <div className="att-tp-head">
            <div className="att-tp-left">
              <div className="att-tp-icon"><User size={16}/></div>
              <div>
                <p className="att-tp-title">My Attendance — {ME.name}</p>
                <p className="att-tp-sub">{ME.id} · {filteredList.length}/{historyList.length} records</p>
              </div>
            </div>
            <button className="att-abtn att-abtn-outline" style={{fontSize:11,padding:'7px 14px'}} onClick={exportToCSV}>
              <Download size={13}/>Export XL
            </button>
          </div>

          {/* Search bar */}
          <div className="att-search-bar">
            <Search size={14} style={{color:'#a0aec0',flexShrink:0}}/>
            <input
              className="att-search-input"
              placeholder="Search by date, status, check-in time…"
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
            {search && (
              <button className="att-search-clear" onClick={()=>setSearch('')}><X size={13}/></button>
            )}
          </div>

          <div className="att-scroll att-tbl-scroll">
            <table className="att-tbl">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Hours Worked</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr><td colSpan={5} style={{textAlign:'center',padding:'28px',color:'#a0aec0',fontSize:12,fontWeight:600}}>No records match your search</td></tr>
                ) : filteredList.map(rec=>(
                  <tr key={rec.date}
                    className={selDate===rec.date?'att-row-sel':''}
                    style={{cursor:'pointer'}}
                    onClick={()=>{ setSelDate(rec.date); const d=new Date(rec.date); setMonth(d.getMonth());setYear(d.getFullYear()); }}
                  >
                    <td style={{fontWeight:700,color:'#1a202c',fontSize:12}}>
                      {new Date(rec.date+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                    </td>
                    <td>
                      <span className={`att-tchip ${rec.checkIn==='-'?'tc-nil':'tc-in'}`}>
                        {rec.checkIn!=='-'&&<CheckCircle size={10}/>}{rec.checkIn}
                      </span>
                    </td>
                    <td>
                      <span className={`att-tchip ${rec.checkOut==='-'?'tc-nil':'tc-out'}`}>{rec.checkOut}</span>
                    </td>
                    <td>
                      <div className="att-bar-wrap">
                        <div className="att-bar-track">
                          <div className={`att-bar-fill ${hoursClass(rec.hours)}`} style={{width:hoursWidth(rec.hours)}}/>
                        </div>
                        <span className="att-bar-val">{rec.hours>0?rec.hours+'h':'—'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`att-badge ${badgeClass(rec.status)}`}>
                        <span className="att-bdot"/>{rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AttendanceModule;