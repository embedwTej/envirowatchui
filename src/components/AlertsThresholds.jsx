import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  BellOff, 
  AlertTriangle, 
  Check, 
  CheckCircle2, 
  ShieldAlert, 
  Filter, 
  Clock, 
  Activity,
  ArrowRight
} from 'lucide-react';

export default function AlertsThresholds({ alerts, onAcknowledgeAlert, locations }) {
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedSensor, setSelectedSensor] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Latest');

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchLocation = selectedLocation === 'All' || alert.location === selectedLocation;
      const matchSensor = selectedSensor === 'All' || alert.sensor.toLowerCase() === selectedSensor.toLowerCase();
      const matchSearch = searchQuery.trim() === '' || 
        alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.sensor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alert.message && alert.message.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchLocation && matchSensor && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'Latest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortBy === 'Oldest') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      return 0;
    });
  }, [alerts, selectedLocation, selectedSensor, searchQuery, sortBy]);

  const highCount = alerts.filter(a => a.severity === 'High').length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical').length;
  const resolvedCount = alerts.filter(a => a.acknowledged).length;

  return (
    <div className="alerts-page animate-fade-in">
      {/* Top Banner */}
      <div className="dashboard-title-banner">
        <div>
          <h1 className="page-title">Alerts & Threshold Incidents</h1>
          <p className="page-subtitle">Real-time incident response and sensor threshold breach logs</p>
        </div>

        <div className="alerts-summary-pills">
          <div className="stat-pill stat-pill-critical">
            <span className="pill-dot blink-red"></span>
            <span>{criticalCount + highCount} Unresolved</span>
          </div>
          <div className="stat-pill stat-pill-normal">
            <CheckCircle2 size={13} className="text-success" />
            <span>{resolvedCount} Acknowledged</span>
          </div>
        </div>
      </div>

      {/* Filter Selection Panel */}
      <div className="modern-filter-card">
        <div className="filter-grid-2col">
          <div className="filter-input-cell">
            <label className="filter-cell-label">Plant Location</label>
            <div className="select-box-wrap">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="modern-select"
              >
                <option value="All">All Locations (Plant Wide)</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} {loc.department ? `(${loc.department})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-input-cell">
            <label className="filter-cell-label">Sensor Parameter</label>
            <div className="select-box-wrap">
              <select
                value={selectedSensor}
                onChange={(e) => setSelectedSensor(e.target.value)}
                className="modern-select"
              >
                <option value="All">All Sensor Types</option>
                <option value="Temperature">Temperature (°C)</option>
                <option value="Noise">Noise (dB)</option>
                <option value="Light">Light (lx)</option>
                <option value="Humidity">Humidity (%)</option>
                <option value="pH">pH Balance</option>
                <option value="COD">COD (mg/L)</option>
                <option value="TDS">TDS (ppm)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Feed Container */}
      <div className="alerts-feed-card">
        <div className="feed-toolbar">
          <div className="search-filter-input">
            <Search size={15} className="search-icon-muted" />
            <input
              type="text"
              placeholder="Search by location, sensor, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="sort-wrapper">
            <span className="sort-hint">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-dropdown-input"
            >
              <option value="Latest">Latest First</option>
              <option value="Oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Alerts Content */}
        <div className="alerts-body-feed">
          {filteredAlerts.length === 0 ? (
            <div className="feed-empty-state">
              <div className="empty-state-shield">
                <CheckCircle2 size={36} className="text-success" />
              </div>
              <h3>No Active Threshold Violations</h3>
              <p>All environmental telemetry across selected parameters are operating within configured safe limits.</p>
            </div>
          ) : (
            <div className="alerts-stream-list">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className={`alert-stream-item ${alert.acknowledged ? 'is-acked' : 'is-unacked'}`}>
                  <div className="alert-stream-main">
                    <div className="alert-badge-icon">
                      <AlertTriangle size={18} />
                    </div>

                    <div className="alert-content-block">
                      <div className="alert-headline-row">
                        <span className="alert-entity-name">{alert.location}</span>
                        <span className="alert-metric-tag">{alert.sensor} Violation</span>
                        <span className="alert-severity-badge severity-high">
                          {alert.severity} Priority
                        </span>
                      </div>

                      <p className="alert-description-text">{alert.message}</p>

                      <div className="alert-spec-chips">
                        <span className="spec-chip">
                          Recorded: <strong className="text-danger">{alert.currentValue}</strong>
                        </span>
                        <span className="spec-chip">
                          Threshold: <strong>{alert.threshold}</strong>
                        </span>
                        <span className="spec-chip timestamp-chip">
                          <Clock size={12} /> {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="alert-stream-actions">
                    {alert.acknowledged ? (
                      <div className="resolved-status-box">
                        <CheckCircle2 size={15} className="text-success" />
                        <span>Acknowledged</span>
                      </div>
                    ) : (
                      <button 
                        className="acknowledge-action-btn"
                        onClick={() => onAcknowledgeAlert(alert.id)}
                      >
                        <Check size={14} />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
