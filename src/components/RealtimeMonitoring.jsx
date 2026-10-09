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
  Zap,
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

import bottlingImg from '../assets/sectors/sector_bottling.jpg';
import refineryImg from '../assets/sectors/sector_refinery.jpg';
import tankfarmImg from '../assets/sectors/sector_tankfarm.jpg';
import boilerImg from '../assets/sectors/sector_boiler.jpg';
import etpImg from '../assets/sectors/sector_etp.jpg';

const getSectorImage = (loc) => {
  const text = ((loc.department || '') + ' ' + (loc.name || '')).toLowerCase();
  if (text.includes('bottl') || text.includes('packag')) return bottlingImg;
  if (text.includes('tank') || text.includes('storage')) return tankfarmImg;
  if (text.includes('boiler') || text.includes('util') || text.includes('wtp') || text.includes('steam')) return boilerImg;
  if (text.includes('etp') || text.includes('effluent') || text.includes('water')) return etpImg;
  return refineryImg;
};

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

      {/* 4 Compact Executive KPI Cards */}
      <div className="kpi-grid kpi-grid-compact">
        <div className="kpi-card kpi-card-compact kpi-card-total">
          <div className="kpi-compact-left">
            <div className="kpi-icon-container kpi-teal-icon">
              <Building2 size={16} />
            </div>
            <div className="kpi-compact-info">
              <div className="kpi-metric-number">{totalLocations}</div>
              <div className="kpi-metric-title">Monitored Units</div>
            </div>
          </div>
          <div className="kpi-status-badge positive">
            <span className="badge-glow-dot green"></span>
            <span>100% ONLINE</span>
          </div>
        </div>

        <div className="kpi-card kpi-card-compact kpi-card-alert">
          <div className="kpi-compact-left">
            <div className="kpi-icon-container kpi-red-icon">
              <AlertTriangle size={16} />
            </div>
            <div className="kpi-compact-info">
              <div className="kpi-metric-number text-alert">{alertCount}</div>
              <div className="kpi-metric-title">Critical Breaches</div>
            </div>
          </div>
          <div className="kpi-status-badge alert">
            <span className="badge-glow-dot red"></span>
            <span>ALARM</span>
          </div>
        </div>

        <div className="kpi-card kpi-card-compact kpi-card-normal">
          <div className="kpi-compact-left">
            <div className="kpi-icon-container kpi-green-icon">
              <Leaf size={16} />
            </div>
            <div className="kpi-compact-info">
              <div className="kpi-metric-number">{normalCount}</div>
              <div className="kpi-metric-title">Optimal Units</div>
            </div>
          </div>
          <div className="kpi-status-badge normal">
            <span className="badge-glow-dot green"></span>
            <span>NORMAL</span>
          </div>
        </div>

        <div className="kpi-card kpi-card-compact kpi-card-inactive">
          <div className="kpi-compact-left">
            <div className="kpi-icon-container kpi-amber-icon">
              <ShieldAlert size={16} />
            </div>
            <div className="kpi-compact-info">
              <div className="kpi-metric-number">{inactiveCount}</div>
              <div className="kpi-metric-title">Standby Units</div>
            </div>
          </div>
          <div className="kpi-status-badge standby">
            <span className="badge-glow-dot slate"></span>
            <span>STANDBY</span>
          </div>
        </div>
      </div>

      {/* Control Bar & Filtering Tabs */}
      <div className="monitoring-control-bar">
        <div className="filter-pill-cluster">
          {[
            { id: 'All Location', label: 'All Units', count: totalLocations, isTotal: true },
            { id: 'Normal', label: 'Optimal', count: normalCount, dot: 'green' },
            { id: 'Alert', label: 'Alerts', count: alertCount, dot: 'red', alert: alertCount > 0 },
            { id: 'Inactive', label: 'Standby', count: inactiveCount, dot: 'slate' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`filter-pill-item ${activeTab === tab.id ? 'active' : ''} ${tab.alert ? 'has-active-alert' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.dot && <span className={`tab-indicator-dot dot-${tab.dot}`}></span>}
              <span className="tab-label-text">{tab.label}</span>
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
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(10, 18, 32, 0.76) 0%, rgba(6, 11, 20, 0.94) 100%), url(${getSectorImage(loc)})`
              }}
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
                  <Zap size={13} className="text-gold" />
                  <span>220V AC</span>
                </div>
                <div className="meta-sensor-stat meta-time">
                  <Clock size={12} className="text-muted" />
                  <span>{loc.lastSync || 'Live'}</span>
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
