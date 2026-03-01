import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCompletedCases } from "../../services/adminService";

const CompletedCases = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCompletedCases();
        setCompleted(data);
      } catch (err) {
        console.error("Failed to fetch completed cases");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = completed.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c._id.toLowerCase().includes(search.toLowerCase()) ||
      c.matchDetails?.foundLocation?.toLowerCase().includes(search.toLowerCase())
  );

  const avgDays = completed.length > 0 ? Math.round(
    completed.reduce((sum, c) => {
      const diff = new Date(c.updatedAt) - new Date(c.createdAt);
      return sum + (diff / (1000 * 60 * 60 * 24));
    }, 0) / completed.length
  ) : 0;

  const thisMonth = completed.filter((c) => {
    const d = new Date(c.updatedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <>
      <style>{`

/* ════════════════════════════════════════════
   COMPLETED CASES — AI Missing Finder
   Classic Government · Maroon & Gold Theme
════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lato:wght@300;400;700;900&family=Inconsolata:wght@400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.cc {
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
  --green-border:  rgba(90,138,74,0.22);
  --amber:         #a0622a;
  --amber-bg:      rgba(160,98,42,0.1);
  --amber-border:  rgba(160,98,42,0.22);
  --red:           #9e3a47;
  --red-bg:        rgba(158,58,71,0.1);
  --font-serif:    'Playfair Display', Georgia, serif;
  --font-sans:     'Lato', 'Helvetica Neue', sans-serif;
  --font-mono:     'Inconsolata', 'Courier New', monospace;
}

.cc {
  min-height: 100vh;
  background: var(--surface);
  color: var(--text-dark);
  font-family: var(--font-sans);
}

/* ════════════════════════════════════════════
   HERO HEADER BAND
════════════════════════════════════════════ */
.cc-hero {
  background: var(--maroon-deep);
  border-bottom: 3px solid var(--gold);
  padding: 32px 48px 38px;
  position: relative; overflow: hidden;
}
.cc-hero::before {
  content: ''; position: absolute; inset: 0;
  background-image: repeating-linear-gradient(45deg,rgba(255,255,255,0.012) 0px,rgba(255,255,255,0.012) 1px,transparent 1px,transparent 28px);
  pointer-events: none;
}
.cc-hero::after {
  content: ''; position: absolute;
  bottom: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
}
.cc-hero-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 24px; flex-wrap: wrap; position: relative; z-index: 1;
}
.cc-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-size: 10px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: var(--gold-light); margin-bottom: 10px;
}
.cc-eyebrow-rule { width: 20px; height: 1.5px; background: var(--gold); }
.cc-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(24px, 3vw, 36px); font-weight: 800; color: var(--white);
  letter-spacing: -0.5px; line-height: 1.1; margin-bottom: 6px;
}
.cc-hero-title em { font-style: italic; color: var(--gold-light); }
.cc-hero-sub { font-size: 13px; color: rgba(255,255,255,0.38); font-weight: 300; line-height: 1.6; max-width: 420px; }
.cc-back-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 18px; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(212,160,23,0.25); border-radius: 2px;
  font-family: var(--font-sans); font-size: 12.5px; font-weight: 700;
  color: rgba(255,255,255,0.55); cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s; letter-spacing: 0.3px;
}
.cc-back-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(212,160,23,0.45); color: var(--gold-light); }

/* ════════════════════════════════════════════
   BODY
════════════════════════════════════════════ */
.cc-body { max-width: 1200px; margin: 0 auto; padding: 36px 48px 80px; }
.cc-section-label {
  display: flex; align-items: center; gap: 12px;
  font-size: 10px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: 16px;
}
.cc-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* ════════════════════════════════════════════
   STATS ROW
════════════════════════════════════════════ */
.cc-stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px; background: var(--border);
  border: 1px solid var(--border); border-radius: 3px;
  overflow: hidden; margin-bottom: 32px;
}
.cc-stat {
  background: var(--white); padding: 22px;
  position: relative; overflow: hidden; transition: background 0.2s;
  animation: cc-card-in 0.4s ease both;
}
.cc-stat:nth-child(1) { animation-delay: 0.05s; }
.cc-stat:nth-child(2) { animation-delay: 0.1s; }
.cc-stat:nth-child(3) { animation-delay: 0.15s; }
.cc-stat:nth-child(4) { animation-delay: 0.2s; }
.cc-stat:hover { background: var(--maroon-pale); }
.cc-stat::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--maroon), var(--gold));
  transform: scaleX(0); transform-origin: left; transition: transform 0.3s;
}
.cc-stat:hover::after { transform: scaleX(1); }
.cc-stat-icon {
  width: 36px; height: 36px; border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px; border: 1px solid var(--border); transition: background 0.2s, color 0.2s;
}
.cc-stat:nth-child(1) .cc-stat-icon { background: var(--green-bg);    color: var(--green); }
.cc-stat:nth-child(2) .cc-stat-icon { background: var(--gold-pale);   color: var(--gold); }
.cc-stat:nth-child(3) .cc-stat-icon { background: var(--maroon-light); color: var(--maroon); }
.cc-stat:nth-child(4) .cc-stat-icon { background: var(--amber-bg);    color: var(--amber); }
.cc-stat:hover .cc-stat-icon { background: var(--maroon); color: var(--gold-light); border-color: var(--maroon); }
.cc-stat-value { font-family: var(--font-serif); font-size: 36px; font-weight: 800; color: var(--maroon-deep); letter-spacing: -1.5px; line-height: 1; margin-bottom: 4px; }
.cc-stat-label { font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--text-muted); }

/* ════════════════════════════════════════════
   TOOLBAR
════════════════════════════════════════════ */
.cc-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.cc-search-wrap { position: relative; flex: 1; }
.cc-search-wrap svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.cc-search-input {
  width: 100%; padding: 10px 14px 10px 40px;
  background: var(--white); border: 1px solid var(--border); border-radius: 2px;
  font-family: var(--font-mono); font-size: 13px; color: var(--text-dark); outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.cc-search-input::placeholder { color: var(--text-light); }
.cc-search-input:focus { border-color: var(--maroon); box-shadow: 0 0 0 3px rgba(107,15,26,0.07); }
.cc-count-chip {
  font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--text-muted);
  background: var(--white); border: 1px solid var(--border); padding: 8px 14px; border-radius: 2px; white-space: nowrap;
}

/* ════════════════════════════════════════════
   MAIN GRID
════════════════════════════════════════════ */
.cc-main-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }

/* ════════════════════════════════════════════
   CASE CARDS
════════════════════════════════════════════ */
.cc-case-list { display: flex; flex-direction: column; gap: 10px; }
.cc-card {
  background: var(--white); border: 1px solid var(--border); border-radius: 3px;
  padding: 22px 24px; cursor: pointer; position: relative; overflow: hidden;
  transition: border-color 0.2s, background 0.2s, transform 0.18s, box-shadow 0.18s;
  animation: cc-card-in 0.3s ease both;
}
.cc-card:hover { border-color: rgba(107,15,26,0.2); background: var(--maroon-pale); transform: translateY(-1px); box-shadow: 0 4px 18px rgba(107,15,26,0.07); }
.cc-card.selected { border-color: var(--green); background: var(--green-bg); box-shadow: 0 0 0 1px var(--green-border); }
.cc-card-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 3px 0 0 3px; background: var(--green); }
.cc-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
.cc-card-identity { display: flex; align-items: center; gap: 13px; }
.cc-avatar {
  width: 44px; height: 44px; border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-serif); font-size: 13px; font-weight: 800;
  flex-shrink: 0; letter-spacing: 0.5px;
  background: var(--green-bg); color: var(--green); border: 1.5px solid var(--green-border); overflow: hidden;
}
.cc-card-name { font-family: var(--font-serif); font-size: 16px; font-weight: 700; color: var(--maroon-deep); letter-spacing: -0.2px; margin-bottom: 3px; }
.cc-card-id { font-family: var(--font-mono); font-size: 11px; color: var(--text-light); }
.cc-resolved-badge {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px; border-radius: 2px;
  background: var(--green-bg); border: 1px solid var(--green-border);
  font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
  color: var(--green); white-space: nowrap; flex-shrink: 0;
}
.cc-resolved-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: cc-blink 2.5s infinite; }
@keyframes cc-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
.cc-card-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding-top: 14px; border-top: 1px solid var(--border-light); }
.cc-meta-label { font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--text-light); margin-bottom: 4px; }
.cc-meta-value { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); }
.cc-location-value { display: flex; align-items: flex-start; gap: 5px; font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); }
.cc-location-value svg { flex-shrink: 0; margin-top: 1px; }

/* ════════════════════════════════════════════
   DETAIL PANEL
════════════════════════════════════════════ */
.cc-detail-panel { background: var(--white); border: 1px solid var(--border); border-radius: 3px; overflow: hidden; position: sticky; top: 20px; animation: cc-fade-left 0.3s ease both; }
.cc-detail-head { background: var(--maroon-deep); padding: 20px 22px; border-bottom: 2px solid var(--gold); position: relative; }
.cc-detail-head::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
}
.cc-detail-avatar {
  width: 48px; height: 48px; border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-serif); font-size: 15px; font-weight: 800;
  margin-bottom: 12px; letter-spacing: 0.5px;
  background: var(--green-bg); color: var(--green); border: 1.5px solid var(--green-border); overflow: hidden;
}
.cc-detail-name { font-family: var(--font-serif); font-size: 18px; font-weight: 800; color: var(--white); letter-spacing: -0.3px; margin-bottom: 4px; }
.cc-detail-sub { font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.35); }
.cc-detail-section { padding: 16px 22px; border-bottom: 1px solid var(--border-light); }
.cc-detail-section:last-child { border-bottom: none; }
.cc-detail-section-title { font-size: 9.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text-light); margin-bottom: 12px; }
.cc-detail-rows { display: flex; flex-direction: column; gap: 9px; }
.cc-detail-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.cc-detail-key { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
.cc-detail-val { font-family: var(--font-mono); font-size: 11.5px; color: var(--text-mid); text-align: right; line-height: 1.45; max-width: 175px; }
.cc-notes-box { background: var(--surface); border: 1px solid var(--border); border-radius: 2px; padding: 13px 14px; font-size: 13px; color: var(--text-muted); line-height: 1.65; font-style: italic; }
.cc-resolved-stamp { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--green-bg); border: 1px solid var(--green-border); border-radius: 2px; margin-top: 4px; }
.cc-resolved-stamp-text { font-size: 12px; font-weight: 700; color: var(--green); letter-spacing: 0.3px; }

/* Placeholder */
.cc-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 52px 24px; gap: 12px; }
.cc-placeholder-icon { width: 48px; height: 48px; border-radius: 3px; background: var(--maroon-light); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.cc-placeholder-icon svg { stroke: var(--text-light); }
.cc-placeholder-title { font-family: var(--font-serif); font-size: 15px; font-weight: 700; color: var(--text-muted); margin-bottom: 4px; }
.cc-placeholder-sub { font-size: 12.5px; color: var(--text-light); }

/* Empty state */
.cc-empty { text-align: center; padding: 60px 32px; border: 1px dashed var(--border); border-radius: 3px; background: var(--white); }
.cc-empty-icon { width: 48px; height: 48px; border-radius: 3px; background: var(--maroon-light); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; color: var(--maroon); }
.cc-empty-title { font-family: var(--font-serif); font-size: 15px; font-weight: 700; color: var(--text-muted); margin-bottom: 5px; }
.cc-empty-sub { font-size: 13px; color: var(--text-light); }

@keyframes cc-card-in  { from{opacity:0;transform:translateY(10px)}  to{opacity:1;transform:translateY(0)} }
@keyframes cc-fade-left { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }

@media (max-width: 1100px) { .cc-hero { padding: 26px 24px 32px; } .cc-body { padding: 28px 24px 60px; } .cc-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 860px)  { .cc-main-grid { grid-template-columns: 1fr; } .cc-detail-panel { position: static; } }
@media (max-width: 640px)  { .cc-hero { padding: 20px 16px 28px; } .cc-body { padding: 20px 16px 60px; } .cc-stats { grid-template-columns: 1fr 1fr; } .cc-card-meta { grid-template-columns: repeat(2, 1fr); } }

      `}</style>

      <div className="cc">

        {/* ── HERO ── */}
        <div className="cc-hero">
          <div className="cc-hero-inner">
            <div>
              <div className="cc-eyebrow">
                <div className="cc-eyebrow-rule" />
                Admin · Case Archive
                <div className="cc-eyebrow-rule" />
              </div>
              <div className="cc-hero-title">Completed <em>Cases</em></div>
              <div className="cc-hero-sub">
                All successfully resolved missing person cases across the national network — browse, search, and export records.
              </div>
            </div>
            <button className="cc-back-btn" onClick={() => navigate(-1)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="cc-body">

          {/* Stats */}
          <div className="cc-section-label">Overview</div>
          <div className="cc-stats">
            {[
              {
                label: "Total Resolved", val: completed.length,
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              },
              {
                label: "Avg. Resolution", val: `${avgDays}d`,
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              },
              {
                label: "Safe & Healthy", val: completed.filter((c) => c.condition === "Safe & Healthy").length,
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              },
              {
                label: "This Month", val: thisMonth,
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
              },
            ].map((s, i) => (
              <div className="cc-stat" key={i}>
                <div className="cc-stat-icon">{s.icon}</div>
                <div className="cc-stat-value">{s.val}</div>
                <div className="cc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="cc-section-label">Search Cases</div>
          <div className="cc-toolbar">
            <div className="cc-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b09098" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="cc-search-input"
                placeholder="Search by name, case ID, or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="cc-count-chip">{filtered.length} case{filtered.length !== 1 ? "s" : ""}</div>
          </div>

          {/* Main Grid */}
          <div className="cc-section-label">Resolved Cases</div>
          <div className="cc-main-grid">

            {/* ── CASE CARDS ── */}
            <div>
              {filtered.length === 0 ? (
                <div className="cc-empty">
                  <div className="cc-empty-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <div className="cc-empty-title">No cases match your search</div>
                  <div className="cc-empty-sub">Try searching by name, case ID, or location</div>
                </div>
              ) : (
                <div className="cc-case-list">
                  {filtered.map((c, i) => (
                    <div
                      key={c._id}
                      className={`cc-card ${selected?._id === c._id ? "selected" : ""}`}
                      style={{ animationDelay: `${i * 0.06}s` }}
                      onClick={() => setSelected(selected?._id === c._id ? null : c)}
                    >
                      <div className="cc-card-bar" />

                      <div className="cc-card-top">
                        <div className="cc-card-identity">
                          <div className="cc-avatar">
                            {c.imageUrl ? (
                              <img src={c.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} />
                            ) : (
                              c.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="cc-card-name">{c.name}</div>
                            <div className="cc-card-id">#{c._id.slice(-6).toUpperCase()}</div>
                          </div>
                        </div>
                        <div className="cc-resolved-badge">
                          <span className="cc-resolved-dot" />
                          Resolved
                        </div>
                      </div>

                      <div className="cc-card-meta">
                        <div>
                          <div className="cc-meta-label">Resolved On</div>
                          <div className="cc-meta-value">{new Date(c.updatedAt).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="cc-meta-label">Station</div>
                          {/* ✅ FIX: read from c.station.name */}
                          <div className="cc-meta-value">{c.station?.name || "Not Assigned"}</div>
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <div className="cc-meta-label">Found Location</div>
                          <div className="cc-location-value">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#b09098" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {/* ✅ FIX: read from c.matchDetails.foundLocation */}
                            {c.matchDetails?.foundLocation || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── DETAIL PANEL ── */}
            <div className="cc-detail-panel">
              {selected ? (
                <>
                  <div className="cc-detail-head">
                    <div className="cc-detail-avatar">
                      {selected.imageUrl ? (
                        <img src={selected.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        selected.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="cc-detail-name">{selected.name}</div>
                    <div className="cc-detail-sub">#{selected._id.slice(-6).toUpperCase()} · Resolved {new Date(selected.updatedAt).toLocaleDateString()}</div>
                  </div>

                  {/* Resolved stamp */}
                  <div className="cc-detail-section">
                    <div className="cc-resolved-stamp">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a8a4a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span className="cc-resolved-stamp-text">Case Successfully Closed</span>
                    </div>
                  </div>

                  {/* Personal info */}
                  <div className="cc-detail-section">
                    <div className="cc-detail-section-title">Personal Information</div>
                    <div className="cc-detail-rows">
                      {[
                        { k: "Gender",      v: selected.gender },
                        { k: "Reported On", v: new Date(selected.createdAt).toLocaleDateString() },
                        { k: "Last Seen",   v: new Date(selected.missingTime).toLocaleString() },
                        { k: "Contact",     v: selected.contactNumber },
                      ].map((r) => (
                        <div className="cc-detail-row" key={r.k}>
                          <span className="cc-detail-key">{r.k}</span>
                          <span className="cc-detail-val">{r.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ✅ Resolution details — fixed field paths */}
                  <div className="cc-detail-section">
                    <div className="cc-detail-section-title">Resolution Details</div>
                    <div className="cc-detail-rows">
                      <div className="cc-detail-row">
                        <span className="cc-detail-key">Station</span>
                        {/* ✅ FIX: selected.station.name */}
                        <span className="cc-detail-val">{selected.station?.name || "Not Assigned"}</span>
                      </div>
                      <div className="cc-detail-row">
                        <span className="cc-detail-key">Found Location</span>
                        {/* ✅ FIX: selected.matchDetails.foundLocation */}
                        <span className="cc-detail-val">{selected.matchDetails?.foundLocation || "-"}</span>
                      </div>
                      <div className="cc-detail-row">
                        <span className="cc-detail-key">Verified By</span>
                        <span className="cc-detail-val">{selected.matchDetails?.verifiedBy || "-"}</span>
                      </div>
                      <div className="cc-detail-row">
                        <span className="cc-detail-key">Verified At</span>
                        <span className="cc-detail-val">
                          {selected.matchDetails?.verifiedAt
                            ? new Date(selected.matchDetails.verifiedAt).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Officer Notes — only rendered if notes exist */}
                  {(selected?.matchDetails?.officerNotes || selected?.officerNotes) && (
                    <div className="cc-detail-section">
                      <div className="cc-detail-section-title">Officer Notes</div>
                      <div className="cc-notes-box">
                        {selected?.matchDetails?.officerNotes || selected?.officerNotes}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="cc-placeholder">
                  <div className="cc-placeholder-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div className="cc-placeholder-title">Select a Case</div>
                  <div className="cc-placeholder-sub">Click any card to view the full resolution report</div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CompletedCases;