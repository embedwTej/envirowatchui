import React, { useState } from 'react';
import { 
  Users, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Activity, 
  Lock, 
  Cpu, 
  ArrowRight,
  Server
} from 'lucide-react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('Dufil');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    setError('');
    onLogin({ name: username, role: 'ADMIN' });
  };

  const handleQuickLogin = (user, role) => {
    setUsername(user);
    onLogin({ name: user, role });
  };

  return (
    <div className="login-page-luxury">
      {/* Background ambient lighting */}
      <div className="login-bg-glow"></div>

      <div className="login-stage-container">
        {/* Left Side: Enterprise Showcase */}
        <div className="login-hero-showcase">
          <div className="hero-brand-top">
            <div className="hero-brand-badge">
              <span>E</span>
            </div>
            <div>
              <span className="hero-brand-title">Enviro Watch</span>
              <span className="hero-brand-tag">Industrial IoT Telemetry</span>
            </div>
          </div>

          <div className="hero-center-content">
            <div className="hero-badge-tag">
              <span className="hero-pulse-dot"></span>
              <span>Next-Gen Factory Environment Monitoring</span>
            </div>
            <h1 className="hero-headline">
              Realtime Environmental Intelligence for Smart Manufacturing.
            </h1>
            <p className="hero-subtext">
              Unified telemetry across 22+ facility sectors, monitoring critical temperature, 
              acoustic decibels, air luminosity, humidity, and wastewater compliance.
            </p>

            <div className="hero-specs-grid">
              <div className="spec-card">
                <div className="spec-icon">
                  <Activity size={18} />
                </div>
                <div className="spec-info">
                  <span className="spec-number">&lt; 1.0s</span>
                  <span className="spec-label">Sub-Second Latency</span>
                </div>
              </div>

              <div className="spec-card">
                <div className="spec-icon">
                  <Cpu size={18} />
                </div>
                <div className="spec-info">
                  <span className="spec-number">100%</span>
                  <span className="spec-label">Edge Sensor Uptime</span>
                </div>
              </div>

              <div className="spec-card">
                <div className="spec-icon">
                  <ShieldCheck size={18} />
                </div>
                <div className="spec-info">
                  <span className="spec-number">ISO 14001</span>
                  <span className="spec-label">Audit Compliant</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-footer-copy">
            <span>Powered by Metayb Industrial IoT Framework</span>
          </div>
        </div>

        {/* Right Side: Professional Login Card */}
        <div className="login-form-wrapper">
          <div className="login-glass-card">
            <div className="login-card-header">
              <div className="login-icon-box">
                <Users size={20} />
              </div>
              <div className="login-header-text">
                <h2>Portal Access</h2>
                <p>Welcome back! Enter credentials to access supervisory telemetry.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="login-error-msg">{error}</div>}

              <div className="form-group">
                <label htmlFor="username">User Name</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your user name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="login-actions">
                <button type="submit" className="login-btn-luxury">
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            {/* Quick Demo Selector for Client Presentations */}
            <div className="client-demo-profiles">
              <span className="demo-label">Demo Quick Logins:</span>
              <div className="demo-pills">
                <button 
                  type="button"
                  className="demo-pill"
                  onClick={() => handleQuickLogin('Dufil', 'ADMIN')}
                >
                  Dufil (Admin)
                </button>
                <button 
                  type="button"
                  className="demo-pill"
                  onClick={() => handleQuickLogin('Faizal Rahman', 'ADMIN')}
                >
                  Metayb Admin
                </button>
                <button 
                  type="button"
                  className="demo-pill"
                  onClick={() => handleQuickLogin('Plant Operator', 'OPERATOR')}
                >
                  Plant Operator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
