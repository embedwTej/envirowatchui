import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Wifi, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  Sparkles,
  RefreshCw,
  Sliders,
  ExternalLink
} from 'lucide-react';

import DufilLogo from './DufilLogo';

export default function Navbar({ 
  currentViewTitle, 
  alerts = [], 
  onSimulatePulse, 
  onOpenAlerts 
}) {
  const [timeStr, setTimeStr] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadAlerts = alerts.filter(a => !a.acknowledged);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <div className="page-breadcrumb">
          <DufilLogo size="small" showTagline={false} />
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{currentViewTitle}</span>
        </div>

        <div className="live-stream-badge">
          <span className="pulse-dot"></span>
          <span className="stream-text">LIVE</span>
          <span className="stream-sep">•</span>
          <span className="gateway-text">Connected</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Plant Clock */}
        <div className="plant-clock">
          <Clock size={14} className="clock-icon" />
          <span>{timeStr || '11:29:40'}</span>
        </div>

        {/* Live Simulation Pulse Button (for client demos!) */}
        <button 
          className="navbar-tool-btn pulse-action-btn"
          onClick={onSimulatePulse}
          title="Simulate Real-time Sensor Packet"
        >
          <RefreshCw size={14} className="spin-on-click" />
          <span className="pulse-btn-text">Sync Telemetry</span>
        </button>

        {/* Notifications Bell */}
        <div className="notification-wrapper">
          <button 
            className={`navbar-icon-btn ${unreadAlerts.length > 0 ? 'has-alerts' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Active Notifications"
            aria-label="Active Notifications"
          >
            <Bell size={18} />
            {unreadAlerts.length > 0 && (
              <span className="bell-badge">{unreadAlerts.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown animate-fade-in">
              <div className="notification-header">
                <div>
                  <h4>Environmental Alerts</h4>
                  <p>{unreadAlerts.length} critical issues pending</p>
                </div>
                <button 
                  className="view-all-alerts-link"
                  onClick={() => {
                    setShowNotifications(false);
                    onOpenAlerts();
                  }}
                >
                  View All
                </button>
              </div>

              <div className="notification-list">
                {alerts.length === 0 ? (
                  <div className="no-notifications-item">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>All industrial parameters within thresholds</span>
                  </div>
                ) : (
                  alerts.slice(0, 3).map(a => (
                    <div 
                      key={a.id} 
                      className={`notification-item ${!a.acknowledged ? 'unread' : ''}`}
                      onClick={() => {
                        setShowNotifications(false);
                        onOpenAlerts();
                      }}
                    >
                      <div className="notif-icon-circle">
                        <AlertTriangle size={14} />
                      </div>
                      <div className="notif-body">
                        <div className="notif-top">
                          <span className="notif-loc">{a.location}</span>
                          <span className="notif-time">{a.timestamp.split(' ')[1] || 'Just now'}</span>
                        </div>
                        <p className="notif-desc">{a.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
