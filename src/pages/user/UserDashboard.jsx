import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserComplaints } from "../../services/complaintService";

const UserDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserComplaints();
        setComplaints(data || []);
      } catch (err) {
        console.error("Failed to fetch user complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const complaintsCount = complaints.length;
  const activeCount = complaints.filter(c => c.status === "Approved" || c.status === "Pending").length;
  const resolvedCount = complaints.filter(c => c.status === "Completed").length;

  const userInitial = user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
  const userName = user?.fullName || user?.email?.split('@')[0] || "User";

  const stats = [
    {
      label: "Total Complaints", value: complaintsCount.toString(), sub: "Lifetime filed",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      accent: "#6b0f1a", accentBg: "rgba(107,15,26,0.08)", border: "rgba(107,15,26,0.18)",
    },
    {
      label: "In Progress", value: activeCount.toString(), sub: "Being reviewed",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      accent: "#b8860b", accentBg: "rgba(184,134,11,0.08)", border: "rgba(184,134,11,0.2)",
    },
    {
      label: "Resolved", value: resolvedCount.toString(), sub: "Successfully closed",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      accent: "#166534", accentBg: "rgba(22,101,52,0.07)", border: "rgba(22,101,52,0.18)",
    },
    {
      label: "Unread Alerts", value: "0", sub: "Require attention",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      accent: "#92400e", accentBg: "rgba(146,64,14,0.07)", border: "rgba(146,64,14,0.18)",
    },
  ];

  const actions = [
    {
      to: "/user/create", label: "File a Missing Person Report",
      sub: "Submit a new case with photos and details", badge: "New Case",
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>),
      accent: "#6b0f1a", accentBorder: "rgba(107,15,26,0.16)",
      iconBg: "#6b0f1a", iconColor: "#d4a017",
      badgeColor: "#6b0f1a", badgeBg: "rgba(107,15,26,0.08)", badgeBorder: "rgba(107,15,26,0.2)",
    },
    {
      to: "/user/complaints", label: "My Complaints",
      sub: "Track the status of your submitted reports", badge: `${complaintsCount} Filed`,
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>),
      accent: "#b8860b", accentBorder: "rgba(184,134,11,0.2)",
      iconBg: "#b8860b", iconColor: "#fff",
      badgeColor: "#b8860b", badgeBg: "rgba(184,134,11,0.1)", badgeBorder: "rgba(184,134,11,0.24)",
    },
    {
      to: "/user/notifications", label: "Notifications & Alerts",
      sub: "View AI match results and case updates", badge: "3 New",
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>),
      accent: "#92400e", accentBorder: "rgba(146,64,14,0.18)",
      iconBg: "#92400e", iconColor: "#fde68a",
      badgeColor: "#92400e", badgeBg: "rgba(146,64,14,0.09)", badgeBorder: "rgba(146,64,14,0.22)",
    },
  ];

  const myComplaints = [
    { id: "MPC-0041", type: "Missing: Ravi Kumar", date: "Feb 19, 2026", status: "In Progress", statusColor: "#b8860b", statusBg: "rgba(184,134,11,0.1)", statusBorder: "rgba(184,134,11,0.22)" },
    { id: "MPC-0038", type: "Missing: Priya Devi", date: "Feb 14, 2026", status: "Resolved", statusColor: "#166534", statusBg: "rgba(22,101,52,0.08)", statusBorder: "rgba(22,101,52,0.2)" },
    { id: "MPC-0031", type: "Missing: Arjun S.", date: "Jan 30, 2026", status: "Resolved", statusColor: "#166534", statusBg: "rgba(22,101,52,0.08)", statusBorder: "rgba(22,101,52,0.2)" },
    { id: "MPC-0029", type: "Missing: Meena R.", date: "Jan 22, 2026", status: "In Progress", statusColor: "#b8860b", statusBg: "rgba(184,134,11,0.1)", statusBorder: "rgba(184,134,11,0.22)" },
  ];

  const notifications = [
    { msg: "AI match found for MPC-0041. Officer Ramesh has been notified.", time: "2 hrs ago", type: "match" },
    { msg: "Case MPC-0038 has been marked Resolved by the department.", time: "Yesterday", type: "resolved" },
    { msg: "Reminder: Provide additional details for MPC-0029.", time: "2 days ago", type: "info" },
  ];

  const notifDotColor = { match: "#d4a017", resolved: "#166534", info: "#6b0f1a" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lato:wght@300;400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --maroon:       #6b0f1a;
          --maroon-deep:  #4a0a12;
          --maroon-light: #f9f0f1;
          --maroon-pale:  #fdf5f6;
          --gold:         #b8860b;
          --gold-light:   #d4a017;
          --gold-pale:    #fdf6e3;
          --text-dark:    #1a0a0c;
          --text-mid:     #3d1a1f;
          --text-muted:   #7a5a5e;
          --border:       #e2c8cb;
          --bg:           #faf7f7;
          --white:        #ffffff;
        }

        /* ── PAGE ROOT — no navbar here ── */
        .ud-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'Lato', sans-serif;
          color: var(--text-dark);
        }

        /* ── PAGE TOPBAR (notification + user only, NO brand) ── */
        .ud-page-topbar {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          position: relative;
        }

        .ud-topbar-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 48px; height: 52px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .ud-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: var(--text-muted); font-weight: 400;
        }

        .ud-breadcrumb a {
          color: var(--gold); font-weight: 700; text-decoration: none;
        }

        .ud-breadcrumb a:hover { color: var(--maroon); }

        .ud-breadcrumb-sep {
          color: var(--border); font-size: 14px;
        }

        .ud-topbar-right {
          display: flex; align-items: center; gap: 10px;
          position: relative;
        }

        /* Notif bell */
        .ud-notif-btn {
          position: relative; width: 36px; height: 36px;
          background: var(--maroon-light);
          border: 1.5px solid var(--border); border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s, border-color 0.2s;
        }

        .ud-notif-btn:hover { background: var(--maroon-pale); border-color: var(--maroon); }

        .ud-notif-pip {
          position: absolute; top: 6px; right: 6px;
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--maroon); border: 1.5px solid var(--white);
          animation: udpulse 2s infinite;
        }

        @keyframes udpulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        /* Notif dropdown */
        .ud-notif-dropdown {
          position: absolute; top: 44px; right: 0;
          width: 360px;
          background: var(--white);
          border: 1px solid var(--border);
          border-top: 3px solid var(--maroon);
          border-radius: 3px;
          box-shadow: 0 16px 48px rgba(107,15,26,0.14);
          z-index: 500; overflow: hidden;
          animation: udDropFade 0.18s ease;
        }

        @keyframes udDropFade { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }

        .nd-hdr {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 18px 11px;
          border-bottom: 1px solid var(--border);
          background: var(--maroon-pale);
        }

        .nd-hdr h4 {
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-weight: 700; color: var(--maroon-deep);
        }

        .nd-mark {
          font-size: 11px; font-weight: 700; color: var(--gold);
          cursor: pointer; background: none; border: none;
          font-family: 'Lato', sans-serif;
        }

        .nd-item {
          display: flex; gap: 12px; padding: 12px 18px;
          border-bottom: 1px solid rgba(226,200,203,0.35);
          transition: background 0.15s;
        }

        .nd-item:last-child { border-bottom: none; }
        .nd-item:hover { background: var(--maroon-pale); }

        .nd-dot { width: 7px; height: 7px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }

        .nd-msg { font-size: 12.5px; color: var(--text-mid); line-height: 1.55; margin-bottom: 3px; }

        .nd-time { font-size: 11px; color: var(--text-muted); font-weight: 700; }

        /* User chip */
        .ud-user-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 11px;
          background: var(--maroon-pale);
          border: 1px solid var(--border); border-radius: 3px;
        }

        .ud-user-av {
          width: 26px; height: 26px; border-radius: 2px;
          background: var(--maroon); border: 1.5px solid var(--gold);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 12px; font-weight: 800; color: var(--gold-light);
          flex-shrink: 0;
        }

        .ud-user-name { font-size: 11.5px; font-weight: 700; color: var(--text-mid); line-height: 1.1; }
        .ud-user-role { font-size: 9.5px; color: var(--gold); font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; }

        /* ── BODY ── */
        .ud-body {
          max-width: 1200px; margin: 0 auto;
          padding: 36px 48px 72px;
        }

        /* Page header */
        .ud-page-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 30px; gap: 20px; flex-wrap: wrap;
        }

        .ud-eyebrow {
          display: flex; align-items: center; gap: 8px;
          font-size: 10.5px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--gold); margin-bottom: 8px;
        }

        .eyebrow-line { width: 20px; height: 2px; background: var(--gold); }

        .ud-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 30px; font-weight: 800;
          color: var(--maroon-deep); letter-spacing: -0.5px; margin-bottom: 5px;
        }

        .ud-page-sub { font-size: 14px; color: var(--text-muted); font-weight: 300; }

        .ud-file-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px;
          background: var(--maroon); border: 2px solid var(--maroon);
          border-radius: 3px; font-family: 'Lato', sans-serif;
          font-size: 14px; font-weight: 700; color: white;
          text-decoration: none;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
          white-space: nowrap; flex-shrink: 0;
          position: relative; overflow: hidden;
        }

        .ud-file-btn::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212,160,23,0.2), transparent);
          transition: left 0.5s;
        }

        .ud-file-btn:hover { background: var(--maroon-deep); box-shadow: 0 4px 16px rgba(107,15,26,0.28); transform: translateY(-1px); }
        .ud-file-btn:hover::after { left: 150%; }

        /* ── STATS ── */
        .ud-stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--border); margin-bottom: 30px;
          background: var(--border); gap: 1px;
        }

        .ud-stat-card {
          background: var(--white);
          padding: 22px 20px 18px;
          position: relative; overflow: hidden;
          transition: background 0.2s;
        }

        .ud-stat-card:hover { background: var(--maroon-pale); }

        /* coloured top bar per card — using a real div, not ::before */
        .ud-stat-top-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 4px;
        }

        .ud-stat-icon-row {
          margin-top: 10px; margin-bottom: 14px;
        }

        .ud-stat-icon-box {
          width: 40px; height: 40px; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid;
        }

        .ud-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 38px; font-weight: 800;
          letter-spacing: -2px; line-height: 1;
          margin-bottom: 5px;
        }

        .ud-stat-label { font-size: 12px; font-weight: 700; color: var(--text-muted); margin-bottom: 3px; }
        .ud-stat-sub   { font-size: 11px; color: var(--text-muted); font-weight: 300; opacity: 0.65; }

        /* ── MAIN 2-COL GRID ── */
        .ud-main-grid {
          display: grid; grid-template-columns: 1fr 352px; gap: 24px;
        }

        .ud-section-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 10.5px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--text-muted);
          margin-bottom: 14px;
        }

        .ud-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        /* ── ACTIONS ── */
        .ud-actions-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 26px; }

        .ud-action-card {
          display: flex; align-items: center; gap: 16px;
          padding: 17px 20px;
          background: var(--white);
          border: 1px solid; border-radius: 3px;
          text-decoration: none;
          position: relative; overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
        }

        .ud-action-left-bar {
          position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
          transition: width 0.2s;
        }

        .ud-action-card:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(107,15,26,0.1); background: var(--maroon-pale); }
        .ud-action-card:hover .ud-action-left-bar { width: 6px; }

        .ud-action-icon {
          width: 44px; height: 44px; border-radius: 3px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .ud-action-text { flex: 1; }
        .ud-action-label { font-size: 14px; font-weight: 700; color: var(--text-dark); margin-bottom: 3px; }
        .ud-action-sub { font-size: 12.5px; color: var(--text-muted); font-weight: 300; }

        .ud-action-badge {
          font-size: 10.5px; font-weight: 700;
          padding: 4px 10px; border-radius: 2px;
          white-space: nowrap; letter-spacing: 0.3px; border: 1px solid;
        }

        .ud-action-arrow { color: var(--border); flex-shrink: 0; transition: color 0.2s, transform 0.2s; }
        .ud-action-card:hover .ud-action-arrow { color: var(--maroon); transform: translateX(3px); }

        /* ── TIP ── */
        .ud-tip {
          background: var(--gold-pale);
          border: 1px solid rgba(184,134,11,0.2);
          border-left: 4px solid var(--gold);
          border-radius: 3px; padding: 16px 18px;
          display: flex; gap: 14px; align-items: flex-start;
        }

        .ud-tip-icon {
          width: 34px; height: 34px; border-radius: 3px;
          background: rgba(184,134,11,0.1); border: 1px solid rgba(184,134,11,0.22);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold); flex-shrink: 0;
        }

        .ud-tip-title { font-size: 13px; font-weight: 700; color: var(--text-dark); margin-bottom: 4px; }
        .ud-tip-body  { font-size: 12.5px; color: var(--text-muted); line-height: 1.65; font-weight: 300; }

        /* ── RIGHT PANEL — Complaints ── */
        .ud-right-col { display: flex; flex-direction: column; gap: 20px; }

        .ud-panel {
          background: var(--white);
          border: 1px solid var(--border);
          border-top: 3px solid var(--maroon);
          border-radius: 3px; overflow: hidden;
        }

        .ud-panel-hdr {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          background: var(--maroon-pale);
          border-bottom: 1px solid var(--border);
        }

        .ud-panel-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 700; color: var(--maroon-deep);
        }

        .ud-see-all {
          font-size: 12px; font-weight: 700; color: var(--gold);
          text-decoration: none; transition: color 0.2s;
        }

        .ud-see-all:hover { color: var(--maroon); }

        .ud-c-item {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 18px;
          border-bottom: 1px solid rgba(226,200,203,0.35);
          transition: background 0.15s;
        }

        .ud-c-item:last-child { border-bottom: none; }
        .ud-c-item:hover { background: var(--maroon-pale); }

        .ud-c-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

        .ud-c-left { flex: 1; min-width: 0; }
        .ud-c-id   { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 2px; }
        .ud-c-type { font-size: 13px; font-weight: 700; color: var(--text-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
        .ud-c-date { font-size: 11px; color: var(--text-muted); font-weight: 300; }

        .ud-status {
          font-size: 10.5px; font-weight: 700;
          padding: 4px 9px; border-radius: 2px;
          white-space: nowrap; border: 1px solid; letter-spacing: 0.3px;
        }

        /* System Overview */
        .ud-qs-hdr {
          padding: 14px 18px;
          background: var(--maroon-pale);
          border-bottom: 1px solid var(--border);
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 700; color: var(--maroon-deep);
        }

        .ud-qs-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 18px;
          border-bottom: 1px solid rgba(226,200,203,0.35);
        }

        .ud-qs-row:last-child { border-bottom: none; }
        .ud-qs-row:hover { background: var(--maroon-pale); }

        .ud-qs-lbl { font-size: 12.5px; color: var(--text-muted); }

        .ud-qs-val {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 800; color: var(--maroon);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .ud-stats-grid  { grid-template-columns: repeat(2, 1fr); }
          .ud-main-grid   { grid-template-columns: 1fr; }
          .ud-topbar-inner{ padding: 0 20px; }
          .ud-body        { padding: 24px 20px 56px; }
          .ud-page-header { flex-direction: column; }
        }
      `}</style>

      {/*
        ╔══════════════════════════════════════════════════════╗
        ║  NO gov-band or navbar here.                        ║
        ║  The global <Navbar> (Navbar.jsx) renders those.    ║
        ║  App.jsx should render <Navbar /> then <UserDashboard /> ║
        ╚══════════════════════════════════════════════════════╝
      */}

      <div className="ud-root">

        {/* ── SLIM PAGE TOPBAR (breadcrumb + notif + user only) ── */}
        <div className="ud-page-topbar">
          <div className="ud-topbar-inner">

            {/* Breadcrumb */}
            <div className="ud-breadcrumb">
              <Link to="/">Home</Link>
              <span className="ud-breadcrumb-sep">›</span>
              <span>My Dashboard</span>
            </div>

            {/* Right: notif + user chip */}
            <div className="ud-topbar-right">
              <div className="ud-notif-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={notifOpen ? "#6b0f1a" : "#7a5a5e"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="ud-notif-pip" />
              </div>

              {notifOpen && (
                <div className="ud-notif-dropdown">
                  <div className="nd-hdr">
                    <h4>Notifications</h4>
                    <button className="nd-mark">Mark all read</button>
                  </div>
                  {notifications.map((n, i) => (
                    <div className="nd-item" key={i}>
                      <div className="nd-dot" style={{ background: notifDotColor[n.type] }} />
                      <div>
                        <div className="nd-msg">{n.msg}</div>
                        <div className="nd-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="ud-user-chip">
                <div className="ud-user-av">{userInitial}</div>
                <div>
                  <div className="ud-user-name">{userName}</div>
                  <div className="ud-user-role">Citizen</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN BODY ── */}
        <div className="ud-body">

          {/* Page Header */}
          <div className="ud-page-header">
            <div>
              <div className="ud-eyebrow">
                <div className="eyebrow-line" />
                Citizen Portal
              </div>
              <div className="ud-page-title">My Dashboard</div>
              <div className="ud-page-sub">Track your missing person complaints and case updates in real time</div>
            </div>
            <Link to="/user/create" className="ud-file-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              File a New Report
            </Link>
          </div>

          {/* Stats */}
          <div className="ud-stats-grid">
            {stats.map((s, i) => (
              <div className="ud-stat-card" key={i}>
                {/* coloured top bar */}
                <div className="ud-stat-top-bar" style={{ background: s.accent }} />
                <div className="ud-stat-icon-row">
                  <div className="ud-stat-icon-box" style={{ background: s.accentBg, color: s.accent, borderColor: s.border }}>
                    {s.icon}
                  </div>
                </div>
                <div className="ud-stat-num" style={{ color: s.accent }}>{s.value}</div>
                <div className="ud-stat-label">{s.label}</div>
                <div className="ud-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Main 2-col grid */}
          <div className="ud-main-grid">

            {/* LEFT */}
            <div>
              <div className="ud-section-label">Quick Actions</div>
              <div className="ud-actions-list">
                {actions.map((a, i) => (
                  <Link key={i} to={a.to} className="ud-action-card" style={{ borderColor: a.accentBorder }}>
                    <div className="ud-action-left-bar" style={{ background: a.accent }} />
                    <div className="ud-action-icon" style={{ background: a.iconBg, color: a.iconColor }}>
                      {a.icon}
                    </div>
                    <div className="ud-action-text">
                      <div className="ud-action-label">{a.label}</div>
                      <div className="ud-action-sub">{a.sub}</div>
                    </div>
                    <span className="ud-action-badge" style={{ color: a.badgeColor, background: a.badgeBg, borderColor: a.badgeBorder }}>
                      {a.badge}
                    </span>
                    <span className="ud-action-arrow">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>

              <div className="ud-section-label">Important Notice</div>
              <div className="ud-tip">
                <div className="ud-tip-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <div className="ud-tip-title">Keep your complaint reference ID safe</div>
                  <div className="ud-tip-body">Always note your case ID after filing. You can use it to follow up with your local station or track AI match progress directly here on your dashboard.</div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="ud-right-col">

              {/* Recent complaints panel */}
              <div className="ud-panel">
                <div className="ud-panel-hdr">
                  <div className="ud-panel-title">Recent Complaints</div>
                  <Link to="/user/complaints" className="ud-see-all">View all →</Link>
                </div>
                {complaints.slice(0, 4).map((c, i) => {
                  const statusColors = {
                    Pending: { color: "#b8860b", bg: "rgba(184,134,11,0.1)", border: "rgba(184,134,11,0.22)" },
                    Approved: { color: "#166534", bg: "rgba(22,101,52,0.08)", border: "rgba(22,101,52,0.2)" },
                    Completed: { color: "#166534", bg: "rgba(22,101,52,0.08)", border: "rgba(22,101,52,0.2)" },
                  };
                  const cfg = statusColors[c.status] || statusColors.Pending;
                  return (
                    <div className="ud-c-item" key={i}>
                      <div className="ud-c-dot" style={{ background: cfg.color }} />
                      <div className="ud-c-left">
                        <div className="ud-c-id">MPC-{c._id.slice(-4).toUpperCase()}</div>
                        <div className="ud-c-type">Missing: {c.name}</div>
                        <div className="ud-c-date">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </div>
                      <span className="ud-status" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
                        {c.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* System overview */}
              <div className="ud-panel">
                <div className="ud-qs-hdr">System Overview</div>
                {[
                  { lbl: "National Cases Resolved", val: "2,400+" },
                  { lbl: "AI Match Accuracy", val: "97%" },
                  { lbl: "Stations Connected", val: "180+" },
                  { lbl: "Active Cases Nationwide", val: "312" },
                ].map((q, i) => (
                  <div className="ud-qs-row" key={i}>
                    <span className="ud-qs-lbl">{q.lbl}</span>
                    <span className="ud-qs-val">{q.val}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;