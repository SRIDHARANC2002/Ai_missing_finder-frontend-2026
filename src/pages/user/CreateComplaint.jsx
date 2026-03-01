import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "../../services/complaintService";

const CreateComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", gender: "", dob: "", education: "",
    missingTime: "", address: "", contactNumber: "", image: null,
  });
  const [focused, setFocused] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    await createComplaint(data);

    // ❌ Popup removed

    navigate("/user/complaints"); // redirect directly

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
  const ff = (name) => focused === name;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lato:wght@300;400;700;900&family=Inconsolata:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --M: #6b0f1a; --MD: #3e0810; --ML: #f8eef0; --MP: #fdf4f5;
          --G: #b8860b; --GL: #d4a017; --GB: #e8b84b; --GP: #fdf8ec;
          --TD: #1c0a0d; --TT: #7a5a60; --TL: #b09098;
          --BD: #ddc8cc; --W: #fff; --S: #faf6f7; --S2: #f4edef;
        }
        html { scroll-behavior: smooth; }
        .cr { background: var(--S); font-family: 'Lato', sans-serif; min-height: 100vh; color: var(--TD); }

        /* ── PAGE HEADER ── */
        .ph { background: var(--W); border-bottom: 1px solid var(--BD); position: sticky; top: 0; z-index: 100; }
        .ph::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, var(--MD), var(--GL), var(--MD)); }
        .ph-inner { max-width: 860px; margin: 0 auto; padding: 18px 40px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .ph-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: var(--GL); margin-bottom: 3px; }
        .ph-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800; color: var(--MD); letter-spacing: -0.4px; }
        .back-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 18px; border-radius: 2px;
          border: 1.5px solid var(--BD); background: var(--S);
          color: var(--TT); font-family: 'Lato', sans-serif;
          font-size: 12.5px; font-weight: 700; cursor: pointer; letter-spacing: 0.3px;
          transition: all 0.2s;
        }
        .back-btn:hover { background: var(--ML); color: var(--M); border-color: rgba(107,15,26,0.3); }

        /* ── BODY ── */
        .body { max-width: 860px; margin: 0 auto; padding: 36px 40px 80px; }

        /* Alert notice */
        .alert {
          display: flex; align-items: flex-start; gap: 14px;
          background: rgba(107,15,26,0.05); border: 1px solid rgba(107,15,26,0.18);
          border-left: 4px solid var(--M);
          border-radius: 3px; padding: 16px 20px; margin-bottom: 28px;
        }
        .alert-icon { color: var(--M); flex-shrink: 0; margin-top: 1px; }
        .alert strong { display: block; font-size: 13px; font-weight: 700; color: var(--MD); margin-bottom: 3px; }
        .alert span { font-size: 12.5px; color: var(--TT); line-height: 1.55; font-weight: 300; }

        /* Steps indicator */
        .steps { display: flex; align-items: center; margin-bottom: 28px; }
        .step {
          display: flex; align-items: center; gap: 9px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.3px; color: var(--TL);
        }
        .step.active { color: var(--MD); }
        .step-num {
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 900;
          border: 1.5px solid var(--BD); background: var(--W); color: var(--TT);
          transition: all 0.2s; flex-shrink: 0;
        }
        .step.active .step-num { background: var(--MD); border-color: var(--MD); color: var(--GB); }
        .step.done .step-num { background: var(--GP); border-color: var(--G); color: var(--G); }
        .step-conn { flex: 1; height: 1px; background: var(--BD); margin: 0 10px; }

        /* Form card */
        .fc {
          background: var(--W); border: 1px solid var(--BD);
          border-radius: 4px; overflow: hidden;
          box-shadow: 0 2px 16px rgba(62,8,16,0.05);
        }

        /* Section */
        .fs { padding: 28px 32px; border-bottom: 1px solid var(--BD); }
        .fs:last-of-type { border-bottom: none; }

        .sec-head {
          display: flex; align-items: center; gap: 12px; margin-bottom: 22px;
        }
        .sec-icon {
          width: 34px; height: 34px; border-radius: 3px;
          background: var(--MP); border: 1px solid var(--BD);
          display: flex; align-items: center; justify-content: center;
          color: var(--M); flex-shrink: 0;
        }
        .sec-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--MD); }
        .sec-sub { font-size: 12px; color: var(--TT); font-weight: 300; margin-top: 1px; }
        .sec-line { flex: 1; height: 1px; background: var(--BD); }

        /* Upload zone */
        .upload-zone {
          border: 1.5px dashed var(--BD); border-radius: 3px;
          padding: 36px 24px; text-align: center; cursor: pointer;
          transition: border-color 0.2s, background 0.2s; position: relative; overflow: hidden;
          background: var(--S);
        }
        .upload-zone.drag { border-color: var(--GL); background: var(--GP); }
        .upload-zone:hover { border-color: rgba(184,134,11,0.4); background: var(--GP); }
        .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .upload-preview { width: 110px; height: 110px; border-radius: 3px; object-fit: cover; margin: 0 auto 16px; display: block; border: 2px solid var(--BD); box-shadow: 0 4px 16px rgba(62,8,16,0.12); }
        .upload-icon { width: 52px; height: 52px; background: var(--ML); border: 1px solid var(--BD); border-radius: 3px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--M); }
        .upload-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--MD); margin-bottom: 6px; }
        .upload-sub { font-size: 13px; color: var(--TT); font-weight: 300; }
        .upload-sub span { color: var(--GL); font-weight: 700; }
        .upload-hint { font-size: 11px; color: var(--TL); margin-top: 8px; font-family: 'Inconsolata', monospace; }

        /* Grids */
        .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }

        /* Field */
        .field { display: flex; flex-direction: column; }
        .field label {
          font-size: 10.5px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1px; color: var(--TT); margin-bottom: 7px;
        }
        .field label span { color: var(--M); margin-left: 2px; }

        /* Input wrap */
        .iw { position: relative; }
        .iw svg.fi { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--TL); pointer-events: none; transition: color 0.2s; }
        .iw.foc svg.fi { color: var(--GL); }

        .field input,
        .field select,
        .field textarea {
          width: 100%; padding: 12px 14px 12px 40px;
          background: var(--W); border: 1.5px solid var(--BD);
          border-radius: 2px; font-family: 'Inconsolata', monospace;
          font-size: 13.5px; color: var(--TD); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          -webkit-appearance: none; appearance: none;
        }
        .field input::placeholder, .field textarea::placeholder { color: var(--TL); font-weight: 400; }
        .field input:focus, .field select:focus, .field textarea:focus {
          border-color: var(--GL); background: var(--GP);
          box-shadow: 0 0 0 3px rgba(184,134,11,0.1);
        }
        .field select { cursor: pointer; }
        .sel-arrow { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--TT); }
        .field textarea { padding: 12px 14px 12px 40px; resize: vertical; min-height: 100px; line-height: 1.6; font-size: 13px; }
        .tw { position: relative; }
        .tw svg.fi { position: absolute; left: 13px; top: 14px; color: var(--TL); pointer-events: none; transition: color 0.2s; }
        .tw.foc svg.fi { color: var(--GL); }

        /* Field hint */
        .f-hint { font-size: 11px; color: var(--TL); margin-top: 5px; font-family: 'Inconsolata', monospace; }

        /* Info row */
        .info-row {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; background: var(--S2);
          border: 1px solid var(--BD); border-radius: 2px; margin-top: 18px;
          font-size: 12px; color: var(--TT); font-weight: 400;
        }
        .info-row svg { color: var(--G); flex-shrink: 0; }

        /* Footer */
        .ff {
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 32px; border-top: 1px solid var(--BD);
          background: var(--S);
        }
        .ff-note { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--TT); }
        .ff-note svg { color: var(--G); }
        .submit-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 13px 32px; background: var(--MD); color: var(--GB);
          border: 1.5px solid var(--G); border-radius: 2px;
          font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; letter-spacing: 0.3px;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .submit-btn:hover:not(:disabled) { background: var(--M); box-shadow: 0 4px 20px rgba(62,8,16,0.3); transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .spinner { width: 15px; height: 15px; border: 2px solid rgba(232,184,75,0.3); border-top-color: var(--GB); border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 680px) {
          .ph-inner, .body { padding-left: 16px; padding-right: 16px; }
          .g2, .g3 { grid-template-columns: 1fr; }
          .fs { padding: 22px 18px; }
          .ff { flex-direction: column; gap: 14px; align-items: stretch; }
          .submit-btn { justify-content: center; }
          .steps { display: none; }
        }
      `}</style>

      <div className="cr">

        {/* PAGE HEADER */}
        <div className="ph">
          <div className="ph-inner">
            <div>
              <div className="ph-eyebrow">Citizen Portal</div>
              <div className="ph-title">Missing Person Report</div>
            </div>
            <button className="back-btn" onClick={() => history.back()}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </button>
          </div>
        </div>

        <div className="body">

          {/* Steps */}
          <div className="steps">
            {[["01", "Photo Upload"], ["02", "Personal Info"], ["03", "Contact & Location"]].map(([n, l], i) => (
              <div key={n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div className={`step ${i < 2 ? "done" : i === 2 ? "active" : ""}`}>
                  <div className="step-num">
                    {i < 2 ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> : n}
                  </div>
                  {l}
                </div>
                {i < 2 && <div className="step-conn" />}
              </div>
            ))}
          </div>

          {error && (
            <div className="alert" style={{ background: "rgba(158,58,71,0.05)", borderColor: "rgba(158,58,71,0.2)", borderLeftColor: "#9e3a47", marginBottom: "20px" }}>
              <div className="alert-icon" style={{ color: "#9e3a47" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <strong>Error Submitting Report</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Alert */}
          <div className="alert">
            <div className="alert-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <strong>Submitting false information is a criminal offence</strong>
              <span>All reports are verified by a duty officer under the IT Act, 2000. Ensure all details are accurate and truthful before submitting.</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="fc">

              {/* ── SECTION 1: Photo ── */}
              <div className="fs">
                <div className="sec-head">
                  <div className="sec-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div>
                    <div className="sec-title">Person's Photograph</div>
                    <div className="sec-sub">Upload a recent, clear photo of the missing person</div>
                  </div>
                  <div className="sec-line" />
                </div>

                <div
                  className={`upload-zone ${dragging ? "drag" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <input type="file" name="image" accept="image/*" required onChange={handleChange} />
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" className="upload-preview" />
                      <div className="upload-title">Photo uploaded</div>
                      <div className="upload-sub">Click or drag to <span>replace</span></div>
                    </>
                  ) : (
                    <>
                      <div className="upload-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <div className="upload-title">Upload a clear photograph</div>
                      <div className="upload-sub">Drag & drop here or <span>browse files</span></div>
                      <div className="upload-hint">JPG, PNG or WEBP · Maximum 5MB · Front-facing preferred</div>
                    </>
                  )}
                </div>
              </div>

              {/* ── SECTION 2: Personal Info ── */}
              <div className="fs">
                <div className="sec-head">
                  <div className="sec-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="sec-title">Personal Information</div>
                    <div className="sec-sub">Provide accurate details as per identity documents</div>
                  </div>
                  <div className="sec-line" />
                </div>

                <div className="g2" style={{ marginBottom: "18px" }}>
                  <div className="field">
                    <label>Full Name <span>*</span></label>
                    <div className={`iw ${ff("name") ? "foc" : ""}`}>
                      <svg className="fi" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                      <input type="text" name="name" placeholder="e.g. Ravi Kumar" required onChange={handleChange} onFocus={() => setFocused("name")} onBlur={() => setFocused("")} />
                    </div>
                    <div className="f-hint">As per Aadhaar / identity proof</div>
                  </div>

                  <div className="field">
                    <label>Gender <span>*</span></label>
                    <div className={`iw ${ff("gender") ? "foc" : ""}`} style={{ position: "relative" }}>
                      <svg className="fi" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="8" /><line x1="12" y1="16" x2="12" y2="22" /><line x1="9" y1="19" x2="15" y2="19" /></svg>
                      <select name="gender" required onChange={handleChange} onFocus={() => setFocused("gender")} onBlur={() => setFocused("")}>
                        <option value="">Select gender</option>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                      <svg className="sel-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                  </div>
                </div>

                <div className="g3">
                  <div className="field">
                    <label>Date of Birth <span>*</span></label>
                    <div className={`iw ${ff("dob") ? "foc" : ""}`}>
                      <svg className="fi" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      <input type="date" name="dob" required onChange={handleChange} onFocus={() => setFocused("dob")} onBlur={() => setFocused("")} />
                    </div>
                  </div>

                  <div className="field">
                    <label>Education Level</label>
                    <div className={`iw ${ff("education") ? "foc" : ""}`}>
                      <svg className="fi" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                      <input type="text" name="education" placeholder="e.g. 10th Grade" onChange={handleChange} onFocus={() => setFocused("education")} onBlur={() => setFocused("")} />
                    </div>
                  </div>

                  <div className="field">
                    <label>Time of Missing <span>*</span></label>
                    <div className={`iw ${ff("missingTime") ? "foc" : ""}`}>
                      <svg className="fi" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      <input type="datetime-local" name="missingTime" required onChange={handleChange} onFocus={() => setFocused("missingTime")} onBlur={() => setFocused("")} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: Contact ── */}
              <div className="fs">
                <div className="sec-head">
                  <div className="sec-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div className="sec-title">Contact & Location</div>
                    <div className="sec-sub">Last known whereabouts and your contact details</div>
                  </div>
                  <div className="sec-line" />
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <div className="field">
                    <label>Last Known Address <span>*</span></label>
                    <div className={`tw ${ff("address") ? "foc" : ""}`}>
                      <svg className="fi" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      <textarea name="address" placeholder="House no., Street, Area, City, PIN code" required onChange={handleChange} onFocus={() => setFocused("address")} onBlur={() => setFocused("")} />
                    </div>
                    <div className="f-hint">Include all available location details</div>
                  </div>
                </div>

                <div className="field" style={{ maxWidth: "380px" }}>
                  <label>Reporter's Contact Number <span>*</span></label>
                  <div className={`iw ${ff("contactNumber") ? "foc" : ""}`}>
                    <svg className="fi" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    <input type="tel" name="contactNumber" placeholder="+91 00000 00000" required value={formData.contactNumber} onChange={handleChange} onFocus={() => setFocused("contactNumber")} onBlur={() => setFocused("")} />
                  </div>
                  <div className="f-hint">You will receive case updates on this number</div>
                </div>

                <div className="info-row">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  All submitted data is encrypted and stored securely under the IT Act, 2000. Your contact details are only shared with the assigned duty officer.
                </div>
              </div>

              {/* FOOTER */}
              <div className="ff">
                <div className="ff-note">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Encrypted · Verified within 24 hours
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <><span className="spinner" /> Submitting Report…</>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                      Submit Report
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateComplaint;