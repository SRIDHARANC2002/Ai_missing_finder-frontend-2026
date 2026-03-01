import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { verifyUnknownPerson } from "../../services/faceRecognitionService";
import { markCompleted } from "../../services/adminService";

const VerifyUnknown = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [foundLocation, setFoundLocation] = useState("");
  const [officerNotes, setOfficerNotes] = useState("");
  const [showCompletionBox, setShowCompletionBox] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'success' | 'error', message: string }
  const [facingMode, setFacingMode] = useState("user"); // "user" = front, "environment" = back

  const videoConstraints = { width: 480, height: 360, facingMode };

  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 5000);
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setResult(null);
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const dataURLtoBlob = (dataurl) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) { u8arr[n] = bstr.charCodeAt(n); }
    return new Blob([u8arr], { type: mime });
  };

  const handleVerify = async () => {
    if (!capturedImage) return;
    setScanning(true);
    setResult(null);
    setShowCompletionBox(false);
    setFoundLocation("");
    setOfficerNotes("");

    try {
      for (let i = 1; i <= 3; i++) {
        setScanStep(i);
        await new Promise((r) => setTimeout(r, 800));
      }

      const imageBlob = dataURLtoBlob(capturedImage);
      const imageFile = new File([imageBlob], "captured_face.jpg", { type: "image/jpeg" });

      setScanStep(4);
      const data = await verifyUnknownPerson(imageFile);

      setScanning(false);
      setScanStep(0);

      if (data.match && data.complaint) {
        setResult({
          match: true,
          similarity: Math.min(100, Math.round((data.similarity ?? 0) * 100)),
          name: data.complaint.name,
          age: data.complaint.dob
            ? new Date().getFullYear() - new Date(data.complaint.dob).getFullYear()
            : "N/A",
          gender: data.complaint.gender,
          station:
            data.complaint.stationDetails?.stationName ||
            data.complaint.station?.name ||
            "Not Assigned",
          stationAddress:
            data.complaint.stationDetails?.stationAddress ||
            data.complaint.station?.address ||
            "Not Assigned",
          stationContact:
            data.complaint.stationDetails?.stationContact ||
            data.complaint.station?.contact ||
            "Not Assigned",
          caseId: `CMP-${data.complaint._id.slice(-6).toUpperCase()}`,
          rawId: data.complaint._id,
          reportedOn: new Date(data.complaint.createdAt).toLocaleDateString("en-IN"),
          address: data.complaint.address,
          contact: data.complaint.contactNumber,
          databaseImage: data.complaint.imageUrl,
          stationName: data.complaint.stationDetails?.stationName || data.complaint.station?.name || null,
        });
      } else {
        setResult({
          match: false,
          similarity: Math.min(100, Math.round((data.similarity ?? 0) * 100)),
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setScanning(false);
      setScanStep(0);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setResult(null);
    setScanStep(0);
    setScanning(false);
    setShowCompletionBox(false);
    setFoundLocation("");
    setOfficerNotes("");
  };

  const handleMarkCompleted = async () => {
    if (!foundLocation || !result?.rawId) {
      showBanner("error", "Found location or complaint ID missing. Please fill in all required fields.");
      return;
    }
    try {
      await markCompleted(result.rawId, { foundLocation, officerNotes });
      showBanner("success", `Case ${result.caseId} has been successfully closed and moved to completed records.`);
      reset();
    } catch (error) {
      console.error("Completion failed", error.response?.data);
      showBanner("error", error.response?.data?.message || "Failed to mark as completed. Please try again.");
    }
  };

  const scanSteps = ["Detecting face…", "Extracting features…", "Searching database…", "Generating result…"];

  return (
    <>
      <style>{`

/* ════════════════════════════════════════════
   VERIFY UNKNOWN — AI Missing Finder
   Classic Government · Maroon & Gold Theme
════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lato:wght@300;400;700;900&family=Inconsolata:wght@400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.vu {
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
  --red-bg:        rgba(158,58,71,0.1);
  --red-border:    rgba(158,58,71,0.22);
  --amber:         #a0622a;
  --amber-bg:      rgba(160,98,42,0.1);
  --amber-border:  rgba(160,98,42,0.22);
  --font-serif:    'Playfair Display', Georgia, serif;
  --font-sans:     'Lato', 'Helvetica Neue', sans-serif;
  --font-mono:     'Inconsolata', 'Courier New', monospace;
}

.vu {
  min-height: 100vh;
  background: var(--surface);
  color: var(--text-dark);
  font-family: var(--font-sans);
}

/* ════════════════════════════════════════════
   IN-PAGE TOP BANNER NOTIFICATION
════════════════════════════════════════════ */
.vu-banner {
  width: 100%;
  overflow: hidden;
  animation: vu-banner-drop 0.38s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes vu-banner-drop {
  from { opacity: 0; transform: translateY(-100%); }
  to   { opacity: 1; transform: translateY(0); }
}

.vu-banner.success {
  background: var(--green-bg);
  border-bottom: 2px solid var(--green-border);
}

.vu-banner.error {
  background: var(--red-bg);
  border-bottom: 2px solid var(--red-border);
}

.vu-banner-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 13px 48px;
  display: flex;
  align-items: center;
  gap: 13px;
}

.vu-banner-icon {
  width: 34px; height: 34px;
  border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.vu-banner.success .vu-banner-icon {
  background: rgba(90,138,74,0.15);
  border: 1px solid var(--green-border);
}

.vu-banner.error .vu-banner-icon {
  background: rgba(158,58,71,0.12);
  border: 1px solid var(--red-border);
}

.vu-banner-body { flex: 1; min-width: 0; }

.vu-banner-title {
  font-family: var(--font-serif);
  font-size: 13.5px; font-weight: 700;
  letter-spacing: -0.1px;
  margin-bottom: 2px;
}

.vu-banner.success .vu-banner-title { color: var(--green); }
.vu-banner.error   .vu-banner-title { color: #9e3a47; }

.vu-banner-msg {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.45;
}

.vu-banner-close {
  background: none; border: none;
  cursor: pointer; padding: 4px; flex-shrink: 0;
  color: var(--text-light); line-height: 1;
  transition: color 0.15s;
}
.vu-banner-close:hover { color: var(--text-dark); }

/* Drain progress bar */
.vu-banner-bar { height: 2px; }
.vu-banner.success .vu-banner-bar { background: rgba(90,138,74,0.12); }
.vu-banner.error   .vu-banner-bar { background: rgba(158,58,71,0.1); }

.vu-banner-bar-fill {
  height: 100%;
  animation: vu-banner-drain 5s linear forwards;
}
.vu-banner.success .vu-banner-bar-fill { background: var(--green); }
.vu-banner.error   .vu-banner-bar-fill { background: #9e3a47; }

@keyframes vu-banner-drain {
  from { width: 100%; }
  to   { width: 0%; }
}

/* ════════════════════════════════════════════
   HERO HEADER BAND
════════════════════════════════════════════ */
.vu-hero {
  background: var(--maroon-deep);
  border-bottom: 3px solid var(--gold);
  padding: 32px 48px 38px;
  position: relative;
  overflow: hidden;
}

.vu-hero::before {
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

.vu-hero::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
}

.vu-hero-inner {
  max-width: 1120px; margin: 0 auto;
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 24px; flex-wrap: wrap;
  position: relative; z-index: 1;
}

.vu-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-size: 10px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: var(--gold-light);
  margin-bottom: 10px;
}

.vu-eyebrow-rule { width: 20px; height: 1.5px; background: var(--gold); }

.vu-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 800; color: var(--white);
  letter-spacing: -0.5px; line-height: 1.1;
  margin-bottom: 6px;
}

.vu-hero-title em { font-style: italic; color: var(--gold-light); }

.vu-hero-sub {
  font-size: 13px; color: rgba(255,255,255,0.38);
  font-weight: 300; line-height: 1.6; max-width: 420px;
}

.vu-back-btn {
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

.vu-back-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(212,160,23,0.45);
  color: var(--gold-light);
}

/* ════════════════════════════════════════════
   BODY LAYOUT
════════════════════════════════════════════ */
.vu-body {
  max-width: 1120px;
  margin: 0 auto;
  padding: 36px 48px 80px;
}

.vu-section-label {
  display: flex; align-items: center; gap: 12px;
  font-size: 10px; font-weight: 700;
  letter-spacing: 1.8px; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: 16px;
}

.vu-section-label::after {
  content: ''; flex: 1; height: 1px; background: var(--border);
}

/* ════════════════════════════════════════════
   MAIN GRID
════════════════════════════════════════════ */
.vu-main-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  align-items: start;
}

/* ════════════════════════════════════════════
   CAMERA CARD
════════════════════════════════════════════ */
.vu-camera-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.vu-camera-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px;
  background: var(--maroon-deep);
  border-bottom: 2px solid var(--gold);
  position: relative;
}

.vu-camera-header::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
}

.vu-camera-header-left { display: flex; align-items: center; gap: 12px; }

.vu-live-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--gold-bright);
  box-shadow: 0 0 8px rgba(232,184,75,0.6);
  animation: vu-pulse 2s infinite;
}

@keyframes vu-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.85)} }

.vu-camera-title {
  font-family: var(--font-serif);
  font-size: 15px; font-weight: 700;
  color: var(--white); margin-bottom: 2px;
}

.vu-camera-sub {
  font-size: 11px; color: rgba(255,255,255,0.35);
  font-weight: 300; letter-spacing: 0.2px;
}

/* ── Camera flip/toggle button ── */
.vu-camera-toggle {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 13px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(212,160,23,0.22);
  border-radius: 2px;
  font-family: var(--font-sans);
  font-size: 11.5px; font-weight: 700;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: background 0.18s, color 0.18s, border-color 0.18s;
  flex-shrink: 0;
}

.vu-camera-toggle:hover {
  background: rgba(255,255,255,0.13);
  border-color: rgba(212,160,23,0.45);
  color: var(--gold-light);
}

.vu-camera-toggle svg {
  transition: transform 0.35s ease;
}

.vu-camera-toggle:hover svg {
  transform: rotate(180deg);
}

.vu-viewport {
  position: relative;
  background: #1a0508;
  aspect-ratio: 4/3;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}

.vu-viewport video,
.vu-viewport img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}

.vu-face-guide {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}

.vu-face-box-wrap {
  position: relative;
  width: 220px; height: 260px;
}

.vu-face-box {
  width: 220px; height: 260px;
  position: relative;
  border: 1.5px solid rgba(232,184,75,0.35);
}

.vu-scan-line {
  position: absolute;
  left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold-bright), transparent);
  box-shadow: 0 0 12px var(--gold-bright), 0 0 4px rgba(232,184,75,0.6);
  animation: vu-scan 2s ease-in-out infinite;
}

@keyframes vu-scan {
  0%   { top: 5%; opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { top: 95%; opacity: 0; }
}

.vu-corner {
  position: absolute;
  width: 28px; height: 28px;
  border-color: var(--gold-bright);
  border-style: solid;
  opacity: 1;
}

.vu-corner.tl { top: -1px;    left: -1px;   border-width: 3px 0 0 3px; }
.vu-corner.tr { top: -1px;    right: -1px;  border-width: 3px 3px 0 0; }
.vu-corner.bl { bottom: -1px; left: -1px;   border-width: 0 0 3px 3px; }
.vu-corner.br { bottom: -1px; right: -1px;  border-width: 0 3px 3px 0; }

.vu-face-dot {
  position: absolute;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--gold-bright);
  opacity: 0.7;
  animation: vu-dot-blink 2.5s ease-in-out infinite;
}

@keyframes vu-dot-blink {
  0%,100% { opacity: 0.7; }
  50%      { opacity: 0.2; }
}

.vu-face-cross-h,
.vu-face-cross-v {
  position: absolute;
  background: rgba(232,184,75,0.12);
  pointer-events: none;
}

.vu-face-cross-h {
  left: 0; right: 0; height: 1px;
  top: 50%; transform: translateY(-50%);
}

.vu-face-cross-v {
  top: 0; bottom: 0; width: 1px;
  left: 50%; transform: translateX(-50%);
}

.vu-detect-label {
  position: absolute;
  top: -28px; left: 0;
  font-family: var(--font-mono);
  font-size: 10px; font-weight: 600;
  letter-spacing: 1.5px;
  color: var(--gold-bright);
  text-transform: uppercase;
  text-shadow: 0 0 8px rgba(232,184,75,0.5);
  animation: vu-dot-blink 1.5s ease-in-out infinite;
}

.vu-detect-status {
  position: absolute;
  bottom: -26px; right: 0;
  font-family: var(--font-mono);
  font-size: 9px; font-weight: 600;
  letter-spacing: 1px;
  color: rgba(232,184,75,0.6);
  text-transform: uppercase;
}

.vu-controls {
  display: flex; gap: 10px;
  padding: 16px 22px;
  border-top: 1px solid var(--border-light);
  background: var(--maroon-pale);
}

.vu-btn {
  flex: 1; padding: 11px 16px; border-radius: 2px;
  font-family: var(--font-sans);
  font-size: 13px; font-weight: 700;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.18s;
  border: 1px solid var(--border);
  background: var(--white); color: var(--text-muted);
  letter-spacing: 0.2px;
}

.vu-btn:hover { background: var(--maroon-light); color: var(--maroon); border-color: rgba(107,15,26,0.2); }

.vu-btn.capture {
  background: var(--maroon);
  border-color: var(--maroon);
  color: var(--white);
  box-shadow: 0 3px 14px rgba(107,15,26,0.22);
}

.vu-btn.capture:hover { background: var(--maroon-deep); box-shadow: 0 4px 18px rgba(62,8,16,0.28); }

.vu-btn.verify {
  background: var(--gold-pale);
  border-color: rgba(184,134,11,0.3);
  color: var(--maroon-deep);
}

.vu-btn.verify:hover { background: var(--gold-light); color: var(--white); border-color: var(--gold); }

.vu-btn.complete {
  background: var(--green-bg);
  border-color: var(--green-border);
  color: var(--green);
}

.vu-btn.complete:hover { background: var(--green); color: var(--white); border-color: var(--green); }

.vu-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

.vu-spinner {
  width: 13px; height: 13px;
  border: 2px solid rgba(62,8,16,0.2);
  border-top-color: var(--maroon);
  border-radius: 50%;
  animation: vu-spin 0.7s linear infinite;
}

.vu-btn.verify .vu-spinner {
  border-color: rgba(184,134,11,0.2);
  border-top-color: var(--gold);
}

@keyframes vu-spin { to { transform: rotate(360deg); } }

/* ════════════════════════════════════════════
   RIGHT PANEL
════════════════════════════════════════════ */
.vu-right-panel { display: flex; flex-direction: column; gap: 16px; }

.vu-pipeline-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.vu-pipeline-head {
  background: var(--maroon-deep);
  padding: 14px 20px;
  border-bottom: 2px solid var(--gold);
  position: relative;
}

.vu-pipeline-head::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
}

.vu-pipeline-title {
  font-family: var(--font-serif);
  font-size: 14px; font-weight: 700; color: var(--white);
}

.vu-pipeline-sub {
  font-size: 10.5px; color: rgba(255,255,255,0.35); margin-top: 2px;
}

.vu-pipeline-body { padding: 18px 20px; }

.vu-steps { display: flex; flex-direction: column; gap: 14px; }

.vu-step {
  display: flex; align-items: center; gap: 13px;
  opacity: 0.3; transition: opacity 0.3s;
}

.vu-step.active { opacity: 1; }
.vu-step.done   { opacity: 0.65; }

.vu-step-circle {
  width: 30px; height: 30px; border-radius: 3px;
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono);
  font-size: 12px; font-weight: 600;
  color: var(--text-light); flex-shrink: 0;
  transition: all 0.3s;
}

.vu-step.active .vu-step-circle {
  border-color: var(--gold);
  background: var(--gold-pale);
  color: var(--gold);
}

.vu-step.done .vu-step-circle {
  border-color: var(--green);
  background: var(--green-bg);
  color: var(--green);
}

.vu-step-label {
  font-size: 13px; color: var(--text-light);
  transition: color 0.3s;
}

.vu-step.active .vu-step-label { color: var(--text-dark); font-weight: 700; }
.vu-step.done   .vu-step-label { color: var(--text-muted); }

.vu-result-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 3px;
  overflow: hidden;
  animation: vu-fade-up 0.35s ease;
}

@keyframes vu-fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

.vu-result-banner {
  padding: 18px 22px;
  display: flex; align-items: center; gap: 13px;
  border-bottom: 2px solid;
}

.vu-result-banner.match    { background: var(--green-bg);  border-color: var(--green-border); }
.vu-result-banner.no-match { background: var(--red-bg);    border-color: var(--red-border); }
.vu-result-banner.potential{ background: var(--amber-bg);  border-color: var(--amber-border); }

.vu-result-icon {
  width: 42px; height: 42px; border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.vu-result-icon.match      { background: rgba(90,138,74,0.15);  border: 1px solid var(--green-border); }
.vu-result-icon.no-match   { background: rgba(158,58,71,0.12);  border: 1px solid var(--red-border); }
.vu-result-icon.potential  { background: rgba(160,98,42,0.12);  border: 1px solid var(--amber-border); }

.vu-result-banner-title {
  font-family: var(--font-serif);
  font-size: 16px; font-weight: 800; letter-spacing: -0.2px;
  margin-bottom: 3px;
}

.vu-result-banner-title.match      { color: var(--green); }
.vu-result-banner-title.no-match   { color: #9e3a47; }
.vu-result-banner-title.potential  { color: var(--amber); }

.vu-result-banner-sub { font-size: 12px; color: var(--text-muted); }

.vu-result-body { padding: 18px 22px; }

.vu-similarity-row {
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 18px; padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}

.vu-ring-wrap { position: relative; width: 72px; height: 72px; flex-shrink: 0; }

.vu-ring-wrap svg { transform: rotate(-90deg); }

.vu-ring-value {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono);
  font-size: 14px; font-weight: 700;
  color: var(--text-dark);
}

.vu-sim-label {
  font-size: 12.5px; font-weight: 700;
  color: var(--text-muted); margin-bottom: 4px;
}

.vu-sim-desc { font-size: 11.5px; color: var(--text-light); line-height: 1.5; }

.vu-match-meta { display: flex; flex-direction: column; gap: 10px; }

.vu-meta-row {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
}

.vu-meta-key {
  font-size: 11.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.6px;
  color: var(--text-light); white-space: nowrap;
}

.vu-meta-val {
  font-family: var(--font-mono);
  font-size: 12px; color: var(--text-mid);
  text-align: right;
}

.vu-case-badge {
  display: inline-block;
  padding: 2px 9px;
  background: var(--gold-pale);
  border: 1px solid rgba(184,134,11,0.3);
  border-radius: 2px;
  color: var(--maroon-deep);
  font-size: 11px; font-weight: 700;
  font-family: var(--font-mono);
}

.vu-info-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 3px; padding: 18px 20px;
}

.vu-info-title {
  font-size: 9.5px; font-weight: 700;
  letter-spacing: 1.2px; text-transform: uppercase;
  color: var(--text-light); margin-bottom: 14px;
}

.vu-info-tip {
  display: flex; gap: 11px;
  font-size: 13px; color: var(--text-muted);
  line-height: 1.65;
}

.vu-info-tip-icon {
  width: 28px; height: 28px; border-radius: 2px;
  background: var(--maroon-light);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--maroon); flex-shrink: 0; margin-top: 1px;
}

/* ════════════════════════════════════════════
   COMPLETION BOX
════════════════════════════════════════════ */
.vu-completion-box {
  margin-top: 18px;
  padding: 18px 20px;
  background: var(--green-bg);
  border: 1px solid var(--green-border);
  border-radius: 3px;
  animation: vu-fade-up 0.3s ease;
}

.vu-completion-box h4 {
  font-family: var(--font-serif);
  font-size: 14px; font-weight: 700;
  color: var(--maroon-deep);
  margin-bottom: 4px;
}

.vu-completion-station {
  font-size: 12px; color: var(--text-muted);
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--green-border);
}

.vu-completion-station strong {
  color: var(--text-mid);
  font-weight: 700;
}

.vu-completion-box input,
.vu-completion-box textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: 2px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-dark);
  background: var(--white);
  margin-bottom: 10px;
  resize: vertical;
  transition: border-color 0.18s, box-shadow 0.18s;
  outline: none;
}

.vu-completion-box input:focus,
.vu-completion-box textarea:focus {
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(90,138,74,0.1);
}

.vu-completion-box input::placeholder,
.vu-completion-box textarea::placeholder {
  color: var(--text-light);
}

.vu-completion-box textarea {
  min-height: 72px;
  margin-bottom: 12px;
}

.vu-completion-actions { display: flex; gap: 8px; }

.vu-btn-cancel-completion {
  flex: 0 0 auto;
  padding: 9px 14px;
  border-radius: 2px;
  font-family: var(--font-sans);
  font-size: 12px; font-weight: 700;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--text-muted);
  transition: all 0.18s;
}

.vu-btn-cancel-completion:hover {
  background: var(--maroon-light);
  color: var(--maroon);
  border-color: rgba(107,15,26,0.2);
}

@media (max-width: 1100px) {
  .vu-hero { padding: 26px 24px 32px; }
  .vu-body { padding: 28px 24px 60px; }
  .vu-banner-inner { padding: 13px 24px; }
}

@media (max-width: 860px) {
  .vu-main-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .vu-hero { padding: 20px 16px 28px; }
  .vu-body { padding: 20px 16px 60px; }
  .vu-banner-inner { padding: 12px 16px; }
}

      `}</style>

      <div className="vu">

        {/* ══════════════════════════════════════
            IN-PAGE TOP BANNER — success / error
        ══════════════════════════════════════ */}
        {banner && (
          <div className={`vu-banner ${banner.type}`}>
            <div className="vu-banner-inner">
              {/* icon */}
              <div className="vu-banner-icon">
                {banner.type === "success" ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5a8a4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9e3a47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                )}
              </div>
              {/* text */}
              <div className="vu-banner-body">
                <div className="vu-banner-title">
                  {banner.type === "success" ? "Case Closed Successfully" : "Action Failed"}
                </div>
                <div className="vu-banner-msg">{banner.message}</div>
              </div>
              {/* close */}
              <button className="vu-banner-close" onClick={() => setBanner(null)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* drain bar */}
            <div className="vu-banner-bar">
              <div className="vu-banner-bar-fill" />
            </div>
          </div>
        )}

        {/* ── HERO HEADER ── */}
        <div className="vu-hero">
          <div className="vu-hero-inner">
            <div>
              <div className="vu-eyebrow">
                <div className="vu-eyebrow-rule" />
                Admin · AI Verification
                <div className="vu-eyebrow-rule" />
              </div>
              <div className="vu-hero-title">
                Identity <em>Verification</em>
              </div>
              <div className="vu-hero-sub">
                Capture a live photo to run a facial similarity check against all open missing persons records in the national database.
              </div>
            </div>
            <button className="vu-back-btn" onClick={() => navigate(-1)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="vu-body">

          <div className="vu-section-label">Facial Recognition Scanner</div>

          <div className="vu-main-grid">

            {/* ── CAMERA CARD ── */}
            <div className="vu-camera-card">

              <div className="vu-camera-header">
                <div className="vu-camera-header-left">
                  {!capturedImage && <span className="vu-live-dot" />}
                  <div>
                    <div className="vu-camera-title">
                      {capturedImage ? "Captured Photo" : "Live Camera Feed"}
                    </div>
                    <div className="vu-camera-sub">
                      {capturedImage
                        ? "Review the image, then run verification or retake"
                        : facingMode === "user"
                          ? "Position the subject's face within the square guide"
                          : "Using rear camera — point at the subject's face"}
                    </div>
                  </div>
                </div>

                {/* ── Camera flip button — only shown when live feed is active ── */}
                {!capturedImage && (
                  <button
                    className="vu-camera-toggle"
                    onClick={toggleCamera}
                    title={facingMode === "user" ? "Switch to rear camera" : "Switch to front camera"}
                  >
                    {/* flip/rotate icon */}
                    <svg
                      width="14" height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                      <path d="M16 3H8l-2 4h12l-2-4z" />
                      <circle cx="12" cy="13" r="3" />
                      <path d="M17 13h2M5 13h2" strokeWidth="1.8" />
                    </svg>
                    {facingMode === "user" ? "Rear Cam" : "Front Cam"}
                  </button>
                )}
              </div>

              <div className="vu-viewport">
                {!capturedImage ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'radial-gradient(ellipse 55% 65% at 50% 48%, transparent 38%, rgba(0,0,0,0.52) 100%)',
                      pointerEvents: 'none',
                    }} />
                    <div className="vu-face-guide">
                      <div className="vu-face-box-wrap">
                        <div className="vu-detect-label">◈ Face Detected</div>
                        <div className="vu-face-box">
                          <div className="vu-scan-line" />
                          <div className="vu-face-cross-h" />
                          <div className="vu-face-cross-v" />
                          <div className="vu-corner tl" />
                          <div className="vu-corner tr" />
                          <div className="vu-corner bl" />
                          <div className="vu-corner br" />
                          {[
                            { top: '30%', left: '28%' },
                            { top: '30%', left: '68%' },
                            { top: '50%', left: '48%' },
                            { top: '65%', left: '32%' },
                            { top: '65%', left: '64%' },
                            { top: '20%', left: '48%' },
                            { top: '78%', left: '48%' },
                          ].map((pos, i) => (
                            <div
                              key={i}
                              className="vu-face-dot"
                              style={{ top: pos.top, left: pos.left, animationDelay: `${i * 0.3}s` }}
                            />
                          ))}
                        </div>
                        <div className="vu-detect-status">Scanning… 98% confidence</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <img src={capturedImage} alt="Captured" />
                )}
              </div>

              <div className="vu-controls">
                {!capturedImage ? (
                  <button className="vu-btn capture" onClick={capture}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                      <path d="M16 3H8l-2 4h12l-2-4z" />
                    </svg>
                    Capture Photo
                  </button>
                ) : (
                  <>
                    <button className="vu-btn" onClick={reset} disabled={scanning}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
                      </svg>
                      Retake
                    </button>
                    <button className="vu-btn verify" onClick={handleVerify} disabled={scanning}>
                      {scanning ? (
                        <><span className="vu-spinner" /> Scanning…</>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          Verify Identity
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="vu-right-panel">

              {/* Scan Pipeline */}
              <div className="vu-pipeline-card">
                <div className="vu-pipeline-head">
                  <div className="vu-pipeline-title">Verification Pipeline</div>
                  <div className="vu-pipeline-sub">AI-powered facial recognition steps</div>
                </div>
                <div className="vu-pipeline-body">
                  <div className="vu-steps">
                    {scanSteps.map((label, i) => {
                      const stepNum = i + 1;
                      const isDone = scanStep > stepNum;
                      const isActive = scanStep === stepNum;
                      return (
                        <div key={i} className={`vu-step ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                          <div className="vu-step-circle">
                            {isDone ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : isActive ? (
                              <span className="vu-spinner" />
                            ) : (
                              stepNum
                            )}
                          </div>
                          <div className="vu-step-label">{label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Result Card */}
              {result && (
                <div className="vu-result-card">

                  <div className={`vu-result-banner ${result.match ? "match" : result.name ? "potential" : "no-match"}`}>
                    <div className={`vu-result-icon ${result.match ? "match" : result.name ? "potential" : "no-match"}`}>
                      {result.match ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a8a4a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      ) : result.name ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a0622a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9e3a47" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className={`vu-result-banner-title ${result.match ? "match" : result.name ? "potential" : "no-match"}`}>
                        {result.match ? "Identity Confirmed" : result.name ? "Potential Match Detected" : "Identity Not Found"}
                      </div>
                      <div className="vu-result-banner-sub">
                        {result.match
                          ? "Identity confirmed — record located in database"
                          : result.name
                            ? "Multiple facial markers match a record in database."
                            : "No record matches this face in the database"}
                      </div>
                    </div>
                  </div>

                  <div className="vu-result-body">

                    {result.name && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 'bold' }}>LIVE CAPTURE</div>
                          <img src={capturedImage} alt="Capture" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '3px', border: '1px solid var(--border)' }} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 'bold' }}>DATABASE PHOTO</div>
                          <img src={result.databaseImage} alt="Database" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '3px', border: '1px solid var(--border)' }} />
                        </div>
                      </div>
                    )}

                    <div className="vu-similarity-row">
                      <div className="vu-ring-wrap">
                        <svg width="72" height="72" viewBox="0 0 72 72">
                          <circle cx="36" cy="36" r="30" fill="none" stroke="var(--border)" strokeWidth="6" />
                          <circle
                            cx="36" cy="36" r="30"
                            fill="none"
                            stroke={result.match ? "#5a8a4a" : result.name ? "#a0622a" : "#9e3a47"}
                            strokeWidth="6"
                            strokeDasharray={`${(result.similarity / 100) * 188.5} 188.5`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="vu-ring-value">{result.similarity}%</div>
                      </div>
                      <div>
                        <div className="vu-sim-label">Similarity Score</div>
                        <div className="vu-sim-desc">
                          {result.match
                            ? "Above 75% threshold — high confidence match"
                            : result.name
                              ? "Close resemblance detected — manual review recommended"
                              : "Below match threshold — identity mismatch"}
                        </div>
                      </div>
                    </div>

                    {result.name && (
                      <div className="vu-match-meta">
                        {[
                          { key: "Name",            val: result.name },
                          { key: "Age",             val: typeof result.age === 'number' ? `${result.age} yrs` : result.age },
                          { key: "Gender",          val: result.gender },
                          { key: "Case ID",         val: <span className="vu-case-badge">{result.caseId}</span> },
                          { key: "Reported On",     val: result.reportedOn },
                          { key: "Station Name",    val: result.station },
                          { key: "Station Address", val: result.stationAddress },
                          { key: "Station Contact", val: result.stationContact },
                          { key: "Last Address",    val: result.address },
                          { key: "Contact",         val: result.contact },
                        ].map((m) => (
                          <div className="vu-meta-row" key={m.key}>
                            <span className="vu-meta-key">{m.key}</span>
                            <span className="vu-meta-val">{m.val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Mark as Completed */}
                    {result.match && result.station !== "Not Assigned" && !showCompletionBox && (
                      <button
                        className="vu-btn complete"
                        style={{ width: '100%', marginTop: '16px' }}
                        onClick={() => setShowCompletionBox(true)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Mark as Completed
                      </button>
                    )}

                    {/* Completion Box */}
                    {result.match && result.station !== "Not Assigned" && showCompletionBox && (
                      <div className="vu-completion-box">
                        <h4>Resolution Details</h4>
                        <div className="vu-completion-station">
                          <strong>Station:</strong> {result.station}
                        </div>
                        <input
                          type="text"
                          placeholder="Enter Found Location"
                          value={foundLocation}
                          onChange={(e) => setFoundLocation(e.target.value)}
                        />
                        <textarea
                          placeholder="Officer Notes (optional)"
                          value={officerNotes}
                          onChange={(e) => setOfficerNotes(e.target.value)}
                        />
                        <div className="vu-completion-actions">
                          <button
                            className="vu-btn-cancel-completion"
                            onClick={() => { setShowCompletionBox(false); setFoundLocation(""); setOfficerNotes(""); }}
                          >
                            Cancel
                          </button>
                          <button
                            className="vu-btn complete"
                            style={{ flex: 1 }}
                            disabled={!foundLocation}
                            onClick={handleMarkCompleted}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            Confirm &amp; Complete
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Station not assigned */}
                    {result.match && result.station === "Not Assigned" && (
                      <div style={{
                        marginTop: '16px', padding: '10px 14px',
                        background: 'var(--amber-bg)', border: '1px solid var(--amber-border)',
                        borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '10px',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a0622a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span style={{ fontSize: '12px', color: 'var(--amber)', fontWeight: '600' }}>
                          A police station must be assigned before this case can be completed.
                        </span>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* How it works */}
              {!result && (
                <div className="vu-info-card">
                  <div className="vu-info-title">How It Works</div>
                  <div className="vu-info-tip">
                    <div className="vu-info-tip-icon">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <span>
                      Capture a clear, well-lit photo of the unknown person. The system runs a four-stage facial similarity check against all open missing persons cases and returns a confidence score. A score above 80% confirms a match.
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyUnknown;