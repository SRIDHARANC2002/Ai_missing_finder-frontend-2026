import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { getAllComplaints, approveComplaint, markCompleted } from "../../services/adminService";
import { verifyComplaintImage } from "../../services/complaintService";

const Complaints = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Toast State ──
  const [toast, setToast] = useState(null); // { message, type: 'error'|'warning'|'success' }
  const toastTimer = useRef(null);

  const showToast = (message, type = "warning") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchData();
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllComplaints();
      setComplaints(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch complaints. Please check your permissions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [stationForm, setStationForm] = useState({ stationName: "", stationAddress: "", stationContact: "" });
  const [selected, setSelected] = useState(null);

  // Verification States
  const webcamRef = useRef(null);
  const [showVerify, setShowVerify] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const dataURLtoBlob = (dataurl) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) { u8arr[n] = bstr.charCodeAt(n); }
    return new Blob([u8arr], { type: mime });
  };

  const handleVerify = async () => {
    if (!capturedImage || !selected) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const blob = dataURLtoBlob(capturedImage);
      const file = new File([blob], "verify.jpg", { type: "image/jpeg" });
      const res = await verifyComplaintImage(selected._id, file);
      setVerifyResult(res);
    } catch (err) {
      showToast("Verification failed: " + (err.response?.data?.message || err.message), "error");
    } finally {
      setVerifying(false);
    }
  };

  const closeVerify = () => {
    setShowVerify(false);
    setCapturedImage(null);
    setVerifyResult(null);
  };

  const statusConfig = {
    "Pending": { color: "#a0622a", bg: "rgba(160,98,42,0.1)", border: "rgba(160,98,42,0.22)" },
    "Approved": { color: "#b8860b", bg: "rgba(184,134,11,0.1)", border: "rgba(184,134,11,0.22)" },
    "Completed": { color: "#5a8a4a", bg: "rgba(90,138,74,0.1)", border: "rgba(90,138,74,0.22)" },
  };

  const filters = ["All", "Pending", "Approved", "Completed"];

  const filtered = complaints.filter((c) => {
    if (filter === "All") return true;
    return c.status?.toLowerCase() === filter.toLowerCase();
  });

  const openApproveModal = (id) => {
    setStationForm({ stationName: "", stationAddress: "", stationContact: "" });
    setModal(id);
  };

  const confirmApprove = async () => {
    if (!stationForm.stationName || !stationForm.stationAddress || !stationForm.stationContact) return;
    try {
      await approveComplaint(modal, stationForm);
      fetchData();
      setModal(null);
      setSelected(null);
    } catch (err) {
      showToast("Error approving complaint", "error");
    }
  };

  const handleMoveToCompleted = async (id) => {
    try {
      await markCompleted(id, { foundLocation: "Verified and found" });
      fetchData();
      setSelected(null);
    } catch (err) {
      showToast("Error completing case", "error");
    }
  };

  const counts = {
    pending: complaints.filter((c) => c.status?.toLowerCase() === "pending").length,
    approved: complaints.filter((c) => c.status?.toLowerCase() === "approved").length,
    completed: complaints.filter((c) => c.status?.toLowerCase() === "completed").length,
  };

  // Toast icon by type
  const toastIcon = {
    warning: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    error: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    success: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  };

  const toastColors = {
    warning: { bg: "#fffbeb", border: "#d97706", color: "#92400e", icon: "#d97706" },
    error:   { bg: "#fef2f2", border: "#dc2626", color: "#991b1b", icon: "#dc2626" },
    success: { bg: "#f0fdf4", border: "#16a34a", color: "#166534", icon: "#16a34a" },
  };

  return (
    <>
      <style>{`

/* ════════════════════════════════════════════
   COMPLAINTS PAGE — AI Missing Finder
   Classic Government · Maroon & Gold Theme
════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lato:wght@300;400;700;900&family=Inconsolata:wght@400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.cp {
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

.cp {
  min-height: 100vh;
  background: var(--surface);
  color: var(--text-dark);
  font-family: var(--font-sans);
}

/* ════════════════════════════════════════════
   TOAST NOTIFICATION — Bottom Right, Slides Up
════════════════════════════════════════════ */
.cp-toast-wrap {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  pointer-events: none;
}

.cp-toast {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 13px 16px 13px 14px;
  border-radius: 4px;
  border-left: 3px solid;
  min-width: 260px;
  max-width: 360px;
  box-shadow: 0 8px 32px rgba(62,8,16,0.14), 0 2px 8px rgba(0,0,0,0.08);
  pointer-events: all;
  animation: cp-toast-in 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.cp-toast.cp-toast-hide {
  animation: cp-toast-out 0.28s ease forwards;
}

@keyframes cp-toast-in {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}

@keyframes cp-toast-out {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(16px); }
}

.cp-toast-icon {
  flex-shrink: 0;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cp-toast-body { flex: 1; }

.cp-toast-title {
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.2px;
  line-height: 1.35;
  margin-bottom: 2px;
}

.cp-toast-msg {
  font-size: 12px;
  line-height: 1.5;
  opacity: 0.8;
}

.cp-toast-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  opacity: 0.4;
  transition: opacity 0.15s;
  flex-shrink: 0;
  color: inherit;
  line-height: 1;
  font-size: 16px;
}

.cp-toast-close:hover { opacity: 0.8; }

/* Progress bar at bottom of toast */
.cp-toast-progress {
  position: absolute;
  bottom: 0; left: 0;
  height: 2.5px;
  border-radius: 0 0 4px 4px;
  animation: cp-toast-progress 3.5s linear forwards;
  opacity: 0.5;
}

@keyframes cp-toast-progress {
  from { width: 100%; }
  to   { width: 0%; }
}

/* ════════════════════════════════════════════
   HERO HEADER BAND
════════════════════════════════════════════ */
.cp-hero {
  background: var(--maroon-deep);
  border-bottom: 3px solid var(--gold);
  padding: 32px 48px 38px;
  position: relative;
  overflow: hidden;
}

.cp-hero::before {
  content: '';
  position: absolute; inset: 0;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255,255,255,0.012) 0px,
    rgba(255,255,255,0.012) 1px,
    transparent 1px,
    transparent 28px
  );
  pointer-events: none;
}

.cp-hero::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
}

.cp-hero-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 24px; flex-wrap: wrap;
  position: relative; z-index: 1;
}

.cp-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-size: 10px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: var(--gold-light);
  margin-bottom: 10px;
}

.cp-eyebrow-rule { width: 20px; height: 1.5px; background: var(--gold); }

.cp-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 800; color: var(--white);
  letter-spacing: -0.5px; line-height: 1.1;
  margin-bottom: 6px;
}

.cp-hero-title em { font-style: italic; color: var(--gold-light); }

.cp-hero-sub {
  font-size: 13px; color: rgba(255,255,255,0.38);
  font-weight: 300; line-height: 1.6; max-width: 400px;
}

.cp-back-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 18px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(212,160,23,0.25);
  border-radius: 2px;
  font-family: var(--font-sans);
  font-size: 12.5px; font-weight: 700;
  color: rgba(255,255,255,0.55);
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  letter-spacing: 0.3px;
}

.cp-back-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(212,160,23,0.45);
  color: var(--gold-light);
}

/* ════════════════════════════════════════════
   BODY LAYOUT
════════════════════════════════════════════ */
.cp-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 48px 80px;
}

.cp-section-label {
  display: flex; align-items: center; gap: 12px;
  font-size: 10px; font-weight: 700;
  letter-spacing: 1.8px; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: 16px;
}

.cp-section-label::after {
  content: ''; flex: 1; height: 1px; background: var(--border);
}

/* ════════════════════════════════════════════
   STATS ROW
════════════════════════════════════════════ */
.cp-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 32px;
}

.cp-stat {
  background: var(--white);
  padding: 22px 22px;
  position: relative; overflow: hidden;
  transition: background 0.2s;
  animation: cp-card-in 0.4s ease both;
}

.cp-stat:nth-child(1) { animation-delay: 0.05s; }
.cp-stat:nth-child(2) { animation-delay: 0.1s; }
.cp-stat:nth-child(3) { animation-delay: 0.15s; }

.cp-stat:hover { background: var(--maroon-pale); }

.cp-stat::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  transform: scaleX(0); transform-origin: left; transition: transform 0.3s;
}

.cp-stat:hover::after { transform: scaleX(1); }

.cp-stat.pending::after  { background: linear-gradient(90deg, var(--amber), var(--gold)); }
.cp-stat.approved::after { background: linear-gradient(90deg, var(--gold), var(--gold-light)); }
.cp-stat.complete::after { background: linear-gradient(90deg, var(--green), #7ab868); }

.cp-stat-icon {
  width: 36px; height: 36px; border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px;
  border: 1px solid var(--border);
  transition: background 0.2s, color 0.2s;
}

.cp-stat.pending  .cp-stat-icon { background: var(--amber-bg);  color: var(--amber); }
.cp-stat.approved .cp-stat-icon { background: var(--gold-pale); color: var(--gold); }
.cp-stat.complete .cp-stat-icon { background: var(--green-bg);  color: var(--green); }

.cp-stat:hover .cp-stat-icon {
  background: var(--maroon);
  color: var(--gold-light);
  border-color: var(--maroon);
}

.cp-stat-value {
  font-family: var(--font-serif);
  font-size: 36px; font-weight: 800;
  color: var(--maroon-deep);
  letter-spacing: -1.5px; line-height: 1;
  margin-bottom: 4px;
}

.cp-stat-label {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.8px; text-transform: uppercase;
  color: var(--text-muted);
}

/* ════════════════════════════════════════════
   FILTER TABS
════════════════════════════════════════════ */
.cp-filters {
  display: flex; gap: 6px; flex-wrap: wrap;
  margin-bottom: 24px;
}

.cp-filter-tab {
  padding: 7px 16px; border-radius: 2px;
  font-family: var(--font-sans);
  font-size: 12px; font-weight: 700;
  cursor: pointer; letter-spacing: 0.4px;
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--text-muted);
  transition: all 0.18s; white-space: nowrap;
}

.cp-filter-tab:hover { background: var(--maroon-light); color: var(--maroon); border-color: rgba(107,15,26,0.2); }

.cp-filter-tab.active {
  background: var(--maroon); color: var(--white);
  border-color: var(--maroon);
}

/* ════════════════════════════════════════════
   MAIN GRID
════════════════════════════════════════════ */
.cp-main-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

/* ════════════════════════════════════════════
   COMPLAINT CARDS
════════════════════════════════════════════ */
.cp-card-list { display: flex; flex-direction: column; gap: 10px; }

.cp-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 22px 24px;
  cursor: pointer; position: relative; overflow: hidden;
  transition: border-color 0.2s, background 0.2s, transform 0.18s, box-shadow 0.18s;
  animation: cp-card-in 0.3s ease both;
}

.cp-card:hover {
  border-color: rgba(107,15,26,0.2);
  background: var(--maroon-pale);
  transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(107,15,26,0.07);
}

.cp-card.selected {
  border-color: var(--maroon);
  background: var(--maroon-pale);
  box-shadow: 0 0 0 1px var(--maroon);
}

.cp-card-bar {
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 4px; border-radius: 3px 0 0 3px;
}

.cp-card-top {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 12px;
  margin-bottom: 18px;
}

.cp-card-identity { display: flex; align-items: center; gap: 13px; }

.cp-avatar {
  width: 44px; height: 44px; border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-serif);
  font-size: 13px; font-weight: 800;
  flex-shrink: 0; letter-spacing: 0.5px;
  overflow: hidden;
}

.cp-card-name {
  font-family: var(--font-serif);
  font-size: 16px; font-weight: 700;
  color: var(--maroon-deep);
  letter-spacing: -0.2px; margin-bottom: 3px;
}

.cp-card-id {
  font-family: var(--font-mono);
  font-size: 11px; color: var(--text-light);
}

.cp-status-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 11px; border-radius: 2px;
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.5px; text-transform: uppercase;
  white-space: nowrap; flex-shrink: 0;
}

.cp-status-dot {
  width: 6px; height: 6px; border-radius: 50%;
  animation: cp-blink 2.2s infinite;
}

@keyframes cp-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

.cp-card-meta {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--border-light);
  margin-bottom: 18px;
}

.cp-meta-label {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.8px; text-transform: uppercase;
  color: var(--text-light); margin-bottom: 4px;
}

.cp-meta-value {
  font-family: var(--font-mono);
  font-size: 12px; color: var(--text-muted);
}

.cp-card-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.cp-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px; border-radius: 2px;
  font-family: var(--font-sans);
  font-size: 12.5px; font-weight: 700;
  cursor: pointer; transition: all 0.18s;
  border: 1px solid var(--border);
  background: var(--surface); color: var(--text-muted);
  letter-spacing: 0.2px;
}

.cp-btn:hover { background: var(--maroon-light); color: var(--maroon); border-color: rgba(107,15,26,0.2); }

.cp-btn.approve {
  background: var(--gold-pale); color: var(--maroon-deep);
  border-color: rgba(184,134,11,0.3);
}

.cp-btn.approve:hover {
  background: var(--gold-light); color: var(--white);
  border-color: var(--gold);
}

.cp-btn.complete {
  background: var(--green-bg); color: var(--green);
  border-color: var(--green-border);
}

.cp-btn.complete:hover { background: var(--green); color: var(--white); border-color: var(--green); }
.cp-btn.complete:hover svg { stroke: white; }

.cp-done-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12.5px; font-weight: 700; color: var(--green);
}

/* ════════════════════════════════════════════
   DETAIL PANEL
════════════════════════════════════════════ */
.cp-detail-panel {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 3px; overflow: hidden;
  position: sticky; top: 20px;
  animation: cp-fade-left 0.3s ease both;
}

.cp-detail-head {
  background: var(--maroon-deep);
  padding: 20px 22px;
  border-bottom: 2px solid var(--gold);
  position: relative;
}

.cp-detail-head::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
}

.cp-detail-avatar {
  width: 48px; height: 48px; border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-serif);
  font-size: 15px; font-weight: 800;
  margin-bottom: 12px; letter-spacing: 0.5px;
  overflow: hidden;
}

.cp-detail-name {
  font-family: var(--font-serif);
  font-size: 18px; font-weight: 800;
  color: var(--white); letter-spacing: -0.3px;
  margin-bottom: 4px;
}

.cp-detail-sub {
  font-family: var(--font-mono);
  font-size: 11px; color: rgba(255,255,255,0.35);
}

.cp-detail-section {
  padding: 16px 22px;
  border-bottom: 1px solid var(--border-light);
}

.cp-detail-section:last-child { border-bottom: none; }

.cp-detail-section-title {
  font-size: 9.5px; font-weight: 700;
  letter-spacing: 1.2px; text-transform: uppercase;
  color: var(--text-light); margin-bottom: 12px;
}

.cp-detail-rows { display: flex; flex-direction: column; gap: 9px; }

.cp-detail-row {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 8px;
}

.cp-detail-key { font-size: 12px; color: var(--text-muted); white-space: nowrap; }

.cp-detail-val {
  font-family: var(--font-mono);
  font-size: 11.5px; color: var(--text-mid);
  text-align: right; line-height: 1.45;
}

.cp-station-box {
  background: var(--gold-pale);
  border: 1px solid rgba(184,134,11,0.25);
  border-radius: 2px; padding: 12px 14px;
}

.cp-station-name {
  font-family: var(--font-serif);
  font-size: 13.5px; font-weight: 700;
  color: var(--maroon-deep); margin-bottom: 4px;
}

.cp-station-addr {
  font-size: 12px; color: var(--text-muted); line-height: 1.55;
}

.cp-placeholder {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; text-align: center;
  padding: 52px 24px; gap: 12px;
}

.cp-placeholder-icon {
  width: 48px; height: 48px; border-radius: 3px;
  background: var(--maroon-light);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--maroon-light);
  margin-bottom: 4px;
}

.cp-placeholder-icon svg { stroke: var(--text-light); }

.cp-placeholder-title {
  font-family: var(--font-serif);
  font-size: 15px; font-weight: 700; color: var(--text-muted);
  margin-bottom: 4px;
}

.cp-placeholder-sub { font-size: 12.5px; color: var(--text-light); }

/* ════════════════════════════════════════════
   EMPTY STATE
════════════════════════════════════════════ */
.cp-empty {
  text-align: center; padding: 60px 32px;
  border: 1px dashed var(--border);
  border-radius: 3px; background: var(--white);
}

.cp-empty-icon {
  width: 48px; height: 48px; border-radius: 3px;
  background: var(--maroon-light); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 14px; color: var(--maroon);
}

.cp-empty-title {
  font-family: var(--font-serif);
  font-size: 15px; font-weight: 700; color: var(--text-muted); margin-bottom: 5px;
}

.cp-empty-sub { font-size: 13px; color: var(--text-light); }

/* ════════════════════════════════════════════
   APPROVE MODAL
════════════════════════════════════════════ */
.cp-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(62,8,16,0.55);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 999; padding: 20px;
  animation: cp-fade-overlay 0.18s ease;
}

@keyframes cp-fade-overlay { from{opacity:0} to{opacity:1} }

.cp-modal {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 3px;
  width: 100%; max-width: 460px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(62,8,16,0.2);
  animation: cp-modal-up 0.22s ease;
}

@keyframes cp-modal-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

.cp-modal-header {
  background: var(--maroon-deep);
  padding: 20px 24px 18px;
  border-bottom: 2px solid var(--gold);
  display: flex; align-items: flex-start; justify-content: space-between;
  position: relative;
}

.cp-modal-header::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
}

.cp-modal-title {
  font-family: var(--font-serif);
  font-size: 17px; font-weight: 800;
  color: var(--white); letter-spacing: -0.3px;
  margin-bottom: 3px;
}

.cp-modal-sub { font-size: 12.5px; color: rgba(255,255,255,0.35); }

.cp-modal-close {
  width: 30px; height: 30px; border-radius: 2px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: rgba(255,255,255,0.4);
  transition: all 0.15s; flex-shrink: 0;
}

.cp-modal-close:hover { background: rgba(255,255,255,0.12); color: var(--white); }

.cp-modal-body {
  padding: 22px 24px; display: flex; flex-direction: column; gap: 16px;
}

.cp-field label {
  display: block; font-size: 10.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px;
  color: var(--text-muted); margin-bottom: 8px;
}

.cp-field input,
.cp-field textarea {
  width: 100%; padding: 10px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 13px; color: var(--text-dark);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.cp-field textarea { resize: none; min-height: 78px; line-height: 1.6; }

.cp-field input:focus,
.cp-field textarea:focus {
  border-color: var(--maroon);
  box-shadow: 0 0 0 3px rgba(107,15,26,0.07);
}

.cp-field input::placeholder,
.cp-field textarea::placeholder { color: var(--text-light); }

.cp-modal-footer {
  display: flex; gap: 10px;
  padding: 16px 24px 22px;
  border-top: 1px solid var(--border-light);
}

.cp-modal-btn {
  flex: 1; padding: 11px 16px; border-radius: 2px;
  font-family: var(--font-sans); font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all 0.18s;
  border: 1px solid var(--border);
  background: var(--surface); color: var(--text-muted);
}

.cp-modal-btn:hover { background: var(--maroon-light); color: var(--maroon); border-color: rgba(107,15,26,0.2); }

.cp-modal-btn.confirm {
  background: var(--maroon); color: var(--white); border-color: var(--maroon);
}

.cp-modal-btn.confirm:hover { background: var(--maroon-deep); }

.cp-modal-btn.confirm:disabled {
  background: var(--border); color: var(--text-light);
  border-color: var(--border); cursor: not-allowed;
}

/* ── Animations ── */
@keyframes cp-card-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes cp-fade-left {
  from { opacity: 0; transform: translateX(12px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ── Spinner ── */
@keyframes spin { to { transform: rotate(360deg); } }

/* ════════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════════ */
@media (max-width: 1100px) {
  .cp-hero  { padding: 26px 24px 32px; }
  .cp-body  { padding: 28px 24px 60px; }
}

@media (max-width: 860px) {
  .cp-main-grid { grid-template-columns: 1fr; }
  .cp-detail-panel { position: static; }
  .cp-stats { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 640px) {
  .cp-hero  { padding: 20px 16px 28px; }
  .cp-body  { padding: 20px 16px 60px; }
  .cp-stats { grid-template-columns: 1fr 1fr; }
  .cp-card-meta { grid-template-columns: repeat(2, 1fr); }
  .cp-toast-wrap { bottom: 16px; right: 16px; left: 16px; }
  .cp-toast { min-width: unset; max-width: unset; }
}

      `}</style>

      <div className="cp">

        {/* ════════════════════════════════════════════
            TOAST — Bottom Right Slide-Up
        ════════════════════════════════════════════ */}
        {toast && (() => {
          const tc = toastColors[toast.type] || toastColors.warning;
          const titles = { warning: "Action Required", error: "Error", success: "Success" };
          return (
            <div className="cp-toast-wrap">
              <div
                className="cp-toast"
                style={{
                  background: tc.bg,
                  borderLeftColor: tc.border,
                  color: tc.color,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div className="cp-toast-icon" style={{ color: tc.icon }}>
                  {toastIcon[toast.type]}
                </div>
                <div className="cp-toast-body">
                  <div className="cp-toast-title">{titles[toast.type]}</div>
                  <div className="cp-toast-msg">{toast.message}</div>
                </div>
                <button className="cp-toast-close" onClick={() => setToast(null)}>×</button>
                <div
                  className="cp-toast-progress"
                  style={{ background: tc.border }}
                />
              </div>
            </div>
          );
        })()}

        {/* ── HERO HEADER ── */}
        <div className="cp-hero">
          <div className="cp-hero-inner">
            <div>
              <div className="cp-eyebrow">
                <div className="cp-eyebrow-rule" />
                Admin · Case Management
                <div className="cp-eyebrow-rule" />
              </div>
              <div className="cp-hero-title">
                Complaint <em>Verification</em>
              </div>
              <div className="cp-hero-sub">
                Review, approve, and manage all incoming missing person reports across all zones.
              </div>
            </div>
            <button className="cp-back-btn" onClick={() => navigate(-1)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="cp-body">
          {error && (
            <div style={{ padding: '20px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{error}</span>
              <button onClick={fetchData} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#991b1b', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
            </div>
          )}

          {loading && (
            <div style={{ padding: '100px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--maroon)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <p>Loading case data...</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Stats */}
              <div className="cp-section-label">Overview</div>
              <div className="cp-stats">
                {[
                  {
                    cls: "pending", label: "Pending Review", val: counts.pending, icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                    )
                  },
                  {
                    cls: "approved", label: "Approved", val: counts.approved, icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    )
                  },
                  {
                    cls: "complete", label: "Completed", val: counts.completed, icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    )
                  },
                ].map((s, i) => (
                  <div className={`cp-stat ${s.cls}`} key={i}>
                    <div className="cp-stat-icon">{s.icon}</div>
                    <div className="cp-stat-value">{s.val}</div>
                    <div className="cp-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="cp-section-label">Filter Cases</div>
              <div className="cp-filters">
                {filters.map((f) => (
                  <button
                    key={f}
                    className={`cp-filter-tab ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}{f !== "All" && ` (${complaints.filter((c) => c.status === f).length})`}
                  </button>
                ))}
              </div>

              {/* Main grid */}
              <div className="cp-section-label">Cases</div>
              <div className="cp-main-grid">

                {/* ── CARD LIST ── */}
                <div>
                  {filtered.length === 0 ? (
                    <div className="cp-empty">
                      <div className="cp-empty-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="cp-empty-title">No complaints in this category</div>
                      <div className="cp-empty-sub">Switch the filter above to see other cases</div>
                    </div>
                  ) : (
                    <div className="cp-card-list">
                      {filtered.map((c, i) => {
                        const cfg = statusConfig[c.status] || statusConfig["Pending"];
                        const avatarInitials = c.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                        return (
                          <div
                            key={c._id}
                            className={`cp-card ${selected?._id === c._id ? "selected" : ""}`}
                            style={{ animationDelay: `${i * 0.06}s` }}
                            onClick={() => {
                              setSelected(selected?._id === c._id ? null : c);
                              closeVerify();
                            }}
                          >
                            <div className="cp-card-bar" style={{ background: cfg.color }} />

                            <div className="cp-card-top">
                              <div className="cp-card-identity">
                                <div
                                  className="cp-avatar"
                                  style={{
                                    background: `${cfg.bg}`,
                                    color: cfg.color,
                                    border: `1.5px solid ${cfg.border}`,
                                    overflow: 'hidden'
                                  }}
                                >
                                  {c.imageUrl ? (
                                    <img src={c.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    avatarInitials
                                  )}
                                </div>
                                <div>
                                  <div className="cp-card-name">{c.name}</div>
                                  <div className="cp-card-id">#{c._id.slice(-6).toUpperCase()}</div>
                                </div>
                              </div>
                              <div
                                className="cp-status-pill"
                                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                              >
                                <span className="cp-status-dot" style={{ background: cfg.color }} />
                                {c.status}
                              </div>
                            </div>

                            <div className="cp-card-meta">
                              <div>
                                <div className="cp-meta-label">Reported On</div>
                                <div className="cp-meta-value">{new Date(c.createdAt).toLocaleDateString()}</div>
                              </div>
                              <div>
                                <div className="cp-meta-label">Gender / DOB</div>
                                <div className="cp-meta-value">{c.gender}, {new Date(c.dob).toLocaleDateString()}</div>
                              </div>
                              <div>
                                <div className="cp-meta-label">Last Seen</div>
                                <div className="cp-meta-value" style={{ fontSize: "11px" }}>{new Date(c.missingTime).toLocaleString()}</div>
                              </div>
                              <div style={{ gridColumn: "1 / -1" }}>
                                <div className="cp-meta-label">Location / Address</div>
                                <div className="cp-meta-value">{c.address}</div>
                              </div>
                            </div>

                            <div className="cp-card-actions" onClick={(e) => e.stopPropagation()}>
                              {c.status === "Pending" && (
                                <button className="cp-btn approve" onClick={() => openApproveModal(c._id)}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                  </svg>
                                  Approve & Assign Station
                                </button>
                              )}
                              {c.status === "Approved" && (
                                <button className="cp-btn complete" onClick={() => handleMoveToCompleted(c._id)}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                  </svg>
                                  Mark as Completed
                                </button>
                              )}
                              {c.status === "Completed" && (
                                <span className="cp-done-tag">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                  </svg>
                                  Case Successfully Closed
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── DETAIL PANEL ── */}
                <div className="cp-detail-panel">
                  {selected ? (
                    <>
                      <div className="cp-detail-head">
                        <div
                          className="cp-detail-avatar"
                          style={{
                            background: `${(statusConfig[selected.status] || statusConfig["Pending"]).bg}`,
                            color: (statusConfig[selected.status] || statusConfig["Pending"]).color,
                            border: `1.5px solid ${(statusConfig[selected.status] || statusConfig["Pending"]).border}`,
                            overflow: 'hidden'
                          }}
                        >
                          {selected.imageUrl ? (
                            <img src={selected.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            selected.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                          )}
                        </div>
                        <div className="cp-detail-name">{selected.name}</div>
                        <div className="cp-detail-sub">#{selected._id?.slice(-6).toUpperCase()} · {selected.status}</div>
                      </div>

                      <div className="cp-detail-section">
                        <div className="cp-detail-section-title">Case Information</div>
                        <div className="cp-detail-rows">
                          {[
                            { k: "Gender", v: selected.gender },
                            { k: "DOB", v: new Date(selected.dob).toLocaleDateString() },
                            { k: "Reported On", v: new Date(selected.createdAt).toLocaleDateString() },
                            { k: "Missing Since", v: new Date(selected.missingTime).toLocaleString() },
                            { k: "Reported By", v: selected.user?.fullName },
                            { k: "User Phone", v: selected.user?.phone },
                            { k: "Direct Contact", v: selected.contactNumber },
                          ].map((r) => (
                            <div className="cp-detail-row" key={r.k}>
                              <span className="cp-detail-key">{r.k}</span>
                              <span className="cp-detail-val">{r.v}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="cp-detail-section">
                        <div className="cp-detail-section-title">Last Known Location</div>
                        <div style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                          {selected.address}
                        </div>
                      </div>

                      {selected.stationDetails && (
                        <div className="cp-detail-section">
                          <div className="cp-detail-section-title">Assigned Station</div>
                          <div className="cp-station-box">
                            <div className="cp-station-name">{selected.stationDetails.stationName}</div>
                            <div className="cp-station-addr">{selected.stationDetails.stationAddress}</div>
                            {selected.stationDetails.stationContact && (
                              <div className="cp-station-addr" style={{ marginTop: '4px' }}>
                                📞 {selected.stationDetails.stationContact}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ── VERIFY SECTION ── */}
                      <div className="cp-detail-section">
                        {!showVerify ? (
                          <button
                            className="cp-btn"
                            style={{ width: "100%", justifyContent: "center", background: 'var(--gold-pale)', color: 'var(--maroon-deep)', borderColor: 'rgba(184,134,11,0.3)' }}
                            onClick={() => {
                              if (!selected?.stationDetails) {
                                // ✅ REPLACED: alert() → in-page toast, bottom-right slide-up
                                showToast("Please assign a station before starting verification.", "warning");
                                return;
                              }
                              setShowVerify(true);
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
                            </svg>
                            Verify Against Live Camera
                          </button>
                        ) : (
                          <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--maroon)' }}>LIVE VERIFICATION</span>
                              <button onClick={closeVerify} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>×</button>
                            </div>

                            <div style={{ width: '100%', aspectRatio: '4/3', background: '#000', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                              {!capturedImage ? (
                                <Webcam
                                  audio={false}
                                  ref={webcamRef}
                                  screenshotFormat="image/jpeg"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <img src={capturedImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Captured" />
                              )}
                              {verifying && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px' }}>
                                  Analyzing...
                                </div>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                              {!capturedImage ? (
                                <button className="cp-btn approve" style={{ flex: 1, fontSize: '11px', padding: '6px' }} onClick={capture}>Capture Frame</button>
                              ) : (
                                <>
                                  <button className="cp-btn" style={{ flex: 1, fontSize: '11px', padding: '6px' }} onClick={() => { setCapturedImage(null); setVerifyResult(null); }}>Retake</button>
                                  <button className="cp-btn approve" style={{ flex: 2, fontSize: '11px', padding: '6px' }} onClick={handleVerify} disabled={verifying}>
                                    {verifying ? "Checking..." : "Verify Match"}
                                  </button>
                                </>
                              )}
                            </div>

                            {verifyResult && (
                              <div style={{ marginTop: '12px', padding: '10px', borderRadius: '3px', background: verifyResult.match ? 'rgba(90,138,74,0.1)' : 'rgba(158,58,71,0.1)', border: verifyResult.match ? '1px solid var(--green)' : '1px solid var(--red)' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '12px', color: verifyResult.match ? 'var(--green)' : 'var(--red)', marginBottom: '4px' }}>
                                  {verifyResult.match ? "✓ MATCH CONFIRMED" : "✗ NO MATCH DETECTED"}
                                </div>
                                <div style={{ fontSize: '11px' }}>Confidence Score: <strong>{Math.round(verifyResult.similarity)}%</strong></div>
                                {verifyResult.match && (
                                  <div style={{ fontSize: '10px', marginTop: '4px', color: 'var(--text-muted)' }}>The captured face matches the profile photo in our records.</div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {selected.status === "Pending" && (
                        <div className="cp-detail-section">
                          <button
                            className="cp-btn approve"
                            style={{ width: "100%", justifyContent: "center" }}
                            onClick={() => openApproveModal(selected._id)}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Approve & Assign Station
                          </button>
                        </div>
                      )}
                      {selected.status === "Approved" && (
                        <div className="cp-detail-section">
                          <button
                            className="cp-btn complete"
                            style={{ width: "100%", justifyContent: "center" }}
                            onClick={() => handleMoveToCompleted(selected._id)}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            Mark as Completed
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="cp-placeholder">
                      <div className="cp-placeholder-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="cp-placeholder-title">Select a Complaint</div>
                      <div className="cp-placeholder-sub">Click any card to view full case details and take action</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── APPROVE MODAL ── */}
        {modal && (
          <div className="cp-modal-overlay" onClick={() => setModal(null)}>
            <div className="cp-modal" onClick={(e) => e.stopPropagation()}>

              <div className="cp-modal-header">
                <div>
                  <div className="cp-modal-title">Assign Police Station</div>
                  <div className="cp-modal-sub">Enter the details of the handling station</div>
                </div>
                <button className="cp-modal-close" onClick={() => setModal(null)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="cp-modal-body">
                <div className="cp-field">
                  <label>Station Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sulur Police Station"
                    value={stationForm.stationName}
                    onChange={(e) => setStationForm({ ...stationForm, stationName: e.target.value })}
                  />
                </div>
                <div className="cp-field">
                  <label>Station Address</label>
                  <textarea
                    placeholder="Full address including PIN code…"
                    value={stationForm.stationAddress}
                    onChange={(e) => setStationForm({ ...stationForm, stationAddress: e.target.value })}
                  />
                </div>
                <div className="cp-field">
                  <label>Station Contact Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 044-28512345"
                    value={stationForm.stationContact}
                    onChange={(e) => setStationForm({ ...stationForm, stationContact: e.target.value })}
                  />
                </div>
              </div>

              <div className="cp-modal-footer">
                <button className="cp-modal-btn" onClick={() => setModal(null)}>Cancel</button>
                <button
                  className="cp-modal-btn confirm"
                  onClick={confirmApprove}
                  disabled={!stationForm.stationName || !stationForm.stationAddress || !stationForm.stationContact}
                >
                  Approve Complaint
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Complaints;