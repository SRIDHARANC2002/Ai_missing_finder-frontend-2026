import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: "AI Facial Recognition",
      desc: "Deep learning–powered image comparison identifies unknown persons with up to 97% accuracy against our national database of open cases.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: "Police Command Portal",
      desc: "Secure admin interface for verified officers to review complaints, assign stations, track investigations, and manage case workflows.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
      title: "Real-Time Alerts",
      desc: "Instant notifications to families and duty officers the moment a facial match is detected — no delay, no missed connections.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      title: "End-to-End Encryption",
      desc: "All case data, photos, and personal records are encrypted in transit and at rest, meeting national law enforcement data standards.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
      title: "Live Camera Verification",
      desc: "Officers can point any device camera at an unknown individual for an instant real-time identity check against all open missing persons.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
      title: "Case Analytics",
      desc: "Real-time dashboards give command officers full visibility into case resolution rates, zone activity, and officer performance.",
    },
  ];

  const stats = [
    { val: "2,400+", label: "Cases Resolved" },
    { val: "97%", label: "Match Accuracy" },
    { val: "24/7", label: "System Uptime" },
    { val: "180+", label: "Stations Connected" },
  ];

  const steps = [
    { n: "01", title: "File a Report", desc: "Families submit a missing person complaint with photographs and details through the secure citizen portal." },
    { n: "02", title: "Police Verification", desc: "Duty officers review, verify, and assign the case to the appropriate local police station." },
    { n: "03", title: "AI Scanning", desc: "Our facial recognition engine continuously cross-matches the case against all verified sightings and camera feeds." },
    { n: "04", title: "Instant Reunion", desc: "When a match is found, both the family and officer are notified immediately so action can be taken at once." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Lato:wght@300;400;700&display=swap');

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
          --white:        #ffffff;
        }

        html { scroll-behavior: smooth; }

        .home-root {
          background: var(--white);
          color: var(--text-dark);
          font-family: 'Lato', sans-serif;
          overflow-x: hidden;
        }

        /* ── TOP AUTHORITY BAND ── */
        .auth-band {
          background: var(--maroon-deep);
          padding: 7px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 2px solid var(--gold);
        }
        .auth-band-left {
          display: flex; align-items: center; gap: 14px;
          font-size: 11.5px; color: rgba(255,255,255,0.55);
          font-weight: 400; letter-spacing: 0.4px;
        }
        .auth-ministry {
          display: flex; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.85); font-weight: 700;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
        }
        .auth-sep { width: 1px; height: 14px; background: rgba(255,255,255,0.2); }
        .auth-band-right {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: rgba(255,255,255,0.45);
        }
        .live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #fbbf24; animation: livepulse 2s infinite;
        }
        @keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        /* ── NAVBAR ── */
        .home-nav {
          position: sticky; top: 0; z-index: 200;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          transition: box-shadow 0.3s;
        }
        .home-nav.scrolled { box-shadow: 0 3px 20px rgba(107,15,26,0.1); }
        .home-nav::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--maroon), var(--gold), var(--maroon));
        }
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 48px; height: 74px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-brand { display: flex; align-items: center; gap: 14px; text-decoration: none; }
        .nav-logo {
          width: 46px; height: 46px;
          background: var(--maroon); border-radius: 3px;
          border: 2px solid var(--gold);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .nav-brand-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 800;
          color: var(--maroon); line-height: 1.1; letter-spacing: -0.3px;
        }
        .nav-brand-sub {
          font-size: 10px; color: var(--gold);
          letter-spacing: 1.2px; text-transform: uppercase; font-weight: 700;
        }
        .nav-links { display: flex; align-items: center; gap: 2px; }
        .nav-link {
          padding: 8px 16px; font-size: 14px; font-weight: 700;
          color: var(--text-muted); text-decoration: none; border-radius: 2px;
          transition: color 0.2s, background 0.2s; letter-spacing: 0.2px;
        }
        .nav-link:hover { color: var(--maroon); background: var(--maroon-light); }
        .nav-divider { width: 1px; height: 22px; background: var(--border); margin: 0 8px; }
        .nav-signin {
          padding: 9px 20px; font-size: 14px; font-weight: 700;
          color: var(--maroon); text-decoration: none;
          border: 1.5px solid var(--maroon); border-radius: 2px;
          transition: background 0.2s, color 0.2s;
        }
        .nav-signin:hover { background: var(--maroon); color: white; }
        .nav-cta {
          padding: 9px 22px; font-size: 14px; font-weight: 700;
          color: var(--maroon-deep); text-decoration: none;
          background: var(--gold-light); border: 1.5px solid var(--gold);
          border-radius: 2px; margin-left: 8px;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .nav-cta:hover { background: var(--gold); box-shadow: 0 4px 14px rgba(184,134,11,0.3); }

        /* ── HERO ── */
        .hero {
          background: var(--maroon-deep);
          position: relative; overflow: hidden;
        }
        .hero-pattern {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px,
            transparent 1px, transparent 28px
          );
          pointer-events: none;
        }
        .hero-gold-border {
          position: absolute; bottom: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
        }
        .hero-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 84px 48px 96px;
          display: grid; grid-template-columns: 1fr 360px;
          gap: 60px; align-items: center;
          position: relative; z-index: 1;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          margin-bottom: 22px; font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; color: var(--gold-light);
        }
        .eyebrow-ornament { width: 24px; height: 1.5px; background: var(--gold); }
        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(34px, 4.5vw, 58px); font-weight: 800;
          line-height: 1.08; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 22px;
        }
        .hero h1 em { font-style: italic; color: var(--gold-light); }
        .hero-desc {
          font-size: 16px; line-height: 1.8; color: rgba(255,255,255,0.55);
          max-width: 500px; margin-bottom: 38px; font-weight: 300;
        }
        .hero-buttons { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 44px; }
        .btn-gold {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 13px 28px; background: var(--gold-light);
          color: var(--maroon-deep); font-size: 14px; font-weight: 700;
          letter-spacing: 0.3px; text-decoration: none; border-radius: 2px;
          border: 2px solid var(--gold); transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .btn-gold:hover { background: var(--gold); box-shadow: 0 6px 20px rgba(184,134,11,0.4); transform: translateY(-1px); }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 13px 28px; background: transparent;
          color: rgba(255,255,255,0.75); font-size: 14px; font-weight: 700;
          letter-spacing: 0.3px; text-decoration: none; border-radius: 2px;
          border: 1.5px solid rgba(255,255,255,0.25); transition: border-color 0.2s, background 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.55); background: rgba(255,255,255,0.05); }
        .hero-trust { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .trust-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: rgba(255,255,255,0.35); font-weight: 400;
        }
        .trust-item svg { color: var(--gold); flex-shrink: 0; }

        /* Hero Panel */
        .hero-panel {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(184,134,11,0.3); border-radius: 4px; overflow: hidden;
        }
        .panel-header {
          background: rgba(184,134,11,0.12);
          border-bottom: 1px solid rgba(184,134,11,0.2);
          padding: 14px 20px;
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
          text-transform: uppercase; color: var(--gold-light);
        }
        .panel-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; }
        .panel-stat {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 3px;
        }
        .panel-stat-label { font-size: 13px; color: rgba(255,255,255,0.45); font-weight: 400; }
        .panel-stat-val { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: white; }
        .panel-stat-val.gold { color: var(--gold-light); }
        .panel-stat-val.green { color: #86efac; }
        .panel-live {
          padding: 10px 16px;
          background: rgba(134,239,172,0.07); border: 1px solid rgba(134,239,172,0.2); border-radius: 3px;
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 700; color: #86efac; letter-spacing: 0.3px;
        }
        .live-indicator {
          width: 8px; height: 8px; border-radius: 50%;
          background: #86efac; animation: livepulse 2s infinite; flex-shrink: 0;
        }

        /* ── NOTICE BAND ── */
        .notice-band {
          background: var(--gold-pale);
          border-top: 1px solid #e8d5a3; border-bottom: 1px solid #e8d5a3; padding: 13px 48px;
        }
        .notice-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; gap: 14px;
          font-size: 13px; color: var(--text-mid); line-height: 1.5;
        }
        .notice-tag {
          background: var(--maroon); color: var(--gold-light);
          font-size: 10px; font-weight: 800; letter-spacing: 1.2px;
          text-transform: uppercase; padding: 3px 9px; border-radius: 2px;
          flex-shrink: 0; border: 1px solid var(--gold);
        }

        /* ── STATS ── */
        .stats-section { background: var(--white); border-bottom: 1px solid var(--border); }
        .stats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 48px;
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        .stat-cell {
          padding: 36px 24px; border-right: 1px solid var(--border);
          position: relative; transition: background 0.2s;
        }
        .stat-cell:last-child { border-right: none; }
        .stat-cell:hover { background: var(--maroon-pale); }
        .stat-cell::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--maroon), var(--gold));
          transform: scaleX(0); transition: transform 0.3s; transform-origin: left;
        }
        .stat-cell:hover::after { transform: scaleX(1); }
        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 40px; font-weight: 800; color: var(--maroon);
          letter-spacing: -1.5px; line-height: 1; margin-bottom: 6px;
        }
        .stat-label {
          font-size: 11px; color: var(--text-muted);
          font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
        }

        /* ── SECTION SHARED ── */
        .wrap { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
        .sec-eyebrow {
          display: flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 700; letter-spacing: 1.8px;
          text-transform: uppercase; color: var(--gold); margin-bottom: 12px;
        }
        .sec-rule { width: 28px; height: 2px; background: var(--gold); }
        .sec-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 3.5vw, 40px); font-weight: 800;
          color: var(--maroon-deep); letter-spacing: -0.5px; margin-bottom: 12px; line-height: 1.12;
        }
        .sec-desc {
          font-size: 15px; color: var(--text-muted);
          line-height: 1.75; max-width: 540px; font-weight: 300;
        }
        .sec-header { margin-bottom: 48px; }

        /* ── FEATURES ── */
        .features-section { padding: 84px 0; background: var(--white); }
        .feat-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          border: 1px solid var(--border); background: var(--border); gap: 1px;
        }
        .feat-card {
          background: var(--white); padding: 32px 28px; transition: background 0.2s; position: relative;
        }
        .feat-card:hover { background: var(--maroon-light); }
        .feat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--maroon), var(--gold));
          transform: scaleX(0); transition: transform 0.3s; transform-origin: left;
        }
        .feat-card:hover::before { transform: scaleX(1); }
        .feat-icon {
          width: 52px; height: 52px; background: var(--maroon-light);
          color: var(--maroon); border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px; border: 1px solid var(--border);
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .feat-card:hover .feat-icon { background: var(--maroon); color: var(--gold-light); border-color: var(--maroon); }
        .feat-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: var(--maroon-deep); margin-bottom: 8px;
        }
        .feat-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.7; font-weight: 300; }

        /* ── HOW IT WORKS ── */
        .how-section {
          padding: 84px 0; background: var(--maroon-pale);
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
        }
        .steps-row {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--border); background: var(--border); gap: 1px;
          margin-top: 40px;
        }
        .step-card { background: var(--white); padding: 36px 26px; position: relative; transition: background 0.2s; }
        .step-card:hover { background: var(--gold-pale); }
        .step-number {
          font-family: 'Playfair Display', serif;
          font-size: 52px; font-weight: 800; color: transparent;
          -webkit-text-stroke: 2px var(--maroon-light);
          line-height: 1; margin-bottom: 16px; display: block;
          transition: -webkit-text-stroke-color 0.2s;
        }
        .step-card:hover .step-number { -webkit-text-stroke-color: var(--gold); }
        .step-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: var(--maroon-deep); margin-bottom: 8px;
        }
        .step-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.65; font-weight: 300; }

        /* ── CTA ── */
        .cta-section {
          padding: 90px 48px; background: var(--maroon-deep);
          position: relative; overflow: hidden;
        }
        .cta-section::before {
          content: ''; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px,
            transparent 1px, transparent 28px
          );
        }
        .cta-section::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
        }
        .cta-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          gap: 48px; flex-wrap: wrap; position: relative; z-index: 1;
        }
        .cta-left h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3.5vw, 44px); font-weight: 800;
          color: white; letter-spacing: -0.5px; line-height: 1.1; margin-bottom: 12px;
        }
        .cta-left h2 em { color: var(--gold-light); font-style: italic; }
        .cta-left p { font-size: 15px; color: rgba(255,255,255,0.45); line-height: 1.75; max-width: 460px; font-weight: 300; }
        .cta-actions { display: flex; flex-direction: column; gap: 12px; flex-shrink: 0; }
        .btn-white {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 28px; background: var(--white); color: var(--maroon-deep);
          font-size: 14px; font-weight: 700; letter-spacing: 0.2px; text-decoration: none;
          border-radius: 2px; border: 2px solid white; transition: background 0.2s, transform 0.15s;
          min-width: 220px;
        }
        .btn-white:hover { background: var(--maroon-light); transform: translateY(-1px); }
        .btn-outline-gold {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 28px; background: transparent; color: var(--gold-light);
          font-size: 14px; font-weight: 700; letter-spacing: 0.2px; text-decoration: none;
          border-radius: 2px; border: 1.5px solid rgba(184,134,11,0.5);
          transition: border-color 0.2s, background 0.2s; min-width: 220px;
        }
        .btn-outline-gold:hover { border-color: var(--gold); background: rgba(184,134,11,0.08); }

        /* ── FOOTER ── */
        .home-footer { background: #2a0a0f; border-top: 3px solid var(--maroon); }
        .footer-main {
          max-width: 1200px; margin: 0 auto;
          padding: 52px 48px 40px;
          display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 52px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .footer-logo-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .footer-logo-icon {
          width: 40px; height: 40px; background: var(--maroon);
          border: 1.5px solid var(--gold); border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
        }
        .footer-logo-name { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 800; color: white; }
        .footer-logo-sub { font-size: 10px; color: var(--gold); letter-spacing: 1px; text-transform: uppercase; font-weight: 700; }
        .footer-about { font-size: 13px; color: rgba(255,255,255,0.3); line-height: 1.75; max-width: 270px; font-weight: 300; }
        .footer-col-head {
          font-size: 10.5px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.35); margin-bottom: 18px; padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .footer-link-list { list-style: none; display: flex; flex-direction: column; gap: 11px; }
        .footer-link-list a { font-size: 13.5px; color: rgba(255,255,255,0.38); text-decoration: none; transition: color 0.2s; font-weight: 300; }
        .footer-link-list a:hover { color: rgba(255,255,255,0.8); }
        .footer-bottom {
          max-width: 1200px; margin: 0 auto; padding: 18px 48px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
        }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.18); }
        .footer-bottom-links { display: flex; gap: 20px; }
        .footer-bottom-links a { font-size: 12px; color: rgba(255,255,255,0.2); text-decoration: none; transition: color 0.2s; }
        .footer-bottom-links a:hover { color: rgba(255,255,255,0.55); }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-panel { display: none; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .stat-cell:nth-child(2) { border-right: none; }
          .feat-grid { grid-template-columns: 1fr 1fr; }
          .steps-row { grid-template-columns: 1fr 1fr; }
          .cta-inner { flex-direction: column; align-items: flex-start; }
          .footer-main { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .auth-band, .notice-band { padding: 7px 20px; }
          .nav-inner { padding: 0 20px; }
          .nav-links { display: none; }
          .hero-inner { padding: 52px 20px 64px; }
          .wrap { padding: 0 20px; }
          .stats-inner { padding: 0 20px; grid-template-columns: 1fr 1fr; }
          .feat-grid, .steps-row { grid-template-columns: 1fr; }
          .cta-section { padding: 60px 20px; }
          .footer-main { padding: 36px 20px 28px; grid-template-columns: 1fr; gap: 32px; }
          .footer-bottom { padding: 16px 20px; flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="home-root">

        {/* AUTHORITY BAND */}
        <div className="auth-band">
          <div className="auth-band-left">
            <div className="auth-ministry">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Ministry of Home Affairs — National Crime Records Bureau
            </div>
            <div className="auth-sep" />
            <span>Official Government Portal · India</span>
          </div>
          <div className="auth-band-right">
            <div className="live-dot" />
            System Active — 24/7 Monitoring
          </div>
        </div>

        {/* NAVBAR */}
        <nav className={`home-nav ${scrollY > 20 ? "scrolled" : ""}`}>
          <div className="nav-inner">
            <div className="nav-brand">
              <div className="nav-logo">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <div className="nav-brand-title">AI Missing Finder</div>
                <div className="nav-brand-sub">National Missing Persons Portal</div>
              </div>
            </div>
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#how" className="nav-link">How It Works</a>
              <div className="nav-divider" />
              <Link to="/login" className="nav-signin">Sign In</Link>
              <Link to="/register" className="nav-cta">File a Report</Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-pattern" />
          <div className="hero-inner">
            <div>
              <div className="hero-eyebrow">
                <div className="eyebrow-ornament" />
                AI-Powered Missing Person Identification
                <div className="eyebrow-ornament" />
              </div>
              <h1>Reuniting Families.<br /><em>Faster, Smarter,</em><br />Together.</h1>
              <p className="hero-desc">
                India's official AI-powered missing person platform. File reports, verify identities with facial recognition, and receive instant match alerts — connecting families and law enforcement in real time.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn-gold">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  File a Missing Person Report
                </Link>
                <Link to="/login" className="btn-ghost">
                  Police Login
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>
              <div className="hero-trust">
                {["256-bit Encrypted", "Govt. Authorised Platform", "GDPR Compliant"].map((t) => (
                  <div className="trust-item" key={t}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Panel */}
            <div className="hero-panel">
              <div className="panel-header">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                Live System Statistics
              </div>
              <div className="panel-body">
                {[
                  { label: "Cases Resolved", val: "2,400+", cls: "" },
                  { label: "AI Match Accuracy", val: "97%", cls: "green" },
                  { label: "Active Open Cases", val: "312", cls: "gold" },
                  { label: "Stations Connected", val: "180+", cls: "" },
                ].map((s) => (
                  <div className="panel-stat" key={s.label}>
                    <span className="panel-stat-label">{s.label}</span>
                    <span className={`panel-stat-val ${s.cls}`}>{s.val}</span>
                  </div>
                ))}
                <div className="panel-live">
                  <div className="live-indicator" />
                  All Systems Operational — 24/7
                </div>
              </div>
            </div>
          </div>
          <div className="hero-gold-border" />
        </section>

        {/* NOTICE */}
        <div className="notice-band">
          <div className="notice-inner">
            <span className="notice-tag">Official Notice</span>
            This is an official government-authorised platform. All data is handled under the IT Act, 2000. Misuse or false reporting will attract legal action under applicable laws.
          </div>
        </div>

        {/* STATS */}
        <div className="stats-section">
          <div className="stats-inner">
            {stats.map((s) => (
              <div className="stat-cell" key={s.label}>
                <div className="stat-number">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <section className="features-section" id="features">
          <div className="wrap">
            <div className="sec-header">
              <div className="sec-eyebrow"><div className="sec-rule" /> Platform Capabilities</div>
              <h2 className="sec-title">Built for Speed & Accuracy</h2>
              <p className="sec-desc">Every feature is purpose-built for law enforcement and families navigating one of life's most difficult situations.</p>
            </div>
            <div className="feat-grid">
              {features.map((f) => (
                <div className="feat-card" key={f.title}>
                  <div className="feat-icon">{f.icon}</div>
                  <div className="feat-title">{f.title}</div>
                  <div className="feat-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-section" id="how">
          <div className="wrap">
            <div className="sec-header">
              <div className="sec-eyebrow"><div className="sec-rule" /> Process</div>
              <h2 className="sec-title">How It Works</h2>
              <p className="sec-desc">From filing a report to a successful reunion — here is what happens step by step.</p>
            </div>
            <div className="steps-row">
              {steps.map((s) => (
                <div className="step-card" key={s.n}>
                  <span className="step-number">{s.n}</span>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-inner">
            <div className="cta-left">
              <h2>Every Second Counts.<br /><em>Act Now.</em></h2>
              <p>Join thousands of families and officers who trust this platform to find and reunite missing persons across the country.</p>
            </div>
            <div className="cta-actions">
              <Link to="/register" className="btn-white">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                File a Report — Free
              </Link>
              <Link to="/login" className="btn-outline-gold">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Police Admin Login
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="home-footer">
          <div className="footer-main">
            <div>
              <div className="footer-logo-row">
                <div className="footer-logo-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <div className="footer-logo-name">AI Missing Finder</div>
                  <div className="footer-logo-sub">National Missing Persons Portal</div>
                </div>
              </div>
              <p className="footer-about">An official government-authorised AI platform for locating and reuniting missing persons across India. Operated under the Ministry of Home Affairs.</p>
            </div>
            <div>
              <div className="footer-col-head">Quick Links</div>
              <ul className="footer-link-list">
                <li><a href="#features">Platform Features</a></li>
                <li><a href="#how">How It Works</a></li>
                <li><Link to="/register">File a Report</Link></li>
                <li><Link to="/login">Police Login</Link></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-head">Legal & Support</div>
              <ul className="footer-link-list">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Use</a></li>
                <li><a href="#">Data Protection</a></li>
                <li><a href="#">Contact Helpline</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© {new Date().getFullYear()} AI Missing Finder — Ministry of Home Affairs, Government of India. All rights reserved.</span>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Accessibility</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Home;