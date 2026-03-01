import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginService } from "../services/authService";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("LOGIN REQUEST:", { email: formData.email, role: formData.role });
      const data = await loginService(formData.email, formData.password, formData.role);

      localStorage.setItem("userInfo", JSON.stringify(data));
      login({ email: formData.email, role: data.role || formData.role, ...data });

      const role = data.role || formData.role;
      navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");

    } catch (err) {
      // ✅ FIXED: proper catch with all fallbacks + always stops loading
      console.log("LOGIN ERROR:", err.response?.data);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        "Login failed. Please check your credentials."
      );
    } finally {
      // ✅ FIXED: finally ensures spinner always stops
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

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Lato', sans-serif;
          background: var(--maroon-deep);
          overflow: hidden;
        }

        /* ── LEFT PANEL ── */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 56px;
          background: var(--maroon-deep);
          position: relative;
          overflow: hidden;
        }

        /* Diagonal pattern like home hero */
        .login-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px,
            transparent 1px, transparent 28px
          );
          pointer-events: none;
        }

        /* Gold bottom stripe */
        .left-gold-stripe {
          position: absolute;
          bottom: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent);
        }

        /* Right gold border */
        .login-left::after {
          content: '';
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(184,134,11,0.4), transparent);
        }

        /* Brand / logo */
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
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

        .brand-text {}
        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 19px; font-weight: 800;
          color: white; line-height: 1.1; letter-spacing: -0.3px;
        }
        .brand-sub {
          font-size: 10px; color: var(--gold-light);
          letter-spacing: 1.2px; text-transform: uppercase; font-weight: 700;
        }

        /* Hero text */
        .left-hero {
          position: relative; z-index: 1;
        }

        .left-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: var(--gold-light);
          margin-bottom: 22px;
        }

        .eyebrow-line { width: 22px; height: 1.5px; background: var(--gold); }

        .left-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(30px, 3.5vw, 50px);
          font-weight: 800; line-height: 1.1;
          color: white; letter-spacing: -0.5px;
          margin-bottom: 18px;
        }

        .left-hero h1 em {
          font-style: italic; color: var(--gold-light);
        }

        .left-hero p {
          font-size: 15px;
          color: rgba(255,255,255,0.5);
          line-height: 1.75; max-width: 360px;
          font-weight: 300;
        }

        /* Stats row */
        .stat-row {
          display: flex; gap: 0;
          position: relative; z-index: 1;
          border: 1px solid rgba(184,134,11,0.2);
          border-radius: 3px; overflow: hidden;
        }

        .stat-cell {
          flex: 1; padding: 18px 20px;
          border-right: 1px solid rgba(184,134,11,0.15);
          background: rgba(255,255,255,0.03);
          transition: background 0.2s;
        }

        .stat-cell:last-child { border-right: none; }
        .stat-cell:hover { background: rgba(184,134,11,0.07); }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 24px; font-weight: 800;
          color: white; letter-spacing: -0.5px;
          line-height: 1; margin-bottom: 4px;
        }

        .stat-lbl {
          font-size: 10px; font-weight: 700;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase; letter-spacing: 1px;
        }

        /* Notice strip inside left */
        .left-notice {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px;
          background: rgba(184,134,11,0.08);
          border: 1px solid rgba(184,134,11,0.2);
          border-radius: 3px;
          font-size: 12px; color: rgba(255,255,255,0.4);
          line-height: 1.5;
        }

        .notice-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #fbbf24; flex-shrink: 0;
          animation: npulse 2s infinite;
        }

        @keyframes npulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        /* ── RIGHT PANEL ── */
        .login-right {
          width: 500px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 52px;
          background: var(--white);
          position: relative;
        }

        /* Gold top accent */
        .login-right::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, var(--maroon), var(--gold), var(--maroon));
        }

        /* Official tag top right */
        .official-tag {
          position: absolute;
          top: 20px; right: 52px;
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.8px; text-transform: uppercase;
          color: var(--gold);
          background: var(--gold-pale);
          border: 1px solid rgba(184,134,11,0.25);
          padding: 4px 10px; border-radius: 2px;
        }

        .card-header { margin-bottom: 32px; }

        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 800;
          color: var(--maroon-deep); letter-spacing: -0.5px;
          margin-bottom: 6px; line-height: 1.1;
        }

        .card-sub {
          font-size: 14px; color: var(--text-muted); font-weight: 300;
        }

        /* Section divider */
        .form-section-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 10px; margin-top: 4px;
          display: flex; align-items: center; gap: 8px;
        }

        .form-section-label::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        /* Role toggle */
        .role-toggle {
          display: flex;
          background: var(--maroon-pale);
          border: 1px solid var(--border);
          border-radius: 3px; padding: 4px;
          margin-bottom: 28px; gap: 4px;
        }

        .role-btn {
          flex: 1; padding: 10px 12px;
          border: none; border-radius: 2px;
          font-family: 'Lato', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          background: transparent;
          color: var(--text-muted);
          display: flex; align-items: center; justify-content: center; gap: 7px;
          letter-spacing: 0.2px;
        }

        .role-btn.active {
          background: var(--maroon);
          color: white;
          box-shadow: 0 2px 8px rgba(107,15,26,0.25);
        }

        .role-btn:hover:not(.active) {
          color: var(--maroon); background: var(--maroon-light);
        }

        /* Field */
        .field { margin-bottom: 18px; }

        .field label {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; font-weight: 700;
          color: var(--text-mid);
          text-transform: uppercase; letter-spacing: 0.8px;
          margin-bottom: 7px;
        }

        .req { color: var(--gold); font-size: 14px; line-height: 1; }

        .input-wrap { position: relative; }

        .input-wrap svg {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted); opacity: 0.5;
          transition: opacity 0.2s, color 0.2s;
          pointer-events: none;
        }

        .input-wrap.focused svg {
          opacity: 1; color: var(--maroon);
        }

        .field input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: 3px;
          font-family: 'Lato', sans-serif;
          font-size: 14px; font-weight: 400;
          color: var(--text-dark);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .field input::placeholder { color: var(--text-muted); opacity: 0.5; }

        .field input:focus {
          border-color: var(--maroon);
          background: var(--maroon-pale);
          box-shadow: 0 0 0 3px rgba(107,15,26,0.07);
        }

        /* Error box */
        .error-box {
          display: flex; align-items: flex-start; gap: 9px;
          padding: 11px 14px;
          background: #fff5f5;
          border: 1.5px solid #fca5a5;
          border-radius: 3px;
          margin-bottom: 16px;
          font-size: 13px;
          color: #b91c1c;
          line-height: 1.5;
          font-weight: 400;
        }

        .error-box svg { flex-shrink: 0; margin-top: 1px; color: #ef4444; }

        .forgot {
          display: flex; justify-content: flex-end; margin-top: 6px;
        }

        .forgot a {
          font-size: 12.5px; color: var(--gold);
          text-decoration: none; font-weight: 700;
          transition: color 0.2s;
        }

        .forgot a:hover { color: var(--maroon); }

        /* Submit button */
        .submit-btn {
          width: 100%; padding: 14px;
          margin-top: 26px;
          background: var(--maroon);
          border: 2px solid var(--maroon);
          border-radius: 3px;
          font-family: 'Lato', sans-serif;
          font-size: 15px; font-weight: 700;
          color: white; cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
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

        /* Gold shimmer on submit */
        .submit-btn::after {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212,160,23,0.15), transparent);
          transition: left 0.5s;
        }

        .submit-btn:hover::after { left: 150%; }

        .btn-loader {
          display: inline-flex; align-items: center; gap: 10px;
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .divider {
          display: flex; align-items: center; gap: 12px; margin: 22px 0;
        }

        .divider span {
          font-size: 12px; color: var(--text-muted); font-weight: 700;
          letter-spacing: 0.5px;
        }

        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        /* Signup link */
        .signup-link {
          text-align: center; font-size: 13.5px;
          color: var(--text-muted);
        }

        .signup-link a {
          color: var(--maroon); text-decoration: none;
          font-weight: 700; transition: color 0.2s;
        }

        .signup-link a:hover { color: var(--gold); }

        /* Trust strip at bottom of form */
        .trust-strip {
          margin-top: 28px; padding-top: 20px;
          border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          gap: 20px; flex-wrap: wrap;
        }

        .trust-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: var(--text-muted);
          font-weight: 700; letter-spacing: 0.2px;
        }

        .trust-item svg { color: var(--gold); flex-shrink: 0; }

        /* Responsive */
        @media (max-width: 860px) {
          .login-left { display: none; }
          .login-right { width: 100%; padding: 48px 28px; }
          .official-tag { right: 28px; }
        }
      `}</style>

      <div className="login-root">

        {/* ── LEFT PANEL ── */}
        <div className="login-left">
          <div className="left-gold-stripe" />

          <div className="brand">
            <div className="brand-logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-name">AI Missing Finder</div>
              <div className="brand-sub">National Missing Persons Portal</div>
            </div>
          </div>

          <div className="left-hero">
            <div className="left-eyebrow">
              <div className="eyebrow-line" />
              Secure Portal Access
              <div className="eyebrow-line" />
            </div>
            <h1>
              Every Login.<br />
              <em>Every Second.</em><br />
              Lives Matter.
            </h1>
            <p>
              Access India's official AI-powered missing persons platform. Secure, verified, and operational around the clock to reunite families.
            </p>
          </div>

          <div>
            <div className="stat-row">
              <div className="stat-cell">
                <div className="stat-num">2,400+</div>
                <div className="stat-lbl">Resolved</div>
              </div>
              <div className="stat-cell">
                <div className="stat-num">97%</div>
                <div className="stat-lbl">Accuracy</div>
              </div>
              <div className="stat-cell">
                <div className="stat-num">24/7</div>
                <div className="stat-lbl">Uptime</div>
              </div>
            </div>

            <div style={{ height: "12px" }} />

            <div className="left-notice">
              <div className="notice-dot" />
              This is an official government-authorised portal. Unauthorised access is a punishable offence under the IT Act, 2000.
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="login-right">

          <div className="official-tag">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Official Portal
          </div>

          <div className="card-header">
            <div className="card-title">Sign In</div>
            <div className="card-sub">Access your dashboard — Citizen or Police Admin</div>
          </div>

          <div className="form-section-label">Select Role</div>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn ${formData.role === "user" ? "active" : ""}`}
              onClick={() => setFormData({ ...formData, role: "user" })}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              Citizen
            </button>
            <button
              type="button"
              className={`role-btn ${formData.role === "admin" ? "active" : ""}`}
              onClick={() => setFormData({ ...formData, role: "admin" })}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Police Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section-label">Account Details</div>

            {/* ── ERROR BOX ── */}
            {error && (
              <div className="error-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="field">
              <label>
                Email Address <span className="req">*</span>
              </label>
              <div className={`input-wrap ${focused === "email" ? "focused" : ""}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <label>
                Password <span className="req">*</span>
              </label>
              <div className={`input-wrap ${focused === "password" ? "focused" : ""}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                />
              </div>
              <div className="forgot"><a href="#">Forgot password?</a></div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loader">
                  <span className="spinner" />
                  Authenticating…
                </span>
              ) : (
                `Sign In as ${formData.role === "admin" ? "Police Admin" : "Citizen"}`
              )}
            </button>
          </form>

          {formData.role === "user" && (
            <>
              <div className="divider"><span>or</span></div>
              <p className="signup-link">
                Don't have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>
                  Register here
                </a>
              </p>
            </>
          )}

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

export default Login;