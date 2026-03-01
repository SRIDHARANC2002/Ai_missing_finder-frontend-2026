import { useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "approved", title: "Complaint Approved", message: "Your complaint CMP-0041 has been reviewed and approved by the duty officer. Investigation will commence within 24 hours.", complaint: "CMP-0041", time: "2 hours ago", date: "Feb 21, 2026", read: false },
    { id: 2, type: "match", title: "AI Match Detected", message: "A potential facial recognition match has been found for CMP-0038 — Priya Sharma. Confidence score: 94.7%. An officer will contact you shortly.", complaint: "CMP-0038", time: "Yesterday", date: "Feb 20, 2026", read: false },
    { id: 3, type: "update", title: "Officer Assigned", message: "Officer Ramesh K. (Badge #IN-4821) has been assigned to your case CMP-0041 and will begin field investigation within 12 hours.", complaint: "CMP-0041", time: "2 days ago", date: "Feb 19, 2026", read: false },
    { id: 4, type: "resolved", title: "Case Successfully Resolved", message: "Your complaint CMP-0031 for Suresh Babu has been successfully resolved and closed. Thank you for your cooperation.", complaint: "CMP-0031", time: "3 days ago", date: "Feb 18, 2026", read: true },
    { id: 5, type: "info", title: "Additional Documents Required", message: "Please provide additional photographs or identity documents for CMP-0029 to assist the ongoing investigation.", complaint: "CMP-0029", time: "5 days ago", date: "Feb 16, 2026", read: true },
  ]);

  const [filter, setFilter] = useState("all");
  const [hoveredId, setHoveredId] = useState(null);
  const [dismissing, setDismissing] = useState(null);

  const typeConfig = {
    approved: { color: "#c9922a", bg: "rgba(201,146,42,0.1)", border: "rgba(201,146,42,0.28)", glow: "0 0 20px rgba(201,146,42,0.18)", label: "Approved", barColor: "linear-gradient(180deg,#d4a017,#c9922a)", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    match:    { color: "#9e3a47", bg: "rgba(158,58,71,0.1)",  border: "rgba(158,58,71,0.28)",  glow: "0 0 20px rgba(158,58,71,0.2)",  label: "AI Match",      barColor: "linear-gradient(180deg,#b8404f,#7a1422)", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
    update:   { color: "#b8860b", bg: "rgba(184,134,11,0.1)", border: "rgba(184,134,11,0.28)", glow: "0 0 20px rgba(184,134,11,0.18)", label: "Update",        barColor: "linear-gradient(180deg,#d4a017,#b8860b)", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    resolved: { color: "#5a8a4a", bg: "rgba(90,138,74,0.1)",  border: "rgba(90,138,74,0.25)",  glow: "0 0 20px rgba(90,138,74,0.15)",  label: "Resolved",      barColor: "linear-gradient(180deg,#6aaa58,#5a8a4a)", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    info:     { color: "#a0622a", bg: "rgba(160,98,42,0.1)",  border: "rgba(160,98,42,0.25)",  glow: "0 0 20px rgba(160,98,42,0.15)",  label: "Action Needed", barColor: "linear-gradient(180deg,#c8954a,#a0622a)", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  };

  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })));
  const markRead    = (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss     = (id) => {
    setDismissing(id);
    setTimeout(() => { setNotifications(p => p.filter(n => n.id !== id)); setDismissing(null); }, 300);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filterTabs = [
    { key: "all",      label: "All",            count: notifications.length },
    { key: "unread",   label: "Unread",         count: unreadCount },
    { key: "match",    label: "AI Match",       count: notifications.filter(n => n.type === "match").length },
    { key: "approved", label: "Approved",       count: notifications.filter(n => n.type === "approved").length },
    { key: "update",   label: "Updates",        count: notifications.filter(n => n.type === "update").length },
    { key: "resolved", label: "Resolved",       count: notifications.filter(n => n.type === "resolved").length },
    { key: "info",     label: "Action Needed",  count: notifications.filter(n => n.type === "info").length },
  ];

  const filtered = notifications.filter(n => {
    if (filter === "all")    return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const grouped = filtered.reduce((acc, n) => {
    if (!acc[n.date]) acc[n.date] = [];
    acc[n.date].push(n);
    return acc;
  }, {});

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lato:wght@300;400;700;900&family=Inconsolata:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --M: #6b0f1a; --MD: #3e0810; --ML: #f8eef0; --MP: #fdf4f5;
          --G: #b8860b; --GL: #d4a017; --GB: #e8b84b; --GP: #fdf8ec;
          --TD: #1c0a0d; --TT: #7a5a60;
          --BD: #ddc8cc; --W: #fff; --S: #faf6f7; --S2: #f4edef;
        }

        .nr {
          background: var(--S);
          font-family: 'Lato', sans-serif;
          min-height: 100vh;
          color: var(--TD);
        }

        /* ── PAGE HEADER ── */
        .ph {
          background: var(--W);
          border-bottom: 1px solid var(--BD);
          position: sticky; top: 0; z-index: 100;
        }
        .ph::before {
          content: ''; display: block; height: 3px;
          background: linear-gradient(90deg, var(--MD), var(--GL), var(--MD));
        }
        .ph-inner {
          max-width: 900px; margin: 0 auto;
          padding: 20px 40px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
        }
        .ph-eyebrow {
          font-size: 10px; font-weight: 700; letter-spacing: 1.8px;
          text-transform: uppercase; color: var(--GL); margin-bottom: 4px;
        }
        .ph-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px; font-weight: 800; color: var(--MD);
          letter-spacing: -0.4px; display: flex; align-items: center; gap: 12px;
        }
        .upill {
          font-family: 'Lato', sans-serif; font-size: 11px; font-weight: 900;
          padding: 3px 12px; border-radius: 99px; letter-spacing: 0.3px;
          background: var(--MD); color: var(--GB);
          border: 1px solid rgba(212,160,23,0.5);
          animation: pop .3s cubic-bezier(.175,.885,.32,1.275) both;
        }
        @keyframes pop { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        .ph-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .count-info { font-family: 'Inconsolata', monospace; font-size: 12px; color: var(--TT); }
        .mark-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 20px; border-radius: 2px;
          background: var(--GP); color: var(--MD);
          border: 1.5px solid var(--G); font-family: 'Lato', sans-serif;
          font-size: 12.5px; font-weight: 700; cursor: pointer; letter-spacing: 0.3px;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .mark-btn:hover { background: var(--GL); box-shadow: 0 4px 16px rgba(184,134,11,0.2); }

        /* ── FILTER TABS ── */
        .filter-row {
          background: var(--W);
          border-bottom: 1px solid var(--BD);
        }
        .filter-inner {
          max-width: 900px; margin: 0 auto;
          padding: 0 40px;
          display: flex; gap: 0; overflow-x: auto;
        }
        .filter-inner::-webkit-scrollbar { display: none; }
        .ftab {
          padding: 13px 18px;
          font-family: 'Lato', sans-serif; font-size: 13px; font-weight: 700;
          color: var(--TT); border: none; background: transparent;
          cursor: pointer; white-space: nowrap; letter-spacing: 0.2px;
          border-bottom: 3px solid transparent;
          transition: color 0.18s, border-color 0.18s;
          display: flex; align-items: center; gap: 7px;
        }
        .ftab:hover { color: var(--MD); }
        .ftab.active { color: var(--MD); border-bottom-color: var(--GL); }
        .ftab-count {
          font-size: 10.5px; font-weight: 700;
          padding: 2px 7px; border-radius: 99px;
          background: var(--S2); color: var(--TT);
          font-family: 'Inconsolata', monospace;
          transition: background 0.18s, color 0.18s;
        }
        .ftab.active .ftab-count { background: rgba(212,160,23,0.15); color: var(--GL); }

        /* ── BODY ── */
        .body {
          max-width: 900px; margin: 0 auto;
          padding: 36px 40px 80px;
        }

        /* Date group */
        .dg { margin-bottom: 32px; }
        .dl { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
        .dl::before, .dl::after { content: ''; flex: 1; height: 1px; background: var(--BD); }
        .dl span {
          font-family: 'Inconsolata', monospace; font-size: 10.5px; font-weight: 600;
          letter-spacing: 1.2px; text-transform: uppercase; color: var(--TT);
          background: var(--S); padding: 4px 12px;
          border: 1px solid var(--BD); border-radius: 2px; white-space: nowrap;
        }

        /* Notification card */
        .nc {
          display: flex; overflow: hidden;
          background: var(--W); border: 1px solid var(--BD);
          border-radius: 4px; margin-bottom: 10px;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.18s, opacity 0.3s;
          animation: ci 0.28s ease both;
        }
        @keyframes ci { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .nc.unread {
          background: linear-gradient(to right, #fffdf6 0%, var(--W) 55%);
          border-color: rgba(212,160,23,0.22);
        }
        .nc:hover {
          border-color: rgba(107,15,26,0.22);
          box-shadow: 0 8px 32px rgba(107,15,26,0.08), 0 2px 8px rgba(107,15,26,0.04);
          transform: translateY(-2px);
        }
        .nc.unread:hover { border-color: rgba(212,160,23,0.42); }
        .nc.out { opacity: 0; transform: translateX(16px) scale(0.98); }

        /* Left bar */
        .bar { width: 5px; flex-shrink: 0; transition: width 0.2s; }
        .nc:hover .bar { width: 6px; }

        /* Icon zone */
        .iz { padding: 22px 16px 22px 20px; display: flex; align-items: flex-start; flex-shrink: 0; }
        .ic {
          width: 46px; height: 46px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; position: relative;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .nc:hover .ic { transform: scale(1.06); }
        .udot {
          position: absolute; top: -4px; right: -4px;
          width: 12px; height: 12px; border-radius: 50%;
          border: 2.5px solid var(--W);
          animation: dp 2.5s infinite;
        }
        .nc.unread .udot { border-color: #fffdf6; }
        @keyframes dp { 0%,100%{box-shadow:0 0 0 0 rgba(212,160,23,0.5)} 50%{box-shadow:0 0 0 5px rgba(212,160,23,0)} }

        /* Card body */
        .cb { flex: 1; padding: 20px 22px 18px 0; min-width: 0; }
        .ct { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
        .ct-left { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .ctitle { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--MD); letter-spacing: -0.2px; }
        .chip { font-size: 9.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 3px 9px; border-radius: 2px; }
        .ct-right { flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .ctime { font-family: 'Inconsolata', monospace; font-size: 11.5px; color: var(--TT); white-space: nowrap; }
        .ntag { font-size: 9px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 8px; border-radius: 2px; background: var(--MD); color: var(--GB); border: 1px solid rgba(212,160,23,0.45); }
        .cmsg { font-size: 13.5px; color: var(--TT); line-height: 1.72; font-weight: 300; margin-bottom: 16px; }
        .cf { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .ctag {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'Inconsolata', monospace; font-size: 12px; font-weight: 600;
          color: var(--TT); background: var(--MP); border: 1px solid var(--BD);
          padding: 5px 13px; border-radius: 3px; letter-spacing: 0.5px;
          transition: border-color 0.2s, color 0.2s;
        }
        .nc:hover .ctag { border-color: rgba(107,15,26,0.2); color: var(--M); }
        .cas { display: flex; gap: 8px; }
        .abtn { padding: 7px 16px; border-radius: 2px; font-family: 'Lato', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; letter-spacing: 0.3px; transition: all 0.18s; border: 1.5px solid; }
        .abtn-r { background: var(--GP); color: var(--MD); border-color: rgba(184,134,11,0.4); }
        .abtn-r:hover { background: var(--GL); border-color: var(--G); box-shadow: 0 3px 12px rgba(184,134,11,0.2); }
        .abtn-d { background: var(--W); color: var(--TT); border-color: var(--BD); }
        .abtn-d:hover { background: var(--ML); color: var(--M); border-color: rgba(107,15,26,0.3); }

        /* Empty state */
        .empty { text-align: center; padding: 96px 32px; border: 1.5px dashed var(--BD); border-radius: 4px; background: var(--W); }
        .ei { width: 72px; height: 72px; border-radius: 4px; background: var(--MP); border: 1px solid var(--BD); display: flex; align-items: center; justify-content: center; margin: 0 auto 22px; color: var(--TT); }
        .et { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--MD); margin-bottom: 8px; }
        .es { font-size: 14px; color: var(--TT); font-weight: 300; }

        @media (max-width: 640px) {
          .ph-inner, .filter-inner, .body { padding-left: 16px; padding-right: 16px; }
          .ph-title { font-size: 20px; }
        }
      `}</style>

      <div className="nr">

        {/* PAGE HEADER */}
        <div className="ph">
          <div className="ph-inner">
            <div>
              <div className="ph-eyebrow">Case Activity Centre</div>
              <div className="ph-title">
                Notifications
                {unreadCount > 0 && <span className="upill">{unreadCount} New</span>}
              </div>
            </div>
            <div className="ph-right">
              <span className="count-info">{filtered.length} of {notifications.length} shown</span>
              {unreadCount > 0 && (
                <button className="mark-btn" onClick={markAllRead}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Mark all read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="filter-row">
          <div className="filter-inner">
            {filterTabs.map(f => (
              <button
                key={f.key}
                className={`ftab ${filter === f.key ? "active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className="ftab-count">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="body">
          {filtered.length === 0 ? (
            <div className="empty">
              <div className="ei">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <div className="et">All caught up</div>
              <div className="es">No notifications match the selected filter.</div>
            </div>
          ) : (
            Object.entries(grouped).map(([date, notes]) => (
              <div className="dg" key={date}>
                <div className="dl"><span>{date}</span></div>
                {notes.map((note, i) => {
                  const cfg = typeConfig[note.type];
                  return (
                    <div
                      key={note.id}
                      className={`nc ${!note.read ? "unread" : ""} ${dismissing === note.id ? "out" : ""}`}
                      style={{ animationDelay: `${i * 0.05}s` }}
                      onMouseEnter={() => setHoveredId(note.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div className="bar" style={{ background: !note.read ? cfg.barColor : "transparent" }} />
                      <div className="iz">
                        <div className="ic" style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, color: cfg.color, boxShadow: hoveredId === note.id ? cfg.glow : "none" }}>
                          {cfg.icon}
                          {!note.read && <div className="udot" style={{ background: cfg.color }} />}
                        </div>
                      </div>
                      <div className="cb">
                        <div className="ct">
                          <div className="ct-left">
                            <div className="ctitle">{note.title}</div>
                            <span className="chip" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                          </div>
                          <div className="ct-right">
                            <span className="ctime">{note.time}</span>
                            {!note.read && <span className="ntag">New</span>}
                          </div>
                        </div>
                        <div className="cmsg">{note.message}</div>
                        <div className="cf">
                          <div className="ctag">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                            </svg>
                            {note.complaint}
                          </div>
                          <div className="cas">
                            {!note.read && <button className="abtn abtn-r" onClick={() => markRead(note.id)}>Mark as Read</button>}
                            <button className="abtn abtn-d" onClick={() => dismiss(note.id)}>Dismiss</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;