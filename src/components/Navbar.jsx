import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const isActive = (path) => location.pathname.startsWith(path);

  const getInitials = (user) => {
    if (user?.fullName) {
      const parts = user.fullName.split(" ");
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return user.fullName.slice(0, 2).toUpperCase();
    }
    if (user?.stationName) return user.stationName.slice(0, 2).toUpperCase();
    const email = user?.email || "";
    const name = email.split("@")[0];
    const parts = name.split(/[._\-]/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getDisplayName = (user) => {
    if (user?.fullName) return user.fullName;
    if (user?.stationName) return user.stationName;
    const email = user?.email || "";
    return email
      .split("@")[0]
      .replace(/[._\-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;700&family=Inconsolata:wght@500;600&display=swap');

        :root {
          --maroon:      #6b0f1a;
          --maroon-deep: #4a0a12;
          --maroon-light:#f9f0f1;
          --maroon-pale: #fdf5f6;
          --gold:        #b8860b;
          --gold-light:  #d4a017;
          --gold-bright: #e8b84b;
          --gold-pale:   #fdf6e3;
          --text-mid:    #3d1a1f;
          --text-muted:  #7a5a5e;
          --border:      #e2c8cb;
          --white:       #ffffff;
        }

        /* ─────────────────────────────────────
           GOV BAND
        ───────────────────────────────────── */
        .nb-gov-band {
          background: var(--maroon-deep);
          border-bottom: 1.5px solid var(--gold);
          padding: 6px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-family: 'Lato', sans-serif;
        }

        .nb-gov-left {
          display: flex; align-items: center; gap: 14px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.8px; text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }

        .nb-gov-sep { width: 1px; height: 12px; background: rgba(255,255,255,0.18); }

        .nb-gov-sub {
          font-weight: 400; letter-spacing: 0.3px;
          text-transform: none; color: rgba(255,255,255,0.45); font-size: 11px;
        }

        .nb-gov-right {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: rgba(255,255,255,0.4);
          font-family: 'Lato', sans-serif;
        }

        .nb-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #fbbf24; animation: nbpulse 2s infinite;
        }

        @keyframes nbpulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        /* ─────────────────────────────────────
           MAIN NAVBAR
        ───────────────────────────────────── */
        .nb-main {
          background: var(--white);
          border-bottom: 3px solid var(--maroon);
          font-family: 'Lato', sans-serif;
          position: relative;
          box-shadow: 0 2px 12px rgba(107,15,26,0.07);
        }

        .nb-main::before {
          content: '';
          position: absolute;
          top: -3px; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--maroon), var(--gold), var(--maroon));
        }

        .nb-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 48px; height: 70px;
          display: flex; align-items: center; justify-content: space-between;
        }

        /* ── Brand ── */
        .nb-brand {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none; flex-shrink: 0;
        }

        .nb-logo {
          width: 42px; height: 42px;
          background: var(--maroon);
          border: 2px solid var(--gold);
          border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: background 0.2s;
        }

        .nb-brand:hover .nb-logo { background: var(--maroon-deep); }

        .nb-brand-title {
          font-family: 'Playfair Display', serif;
          font-size: 19px; font-weight: 800;
          color: var(--maroon); line-height: 1.1; letter-spacing: -0.3px;
        }

        .nb-brand-sub {
          font-size: 9.5px; color: var(--gold);
          letter-spacing: 1.2px; text-transform: uppercase; font-weight: 700;
        }

        /* ── Desktop links ── */
        .nb-links {
          display: flex; align-items: center; gap: 2px;
        }

        .nb-link {
          padding: 8px 16px; border-radius: 2px;
          font-size: 13.5px; font-weight: 700;
          color: var(--text-muted); text-decoration: none;
          transition: color 0.2s, background 0.2s;
          letter-spacing: 0.1px; position: relative;
        }

        .nb-link:hover { color: var(--maroon); background: var(--maroon-light); }
        .nb-link.active { color: var(--maroon); background: var(--maroon-light); }

        .nb-link.active::after {
          content: '';
          position: absolute; bottom: -2px; left: 16px; right: 16px;
          height: 2px; background: var(--maroon); border-radius: 1px;
        }

        .nb-divider { width: 1px; height: 22px; background: var(--border); margin: 0 8px; }

        /* ── Guest buttons ── */
        .nb-signin {
          padding: 8px 18px;
          font-size: 13.5px; font-weight: 700;
          color: var(--maroon); text-decoration: none;
          border: 1.5px solid var(--maroon); border-radius: 2px;
          transition: background 0.2s, color 0.2s;
          font-family: 'Lato', sans-serif;
        }

        .nb-signin:hover { background: var(--maroon); color: white; }

        .nb-register {
          padding: 8px 20px; margin-left: 8px;
          font-size: 13.5px; font-weight: 700;
          color: var(--maroon-deep); text-decoration: none;
          background: var(--gold-light);
          border: 1.5px solid var(--gold); border-radius: 2px;
          transition: background 0.2s, box-shadow 0.2s;
          font-family: 'Lato', sans-serif;
        }

        .nb-register:hover { background: var(--gold); box-shadow: 0 3px 12px rgba(184,134,11,0.3); }

        /* ── Profile Pill ── */
        .nb-profile-pill {
          display: flex; align-items: center;
          border: 1.5px solid var(--border);
          border-radius: 3px; overflow: hidden;
          background: var(--maroon-pale);
          margin-right: 6px;
          transition: border-color 0.2s;
        }

        .nb-profile-pill:hover { border-color: rgba(107,15,26,0.28); }

        .nb-avatar {
          width: 44px; height: 44px;
          background: var(--maroon);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-weight: 800;
          color: var(--gold-bright);
          border-right: 1.5px solid var(--border);
          flex-shrink: 0; letter-spacing: 0.5px;
        }

        .nb-profile-info { padding: 0 12px; }

        .nb-profile-name {
          font-size: 13px; font-weight: 700;
          color: var(--text-mid); white-space: nowrap; line-height: 1.2;
        }

        .nb-profile-role {
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          color: var(--gold);
        }

        /* ── Dashboard button ── */
        .nb-dashboard {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 18px;
          font-size: 13.5px; font-weight: 700;
          color: var(--maroon-deep); text-decoration: none;
          background: var(--maroon-light);
          border: 1.5px solid var(--border); border-radius: 2px;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          font-family: 'Lato', sans-serif;
          white-space: nowrap;
        }

        .nb-dashboard:hover,
        .nb-dashboard.active-dash {
          background: var(--maroon); color: white; border-color: var(--maroon);
        }

        .nb-dashboard:hover svg,
        .nb-dashboard.active-dash svg { stroke: white; }

        /* ── Logout button ── */
        .nb-logout {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 18px; margin-left: 8px;
          font-size: 13.5px; font-weight: 700;
          color: var(--maroon); background: transparent;
          border: 1.5px solid var(--border); border-radius: 2px;
          cursor: pointer; font-family: 'Lato', sans-serif;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }

        .nb-logout:hover {
          background: var(--maroon-light);
          border-color: var(--maroon);
          color: var(--maroon-deep);
        }

        /* ── Live Clock ── */
        .nb-clock {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 14px; margin-left: 8px;
          border: 1.5px solid var(--border);
          border-radius: 2px;
          background: var(--maroon-pale);
          white-space: nowrap;
        }

        .nb-clock-time {
          font-family: 'Inconsolata', monospace;
          font-size: 13.5px; font-weight: 600;
          color: var(--maroon-deep);
          letter-spacing: 0.5px;
          line-height: 1;
        }

        .nb-clock-ampm {
          font-family: 'Lato', sans-serif;
          font-size: 9px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          color: var(--gold);
        }

        /* ── Hamburger ── */
        .nb-hamburger {
          display: none;
          flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer;
          padding: 8px; border-radius: 3px;
          transition: background 0.2s;
        }

        .nb-hamburger:hover { background: var(--maroon-light); }

        .nb-hamburger span {
          display: block; width: 22px; height: 2px;
          background: var(--maroon); border-radius: 1px;
          transition: transform 0.25s ease, opacity 0.25s ease;
          transform-origin: center;
        }

        /* ─────────────────────────────────────
           MOBILE MENU  (full rewrite)
        ───────────────────────────────────── */
        .nb-mobile-menu {
          display: none;
          background: var(--white);
          border-top: 2px solid var(--border);
          border-bottom: 3px solid var(--maroon);
          padding: 16px 20px 24px;
          flex-direction: column;
          gap: 6px;
          animation: nbSlideDown 0.22s ease;
        }

        @keyframes nbSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nb-mobile-menu.open { display: flex; }

        /* Mobile — profile strip */
        .nb-mobile-profile {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px;
          background: var(--maroon-pale);
          border: 1.5px solid var(--border);
          border-radius: 3px;
          margin-bottom: 6px;
        }

        .nb-mobile-avatar {
          width: 40px; height: 40px; border-radius: 3px;
          background: var(--maroon);
          border: 1.5px solid var(--gold);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-weight: 800;
          color: var(--gold-bright);
          flex-shrink: 0;
        }

        .nb-mobile-name {
          font-size: 14px; font-weight: 700;
          color: var(--text-mid); line-height: 1.2;
        }

        .nb-mobile-role {
          font-size: 10px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          color: var(--gold);
        }

        /* Mobile — clock bar */
        .nb-mobile-clock {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px;
          background: var(--maroon-pale);
          border: 1.5px solid var(--border);
          border-radius: 3px;
          margin-bottom: 4px;
        }

        .nb-mobile-clock-time {
          font-family: 'Inconsolata', monospace;
          font-size: 15px; font-weight: 600;
          color: var(--maroon-deep);
          letter-spacing: 0.5px;
        }

        .nb-mobile-clock-ampm {
          font-family: 'Lato', sans-serif;
          font-size: 9px; font-weight: 700;
          letter-spacing: 1.2px; text-transform: uppercase;
          color: var(--gold);
        }

        /* Mobile — nav links */
        .nb-mobile-link {
          display: flex; align-items: center;
          padding: 12px 16px;
          border-radius: 3px;
          font-size: 14px; font-weight: 700;
          color: var(--text-mid);
          text-decoration: none;
          border: 1.5px solid transparent;
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          background: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          font-family: 'Lato', sans-serif;
          box-sizing: border-box;
        }

        .nb-mobile-link:hover {
          background: var(--maroon-light);
          color: var(--maroon);
          border-color: var(--border);
        }

        /* Active mobile link */
        .nb-mobile-link.active-mobile {
          background: var(--maroon);
          color: var(--white);
          border-color: var(--maroon);
        }

        /* Mobile sign-in */
        .nb-mobile-signin {
          border-color: var(--maroon) !important;
          color: var(--maroon) !important;
        }

        .nb-mobile-signin:hover {
          background: var(--maroon) !important;
          color: var(--white) !important;
        }

        /* Mobile register/file report */
        .nb-mobile-register {
          background: var(--gold-light) !important;
          color: var(--maroon-deep) !important;
          border-color: var(--gold) !important;
        }

        .nb-mobile-register:hover {
          background: var(--gold) !important;
          border-color: var(--gold-light) !important;
        }

        /* Mobile logout */
        .nb-mobile-logout {
          color: var(--maroon) !important;
          border-color: var(--border) !important;
          margin-top: 2px;
        }

        .nb-mobile-logout:hover {
          background: var(--maroon-light) !important;
          border-color: var(--maroon) !important;
          color: var(--maroon-deep) !important;
        }

        /* Mobile — divider */
        .nb-mobile-divider {
          height: 1px;
          background: var(--border);
          margin: 4px 0;
          border: none;
        }

        /* Mobile — section label */
        .nb-mobile-section-label {
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 1.2px; text-transform: uppercase;
          color: var(--text-muted);
          padding: 4px 16px 2px;
        }

        /* ─────────────────────────────────────
           RESPONSIVE BREAKPOINTS
        ───────────────────────────────────── */

        /* Tablet (≤ 900px) — shrink paddings */
        @media (max-width: 900px) {
          .nb-inner { padding: 0 24px; }
          .nb-gov-band { padding: 6px 24px; }
          .nb-link { padding: 8px 10px; font-size: 13px; }
          .nb-profile-info { padding: 0 8px; }
          .nb-profile-name { font-size: 12px; }
          .nb-dashboard { padding: 8px 12px; font-size: 13px; }
          .nb-logout { padding: 8px 12px; font-size: 13px; margin-left: 6px; }
          .nb-clock { padding: 8px 10px; margin-left: 6px; }
        }

        /* Mobile (≤ 768px) — hamburger takes over */
        @media (max-width: 768px) {
          .nb-gov-band  { padding: 6px 16px; }
          .nb-gov-sub,
          .nb-gov-sep   { display: none; }
          .nb-gov-left  { font-size: 10px; letter-spacing: 0.5px; }
          .nb-gov-right { font-size: 10px; }

          .nb-inner     { padding: 0 16px; height: 60px; }
          .nb-brand-title { font-size: 16px; }
          .nb-brand-sub   { font-size: 8.5px; }
          .nb-logo        { width: 36px; height: 36px; }

          /* Hide desktop links, show hamburger */
          .nb-links       { display: none; }
          .nb-hamburger   { display: flex; }
        }

        /* Small phones (≤ 480px) */
        @media (max-width: 480px) {
          .nb-gov-band     { padding: 5px 12px; }
          .nb-gov-left     { font-size: 9.5px; gap: 8px; }
          .nb-inner        { padding: 0 12px; height: 56px; }
          .nb-brand-title  { font-size: 14px; }
          .nb-brand-sub    { display: none; }
          .nb-logo         { width: 32px; height: 32px; }
          .nb-mobile-menu  { padding: 12px 14px 20px; }
          .nb-mobile-link  { padding: 11px 14px; font-size: 13.5px; }
          .nb-mobile-name  { font-size: 13px; }
          .nb-mobile-clock-time { font-size: 14px; }
        }
      `}</style>

      {/* ── GOV BAND ── */}
      <div className="nb-gov-band">
        <div className="nb-gov-left">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Ministry of Home Affairs — NCRB
          <div className="nb-gov-sep" />
          <span className="nb-gov-sub">Official Government Portal · India</span>
        </div>
        <div className="nb-gov-right">
          <div className="nb-live-dot" />
          System Operational — 24/7
        </div>
      </div>

      {/* ── MAIN NAV ── */}
      <nav className="nb-main">
        <div className="nb-inner">

          {/* Brand */}
          <Link to="/" className="nb-brand">
            <div className="nb-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="nb-brand-title">AI Missing Finder</div>
              <div className="nb-brand-sub">National Missing Persons Portal</div>
            </div>
          </Link>

          {/* ── DESKTOP LINKS ── */}
          <div className="nb-links">

            {/* Guest */}
            {!user && (
              <>
                <a href="/#features" className="nb-link">Features</a>
                <a href="/#how" className="nb-link">How It Works</a>
                <div className="nb-divider" />
                <Link to="/login" className="nb-signin">Sign In</Link>
                <Link to="/register" className="nb-register">File a Report</Link>
              </>
            )}

            {/* User */}
            {user?.role === "user" && (
              <>
                <div className="nb-profile-pill">
                  <div className="nb-avatar">{getInitials(user)}</div>
                  <div className="nb-profile-info">
                    <div className="nb-profile-name">{getDisplayName(user)}</div>
                    <div className="nb-profile-role">Citizen</div>
                  </div>
                </div>
                <Link to="/user/dashboard" className={`nb-dashboard ${isActive("/user") ? "active-dash" : ""}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                  My Dashboard
                </Link>
                <button className="nb-logout" onClick={logout}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
                <div className="nb-clock">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b0f1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <div>
                    <div className="nb-clock-time">{formattedTime.replace(/(AM|PM)/i, "").trim()}</div>
                    <div className="nb-clock-ampm">{formattedTime.match(/(AM|PM)/i)?.[0] ?? ""}</div>
                  </div>
                </div>
              </>
            )}

            {/* Admin */}
            {user?.role === "admin" && (
              <>
                <div className="nb-profile-pill">
                  <div className="nb-avatar">{getInitials(user)}</div>
                  <div className="nb-profile-info">
                    <div className="nb-profile-name">{getDisplayName(user)}</div>
                    <div className="nb-profile-role">Police Admin</div>
                  </div>
                </div>
                <Link to="/admin/dashboard" className={`nb-dashboard ${isActive("/admin") ? "active-dash" : ""}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Admin Panel
                </Link>
                <button className="nb-logout" onClick={logout}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
                <div className="nb-clock">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b0f1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <div>
                    <div className="nb-clock-time">{formattedTime.replace(/(AM|PM)/i, "").trim()}</div>
                    <div className="nb-clock-ampm">{formattedTime.match(/(AM|PM)/i)?.[0] ?? ""}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="nb-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>

        {/* ── MOBILE MENU ── */}
        <div className={`nb-mobile-menu ${menuOpen ? "open" : ""}`}>

          {/* Guest */}
          {!user && (
            <>
              <span className="nb-mobile-section-label">Navigation</span>
              <a href="/#features" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>Features</a>
              <a href="/#how" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>How It Works</a>
              <hr className="nb-mobile-divider" />
              <span className="nb-mobile-section-label">Account</span>
              <Link to="/login" className="nb-mobile-link nb-mobile-signin" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="nb-mobile-link nb-mobile-register" onClick={() => setMenuOpen(false)}>
                File a Report
              </Link>
            </>
          )}

          {/* User — mobile */}
          {user?.role === "user" && (
            <>
              {/* Profile */}
              <div className="nb-mobile-profile">
                <div className="nb-mobile-avatar">{getInitials(user)}</div>
                <div>
                  <div className="nb-mobile-name">{getDisplayName(user)}</div>
                  <div className="nb-mobile-role">Citizen</div>
                </div>
              </div>

              {/* Clock */}
              <div className="nb-mobile-clock">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b0f1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="nb-mobile-clock-time">{formattedTime.replace(/(AM|PM)/i, "").trim()}</span>
                <span className="nb-mobile-clock-ampm">{formattedTime.match(/(AM|PM)/i)?.[0] ?? ""}</span>
              </div>

              <span className="nb-mobile-section-label">Menu</span>
              <Link
                to="/user/dashboard"
                className={`nb-mobile-link ${isActive("/user") ? "active-mobile" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                My Dashboard
              </Link>

              <hr className="nb-mobile-divider" />
              <button
                className="nb-mobile-link nb-mobile-logout"
                onClick={() => { logout(); setMenuOpen(false); }}
              >
                Sign Out
              </button>
            </>
          )}

          {/* Admin — mobile */}
          {user?.role === "admin" && (
            <>
              {/* Profile */}
              <div className="nb-mobile-profile">
                <div className="nb-mobile-avatar">{getInitials(user)}</div>
                <div>
                  <div className="nb-mobile-name">{getDisplayName(user)}</div>
                  <div className="nb-mobile-role">Police Admin</div>
                </div>
              </div>

              {/* Clock */}
              <div className="nb-mobile-clock">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b0f1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="nb-mobile-clock-time">{formattedTime.replace(/(AM|PM)/i, "").trim()}</span>
                <span className="nb-mobile-clock-ampm">{formattedTime.match(/(AM|PM)/i)?.[0] ?? ""}</span>
              </div>

              <span className="nb-mobile-section-label">Menu</span>
              <Link
                to="/admin/dashboard"
                className={`nb-mobile-link ${isActive("/admin") ? "active-mobile" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                Admin Panel
              </Link>

              <hr className="nb-mobile-divider" />
              <button
                className="nb-mobile-link nb-mobile-logout"
                onClick={() => { logout(); setMenuOpen(false); }}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;