import React, { useState, useEffect, useRef } from 'react';
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
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Eye, 
  Radio, 
  ChevronRight, 
  ExternalLink, 
  Play, 
  Pause, 
  Compass, 
  Cpu,
  Move,
  X,
  Camera
} from 'lucide-react';
import plantIsometricImg from '../assets/plant-isometric-clean.jpg';
import plantDroneImg from '../assets/plant-aerial-drone.jpg';

// Zones calibrated precisely to the Raffles Oil isometric plant diagram
const INITIAL_ZONES = [
  {
    id: 'bottling',
    name: 'Bottling',
    fullName: 'Bottling & Packaging Hub',
    sector: 'Packaging & Warehouse',
    left: '56.5%',
    top: '19.5%',
    status: 'Alert',
    alertMessage: 'Noise threshold breach: 68.4 dB (OSHA Max: 55 dB)',
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
    lastSync: 'Live'
  },
  {
    id: 'refinery',
    name: 'Refinery',
    fullName: 'Primary Refining Complex',
    sector: 'Core Production',
    left: '23.5%',
    top: '56.5%',
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
    lastSync: 'Live'
  },
  {
    id: 'tankfarm',
    name: 'Tankfarm',
    fullName: 'Tankfarm Bulk Storage',
    sector: 'Bulk Liquid Logistics',
    left: '51.5%',
    top: '45.0%',
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
    lastSync: 'Live'
  },
  {
    id: 'boiler-wtp',
    name: 'Boiler & WTP',
    fullName: 'Boiler & Water Treatment',
    sector: 'Utilities & Steam',
    left: '35.5%',
    top: '42.0%',
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
    lastSync: 'Live'
  },
  {
    id: 'etp',
    name: 'ETP Area',
    fullName: 'Effluent Treatment Plant',
    sector: 'Environmental Compliance',
    left: '36.0%',
    top: '18.5%',
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
    lastSync: 'Live'
  },
  {
    id: 'g-house',
    name: 'G House',
    fullName: 'Generator & Grid Substation',
    sector: 'Auxiliary Power',
    left: '33.5%',
    top: '26.5%',
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
    lastSync: 'Live'
  },
  {
    id: 'admin',
    name: 'Admin',
    fullName: 'Administrative HQ',
    sector: 'Facility Office',
    left: '54.5%',
    top: '75.0%',
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
    lastSync: 'Live'
  },
  {
    id: 'garden',
    name: 'Garden & Amenities',
    fullName: 'Garden, Lake & Amenities',
    sector: 'Retention & Recreation',
    left: '81.0%',
    top: '53.0%',
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
    lastSync: 'Live'
  },
  {
    id: 'old-gate',
    name: 'Old Entrance Gate',
    fullName: 'North Gate Logistics Post',
    sector: 'North Perimeter',
    left: '86.5%',
    top: '11.5%',
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
    lastSync: 'Live'
  },
  {
    id: 'new-gate',
    name: 'New Entrance Gate',
    fullName: 'Primary South Vehicle Gate',
    sector: 'Security Checkpoint',
    left: '93.5%',
    top: '89.5%',
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
    lastSync: 'Live'
  }
];

export default function FacilityMapView({ onSelectLocation }) {
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [activeHighlightId, setActiveHighlightId] = useState('bottling');
  const [showContinuousPopups, setShowContinuousPopups] = useState(true);
  const [popupViewStyle, setPopupViewStyle] = useState('full'); // 'full' or 'compact'
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'alerts', 'temp', 'noise', 'water'
  const [isAutoCycling, setIsAutoCycling] = useState(false);
  const [isFullscreenModal, setIsFullscreenModal] = useState(false);
  const [mapPerspective, setMapPerspective] = useState('3d'); // '3d' or 'aerial'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastStreamTime, setLastStreamTime] = useState(new Date().toLocaleTimeString());

  const mapContainerRef = useRef(null);

  // Keyboard shortcut: Esc to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreenModal) {
        setIsFullscreenModal(false);
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenModal]);

  // Continuous real-time telemetry streaming simulation (heartbeat every 2 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setZones((prevZones) =>
        prevZones.map((z) => {
          const tempDelta = (Math.random() - 0.5) * 0.2;
          const noiseDelta = (Math.random() - 0.5) * 0.4;
          const newTemp = z.temp ? Number((z.temp + tempDelta).toFixed(1)) : null;
          
          let newNoise = z.noise ? Number((z.noise + noiseDelta).toFixed(1)) : null;
          if (z.id === 'bottling' && newNoise < 64) newNoise = 67.8;

          return {
            ...z,
            temp: newTemp,
            noise: newNoise,
            lastSync: 'Streaming'
          };
        })
      );
      setLastStreamTime(new Date().toLocaleTimeString());
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Auto-tour cycling
  useEffect(() => {
    if (!isAutoCycling) return;
    const cycleTimer = setInterval(() => {
      setActiveHighlightId((currentId) => {
        const currentIndex = zones.findIndex((z) => z.id === currentId);
        const nextIndex = (currentIndex + 1) % zones.length;
        return zones[nextIndex].id;
      });
    }, 4000);

    return () => clearInterval(cycleTimer);
  }, [isAutoCycling, zones]);

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.8, Number((z + 0.2).toFixed(1))));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.7, Number((z - 0.2).toFixed(1))));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Drag pan handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // primary click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const filteredZones = zones.filter((z) => {
    if (filterMode === 'alerts') return z.status === 'Alert';
    if (filterMode === 'temp') return z.temp !== null;
    if (filterMode === 'noise') return z.noise !== null;
    if (filterMode === 'water') return z.ph !== null || z.cod !== null || z.tds !== null;
    return true;
  });

  const highlightedZone = zones.find((z) => z.id === activeHighlightId) || zones[0];

  // Render the core interactive map canvas
  const renderMapCanvas = (inFullscreen = false) => (
    <div 
      className={`isometric-map-wrapper ${isDragging ? 'is-panning' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        cursor: isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'default'
      }}
    >
      <div 
        className="map-zoom-transform-stage"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out'
        }}
      >
        {/* Dynamic High-Definition Plant Map Image (3D Model or Aerial Drone) */}
        <img 
          src={mapPerspective === '3d' ? plantIsometricImg : plantDroneImg} 
          alt="Raffles Oil Facility Digital Twin" 
          className="plant-backdrop-image"
          draggable={false}
        />

        {/* Continuous Live Hotspot Popups */}
        {filteredZones.map((spot) => {
          const isAlert = spot.status === 'Alert';
          const isHighlighted = spot.id === activeHighlightId;

          return (
            <div 
              key={spot.id}
              className={`continuous-hotspot-container ${isAlert ? 'spot-is-alert' : 'spot-is-normal'} ${isHighlighted ? 'spot-is-highlighted' : ''}`}
              style={{ left: spot.left, top: spot.top }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveHighlightId(spot.id);
              }}
            >
              {/* Pulsing Radar Ring */}
              <div className={`hotspot-radar-ring ${isAlert ? 'radar-alert' : 'radar-normal'}`}></div>

              {/* Pin Pointer Pinhead */}
              <div className="hotspot-pin-head">
                <div className="pin-pointer-dot"></div>
              </div>

              {/* CONTINUOUS LIVE POPUP CARD (Always Visible) */}
              {showContinuousPopups && (
                <div 
                  className={`continuous-popup-card ${isAlert ? 'popup-theme-alert' : 'popup-theme-normal'} ${isHighlighted ? 'popup-highlight-glow' : ''} ${popupViewStyle === 'compact' ? 'popup-compact-mode' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHighlightId(spot.id);
                  }}
                >
                  <div className="continuous-popup-header">
                    <div className="popup-title-area">
                      <span className="popup-zone-badge">{spot.name}</span>
                      {isAlert && <span className="alert-badge-micro">ALARM</span>}
                    </div>
                    <span className="live-stream-dot-micro"></span>
                  </div>

                  {popupViewStyle === 'full' ? (
                    <div className="continuous-metrics-row">
                      {spot.temp !== null && (
                        <div className="metric-micro-pill">
                          <Thermometer size={11} className="text-orange" />
                          <span>{spot.temp}°C</span>
                        </div>
                      )}

                      {spot.noise !== null && (
                        <div className={`metric-micro-pill ${spot.noise > 55 ? 'pill-breach-alert' : ''}`}>
                          <Volume2 size={11} className={spot.noise > 55 ? 'text-alert' : 'text-purple'} />
                          <span className={spot.noise > 55 ? 'text-alert font-bold' : ''}>{spot.noise} dB</span>
                        </div>
                      )}

                      {spot.humidity !== null && (
                        <div className="metric-micro-pill">
                          <Droplets size={11} className="text-blue" />
                          <span>{spot.humidity}%</span>
                        </div>
                      )}

                      {spot.ph !== null && (
                        <div className="metric-micro-pill">
                          <Activity size={11} className="text-emerald" />
                          <span>pH {spot.ph}</span>
                        </div>
                      )}

                      {spot.tds !== null && (
                        <div className="metric-micro-pill">
                          <Activity size={11} className="text-teal" />
                          <span>{spot.tds} ppm</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="compact-metric-text">
                      {isAlert ? (
                        <span className="text-alert font-bold">⚠️ Noise: {spot.noise} dB</span>
                      ) : spot.temp ? (
                        <span>{spot.temp}°C • {spot.noise ? `${spot.noise} dB` : `${spot.humidity}%`}</span>
                      ) : (
                        <span>Online</span>
                      )}
                    </div>
                  )}

                  <button 
                    className="popup-inspect-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLocation(spot);
                    }}
                    title="Inspect full diagnostics"
                  >
                    <span>Diagnose</span>
                    <ChevronRight size={11} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Canvas Quick Controls (Zoom & Fullscreen) */}
      <div className="canvas-float-controls" onClick={(e) => e.stopPropagation()}>
        <button 
          className="float-tool-btn" 
          onClick={handleZoomIn} 
          title="Zoom In (+)"
        >
          <ZoomIn size={15} />
        </button>
        <button 
          className="float-tool-btn" 
          onClick={handleZoomOut} 
          title="Zoom Out (-)"
        >
          <ZoomOut size={15} />
        </button>
        {zoomLevel !== 1 && (
          <button 
            className="float-tool-btn" 
            onClick={handleResetZoom} 
            title="Reset Zoom (100%)"
          >
            <RotateCcw size={14} />
            <span className="btn-pct-label">{Math.round(zoomLevel * 100)}%</span>
          </button>
        )}
        {!inFullscreen && (
          <button 
            className="float-tool-btn float-btn-fullscreen-trigger" 
            onClick={() => {
              setIsFullscreenModal(true);
              setZoomLevel(1.1);
              setPanOffset({ x: 0, y: 0 });
            }} 
            title="Open High-Definition Fullscreen Viewer"
          >
            <Maximize2 size={15} />
            <span className="fullscreen-btn-text">Open Fullscreen HD</span>
          </button>
        )}
      </div>

      {/* Subtle Pan Hint when zoomed */}
      {zoomLevel > 1 && (
        <div className="canvas-pan-hint">
          <Move size={12} />
          <span>Click & Drag to Pan Facility</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="facility-map-page animate-fade-in">
      {/* Top Banner */}
      <div className="dashboard-title-banner">
        <div>
          <div className="title-with-pill">
            <h1 className="page-title">Plant GIS Map & Digital Twin</h1>
            <span className="live-pill-tag">
              <span className="live-pulse-dot"></span>
              Live Telemetry Stream: {lastStreamTime}
            </span>
          </div>
          <p className="page-subtitle">
            Raffles Oil Isometric Facility Layout — continuous live telemetry popups rendered over physical plant infrastructure
          </p>
        </div>

        {/* Quick Plant Health Metrics */}
        <div className="facility-quick-stats-strip">
          <div className="facility-stat-item">
            <Compass size={16} className="text-primary" />
            <span>10 Monitored Plant Zones</span>
          </div>
          <div className="facility-stat-item alert-breach-item">
            <AlertTriangle size={15} className="text-alert" />
            <span>Bottling Noise Alert: <strong>{zones.find(z => z.id === 'bottling')?.noise || 68.4} dB</strong></span>
          </div>
          <div className="facility-stat-item">
            <Radio size={14} className="text-success animate-pulse" />
            <span>Edge Mesh: 100% Online</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Layer & Continuous Display Switches */}
      <div className="map-controls-card">
        <div className="map-toolbar-row">
          {/* Layer Filter Pills */}
          <div className="map-filter-pills">
            <span className="filter-pill-label">
              <Layers size={13} />
              Sensor Layer:
            </span>
            {[
              { id: 'all', label: 'All Zones' },
              { id: 'alerts', label: 'Breach Only', badge: '1' },
              { id: 'temp', label: 'Thermal (°C)' },
              { id: 'noise', label: 'Noise (dB)' },
              { id: 'water', label: 'Water Quality & ETP' }
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

          {/* Perspective & Continuous Popups Controls */}
          <div className="map-tools-right">
            <div className="perspective-toggle-cluster">
              <button 
                className={`perspective-pill ${mapPerspective === '3d' ? 'active' : ''}`}
                onClick={() => setMapPerspective('3d')}
                title="Switch to 3D Architectural Model"
              >
                <Layers size={13} />
                <span>3D Twin</span>
              </button>
              <button 
                className={`perspective-pill ${mapPerspective === 'aerial' ? 'active' : ''}`}
                onClick={() => setMapPerspective('aerial')}
                title="Switch to Satellite Drone Aerial Photo"
              >
                <Camera size={13} />
                <span>Drone Aerial</span>
              </button>
            </div>

            <button
              className={`map-tool-toggle-btn ${showContinuousPopups ? 'active' : ''}`}
              onClick={() => setShowContinuousPopups(!showContinuousPopups)}
              title="Show continuous popups for all zones on the map"
            >
              <Eye size={14} />
              <span>{showContinuousPopups ? 'Popups: ON' : 'Show Popups'}</span>
            </button>

            <button
              className={`map-tool-toggle-btn ${popupViewStyle === 'full' ? 'active' : ''}`}
              onClick={() => setPopupViewStyle(popupViewStyle === 'full' ? 'compact' : 'full')}
              title="Toggle popup detail density"
            >
              <Cpu size={14} />
              <span>{popupViewStyle === 'full' ? 'Full Data Cards' : 'Compact Badges'}</span>
            </button>

            <button
              className={`map-tool-toggle-btn ${isAutoCycling ? 'active' : ''}`}
              onClick={() => setIsAutoCycling(!isAutoCycling)}
              title="Auto cycle inspection spotlight through all facility zones"
            >
              {isAutoCycling ? <Pause size={14} /> : <Play size={14} />}
              <span>{isAutoCycling ? 'Cycling...' : 'Auto Tour'}</span>
            </button>

            <button
              className="map-fullscreen-btn"
              onClick={() => {
                setIsFullscreenModal(true);
                setZoomLevel(1.1);
                setPanOffset({ x: 0, y: 0 });
              }}
            >
              <Maximize2 size={15} />
              <span>Open Fullscreen HD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Standard View 2.5D Isometric Canvas */}
      <div className="facility-canvas-container" ref={mapContainerRef}>
        {renderMapCanvas(false)}
      </div>

      {/* DEDICATED HIGH-DEFINITION FULLSCREEN VIEWER MODAL */}
      {isFullscreenModal && (
        <div className="fullscreen-map-modal animate-fade-in">
          {/* Top Command Bar */}
          <div className="fullscreen-top-command-bar">
            <div className="fs-header-left">
              <div className="fs-plant-badge">
                <Compass size={18} className="text-emerald" />
                <span className="fs-brand-title">RAFFLES OIL — HIGH-DEFINITION SPATIAL TELEMETRY</span>
              </div>
              <span className="live-pill-tag">
                <span className="live-pulse-dot"></span>
                Continuous Real-Time Stream: {lastStreamTime}
              </span>
            </div>

            {/* Center Controls */}
            <div className="fs-header-center">
              <div className="perspective-toggle-cluster fs-perspective">
                <button 
                  className={`perspective-pill ${mapPerspective === '3d' ? 'active' : ''}`}
                  onClick={() => setMapPerspective('3d')}
                  title="Switch to 3D Architectural Model"
                >
                  <Layers size={13} />
                  <span>3D Twin</span>
                </button>
                <button 
                  className={`perspective-pill ${mapPerspective === 'aerial' ? 'active' : ''}`}
                  onClick={() => setMapPerspective('aerial')}
                  title="Switch to Satellite Drone Aerial Photo"
                >
                  <Camera size={13} />
                  <span>Drone Aerial</span>
                </button>
              </div>

              <div className="fs-zoom-cluster">
                <button className="fs-ctrl-btn" onClick={handleZoomOut} title="Zoom Out (-)">
                  <ZoomOut size={16} />
                </button>
                <span className="fs-zoom-readout">{Math.round(zoomLevel * 100)}%</span>
                <button className="fs-ctrl-btn" onClick={handleZoomIn} title="Zoom In (+)">
                  <ZoomIn size={16} />
                </button>
                <button className="fs-ctrl-btn fs-btn-reset" onClick={handleResetZoom} title="Reset Zoom">
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>

              <button 
                className={`fs-toggle-popups-btn ${showContinuousPopups ? 'is-active' : ''}`}
                onClick={() => setShowContinuousPopups(!showContinuousPopups)}
              >
                <Eye size={15} />
                <span>{showContinuousPopups ? 'Popups Visible' : 'Popups Hidden'}</span>
              </button>
            </div>

            {/* Close Button */}
            <div className="fs-header-right">
              <button 
                className="fs-exit-modal-btn"
                onClick={() => {
                  setIsFullscreenModal(false);
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
              >
                <X size={18} />
                <span>Exit Fullscreen (Esc)</span>
              </button>
            </div>
          </div>

          {/* Full-bleed Interactive Viewport */}
          <div className="fullscreen-map-viewport">
            {renderMapCanvas(true)}
          </div>
        </div>
      )}

      {/* Selected Zone Deep Diagnostic Deck */}
      {highlightedZone && (
        <div className="active-zone-dock animate-fade-in">
          <div className="dock-left-meta">
            <div className={`dock-status-icon ${highlightedZone.status === 'Alert' ? 'bg-red-alert' : 'bg-emerald-normal'}`}>
              {highlightedZone.status === 'Alert' ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <div className="dock-title-block">
              <div className="dock-tag-row">
                <span className="dock-zone-id">Zone: #{highlightedZone.id.toUpperCase()}</span>
                <span className={`status-pill ${highlightedZone.status === 'Alert' ? 'tag-critical' : 'pill-active'}`}>
                  {highlightedZone.status === 'Alert' ? 'Active Alarm Breach' : 'Operational Normal'}
                </span>
                <span className="dock-stream-live">● Live Synchronized</span>
              </div>
              <h3 className="dock-zone-name">{highlightedZone.fullName}</h3>
              <p className="dock-zone-sector">{highlightedZone.sector} • Connected to <strong>{highlightedZone.devicesCount} IoT Telemetry Nodes</strong></p>
            </div>
          </div>

          <div className="dock-metrics-strip">
            {highlightedZone.temp !== null && (
              <div className="dock-metric-box">
                <span className="metric-box-label">Temperature</span>
                <span className="metric-box-val">{highlightedZone.temp} °C</span>
                <div className="metric-bar-wrap">
                  <div className="metric-bar-inner fill-orange" style={{ width: `${(highlightedZone.temp / 50) * 100}%` }}></div>
                </div>
              </div>
            )}

            {highlightedZone.noise !== null && (
              <div className={`dock-metric-box ${highlightedZone.noise > 55 ? 'box-breach' : ''}`}>
                <span className="metric-box-label">Noise Level</span>
                <span className={`metric-box-val ${highlightedZone.noise > 55 ? 'text-alert' : ''}`}>
                  {highlightedZone.noise} dB
                </span>
                <div className="metric-bar-wrap">
                  <div className={`metric-bar-inner ${highlightedZone.noise > 55 ? 'fill-red' : 'fill-purple'}`} style={{ width: `${(highlightedZone.noise / 90) * 100}%` }}></div>
                </div>
              </div>
            )}

            {highlightedZone.humidity !== null && (
              <div className="dock-metric-box">
                <span className="metric-box-label">Humidity</span>
                <span className="metric-box-val">{highlightedZone.humidity} %</span>
                <div className="metric-bar-wrap">
                  <div className="metric-bar-inner fill-blue" style={{ width: `${highlightedZone.humidity}%` }}></div>
                </div>
              </div>
            )}

            {highlightedZone.light !== null && (
              <div className="dock-metric-box">
                <span className="metric-box-label">Light / Lux</span>
                <span className="metric-box-val">{highlightedZone.light} lx</span>
                <div className="metric-bar-wrap">
                  <div className="metric-bar-inner fill-amber" style={{ width: `${(highlightedZone.light / 1000) * 100}%` }}></div>
                </div>
              </div>
            )}

            {highlightedZone.ph !== null && (
              <div className="dock-metric-box">
                <span className="metric-box-label">Water pH</span>
                <span className="metric-box-val text-primary">pH {highlightedZone.ph}</span>
                <div className="metric-bar-wrap">
                  <div className="metric-bar-inner fill-green" style={{ width: `${(highlightedZone.ph / 14) * 100}%` }}></div>
                </div>
              </div>
            )}

            {highlightedZone.tds !== null && (
              <div className="dock-metric-box">
                <span className="metric-box-label">TDS Water Purity</span>
                <span className="metric-box-val">{highlightedZone.tds} ppm</span>
                <div className="metric-bar-wrap">
                  <div className="metric-bar-inner fill-teal" style={{ width: `${(highlightedZone.tds / 500) * 100}%` }}></div>
                </div>
              </div>
            )}
          </div>

          <button 
            className="dock-launch-inspect-btn"
            onClick={() => onSelectLocation(highlightedZone)}
          >
            <span>Full Gauge Diagnostics</span>
            <ExternalLink size={15} />
          </button>
        </div>
      )}

      {/* Roster Matrix Table */}
      <div className="enterprise-table-card">
        <div className="table-header-toolbar">
          <div>
            <h3 className="section-title">Raffles Oil Spatial Telemetry Roster</h3>
            <p className="section-subtext">Continuous multi-sensor readings mapped to physical infrastructure</p>
          </div>
          <span className="stats-tag">Total Enrolled Sectors: <strong>{zones.length}</strong></span>
        </div>

        <div className="table-wrapper">
          <table className="enterprise-data-table">
            <thead>
              <tr>
                <th>Physical Zone</th>
                <th>Sector Function</th>
                <th>Temperature</th>
                <th>Noise (OSHA Limit 55dB)</th>
                <th>Humidity</th>
                <th>Water & Effluent</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((spot) => {
                const isSelected = spot.id === activeHighlightId;
                return (
                  <tr 
                    key={spot.id} 
                    className={`table-row-interactive ${isSelected ? 'row-selected-highlight' : ''}`}
                    onClick={() => setActiveHighlightId(spot.id)}
                  >
                    <td>
                      <div className="location-title-cell">
                        <div className={`loc-table-icon ${spot.status === 'Alert' ? 'icon-alert-bg' : ''}`}>
                          <MapPin size={16} />
                        </div>
                        <div>
                          <span className="location-name-bold">{spot.name}</span>
                          <div className="text-xs text-muted">{spot.fullName}</div>
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
                          {spot.noise} dB {spot.noise > 55 ? '⚠️' : ''}
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
