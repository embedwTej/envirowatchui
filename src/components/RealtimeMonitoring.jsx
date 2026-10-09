import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  AlertTriangle, 
  Leaf, 
  ShieldAlert, 
  Download, 
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  Wifi,
  Battery,
  Thermometer,
  Sun,
  Volume2,
  Droplets,
  Activity,
  Search,
  LayoutGrid,
  List,
  Sparkles
} from 'lucide-react';

export default function RealtimeMonitoring({ locations, onSelectLocation, onExport }) {
  const [activeTab, setActiveTab] = useState('All Location');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'compact'

  // Dynamic statistics
  const totalLocations = locations.length;
  const alertCount = locations.filter(loc => loc.status === 'Alert').length;
  const normalCount = locations.filter(loc => loc.status === 'Normal').length;
  const inactiveCount = locations.filter(loc => loc.status === 'Inactive' || loc.isInactive).length;

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      // Tab filter
      let matchesTab = true;
      if (activeTab === 'Normal') matchesTab = loc.status === 'Normal';
      else if (activeTab === 'Alert') matchesTab = loc.status === 'Alert';
      else if (activeTab === 'Inactive') matchesTab = loc.status === 'Inactive' || loc.isInactive;

      // Department filter
      let matchesDept = true;
      if (filterDepartment !== 'All') {
        matchesDept = (loc.department || '').toLowerCase() === filterDepartment.toLowerCase();
      }

      // Search filter
      let matchesSearch = true;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        matchesSearch = loc.name.toLowerCase().includes(q) || 
          (loc.department && loc.department.toLowerCase().includes(q));
      }

      return matchesTab && matchesDept && matchesSearch;
    });
  }, [locations, activeTab, filterDepartment, searchQuery]);

  return (
    <div className="realtime-monitoring animate-fade-in">
      {/* Top Banner & Header */}
      <div className="dashboard-title-banner">
        <div>
          <h1 className="page-title">Plant Telemetry</h1>
          <p className="page-subtitle">Dufil Industrial • Raffles Oil Complex</p>
        </div>

        <div className="telemetry-sync-status">
          <span className="live-pulse-dot"></span>
          <span>Sync: <strong>1.0s</strong></span>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-card-total">
          <div className="kpi-card-header">
            <div className="kpi-icon-container kpi-teal-icon">
              <Building2 size={20} />
            </div>
            <span className="kpi-trend-pill positive">100% Online</span>
          </div>
          <div className="kpi-card-body">
            <span className="kpi-metric-number">{totalLocations}</span>
            <span className="kpi-metric-title">Monitored Units</span>
          </div>
          <div className="kpi-card-footer">
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill fill-teal" style={{ width: '100%' }}></div>
            </div>
            <span className="kpi-footer-sub">All sectors active</span>
          </div>
        </div>

        <div className="kpi-card kpi-card-alert">
          <div className="kpi-card-header">
            <div className="kpi-icon-container kpi-red-icon">
              <AlertTriangle size={20} />
            </div>
            <span className="kpi-trend-pill alert-pulse">Alarm</span>
          </div>
          <div className="kpi-card-body">
            <span className="kpi-metric-number text-alert">{alertCount}</span>
            <span className="kpi-metric-title">Critical Breach</span>
          </div>
          <div className="kpi-card-footer">
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill fill-red" style={{ width: `${(alertCount / totalLocations) * 100}%` }}></div>
            </div>
            <span className="kpi-footer-sub text-alert">Bottling: 68.4 dB</span>
          </div>
        </div>

        <div className="kpi-card kpi-card-normal">
          <div className="kpi-card-header">
            <div className="kpi-icon-container kpi-green-icon">
              <Leaf size={20} />
            </div>
            <span className="kpi-trend-pill positive">Normal</span>
          </div>
          <div className="kpi-card-body">
            <span className="kpi-metric-number">{normalCount}</span>
            <span className="kpi-metric-title">Normal Units</span>
          </div>
          <div className="kpi-card-footer">
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill fill-green" style={{ width: `${(normalCount / totalLocations) * 100}%` }}></div>
            </div>
            <span className="kpi-footer-sub">Within limits</span>
          </div>
        </div>

        <div className="kpi-card kpi-card-inactive">
          <div className="kpi-card-header">
            <div className="kpi-icon-container kpi-amber-icon">
              <ShieldAlert size={20} />
            </div>
            <span className="kpi-trend-pill neutral">Standby</span>
          </div>
          <div className="kpi-card-body">
            <span className="kpi-metric-number">{inactiveCount}</span>
            <span className="kpi-metric-title">Standby Units</span>
          </div>
          <div className="kpi-card-footer">
            <div className="kpi-progress-bar">
              <div className="kpi-progress-fill fill-amber" style={{ width: `${(inactiveCount / totalLocations) * 100}%` }}></div>
            </div>
            <span className="kpi-footer-sub">Maintenance mode</span>
          </div>
        </div>
      </div>

      {/* Control Bar & Filtering */}
      <div className="monitoring-control-bar">
        <div className="filter-pill-cluster">
          {[
            { id: 'All Location', label: 'All Location', count: totalLocations },
            { id: 'Normal', label: 'Normal', count: normalCount },
            { id: 'Alert', label: 'Alert', count: alertCount },
            { id: 'Inactive', label: 'Inactive', count: inactiveCount },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`filter-pill-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="pill-badge">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="monitoring-tools-group">
          {/* Search Box */}
          <div className="search-filter-input">
            <Search size={15} className="search-icon-muted" />
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div className="department-filter-box">
            <span className="filter-box-label">Filter by:</span>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="dept-dropdown"
            >
              <option value="All">All Sectors</option>
              <option value="Refinery">Refinery</option>
              <option value="Packaging">Packaging</option>
              <option value="Utility">Utility</option>
              <option value="Admin">Admin</option>
              <option value="Storage">Storage</option>
            </select>
          </div>

          {/* Export Button */}
          <button className="primary-export-btn" onClick={() => onExport(filteredLocations)}>
            <Download size={15} />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Grid of Locations */}
      <div className="location-cards-grid">
        {filteredLocations.map((loc) => {
          const isAlert = loc.status === 'Alert';
          const isNormal = loc.status === 'Normal';
          const isInactive = loc.status === 'Inactive' || loc.isInactive;

          return (
            <div 
              key={loc.id} 
              className={`modern-location-card ${isAlert ? 'is-alert-active' : isInactive ? 'is-inactive-card' : 'is-normal-card'}`}
              onClick={() => onSelectLocation(loc)}
            >
              {/* Card Header */}
              <div className="loc-card-header">
                <div className="loc-header-main">
                  <div className="loc-icon-bubble">
                    <Building2 size={16} />
                  </div>
                  <div className="loc-title-stack">
                    <span className="loc-title-text">{loc.name}</span>
                    {loc.department ? (
                      <span className="loc-sector-pill">{loc.department}</span>
                    ) : (
                      <span className="loc-sector-pill sector-general">Plant Sector</span>
                    )}
                  </div>
                </div>

                <div className="card-status-badges">
                  {isAlert && (
                    <span className="status-tag status-alert-tag">
                      <span className="status-dot-blink"></span>
                      Alert
                    </span>
                  )}
                  {isNormal && (
                    <span className="status-tag status-normal-tag">
                      <span className="status-dot"></span>
                      Normal
                    </span>
                  )}
                  {isInactive && (
                    <span className="status-tag status-inactive-tag">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Hardware Device Connectivity Bar */}
              <div className="device-telemetry-meta">
                <div className="meta-sensor-stat">
                  <Wifi size={13} className="text-muted" />
                  <span>{loc.signal || 'Strong'}</span>
                </div>
                <div className="meta-sensor-stat">
                  <Battery size={13} className="text-muted" />
                  <span>{loc.battery ? `${loc.battery}%` : 'Mains 220V'}</span>
                </div>
                <div className="meta-sensor-stat meta-time">
                  <Clock size={12} className="text-muted" />
                  <span>{loc.lastSync || '4s ago'}</span>
                </div>
              </div>

              {/* Sensor Metrics Section */}
              <div className="loc-metrics-container">
                {loc.temp !== null && loc.temp !== undefined && (
                  <div className="metric-tile">
                    <div className="metric-tile-top">
                      <Thermometer size={14} className="metric-icon metric-icon-temp" />
                      <span className="metric-tile-label">Temperature</span>
                    </div>
                    <span className="metric-tile-value">{loc.temp} °C</span>
                    <div className="metric-mini-bar">
                      <div 
                        className="mini-bar-fill fill-temp" 
                        style={{ width: `${Math.min(100, Math.max(10, ((loc.temp - 10) / 30) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {loc.light !== null && loc.light !== undefined && (
                  <div className="metric-tile">
                    <div className="metric-tile-top">
                      <Sun size={14} className="metric-icon metric-icon-light" />
                      <span className="metric-tile-label">Light / Lux</span>
                    </div>
                    <span className="metric-tile-value">{loc.light} lx</span>
                    <div className="metric-mini-bar">
                      <div 
                        className="mini-bar-fill fill-light" 
                        style={{ width: `${Math.min(100, (loc.light / 1000) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {loc.noise !== null && loc.noise !== undefined && (
                  <div className={`metric-tile ${loc.noise > 55 ? 'metric-tile-breach' : ''}`}>
                    <div className="metric-tile-top">
                      <Volume2 size={14} className="metric-icon metric-icon-noise" />
                      <span className="metric-tile-label">Noise Level</span>
                    </div>
                    <span className={`metric-tile-value ${loc.noise > 55 ? 'text-alert' : ''}`}>
                      {loc.noise} dB
                    </span>
                    <div className="metric-mini-bar">
                      <div 
                        className={`mini-bar-fill ${loc.noise > 55 ? 'fill-red' : 'fill-noise'}`} 
                        style={{ width: `${Math.min(100, (loc.noise / 90) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {loc.humidity !== null && loc.humidity !== undefined && (
                  <div className="metric-tile">
                    <div className="metric-tile-top">
                      <Droplets size={14} className="metric-icon metric-icon-humidity" />
                      <span className="metric-tile-label">Humidity</span>
                    </div>
                    <span className="metric-tile-value">{loc.humidity} %</span>
                    <div className="metric-mini-bar">
                      <div 
                        className="mini-bar-fill fill-humidity" 
                        style={{ width: `${Math.min(100, loc.humidity)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {loc.ph !== null && loc.ph !== undefined && (
                  <div className="metric-tile">
                    <div className="metric-tile-top">
                      <Activity size={14} className="metric-icon metric-icon-ph" />
                      <span className="metric-tile-label">pH Level</span>
                    </div>
                    <span className="metric-tile-value">{loc.ph} pH</span>
                    <div className="metric-mini-bar">
                      <div 
                        className="mini-bar-fill fill-ph" 
                        style={{ width: `${(loc.ph / 14) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {loc.cod !== null && loc.cod !== undefined && (
                  <div className="metric-tile">
                    <div className="metric-tile-top">
                      <Activity size={14} className="metric-icon metric-icon-cod" />
                      <span className="metric-tile-label">COD Quality</span>
                    </div>
                    <span className="metric-tile-value">{loc.cod} mg/L</span>
                    <div className="metric-mini-bar">
                      <div 
                        className="mini-bar-fill fill-cod" 
                        style={{ width: `${(loc.cod / 150) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {loc.tds !== null && loc.tds !== undefined && (
                  <div className="metric-tile">
                    <div className="metric-tile-top">
                      <Activity size={14} className="metric-icon metric-icon-tds" />
                      <span className="metric-tile-label">TDS Purity</span>
                    </div>
                    <span className="metric-tile-value">{loc.tds} ppm</span>
                    <div className="metric-mini-bar">
                      <div className="mini-bar-fill fill-tds" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="loc-card-footer">
                <div className="nodes-count-tag">
                  <span>{loc.devicesCount || 1} Sensor Node{loc.devicesCount > 1 ? 's' : ''}</span>
                </div>
                <button 
                  className="card-view-details-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLocation(loc);
                  }}
                >
                  <span>View Details</span>
                  <ChevronRight size={14} className="action-arrow" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
