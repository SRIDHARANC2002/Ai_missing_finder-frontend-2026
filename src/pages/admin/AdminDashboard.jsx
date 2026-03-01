import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllComplaints } from "../../services/adminService";

const AdminDashboard = () => {
  const [time, setTime] = useState(new Date());
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    fetchData();
    return () => clearInterval(t);
  }, []);

  // ✅ FIX 1: Single clean fetchData — no nested duplicate
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllComplaints();
      console.log("API Response:", data);

      const complaintsArray =
        data?.complaints ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      setComplaints(complaintsArray);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    fetchData();
    return () => clearInterval(t);
  }, []);

  const activeCount   = complaints.filter(c => c.status === "Approved").length;
  const resolvedCount = complaints.filter(c => c.status === "Completed").length;
  const pendingCount  = complaints.filter(c => c.status === "Pending").length;

  const stats = [
    {
      label: "Active Complaints", value: activeCount, change: "+0 today", up: true,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
    },
    {
      label: "Total Resolved", value: resolvedCount, change: "+0 this week", up: true,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    },
    {
      label: "Pending Verification", value: pendingCount, change: "0 urgent", up: false,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
    },
    {
      label: "Officers On Duty", value: 31, change: "Across 6 zones", up: true,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    },
  ];

  const recentComplaints = complaints.slice(0, 4).map(c => ({
    id:       c._id ? `CMP-${c._id.slice(-4).toUpperCase()}` : "CMP-0000",
    name:     c.name     || "Unknown",
    location: c.address  || "Not Available",
    time:     c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A",
    status:   c.status   || "Pending",
    imageUrl: c.imageUrl || null,
  }));

  const actions = [
    {
      to: "/admin/complaints", label: "Review Active Complaints",
      sub: "Manage and assign all incoming missing person reports", badge: `${activeCount} Active`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
    },
    {
      to: "/admin/completed", label: "Completed Cases Archive",
      sub: "Browse and export all closed and resolved incidents", badge: `${resolvedCount} Total`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    },
    {
      to: "/admin/verify", label: "Verify Unknown Person",
      sub: "Run AI facial recognition checks on reported individuals", badge: `${pendingCount} Pending`,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><polyline points="16 11 17 13 21 12" /></svg>
    },
  ];

  const zones = [
    { label: "Zone A — North", cases: 8,  officers: 6, alert: true  },
    { label: "Zone B — South", cases: 5,  officers: 9, alert: false },
    { label: "Zone C — East",  cases: 11, officers: 7, alert: true  },
    { label: "Zone D — West",  cases: 3,  officers: 5, alert: false },
  ];

  // ✅ FIX 2: Loading spinner — no blank screen while API loads
  if (loading) {
    return (
      <div style={{ minHeight:"60vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#faf6f7", gap:"16px" }}>
        <style>{`@keyframes _spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width:"40px", height:"40px", border:"3px solid #ddc8cc", borderTopColor:"#6b0f1a", borderRadius:"50%", animation:"_spin 0.8s linear infinite" }} />
        <p style={{ fontFamily:"'Playfair Display', serif", fontSize:"18px", color:"#6b0f1a", fontStyle:"italic" }}>Loading Dashboard...</p>
        <p style={{ fontSize:"11px", color:"#7a5a60", letterSpacing:"1px", textTransform:"uppercase" }}>Fetching command data</p>
      </div>
    );
  }

  // ✅ FIX 3: Error state — shows message + retry button instead of blank screen
  if (error) {
    return (
      <div style={{ minHeight:"60vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#faf6f7", gap:"12px" }}>
        <p style={{ fontFamily:"'Playfair Display', serif", fontSize:"22px", color:"#6b0f1a" }}>Failed to Load Dashboard</p>
        <p style={{ fontSize:"13px", color:"#7a5a60", maxWidth:"420px", textAlign:"center", lineHeight:"1.6" }}>
          {error} — Check your backend CORS settings or network connection.
        </p>
        <button onClick={fetchData} style={{ marginTop:"8px", padding:"10px 28px", background:"#6b0f1a", color:"#fff", border:"none", borderRadius:"3px", fontWeight:"700", fontSize:"13px", cursor:"pointer", fontFamily:"'Lato', sans-serif", letterSpacing:"0.5px" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lato:wght@300;400;700;900&family=Inconsolata:wght@400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ad {
  --maroon:        #6b0f1a;
  --maroon-deep:   #3e0810;
  --maroon-mid:    #5a0e17;
  --maroon-light:  #f8eef0;
  --maroon-pale:   #fdf4f5;
  --gold:          #b8860b;
  --gold-light:    #d4a017;
  --gold-bright:   #e8b84b;
  --gold-pale:     #fdf8ec;
  --text-dark:     #1c0a0d;
  --text-mid:      #3d1520;
  --text-muted:    #7a5a60;
  --text-light:    #b09098;
  --border:        #ddc8cc;
  --border-light:  #eedadd;
  --white:         #ffffff;
  --surface:       #faf6f7;
  --surface2:      #f4edef;
  --green:         #5a8a4a;
  --green-bg:      rgba(90,138,74,0.1);
  --red:           #9e3a47;
  --red-bg:        rgba(158,58,71,0.1);
  --amber:         #a0622a;
  --amber-bg:      rgba(160,98,42,0.1);
  --font-serif:    'Playfair Display', Georgia, serif;
  --font-sans:     'Lato', 'Helvetica Neue', sans-serif;
  --font-mono:     'Inconsolata', 'Courier New', monospace;
  min-height: 100vh;
  background: var(--surface);
  color: var(--text-dark);
  font-family: var(--font-sans);
}

.ad-hero {
  background: var(--maroon-deep);
  border-bottom: 3px solid var(--gold);
  padding: 36px 48px 42px;
  position: relative;
  overflow: hidden;
}
.ad-hero::before {
  content: '';
  position: absolute; inset: 0;
  background-image: repeating-linear-gradient(45deg,rgba(255,255,255,0.012) 0px,rgba(255,255,255,0.012) 1px,transparent 1px,transparent 28px);
  pointer-events: none;
}
.ad-hero::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
}
.ad-hero-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 32px; flex-wrap: wrap; position: relative; z-index: 1;
}
.ad-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-size: 10.5px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: var(--gold-light); margin-bottom: 14px;
  animation: ad-fade-down 0.5s ease both;
}
.ad-eyebrow-rule { width: 24px; height: 1.5px; background: var(--gold); }
.ad-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(28px, 3.5vw, 44px); font-weight: 800;
  color: var(--white); letter-spacing: -0.5px; line-height: 1.1; margin-bottom: 8px;
  animation: ad-fade-up 0.5s ease 0.1s both;
}
.ad-hero-title em { font-style: italic; color: var(--gold-light); }
.ad-hero-sub {
  font-size: 13.5px; color: rgba(255,255,255,0.38); font-weight: 300;
  line-height: 1.65; max-width: 420px;
  animation: ad-fade-up 0.5s ease 0.2s both;
}
.ad-hero-panel {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(212,160,23,0.2); border-radius: 3px;
  overflow: hidden; min-width: 260px;
  animation: ad-fade-left 0.5s ease 0.25s both;
}
.ad-panel-head {
  background: rgba(212,160,23,0.1); border-bottom: 1px solid rgba(212,160,23,0.15);
  padding: 10px 16px; display: flex; align-items: center; gap: 8px;
  font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--gold-light);
}
.ad-panel-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px 16px; border-bottom: 1px solid rgba(255,255,255,0.05);
  font-size: 12.5px; color: rgba(255,255,255,0.4);
}
.ad-panel-row:last-child { border-bottom: none; }
.ad-panel-val { font-family: var(--font-serif); font-size: 18px; font-weight: 800; color: var(--gold-light); }

@keyframes ad-fade-up   { from{opacity:0;transform:translateY(16px);}  to{opacity:1;transform:translateY(0);} }
@keyframes ad-fade-down { from{opacity:0;transform:translateY(-10px);} to{opacity:1;transform:translateY(0);} }
@keyframes ad-fade-left { from{opacity:0;transform:translateX(16px);}  to{opacity:1;transform:translateX(0);} }
@keyframes ad-card-in   { from{opacity:0;transform:translateY(14px);}  to{opacity:1;transform:translateY(0);} }

.ad-body { max-width: 1200px; margin: 0 auto; padding: 36px 48px 80px; }

.ad-section-label {
  display: flex; align-items: center; gap: 12px;
  font-size: 10px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: 16px;
}
.ad-section-label::after { content:''; flex:1; height:1px; background:var(--border); }

.ad-stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px; background: var(--border);
  border: 1px solid var(--border); border-radius: 3px; overflow: hidden; margin-bottom: 36px;
}
.ad-stat {
  background: var(--white); padding: 24px 22px;
  position: relative; overflow: hidden; transition: background 0.2s;
  animation: ad-card-in 0.4s ease both;
}
.ad-stat:nth-child(1){animation-delay:0.05s;} .ad-stat:nth-child(2){animation-delay:0.1s;}
.ad-stat:nth-child(3){animation-delay:0.15s;} .ad-stat:nth-child(4){animation-delay:0.2s;}
.ad-stat:hover { background: var(--maroon-pale); }
.ad-stat::after {
  content:''; position:absolute; bottom:0; left:0; right:0; height:3px;
  background:linear-gradient(90deg,var(--maroon),var(--gold));
  transform:scaleX(0); transform-origin:left; transition:transform 0.3s;
}
.ad-stat:hover::after { transform:scaleX(1); }
.ad-stat-icon {
  width:38px; height:38px; border-radius:3px;
  background:var(--maroon-light); border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center;
  color:var(--maroon); margin-bottom:14px; transition:background 0.2s,color 0.2s,border-color 0.2s;
}
.ad-stat:hover .ad-stat-icon { background:var(--maroon); color:var(--gold-light); border-color:var(--maroon); }
.ad-stat-value {
  font-family:var(--font-serif); font-size:38px; font-weight:800;
  color:var(--maroon-deep); letter-spacing:-1.5px; line-height:1; margin-bottom:4px;
  animation:ad-count-in 0.6s ease both;
}
@keyframes ad-count-in { from{opacity:0;transform:scale(0.8);} to{opacity:1;transform:scale(1);} }
.ad-stat-label {
  font-size:11px; font-weight:700; letter-spacing:0.8px; text-transform:uppercase;
  color:var(--text-muted); margin-bottom:8px;
}
.ad-stat-change { display:flex; align-items:center; gap:5px; font-family:var(--font-mono); font-size:11.5px; font-weight:600; }
.ad-stat-change.up   { color:var(--green); }
.ad-stat-change.down { color:var(--red); }

.ad-main-grid { display:grid; grid-template-columns:1fr 320px; gap:24px; }

.ad-actions { display:flex; flex-direction:column; gap:10px; margin-bottom:28px; }
.ad-action-card {
  display:flex; align-items:center; gap:18px; padding:20px 22px;
  background:var(--white); border:1px solid var(--border); border-radius:3px;
  text-decoration:none; color:var(--text-dark); position:relative; overflow:hidden;
  transition:border-color 0.2s,box-shadow 0.2s,transform 0.18s;
  animation:ad-card-in 0.4s ease both;
}
.ad-action-card:nth-child(1){animation-delay:0.25s;} .ad-action-card:nth-child(2){animation-delay:0.32s;} .ad-action-card:nth-child(3){animation-delay:0.39s;}
.ad-action-card::before {
  content:''; position:absolute; left:0; top:0; bottom:0; width:4px;
  background:linear-gradient(180deg,var(--maroon),var(--gold));
  transform:scaleY(0); transform-origin:bottom; transition:transform 0.25s;
}
.ad-action-card:hover { border-color:rgba(107,15,26,0.22); box-shadow:0 6px 28px rgba(107,15,26,0.08); transform:translateY(-2px); }
.ad-action-card:hover::before { transform:scaleY(1); }
.ad-action-icon {
  width:48px; height:48px; border-radius:3px; background:var(--maroon-light);
  border:1px solid var(--border); display:flex; align-items:center; justify-content:center;
  color:var(--maroon); flex-shrink:0; transition:background 0.2s,color 0.2s,border-color 0.2s;
}
.ad-action-card:hover .ad-action-icon { background:var(--maroon); color:var(--gold-light); border-color:var(--maroon); }
.ad-action-text { flex:1; min-width:0; }
.ad-action-label { font-family:var(--font-serif); font-size:16px; font-weight:700; color:var(--maroon-deep); letter-spacing:-0.2px; margin-bottom:3px; }
.ad-action-sub { font-size:13px; color:var(--text-muted); font-weight:300; }
.ad-action-badge {
  font-family:var(--font-mono); font-size:11px; font-weight:600;
  padding:4px 12px; border-radius:2px; background:var(--gold-pale);
  color:var(--maroon-deep); border:1px solid rgba(184,134,11,0.3); flex-shrink:0; letter-spacing:0.3px;
}
.ad-action-arrow { color:var(--text-light); flex-shrink:0; transition:color 0.2s,transform 0.2s; }
.ad-action-card:hover .ad-action-arrow { color:var(--maroon); transform:translateX(3px); }

.ad-zones { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.ad-zone-card {
  background:var(--white); border:1px solid var(--border); border-radius:3px;
  padding:16px 18px; position:relative; overflow:hidden; transition:border-color 0.2s,box-shadow 0.2s;
  animation:ad-card-in 0.4s ease both;
}
.ad-zone-card:nth-child(1){animation-delay:0.45s;} .ad-zone-card:nth-child(2){animation-delay:0.5s;}
.ad-zone-card:nth-child(3){animation-delay:0.55s;} .ad-zone-card:nth-child(4){animation-delay:0.6s;}
.ad-zone-card:hover { border-color:rgba(107,15,26,0.18); box-shadow:0 4px 16px rgba(107,15,26,0.06); }
.ad-zone-card.alert  { border-left:4px solid var(--red); }
.ad-zone-card.normal { border-left:4px solid var(--green); }
.ad-zone-name { font-size:12px; font-weight:700; color:var(--maroon-deep); letter-spacing:0.3px; margin-bottom:10px; }
.ad-zone-stats { display:flex; gap:16px; }
.ad-zone-stat-val { font-family:var(--font-serif); font-size:22px; font-weight:800; color:var(--maroon-deep); line-height:1; margin-bottom:2px; }
.ad-zone-stat-label { font-size:9.5px; font-weight:700; letter-spacing:0.8px; text-transform:uppercase; color:var(--text-muted); }
.ad-zone-alert-tag {
  position:absolute; top:12px; right:12px;
  font-size:9px; font-weight:900; letter-spacing:1.2px; text-transform:uppercase;
  padding:2px 8px; border-radius:2px; background:var(--red-bg); color:var(--red);
  border:1px solid rgba(158,58,71,0.25); animation:ad-alert-blink 2s infinite;
}
@keyframes ad-alert-blink { 0%,100%{opacity:1;} 50%{opacity:0.5;} }

.ad-recent-panel {
  background:var(--white); border:1px solid var(--border); border-radius:3px;
  overflow:hidden; height:fit-content; animation:ad-fade-left 0.5s ease 0.3s both;
}
.ad-recent-head {
  background:var(--maroon-deep); padding:16px 20px;
  display:flex; align-items:center; justify-content:space-between;
}
.ad-recent-title { font-family:var(--font-serif); font-size:15px; font-weight:700; color:var(--white); }
.ad-recent-see-all { font-size:11px; font-weight:700; letter-spacing:0.5px; color:var(--gold-light); text-decoration:none; opacity:0.8; transition:opacity 0.2s; }
.ad-recent-see-all:hover { opacity:1; }
.ad-recent-item {
  display:flex; align-items:flex-start; gap:12px; padding:14px 20px;
  border-bottom:1px solid var(--border-light); transition:background 0.18s; position:relative;
}
.ad-recent-item:last-child { border-bottom:none; }
.ad-recent-item:hover { background:var(--maroon-pale); }

/* ✅ FIX 4: Avatar — font styles added so initials show correctly */
.ad-recent-avatar {
  width:42px; height:42px; border-radius:3px;
  background:var(--maroon-light); border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center;
  overflow:hidden; flex-shrink:0;
  font-family:var(--font-serif); font-size:13px; font-weight:800; color:var(--maroon);
}
.ad-recent-avatar img { width:100%; height:100%; object-fit:cover; }
.ad-recent-dot {
  width:8px; height:8px; border-radius:50%; position:absolute;
  top:10px; left:10px; z-index:2; border:1.5px solid var(--white);
}
.ad-recent-info { flex:1; min-width:0; }
.ad-recent-id { font-family:var(--font-mono); font-size:10.5px; color:var(--text-light); margin-bottom:2px; }
.ad-recent-name { font-size:13.5px; font-weight:700; color:var(--maroon-deep); margin-bottom:2px; }
.ad-recent-loc { font-size:11.5px; color:var(--text-muted); font-weight:300; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ad-recent-right { flex-shrink:0; text-align:right; }
.ad-recent-time { font-family:var(--font-mono); font-size:10.5px; color:var(--text-light); margin-bottom:5px; }
.ad-status-chip { font-size:10px; font-weight:700; letter-spacing:0.5px; padding:3px 8px; border-radius:2px; text-transform:uppercase; }
.ad-status-chip.open     { background:var(--red-bg);   color:var(--red);   border:1px solid rgba(158,58,71,0.22); }
.ad-status-chip.progress { background:var(--amber-bg); color:var(--amber); border:1px solid rgba(160,98,42,0.22); }
.ad-status-chip.resolved { background:var(--green-bg); color:var(--green); border:1px solid rgba(90,138,74,0.22); }

/* ✅ FIX 5: Empty state */
.ad-empty {
  padding:40px 20px; text-align:center;
  font-family:var(--font-serif); font-style:italic; color:var(--text-muted); font-size:14px;
}

@media (max-width:1100px) { .ad-hero{padding:28px 24px 36px;} .ad-body{padding:28px 24px 60px;} .ad-stats{grid-template-columns:repeat(2,1fr);} }
@media (max-width:860px)  { .ad-main-grid{grid-template-columns:1fr;} .ad-hero-panel{display:none;} }
@media (max-width:640px)  { .ad-hero{padding:24px 16px 32px;} .ad-body{padding:20px 16px 60px;} .ad-stats{grid-template-columns:1fr 1fr;} .ad-zones{grid-template-columns:1fr;} }

      `}</style>

      <div className="ad">

        {/* ── HERO ── */}
        <div className="ad-hero">
          <div className="ad-hero-inner">
            <div>
              <div className="ad-eyebrow">
                <div className="ad-eyebrow-rule" />
                Police Command Centre
                <div className="ad-eyebrow-rule" />
              </div>
              <div className="ad-hero-title">
                Admin Dashboard<br /><em>Command &amp; Control</em>
              </div>
              <div className="ad-hero-sub">
                {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
                &nbsp;·&nbsp; Manage cases, verify identities, and oversee all field operations.
              </div>
            </div>
            <div className="ad-hero-panel">
              <div className="ad-panel-head">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                Live System Status
              </div>
              {[
                { label: "Open Cases",       val: activeCount   },
                { label: "Resolved Today",   val: resolvedCount },
                { label: "Officers On Duty", val: 31            },
                { label: "AI Scans Active",  val: 12            },
              ].map(r => (
                <div className="ad-panel-row" key={r.label}>
                  <span>{r.label}</span>
                  <span className="ad-panel-val">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="ad-body">

          {/* Stats */}
          <div className="ad-section-label">Command Statistics</div>
          <div className="ad-stats">
            {stats.map((s, i) => (
              <div className="ad-stat" key={i}>
                <div className="ad-stat-icon">{s.icon}</div>
                <div className="ad-stat-value">{s.value}</div>
                <div className="ad-stat-label">{s.label}</div>
                <div className={`ad-stat-change ${s.up ? "up" : "down"}`}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    {s.up
                      ? <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>
                      : <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>}
                  </svg>
                  {s.change}
                </div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="ad-main-grid">
            <div>
              {/* Actions */}
              <div className="ad-section-label">Quick Actions</div>
              <div className="ad-actions">
                {actions.map((a, i) => (
                  <Link key={i} to={a.to} className="ad-action-card">
                    <div className="ad-action-icon">{a.icon}</div>
                    <div className="ad-action-text">
                      <div className="ad-action-label">{a.label}</div>
                      <div className="ad-action-sub">{a.sub}</div>
                    </div>
                    <div className="ad-action-badge">{a.badge}</div>
                    <div className="ad-action-arrow">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Zone overview */}
              <div className="ad-section-label">Zone Overview</div>
              <div className="ad-zones">
                {zones.map((z, i) => (
                  <div key={i} className={`ad-zone-card ${z.alert ? "alert" : "normal"}`}>
                    {z.alert && <div className="ad-zone-alert-tag">High Alert</div>}
                    <div className="ad-zone-name">{z.label}</div>
                    <div className="ad-zone-stats">
                      <div>
                        <div className="ad-zone-stat-val">{z.cases}</div>
                        <div className="ad-zone-stat-label">Cases</div>
                      </div>
                      <div>
                        <div className="ad-zone-stat-val">{z.officers}</div>
                        <div className="ad-zone-stat-label">Officers</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent panel */}
            <div>
              <div className="ad-section-label">Recent Activity</div>
              <div className="ad-recent-panel">
                <div className="ad-recent-head">
                  <div className="ad-recent-title">Recent Complaints</div>
                  <Link to="/admin/complaints" className="ad-recent-see-all">View All →</Link>
                </div>
                <div className="ad-recent-list">
                  {/* ✅ FIX 5: Empty state guard */}
                  {recentComplaints.length === 0 ? (
                    <div className="ad-empty">No complaints found</div>
                  ) : (
                    recentComplaints.map((r, i) => {
                      const statusClass = r.status === "Completed" ? "resolved" : r.status === "Approved" ? "progress" : "open";
                      const dotColor    = r.status === "Completed" ? "#5a8a4a"  : r.status === "Approved" ? "#a0622a"  : "#9e3a47";
                      return (
                        <div key={i} className="ad-recent-item">
                          {/* ✅ FIX 4: Initials in <span> so they render properly */}
                          <div className="ad-recent-avatar">
                            {r.imageUrl
                              ? <img src={r.imageUrl} alt={r.name} />
                              : <span>{r.name ? r.name.slice(0, 2).toUpperCase() : "NA"}</span>
                            }
                          </div>
                          <div className="ad-recent-dot" style={{ background: dotColor }} />
                          <div className="ad-recent-info">
                            <div className="ad-recent-id">{r.id}</div>
                            <div className="ad-recent-name">{r.name}</div>
                            <div className="ad-recent-loc">{r.location}</div>
                          </div>
                          <div className="ad-recent-right">
                            <div className="ad-recent-time">{r.time}</div>
                            <div className={`ad-status-chip ${statusClass}`}>{r.status}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;