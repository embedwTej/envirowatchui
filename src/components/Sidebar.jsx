import React from 'react';
import { 
  LayoutGrid, 
  Map,
  Bell, 
  ShieldAlert, 
  TrendingUp, 
  MapPin, 
  Cpu, 
  Users, 
  LogOut,
  Radio,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, onLogout, activeAlertCount = 1 }) {
  const menuItems = [
    { id: 'realtime', label: 'Realtime Monitoring', icon: LayoutGrid },
    { id: 'facility-map', label: 'Plant GIS Map', icon: Map },
    { id: 'alerts', label: 'Alerts & Thresholds', icon: Bell, badge: activeAlertCount > 0 ? activeAlertCount : null },
    { id: 'alert-management', label: 'Alert Management', icon: ShieldAlert },
    { id: 'historical', label: 'Historical Data & Trends', icon: TrendingUp },
    { id: 'locations', label: 'Locations Management', icon: MapPin },
    { id: 'devices', label: 'Devices Management', icon: Cpu },
    { id: 'users', label: 'Users & Roles', icon: Users },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon-box dufil-logo-box">
            <span className="logo-letter">D</span>
            <div className="logo-pulse-ring"></div>
          </div>
          <div className="logo-text-block">
            <span className="logo-brand-title">DUFIL</span>
            <span className="logo-brand-subtitle">Raffles Oil Complex</span>
          </div>
        </div>
      </div>

      {/* System Status Pill */}
      <div className="sidebar-system-status">
        <div className="sys-status-indicator">
          <Radio size={12} className="sys-icon-radio animate-pulse text-success" />
          <span>Online</span>
        </div>
        <span className="sys-ping-rate">22 Nodes</span>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">MONITORING & CONTROL</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <div className="nav-item-content">
                <Icon size={18} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </div>
              {item.badge ? (
                <span className="nav-badge-pulse">{item.badge}</span>
              ) : (
                isActive && <ChevronRight size={14} className="nav-active-arrow" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="sidebar-footer">
        <div className="user-profile-card">
          <div className="user-avatar-styled">
            <span>D</span>
            <span className="avatar-online-dot"></span>
          </div>
          <div className="user-meta-block">
            <span className="user-name-title">Dufil Industrial</span>
            <span className="user-role-badge">ADMIN</span>
          </div>
        </div>
        <button 
          className="logout-action-btn" 
          onClick={onLogout} 
          title="Sign Out of Enviro Watch"
          aria-label="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
