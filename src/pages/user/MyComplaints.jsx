import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserComplaints } from "../../services/complaintService";

const MyComplaints = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getUserComplaints();
        setComplaints(data);
      } catch (err) {
        setError("Failed to load complaints. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const statusConfig = {
    "Pending": { color: "#b8860b", bg: "rgba(184,134,11,0.1)", border: "rgba(184,134,11,0.28)", bar: "linear-gradient(180deg,#d4a017,#b8860b)", dot: "#d4a017" },
    "Approved": { color: "#a0622a", bg: "rgba(160,98,42,0.1)", border: "rgba(160,98,42,0.25)", bar: "linear-gradient(180deg,#c8954a,#a0622a)", dot: "#c8954a" },
    "Match Found": { color: "#9e3a47", bg: "rgba(158,58,71,0.1)", border: "rgba(158,58,71,0.28)", bar: "linear-gradient(180deg,#b8404f,#7a1422)", dot: "#b8404f" },
    "Completed": { color: "#5a8a4a", bg: "rgba(90,138,74,0.1)", border: "rgba(90,138,74,0.25)", bar: "linear-gradient(180deg,#6aaa58,#5a8a4a)", dot: "#6aaa58" },
  };

  const filters = ["All", "Pending", "Approved", "Match Found", "Completed"];

  const filtered = complaints.filter((c) => {
    const matchFilter = filter === "All" || c.status === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c._id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

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

        .mc { background: var(--S); font-family: 'Lato', sans-serif; min-height: 100vh; color: var(--TD); }

        /* ── PAGE HEADER ── */
        .ph { background: var(--W); border-bottom: 1px solid var(--BD); position: sticky; top: 0; z-index: 100; }
        .ph::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, var(--MD), var(--GL), var(--MD)); }
        .ph-inner { max-width: 1040px; margin: 0 auto; padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .ph-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: var(--GL); margin-bottom: 4px; }
        .ph-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 800; color: var(--MD); letter-spacing: -0.4px; }
        .ph-sub { font-size: 13px; color: var(--TT); font-weight: 300; margin-top: 3px; }
        .new-btn {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 11px 22px; background: var(--MD); color: var(--GB);
          border: 1.5px solid var(--G); border-radius: 2px;
          font-family: 'Lato', sans-serif; font-size: 13px; font-weight: 700;
          text-decoration: none; cursor: pointer; letter-spacing: 0.3px;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s; white-space: nowrap;
        }
        .new-btn:hover { background: var(--M); box-shadow: 0 4px 18px rgba(62,8,16,0.25); transform: translateY(-1px); }

        /* ── FILTER TABS ── */
        .filter-row { background: var(--W); border-bottom: 1px solid var(--BD); }
        .filter-inner { max-width: 1040px; margin: 0 auto; padding: 0 40px; display: flex; gap: 0; overflow-x: auto; }
        .filter-inner::-webkit-scrollbar { display: none; }
        .ftab {
          padding: 13px 18px; font-family: 'Lato', sans-serif; font-size: 13px; font-weight: 700;
          color: var(--TT); border: none; background: transparent; cursor: pointer;
          white-space: nowrap; letter-spacing: 0.2px; border-bottom: 3px solid transparent;
          transition: color 0.18s, border-color 0.18s;
        }
        .ftab:hover { color: var(--MD); }
        .ftab.active { color: var(--MD); border-bottom-color: var(--GL); }

        /* ── BODY ── */
        .body { max-width: 1040px; margin: 0 auto; padding: 32px 40px 80px; }

        /* Summary strip */
        .summary-strip {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; background: var(--BD);
          border: 1px solid var(--BD); border-radius: 3px;
          overflow: hidden; margin-bottom: 28px;
        }
        .scard {
          background: var(--W); padding: 18px 20px;
          transition: background 0.18s; cursor: default;
          position: relative; overflow: hidden;
        }
        .scard:hover { background: var(--MP); }
        .scard::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; transform: scaleX(0); transition: transform 0.3s; transform-origin: left; }
        .scard:hover::after { transform: scaleX(1); }
        .scard-val { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 800; color: var(--MD); line-height: 1; margin-bottom: 4px; }
        .scard-label { font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--TT); }

        /* Search + toolbar */
        .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .search-wrap { position: relative; flex: 1; min-width: 200px; }
        .search-wrap svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--TT); pointer-events: none; }
        .search-input {
          width: 100%; padding: 11px 14px 11px 42px;
          background: var(--W); border: 1.5px solid var(--BD);
          border-radius: 2px; font-family: 'Inconsolata', monospace;
          font-size: 13.5px; color: var(--TD); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input::placeholder { color: var(--TT); opacity: 0.5; }
        .search-input:focus { border-color: rgba(184,134,11,0.5); box-shadow: 0 0 0 3px rgba(184,134,11,0.08); }

        /* Complaint cards */
        .list { display: flex; flex-direction: column; gap: 10px; }

        .cc {
          display: flex; overflow: hidden;
          background: var(--W); border: 1px solid var(--BD);
          border-radius: 4px;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.18s;
          animation: ci 0.28s ease both;
        }
        @keyframes ci { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .cc:hover { border-color: rgba(107,15,26,0.22); box-shadow: 0 8px 32px rgba(107,15,26,0.08); transform: translateY(-2px); }

        /* Left accent bar */
        .cc-bar { width: 5px; flex-shrink: 0; transition: width 0.2s; }
        .cc:hover .cc-bar { width: 6px; }

        /* Card content */
        .cc-body { flex: 1; padding: 22px 24px; min-width: 0; }

        /* Top row */
        .cc-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; flex-wrap: wrap; }
        .cc-person { display: flex; align-items: center; gap: 14px; }
        .av {
          width: 48px; height: 48px; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 800;
          flex-shrink: 0; letter-spacing: 0.5px; overflow: hidden;
        }
        .av img { width: 100%; height: 100%; object-fit: cover; }
        .cc-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: var(--MD); letter-spacing: -0.3px; margin-bottom: 3px; }
        .cc-id { font-family: 'Inconsolata', monospace; font-size: 12px; color: var(--TT); letter-spacing: 0.5px; }
        .status-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 14px; border-radius: 2px;
          font-size: 12px; font-weight: 700; white-space: nowrap; letter-spacing: 0.3px;
          flex-shrink: 0;
        }
        .sdot { width: 6px; height: 6px; border-radius: 50%; animation: dp 2s infinite; }
        @keyframes dp { 0%,100%{opacity:1} 50%{opacity:0.35} }

        /* Meta grid */
        .cc-meta {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
          padding: 16px 0; border-top: 1px solid var(--BD); border-bottom: 1px solid var(--BD);
          margin-bottom: 16px;
        }
        .ml { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--TT); margin-bottom: 4px; }
        .mv { font-family: 'Inconsolata', monospace; font-size: 13px; font-weight: 600; color: var(--MD); }

        /* Footer row */
        .cc-foot { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .officer-info { display: flex; align-items: center; gap: 7px; font-size: 12.5px; color: var(--TT); font-weight: 400; }
        .cc-btns { display: flex; gap: 8px; }
        .cbtn {
          padding: 7px 16px; border-radius: 2px;
          font-family: 'Lato', sans-serif; font-size: 12px; font-weight: 700;
          cursor: pointer; letter-spacing: 0.3px; transition: all 0.18s; border: 1.5px solid;
        }
        .cbtn-loc { background: var(--S); color: var(--TT); border-color: var(--BD); font-family: 'Inconsolata', monospace; font-size: 11.5px; }
        .cbtn-loc:hover { background: var(--ML); color: var(--M); border-color: rgba(107,15,26,0.25); }
        .cbtn-view { background: var(--GP); color: var(--MD); border-color: rgba(184,134,11,0.4); }
        .cbtn-view:hover { background: var(--GL); border-color: var(--G); box-shadow: 0 3px 12px rgba(184,134,11,0.2); }

        /* Empty */
        .empty { text-align: center; padding: 88px 32px; border: 1.5px dashed var(--BD); border-radius: 4px; background: var(--W); }
        .ei { width: 72px; height: 72px; border-radius: 4px; background: var(--MP); border: 1px solid var(--BD); display: flex; align-items: center; justify-content: center; margin: 0 auto 22px; color: var(--TT); }
        .et { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--MD); margin-bottom: 8px; }
        .es { font-size: 14px; color: var(--TT); font-weight: 300; }

        @media (max-width: 720px) {
          .ph-inner, .filter-inner, .body { padding-left: 16px; padding-right: 16px; }
          .summary-strip { grid-template-columns: repeat(2, 1fr); }
          .cc-meta { grid-template-columns: repeat(2, 1fr); }
          .cc-top { flex-direction: column; }
        }
      `}</style>

      <div className="mc">

        {/* PAGE HEADER */}
        <div className="ph">
          <div className="ph-inner">
            <div>
              <div className="ph-eyebrow">Citizen Portal</div>
              <div className="ph-title">My Complaints</div>
              <div className="ph-sub">Track and manage all your missing person reports</div>
            </div>
            <Link to="/user/create" className="new-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              File New Report
            </Link>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="filter-row">
          <div className="filter-inner">
            {filters.map(f => (
              <button key={f} className={`ftab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        {/* BODY */}
        <div className="body">

          {/* Summary strip */}
          <div className="summary-strip">
            {[
              { val: complaints.length, label: "Total Filed", accent: "linear-gradient(90deg,var(--MD),var(--M))" },
              { val: complaints.filter(c => ["Pending", "Approved"].includes(c.status)).length, label: "In Progress", accent: "linear-gradient(90deg,var(--G),var(--GL))" },
              { val: complaints.filter(c => c.status === "Match Found").length, label: "Match Found", accent: "linear-gradient(90deg,#9e3a47,#b8404f)" },
              { val: complaints.filter(c => c.status === "Completed").length, label: "Resolved", accent: "linear-gradient(90deg,#5a8a4a,#6aaa58)" },
            ].map(s => (
              <div className="scard" key={s.label}>
                <div className="scard-val">{s.val}</div>
                <div className="scard-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="toolbar">
            <div className="search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input className="search-input" placeholder="Search by name or complaint ID…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* List */}
          <div className="list">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div style={{ color: "var(--TT)", fontSize: "14px" }}>Fetching your reports…</div>
              </div>
            ) : error ? (
              <div className="empty" style={{ borderColor: "rgba(158,58,71,0.2)" }}>
                <div className="et">Oops! Something went wrong</div>
                <div className="es">{error}</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty">
                <div className="et">No complaints found</div>
                <div className="es">Try adjusting your search or filter</div>
              </div>
            ) : (
              filtered.map((c, idx) => {
                const cfg = statusConfig[c.status] || { color: "#7a5a60", bg: "rgba(122,90,96,0.1)", border: "rgba(122,90,96,0.2)", bar: "#7a5a60", dot: "#7a5a60" };
                const avatarInitials = c.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <div className="cc" key={c._id} style={{ animationDelay: `${idx * 0.06}s` }}>
                    <div className="cc-bar" style={{ background: cfg.bar }} />
                    <div className="cc-body">
                      <div className="cc-top">
                        <div className="cc-person">
                          <div className="av" style={{ background: cfg.bg, color: cfg.color, border: `1.5px solid ${cfg.border}` }}>
                            {c.imageUrl ? <img src={c.imageUrl} alt="" /> : avatarInitials}
                          </div>
                          <div>
                            <div className="cc-name">{c.name}</div>
                            <div className="cc-id">#{c._id.slice(-6).toUpperCase()} · {c.gender}</div>
                          </div>
                        </div>
                        <div className="status-pill" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                          <span className="sdot" style={{ background: cfg.dot }} />
                          {c.status}
                        </div>
                      </div>

                      <div className="cc-meta">
                        {[
                          { l: "Date of Birth", v: new Date(c.dob).toLocaleDateString() },
                          { l: "Reported On", v: new Date(c.createdAt).toLocaleDateString() },
                          { l: "Last Seen", v: c.missingTime },
                          { l: "Location", v: c.address },
                        ].map(m => (
                          <div key={m.l}>
                            <div className="ml">{m.l}</div>
                            <div className="mv" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.v}</div>
                          </div>
                        ))}
                      </div>

                      {c.status === "Match Found" && c.matchDetails && (
                        <div style={{ background: 'rgba(158,58,71,0.05)', border: '1px solid rgba(158,58,71,0.15)', borderRadius: '3px', padding: '12px 16px', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9e3a47', fontWeight: 'bold', fontSize: '12px', marginBottom: '6px' }}>
                            MATCH DETECTED
                          </div>
                          <div style={{ fontSize: '13px', color: '#7a5a60' }}>
                            Person spotted at <strong>{c.matchDetails.foundLocation}</strong> with <strong>{c.matchDetails.similarity}%</strong> similarity.
                          </div>
                        </div>
                      )}

                      <div className="cc-foot">
                        <div className="officer-info">
                          {c.assignedTo ? `Officer Assigned` : "Pending Officer Assignment"}
                        </div>
                        <div className="cc-btns">
                          <button className="cbtn cbtn-view">View Details →</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyComplaints;