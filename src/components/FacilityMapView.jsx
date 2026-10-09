import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Thermometer, 
  Volume2, 
  Droplets, 
  Sun, 
  Activity, 
  Maximize2, 
  Minimize2,
  RefreshCw,
  Eye,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Radio,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import plantMapImg from '../assets/plant-facility-map.png';

// Facility hotspots calibrated exactly to the Raffles Oil isometric plant diagram
const PLANT_HOTSPOTS = [
  {
    id: 'bottling',
    name: 'Bottling Unit',
    sector: 'Packaging & Dispatch',
    left: '55.5%',
    top: '22.0%',
    status: 'Alert',
    alertMessage: 'Noise threshold breach: 68.4 dB (Limit: 55 dB)',
    temp: 29.2,
    noise: 68.4,
    humidity: 52.0,
    light: 410,
    ph: null,
    cod: null,
    tds: null,
    battery: 89,
    signal: 'Strong',
    devicesCount: 4,
    lastSync: 'Just now'
  },
  {
    id: 'refinery',
    name: 'Refinery Tower',
    sector: 'Core Production',
    left: '23.0%',
    top: '58.0%',
    status: 'Normal',
    alertMessage: null,
    temp: 26.5,
    noise: 48.2,
    humidity: 44.0,
    light: 340,
    ph: null,
    cod: null,
    tds: null,
    battery: 98,
    signal: 'Strong',
    devicesCount: 6,
    lastSync: '2s ago'
  },
  {
    id: 'tankfarm',
    name: 'Tankfarm Storage',
    sector: 'Bulk Liquid Logistics',
    left: '51.5%',
    top: '48.0%',
    status: 'Normal',
    alertMessage: null,
    temp: 24.1,
    noise: 39.5,
    humidity: 46.5,
    light: 180,
    ph: null,
    cod: null,
    tds: null,
    battery: 95,
    signal: 'Strong',
    devicesCount: 8,
    lastSync: '5s ago'
  },
  {
    id: 'boiler-wtp',
    name: 'Boiler & WTP',
    sector: 'Utilities & Steam',
    left: '35.0%',
    top: '42.5%',
    status: 'Normal',
    alertMessage: null,
    temp: 28.6,
    noise: 51.0,
    humidity: 58.0,
    light: 290,
    ph: null,
    cod: null,
    tds: 310,
    battery: 92,
    signal: 'Good',
    devicesCount: 3,
    lastSync: '8s ago'
  },
  {
    id: 'etp',
    name: 'ETP Area (Water Treatment)',
    sector: 'Environmental Compliance',
    left: '36.0%',
    top: '19.5%',
    status: 'Normal',
    alertMessage: null,
    temp: 24.8,
    noise: 42.0,
    humidity: 62.0,
    light: 350,
    ph: 7.4,
    cod: 68.0,
    tds: 145,
    battery: 94,
    signal: 'Strong',
    devicesCount: 5,
    lastSync: '3s ago'
  },
  {
    id: 'g-house',
    name: 'G House (Generator Hub)',
    sector: 'Auxiliary Power',
    left: '33.5%',
    top: '29.5%',
    status: 'Normal',
    alertMessage: null,
    temp: 23.8,
    noise: 49.5,
    humidity: 43.0,
    light: 220,
    ph: null,
    cod: null,
    tds: null,
    battery: 91,
    signal: 'Strong',
    devicesCount: 2,
    lastSync: '12s ago'
  },
  {
    id: 'admin',
    name: 'Administrative Complex',
    sector: 'Facility Office',
    left: '54.5%',
    top: '76.5%',
    status: 'Normal',
    alertMessage: null,
    temp: 22.0,
    noise: 41.5,
    humidity: 47.0,
    light: 480,
    ph: null,
    cod: null,
    tds: null,
    battery: 100,
    signal: 'Strong',
    devicesCount: 2,
    lastSync: '1s ago'
  },
  {
    id: 'garden',
    name: 'Garden & Amenities Pond',
    sector: 'Buffer & Retention',
    left: '81.0%',
    top: '56.5%',
    status: 'Normal',
    alertMessage: null,
    temp: 24.8,
    noise: 38.0,
    humidity: 55.0,
    light: 520,
    ph: 7.8,
    cod: 22.0,
    tds: 95,
    battery: 97,
    signal: 'Strong',
    devicesCount: 2,
    lastSync: '4s ago'
  },
  {
    id: 'old-gate',
    name: 'Old Entrance Gate',
    sector: 'North Perimeter',
    left: '87.0%',
    top: '14.5%',
    status: 'Standby',
    alertMessage: null,
    temp: 25.0,
    noise: 44.0,
    humidity: 48.0,
    light: 490,
    ph: null,
    cod: null,
    tds: null,
    battery: 99,
    signal: 'Good',
    devicesCount: 1,
    lastSync: '14s ago'
  },
  {
    id: 'new-gate',
    name: 'New Entrance Gate',
    sector: 'Primary Freight Security',
    left: '93.0%',
    top: '88.0%',
    status: 'Normal',
    alertMessage: null,
    temp: 23.5,
    noise: 47.0,
    humidity: 49.0,
    light: 460,
    ph: null,
    cod: null,
    tds: null,
    battery: 96,
    signal: 'Strong',
    devicesCount: 2,
    lastSync: '2s ago'
  },
  {
    id: 'open-land',
    name: 'Open Land Boundary',
    sector: 'West Perimeter Buffer',
    left: '6.5%',
    top: '48.5%',
    status: 'Standby',
    alertMessage: null,
    temp: 25.4,
    noise: 36.0,
    humidity: 50.0,
    light: 510,
    ph: null,
    cod: null,
    tds: null,
    battery: 99,
    signal: 'Good',
    devicesCount: 1,
    lastSync: '25s ago'
  },
  {
    id: 'express-road',
    name: 'Express Road Freight Corridor',
    sector: 'External Logistics Axis',
    left: '49.5%',
    top: '7.5%',
    status: 'Normal',
    alertMessage: null,
    temp: 27.0,
    noise: 62.0,
    humidity: 45.0,
    light: 550,
    ph: null,
    cod: null,
    tds: null,
    battery: 93,
    signal: 'Good',
    devicesCount: 2,
    lastSync: '6s ago'
  }
];

export default function FacilityMapView({ onSelectLocation }) {
  const [selectedHotspot, setSelectedHotspot] = useState(PLANT_HOTSPOTS[0]); // default Bottling selected
  const [filterMode, setFilterMode] = useState('all'); // all, alerts, temp, noise, water
  const [showValues, setShowValues] = useState(true);
  const [showRings, setShowRings] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filtered hotspots based on active toolbar category
  const filteredSpots = PLANT_HOTSPOTS.filter((spot) => {
    if (filterMode === 'alerts') return spot.status === 'Alert';
    if (filterMode === 'temp') return spot.temp !== null;
    if (filterMode === 'noise') return spot.noise !== null;
    if (filterMode === 'water') return spot.ph !== null || spot.cod !== null || spot.tds !== null;
    return true;
  });

  const getMetricBadgeText = (spot) => {
    if (filterMode === 'noise') return `${spot.noise} dB`;
    if (filterMode === 'temp') return `${spot.temp} °C`;
    if (filterMode === 'water') {
      if (spot.ph) return `pH ${spot.ph}`;
      if (spot.tds) return `${spot.tds} ppm`;
    }
    // Default multi-view
    if (spot.status === 'Alert') return `${spot.noise} dB ⚠️`;
    return `${spot.temp} °C`;
  };

  return (
    <div className={`facility-map-page animate-fade-in ${isFullscreen ? 'map-fullscreen-active' : ''}`}>
      {/* Top Banner & Header */}
      <div className="dashboard-title-banner">
        <div>
          <div className="title-with-pill">
            <h1 className="page-title">Facility GIS Map & Digital Twin</h1>
            <span className="live-pill-tag">
              <span className="live-pulse-dot"></span>
              Raffles Oil Spatial Model
            </span>
          </div>
          <p className="page-subtitle">
            Interactive 2.5D architectural digital twin with real-time multi-sensor telemetry pins across physical manufacturing sectors
          </p>
        </div>

        {/* Executive Facility Status Badges */}
        <div className="facility-quick-stats-strip">
          <div className="facility-stat-item">
            <Compass size={16} className="text-primary" />
            <span>12 Monitored Zones</span>
          </div>
          <div className="facility-stat-item alert-breach-item">
            <AlertTriangle size={15} className="text-alert animate-bounce-subtle" />
            <span>1 Active Breach (Bottling)</span>
          </div>
          <div className="facility-stat-item">
            <Radio size={14} className="text-success" />
            <span>Telemetry Link: 100%</span>
          </div>
        </div>
      </div>

      {/* Map Interactive Toolbar */}
      <div className="map-controls-card">
        <div className="map-toolbar-row">
          {/* Filter Overlays */}
          <div className="map-filter-pills">
            <span className="filter-pill-label">
              <Layers size={13} />
              Telemetry Layer:
            </span>
            {[
              { id: 'all', label: 'All Hotspots' },
              { id: 'alerts', label: 'Breach Alerts Only', badge: '1' },
              { id: 'temp', label: 'Thermal (°C)' },
              { id: 'noise', label: 'Acoustics (dB)' },
              { id: 'water', label: 'Water Quality & ETP' },
            ].map((f) => (
              <button
                key={f.id}
                className={`map-chip-btn ${filterMode === f.id ? 'active' : ''}`}
                onClick={() => setFilterMode(f.id)}
              >
                <span>{f.label}</span>
                {f.badge && <span className="chip-badge-alert">{f.badge}</span>}
              </button>
            ))}
          </div>

          {/* Quick Display Switches */}
          <div className="map-tools-right">
            <button 
              className={`map-tool-toggle-btn ${showValues ? 'active' : ''}`}
              onClick={() => setShowValues(!showValues)}
              title="Toggle Live Value Badges"
            >
              <Eye size={14} />
              <span>Live Badges</span>
            </button>

            <button 
              className={`map-tool-toggle-btn ${showRings ? 'active' : ''}`}
              onClick={() => setShowRings(!showRings)}
              title="Toggle Radar Pulse Rings"
            >
              <Radio size={14} />
              <span>Radar Beacons</span>
            </button>

            <button 
              className="map-fullscreen-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Full Canvas'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2.5D Isometric Canvas Area */}
      <div className="facility-canvas-container">
        <div className="isometric-map-wrapper">
          {/* Base Architectural Plant Map Image */}
          <img 
            src={plantMapImg} 
            alt="Raffles Oil Facility Layout" 
            className="plant-backdrop-image"
          />

          {/* Dynamic Map Pins */}
          {filteredSpots.map((spot) => {
            const isAlert = spot.status === 'Alert';
            const isSelected = selectedHotspot?.id === spot.id;

            return (
              <div 
                key={spot.id}
                className={`map-hotspot-pin ${isAlert ? 'pin-alert' : 'pin-normal'} ${isSelected ? 'pin-selected' : ''}`}
                style={{ left: spot.left, top: spot.top }}
                onClick={() => setSelectedHotspot(spot)}
              >
                {/* Radar Pulse Rings */}
                {showRings && (
                  <div className={`radar-beacon-ring ${isAlert ? 'beacon-alert' : 'beacon-normal'}`}></div>
                )}

                {/* Marker Core Bubble */}
                <div className="pin-core-bubble">
                  {isAlert ? (
                    <AlertTriangle size={14} className="pin-icon-alert" />
                  ) : (
                    <span className="pin-dot-center"></span>
                  )}
                </div>

                {/* Live Value Tag Banner */}
                {showValues && (
                  <div className={`pin-value-tag ${isAlert ? 'tag-alert-pulse' : ''}`}>
                    <span className="tag-zone-name">{spot.name}</span>
                    <span className="tag-zone-metric">{getMetricBadgeText(spot)}</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Active Hotspot HUD Telemetry Floating Inspector */}
          {selectedHotspot && (
            <div 
              className={`hotspot-hud-card ${selectedHotspot.status === 'Alert' ? 'hud-alert-theme' : ''}`}
              style={{
                // Auto position HUD near the selected hotspot
                left: `clamp(16px, calc(${selectedHotspot.left} + 22px), calc(100% - 340px))`,
                top: `clamp(16px, calc(${selectedHotspot.top} - 60px), calc(100% - 320px))`
              }}
            >
              <div className="hud-card-header">
                <div>
                  <div className="hud-badge-row">
                    <span className={`hud-status-chip ${selectedHotspot.status === 'Alert' ? 'chip-red' : 'chip-green'}`}>
                      {selectedHotspot.status === 'Alert' ? 'CRITICAL INCIDENT' : 'OPERATIONAL NORMAL'}
                    </span>
                    <span className="hud-time-tag">{selectedHotspot.lastSync}</span>
                  </div>
                  <h4 className="hud-title">{selectedHotspot.name}</h4>
                  <p className="hud-sector">{selectedHotspot.sector}</p>
                </div>
                <button 
                  className="hud-close-action" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHotspot(null);
                  }}
                >
                  ✕
                </button>
              </div>

              {selectedHotspot.alertMessage && (
                <div className="hud-alert-banner">
                  <AlertTriangle size={15} />
                  <span>{selectedHotspot.alertMessage}</span>
                </div>
              )}

              {/* 4 Sensor Reading Mini Tiles */}
              <div className="hud-telemetry-grid">
                {selectedHotspot.temp !== null && (
                  <div className="hud-tile">
                    <div className="hud-tile-top">
                      <Thermometer size={13} className="text-orange" />
                      <span>Temp</span>
                    </div>
                    <span className="hud-val">{selectedHotspot.temp} °C</span>
                  </div>
                )}

                {selectedHotspot.noise !== null && (
                  <div className={`hud-tile ${selectedHotspot.noise > 55 ? 'hud-tile-breach' : ''}`}>
                    <div className="hud-tile-top">
                      <Volume2 size={13} className={selectedHotspot.noise > 55 ? 'text-alert' : 'text-purple'} />
                      <span>Noise</span>
                    </div>
                    <span className={`hud-val ${selectedHotspot.noise > 55 ? 'text-alert font-bold' : ''}`}>
                      {selectedHotspot.noise} dB
                    </span>
                  </div>
                )}

                {selectedHotspot.humidity !== null && (
                  <div className="hud-tile">
                    <div className="hud-tile-top">
                      <Droplets size={13} className="text-blue" />
                      <span>Humidity</span>
                    </div>
                    <span className="hud-val">{selectedHotspot.humidity} %</span>
                  </div>
                )}

                {selectedHotspot.light !== null && (
                  <div className="hud-tile">
                    <div className="hud-tile-top">
                      <Sun size={13} className="text-amber" />
                      <span>Light</span>
                    </div>
                    <span className="hud-val">{selectedHotspot.light} lx</span>
                  </div>
                )}

                {selectedHotspot.ph !== null && (
                  <div className="hud-tile">
                    <div className="hud-tile-top">
                      <Activity size={13} className="text-emerald" />
                      <span>pH Level</span>
                    </div>
                    <span className="hud-val">{selectedHotspot.ph} pH</span>
                  </div>
                )}

                {selectedHotspot.cod !== null && (
                  <div className="hud-tile">
                    <div className="hud-tile-top">
                      <Activity size={13} className="text-teal" />
                      <span>COD</span>
                    </div>
                    <span className="hud-val">{selectedHotspot.cod} mg/L</span>
                  </div>
                )}
              </div>

              {/* HUD Card Footer Actions */}
              <div className="hud-footer">
                <span className="hud-hardware-meta">
                  {selectedHotspot.devicesCount} Sensor Node{selectedHotspot.devicesCount > 1 ? 's' : ''} • Battery: {selectedHotspot.battery}%
                </span>
                <button 
                  className="hud-inspect-btn"
                  onClick={() => onSelectLocation(selectedHotspot)}
                >
                  <span>Full Telemetry</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Facility Zone Matrix Table */}
      <div className="enterprise-table-card map-zone-matrix-card">
        <div className="table-header-toolbar">
          <div>
            <h3 className="section-title">Plant Physical Sectors Telemetry Roster</h3>
            <p className="section-subtext">Click any zone row to locate and inspect real-time boundary parameters</p>
          </div>
          <span className="stats-tag">Enrolled Hotspots: <strong>{PLANT_HOTSPOTS.length}</strong></span>
        </div>

        <div className="table-wrapper">
          <table className="enterprise-data-table">
            <thead>
              <tr>
                <th>Zone Name</th>
                <th>Facility Sector</th>
                <th>Temperature</th>
                <th>Noise Level</th>
                <th>Humidity</th>
                <th>Water / Quality</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {PLANT_HOTSPOTS.map((spot) => {
                const isSelected = selectedHotspot?.id === spot.id;
                return (
                  <tr 
                    key={spot.id} 
                    className={`table-row-interactive ${isSelected ? 'row-selected-highlight' : ''}`}
                    onClick={() => setSelectedHotspot(spot)}
                  >
                    <td>
                      <div className="location-title-cell">
                        <div className={`loc-table-icon ${spot.status === 'Alert' ? 'icon-alert-bg' : ''}`}>
                          <MapPin size={16} />
                        </div>
                        <div>
                          <span className="location-name-bold">{spot.name}</span>
                          <div className="text-xs text-muted">Node ID: {spot.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="sector-tag-chip">{spot.sector}</span>
                    </td>
                    <td>
                      {spot.temp ? <strong>{spot.temp} °C</strong> : <span className="text-muted">—</span>}
                    </td>
                    <td>
                      {spot.noise ? (
                        <span className={spot.noise > 55 ? 'text-alert font-bold' : ''}>
                          {spot.noise} dB
                        </span>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td>
                      {spot.humidity ? `${spot.humidity} %` : <span className="text-muted">—</span>}
                    </td>
                    <td>
                      {spot.ph ? (
                        <span className="text-primary font-semibold">pH {spot.ph}</span>
                      ) : spot.tds ? (
                        <span>{spot.tds} ppm</span>
                      ) : <span className="text-muted">—</span>}
                    </td>
                    <td>
                      <span className={`status-pill ${spot.status === 'Alert' ? 'tag-critical' : spot.status === 'Normal' ? 'pill-active' : 'pill-inactive'}`}>
                        <span className="status-dot"></span>
                        {spot.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button 
                        className="card-view-details-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLocation(spot);
                        }}
                      >
                        <span>Inspect</span>
                        <ChevronRight size={14} className="action-arrow" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
