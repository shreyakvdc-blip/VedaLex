import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="login-page">

      {/* Left side */}
      <div className="login-visual">

        <img
          src="/vedalex-logo.png"
          alt="VedaLex"
          className="login-logo"
        />

        <h1>नमस्ते</h1>

        <p>
          Your trusted AI assistant for Ayurveda,
          IPR and regulatory guidance.
        </p>

        <div className="login-quote">
          <span>Knowledge rooted in Ayurveda.</span>
          <span>Guidance powered by intelligence.</span>
        </div>

      </div>

      {/* Right side */}
      <div className="login-box">

        <div className="login-card">

          <h2>
            {isSignup ? "Create your account" : 'स्वागतम्'}
          </h2>

          <p className="login-subtitle">
            {isSignup
              ? "Join VedaLex and explore trusted Ayurveda knowledge."
              : "Sign in to continue to VedaLex."}
          </p>

          {isSignup && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button
            className="login-button"
            onClick={onLogin}
          >
            {isSignup ? "Create Account" : "Sign In"}
          </button>

          <div className="switch-mode">

            <span>
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>

            <button
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;