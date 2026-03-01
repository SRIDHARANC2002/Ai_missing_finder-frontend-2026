import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  // ✅ STEP 1 — agreeToTerms added to formData
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    agreeToTerms: false,
  });

  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ STEP 2 — handleChange supports checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: updatedValue });
    if (name === "password") calcStrength(value);
  };

  const calcStrength = (val) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  };

  const strengthLabel = ["Too short", "Weak", "Fair", "Strong", "Very strong"][strength];
  const strengthColor = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // ✅ STEP 4 — Debug log
    console.log("Form Data Sending:", formData);

    try {
      const data = await register(formData);

      localStorage.setItem("userInfo", JSON.stringify(data));
      setSuccess("Account created successfully! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.log(err.response?.data);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Lato:wght@300;400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --maroon:       #6b0f1a;
          --maroon-deep:  #4a0a12;
          --maroon-mid:   #7d1320;
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

        .reg-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Lato', sans-serif;
          background: var(--maroon-deep);
          overflow: hidden;
        }

        /* ── LEFT PANEL ── */
        .reg-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 56px;
          background: var(--maroon-deep);
          position: relative;
          overflow: hidden;
        }

        /* diagonal pattern */
        .reg-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px,
            transparent 1px, transparent 28px
          );
          pointer-events: none;
        }

        /* right border gold */
        .reg-left::after {
          content: '';
          position: absolute;
          top: 0; right: 0; bottom: 0; width: 1px;
          background: linear-gradient(180deg, transparent, rgba(184,134,11,0.4), transparent);
        }

        .left-gold-stripe {
          position: absolute;
          bottom: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
        }

        /* Brand */
        .brand {
          display: flex; align-items: center; gap: 12px;
          position: relative; z-index: 1;
        }

        .brand-logo {
          width: 44px; height: 44px;
          background: var(--maroon-mid);
          border: 2px solid var(--gold);
          border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 19px; font-weight: 800;
          color: white; line-height: 1.1;
        }

        .brand-sub {
          font-size: 10px; color: var(--gold-light);
          letter-spacing: 1.2px; text-transform: uppercase; font-weight: 700;
        }

        /* Hero */
        .left-hero { position: relative; z-index: 1; }

        .left-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: var(--gold-light); margin-bottom: 20px;
        }

        .eyebrow-line { width: 22px; height: 1.5px; background: var(--gold); }

        .left-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3.2vw, 46px);
          font-weight: 800; line-height: 1.1;
          color: white; letter-spacing: -0.5px; margin-bottom: 16px;
        }

        .left-hero h1 em { font-style: italic; color: var(--gold-light); }

        .left-hero p {
          font-size: 15px; color: rgba(255,255,255,0.5);
          line-height: 1.75; max-width: 340px; font-weight: 300;
        }

        /* Steps */
        .steps { position: relative; z-index: 1; }

        .steps-title {
          font-size: 10.5px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
          margin-bottom: 18px; padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .step {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .step:last-child { border-bottom: none; }

        .step-num {
          width: 34px; height: 34px;
          background: rgba(184,134,11,0.1);
          border: 1px solid rgba(184,134,11,0.25);
          border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 700;
          color: var(--gold-light);
        }

        .step-body strong {
          display: block; font-size: 13.5px; font-weight: 700;
          color: rgba(255,255,255,0.85); margin-bottom: 3px; letter-spacing: 0.1px;
        }

        .step-body span {
          font-size: 12.5px; color: rgba(255,255,255,0.35); font-weight: 300;
        }

        /* Bottom notice */
        .left-notice {
          position: relative; z-index: 1;
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 14px;
          background: rgba(184,134,11,0.07);
          border: 1px solid rgba(184,134,11,0.18);
          border-radius: 3px;
          font-size: 12px; color: rgba(255,255,255,0.35); line-height: 1.55;
        }

        .notice-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #fbbf24; flex-shrink: 0; margin-top: 4px;
          animation: npulse 2s infinite;
        }

        @keyframes npulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        /* ── RIGHT PANEL ── */
        .reg-right {
          width: 520px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 44px 52px;
          background: var(--white);
          position: relative;
          overflow-y: auto;
        }

        /* gold top bar */
        .reg-right::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, var(--maroon), var(--gold), var(--maroon));
        }

        /* official tag */
        .official-tag {
          position: absolute; top: 20px; right: 52px;
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.8px; text-transform: uppercase; color: var(--gold);
          background: var(--gold-pale); border: 1px solid rgba(184,134,11,0.25);
          padding: 4px 10px; border-radius: 2px;
        }

        .card-header { margin-bottom: 28px; }

        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 27px; font-weight: 800;
          color: var(--maroon-deep); letter-spacing: -0.5px;
          margin-bottom: 5px; line-height: 1.1;
        }

        .card-sub { font-size: 13.5px; color: var(--text-muted); font-weight: 300; }

        /* Section label */
        .form-section-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 10px; margin-top: 6px;
          display: flex; align-items: center; gap: 8px;
        }

        .form-section-label::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        /* Row */
        .field-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
        }

        /* Field */
        .field { margin-bottom: 14px; }

        .field label {
          display: flex; align-items: center; gap: 4px;
          font-size: 11.5px; font-weight: 700;
          color: var(--text-mid); text-transform: uppercase;
          letter-spacing: 0.8px; margin-bottom: 7px;
        }

        .req { color: var(--gold); font-size: 14px; line-height: 1; }

        .input-wrap { position: relative; }

        .input-wrap svg {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted); opacity: 0.45;
          transition: opacity 0.2s, color 0.2s;
          pointer-events: none;
        }

        .input-wrap.focused svg { opacity: 1; color: var(--maroon); }

        .field input {
          width: 100%;
          padding: 11px 14px 11px 41px;
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: 3px;
          font-family: 'Lato', sans-serif;
          font-size: 14px; font-weight: 400;
          color: var(--text-dark); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .field input::placeholder { color: var(--text-muted); opacity: 0.45; }

        .field input:focus {
          border-color: var(--maroon);
          background: var(--maroon-pale);
          box-shadow: 0 0 0 3px rgba(107,15,26,0.07);
        }

        /* Password strength */
        .strength-row {
          display: flex; gap: 5px; margin-top: 8px; align-items: center;
        }

        .strength-bar {
          flex: 1; height: 3px; border-radius: 99px;
          background: var(--border); transition: background 0.3s;
        }

        .strength-label {
          font-size: 11px; font-weight: 700;
          min-width: 68px; text-align: right; transition: color 0.3s;
          letter-spacing: 0.2px;
        }

        /* Error / Success boxes */
        .error-box {
          display: flex; align-items: flex-start; gap: 9px;
          padding: 11px 14px;
          background: #fff5f5;
          border: 1.5px solid #fca5a5;
          border-radius: 3px;
          margin-bottom: 14px;
          font-size: 13px; color: #b91c1c;
          line-height: 1.5; font-weight: 400;
        }

        .error-box svg { flex-shrink: 0; margin-top: 1px; color: #ef4444; }

        .success-box {
          display: flex; align-items: flex-start; gap: 9px;
          padding: 11px 14px;
          background: #f0fdf4;
          border: 1.5px solid #86efac;
          border-radius: 3px;
          margin-bottom: 14px;
          font-size: 13px; color: #15803d;
          line-height: 1.5; font-weight: 400;
        }

        .success-box svg { flex-shrink: 0; margin-top: 1px; color: #22c55e; }

        /* Terms */
        .terms {
          display: flex; align-items: flex-start; gap: 10px;
          margin: 16px 0 4px;
          padding: 12px 14px;
          background: var(--gold-pale);
          border: 1px solid rgba(184,134,11,0.2);
          border-radius: 3px;
        }

        .terms input[type="checkbox"] {
          accent-color: var(--maroon);
          width: 15px; height: 15px;
          margin-top: 2px; cursor: pointer; flex-shrink: 0;
        }

        .terms span {
          font-size: 12.5px; color: var(--text-mid); line-height: 1.55; font-weight: 400;
        }

        .terms a {
          color: var(--maroon); text-decoration: none; font-weight: 700;
        }

        .terms a:hover { color: var(--gold); }

        /* Submit */
        .submit-btn {
          width: 100%; padding: 13px;
          margin-top: 18px;
          background: var(--maroon);
          border: 2px solid var(--maroon);
          border-radius: 3px;
          font-family: 'Lato', sans-serif;
          font-size: 15px; font-weight: 700;
          color: white; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
          letter-spacing: 0.3px;
          position: relative; overflow: hidden;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--maroon-deep);
          border-color: var(--maroon-deep);
          box-shadow: 0 4px 16px rgba(107,15,26,0.3);
          transform: translateY(-1px);
        }

        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* gold shimmer */
        .submit-btn::after {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212,160,23,0.15), transparent);
          transition: left 0.5s;
        }

        .submit-btn:hover::after { left: 150%; }

        .btn-loader { display: inline-flex; align-items: center; gap: 10px; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .divider {
          display: flex; align-items: center; gap: 12px; margin: 20px 0;
        }

        .divider span {
          font-size: 12px; color: var(--text-muted); font-weight: 700; letter-spacing: 0.5px;
        }

        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        .login-link {
          text-align: center; font-size: 13.5px; color: var(--text-muted);
        }

        .login-link a {
          color: var(--maroon); text-decoration: none; font-weight: 700; transition: color 0.2s;
        }

        .login-link a:hover { color: var(--gold); }

        /* Trust strip */
        .trust-strip {
          margin-top: 22px; padding-top: 18px;
          border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          gap: 18px; flex-wrap: wrap;
        }

        .trust-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: var(--text-muted);
          font-weight: 700; letter-spacing: 0.2px;
        }

        .trust-item svg { color: var(--gold); flex-shrink: 0; }

        /* Responsive */
        @media (max-width: 860px) {
          .reg-left { display: none; }
          .reg-right { width: 100%; padding: 48px 28px; }
          .official-tag { right: 28px; }
          .field-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="reg-root">

        {/* ── LEFT PANEL ── */}
        <div className="reg-left">
          <div className="left-gold-stripe" />

          <div className="brand">
            <div className="brand-logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="brand-name">AI Missing Finder</div>
              <div className="brand-sub">National Missing Persons Portal</div>
            </div>
          </div>

          <div className="left-hero">
            <div className="left-eyebrow">
              <div className="eyebrow-line" />
              Citizen Registration
              <div className="eyebrow-line" />
            </div>
            <h1>
              Join the<br />
              <em>National Network.</em><br />
              Help Find Them.
            </h1>
            <p>
              Register in seconds to file missing person reports, track active cases, and receive real-time match alerts — all from one secure portal.
            </p>
          </div>

          <div className="steps">
            <div className="steps-title">How Registration Works</div>
            {[
              { n: "1", title: "Create your account", sub: "Fill in your details on the right panel" },
              { n: "2", title: "Verify your email", sub: "We'll send a confirmation link to your inbox" },
              { n: "3", title: "Access your dashboard", sub: "Start filing and tracking missing person cases" },
            ].map(({ n, title, sub }) => (
              <div className="step" key={n}>
                <div className="step-num">{n}</div>
                <div className="step-body">
                  <strong>{title}</strong>
                  <span>{sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="left-notice">
            <div className="notice-dot" />
            This is an official government-authorised portal. All submitted data is protected under the IT Act, 2000 and the Data Protection Bill.
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="reg-right">

          <div className="official-tag">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Official Portal
          </div>

          <div className="card-header">
            <div className="card-title">Create Account</div>
            <div className="card-sub">All fields marked with <span style={{ color: "var(--gold)", fontWeight: 700 }}>*</span> are required</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section-label">Personal Information</div>

            {/* ── ERROR BOX ── */}
            {error && (
              <div className="error-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* ── SUCCESS BOX ── */}
            {success && (
              <div className="success-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {success}
              </div>
            )}

            {/* Name + Phone row */}
            <div className="field-row">
              <div className="field">
                <label>Full Name <span className="req">*</span></label>
                <div className={`input-wrap ${focused === "name" ? "focused" : ""}`}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused("")}
                  />
                </div>
              </div>

              <div className="field">
                <label>Phone <span className="req">*</span></label>
                <div className={`input-wrap ${focused === "phone" ? "focused" : ""}`}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 00000 00000"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused("")}
                  />
                </div>
              </div>
            </div>

            <div className="form-section-label">Account Details</div>

            {/* Email */}
            <div className="field">
              <label>Email Address <span className="req">*</span></label>
              <div className={`input-wrap ${focused === "email" ? "focused" : ""}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label>Password <span className="req">*</span></label>
              <div className={`input-wrap ${focused === "password" ? "focused" : ""}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  name="password"
                  placeholder="Min. 8 characters"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                />
              </div>

              {formData.password.length > 0 && (
                <div className="strength-row">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="strength-bar"
                      style={{ background: i <= strength ? strengthColor : undefined }}
                    />
                  ))}
                  <span className="strength-label" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </span>
                </div>
              )}
            </div>

            {/* ✅ STEP 3 — Checkbox wired to formData.agreeToTerms via handleChange */}
            <div className="terms">
              <input
                type="checkbox"
                id="terms"
                name="agreeToTerms"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <span>
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a> of the AI Missing Finder — National Missing Persons Portal
              </span>
            </div>

            <button type="submit" className="submit-btn" disabled={loading || !!success}>
              {loading ? (
                <span className="btn-loader">
                  <span className="spinner" />
                  Creating Account…
                </span>
              ) : (
                "Create Account — Free"
              )}
            </button>
          </form>

          <div className="divider"><span>already registered?</span></div>
          <p className="login-link">
            Have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
              Sign in instead
            </a>
          </p>

          <div className="trust-strip">
            {["256-bit Encrypted", "Govt. Verified", "GDPR Compliant"].map((t) => (
              <div className="trust-item" key={t}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {t}
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Register;