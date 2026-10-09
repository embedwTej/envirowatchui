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
  Camera,
  Link,
  Share2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp
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

export default function FacilityMapView({ 
  onSelectLocation, 
  onShowToast, 
  isStandalone = false, 
  onOpenAdminDashboard, 
  onLaunchFullscreen 
}) {
  // Read initial targeted zone from URL if present (e.g. ?tab=facility-map&zone=bottling)
  const getInitialZone = () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const zoneParam = searchParams.get('zone');
      if (zoneParam && INITIAL_ZONES.some(z => z.id === zoneParam)) {
        return zoneParam;
      }
    } catch (e) {}
    return 'bottling';
  };

  const [zones, setZones] = useState(INITIAL_ZONES);
  const [activeHighlightId, setActiveHighlightId] = useState(getInitialZone);
  const [showContinuousPopups, setShowContinuousPopups] = useState(true);
  const [popupViewStyle, setPopupViewStyle] = useState('full'); // 'full' or 'compact'
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'alerts', 'temp', 'noise', 'water'
  const [isAutoCycling, setIsAutoCycling] = useState(false);
  const [isFullscreenModal, setIsFullscreenModal] = useState(false);
  const [isSummaryDockExpanded, setIsSummaryDockExpanded] = useState(true);
  const [mapPerspective, setMapPerspective] = useState('3d'); // '3d' or 'aerial'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastStreamTime, setLastStreamTime] = useState(new Date().toLocaleTimeString());
  const [copiedUrl, setCopiedUrl] = useState(false);
  // visiblePopupId controls which zone shows a popup at a time
  const [visiblePopupId, setVisiblePopupId] = useState(() => getInitialZone());

  // Function to copy direct shareable browser URL
  const handleCopyDirectUrl = (zoneId = null) => {
    try {
      const targetZone = zoneId || activeHighlightId;
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('tab', 'facility-map');
      url.searchParams.set('mode', 'fullscreen');
      if (targetZone && targetZone !== 'bottling') {
        url.searchParams.set('zone', targetZone);
      }
      const directUrl = url.toString();
      navigator.clipboard.writeText(directUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 3000);
      if (onShowToast) {
        onShowToast(`Direct Fullscreen Map URL copied: ${directUrl}`);
      }
    } catch (e) {
      // Fallback
    }
  };

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

  // Auto-tour cycling — always ON, cycles every 2.5s. Popup shows for 2s then fades before next.
  useEffect(() => {
    const POPUP_SHOW_MS = 2200;   // how long popup stays visible
    const POPUP_GAP_MS = 300;     // brief gap between popups

    let showTimer;
    let gapTimer;
    let zoneIndex = 0;

    const showNext = () => {
      const allZoneIds = INITIAL_ZONES.map(z => z.id);
      const id = allZoneIds[zoneIndex % allZoneIds.length];
      setVisiblePopupId(id);
      setActiveHighlightId(id);
      zoneIndex++;

      // After POPUP_SHOW_MS, hide popup briefly then show next
      showTimer = setTimeout(() => {
        setVisiblePopupId(null); // hide
        gapTimer = setTimeout(showNext, POPUP_GAP_MS);
      }, POPUP_SHOW_MS);
    };

    // Start after a short delay
    const startTimer = setTimeout(showNext, 600);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(showTimer);
      clearTimeout(gapTimer);
    };
  }, []);

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

              {/* CYCLING LIVE POPUP CARD — only visible for the active zone */}
              {visiblePopupId === spot.id && (
                <div 
                  className={`continuous-popup-card popup-cycle-anim ${isAlert ? 'popup-theme-alert' : 'popup-theme-normal'} popup-highlight-glow`}
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
                        <span className={spot.noise > 55 ? 'text-alert' : ''}>{spot.noise} dB</span>
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

  // Pinned Floating Telemetry & Diagnostics Summary Deck
  const renderFloatingSummaryDock = (isPinnedBottom = false) => {
    if (!highlightedZone) return null;

    return (
      <div className={`active-zone-dock animate-fade-in ${isPinnedBottom ? 'dock-pinned-bottom' : ''} ${!isSummaryDockExpanded ? 'dock-minimized' : ''}`}>
        {/* Dock Header & Summary Statistics Strip */}
        <div className="dock-meta-header-bar">
          <div className="dock-summary-stats-strip">
            <span className="dock-kpi-pill">
              <span className="kpi-dot dot-cyan"></span>
              <strong>10</strong> Monitored Zones
            </span>
            <span className="dock-kpi-pill kpi-pill-alert">
              <span className="kpi-dot dot-red"></span>
              <strong>1</strong> Critical Breach: Bottling (68.7 dB)
            </span>
            <span className="dock-kpi-pill">
              <span className="kpi-dot dot-emerald"></span>
              <strong>9</strong> Operational Normal
            </span>
            <span className="dock-kpi-pill">
              <Radio size={12} className="text-success animate-pulse" />
              Edge Mesh 100% Synced
            </span>
          </div>

          <button 
            className="dock-minimize-toggle-btn"
            onClick={() => setIsSummaryDockExpanded(!isSummaryDockExpanded)}
            title={isSummaryDockExpanded ? "Minimize summary dock" : "Expand summary dock"}
          >
            {isSummaryDockExpanded ? (
              <>
                <span>Hide Summary</span>
                <ChevronDown size={14} />
              </>
            ) : (
              <>
                <span>Show Live Telemetry Summary ({highlightedZone.name})</span>
                <ChevronUp size={14} />
              </>
            )}
          </button>
        </div>

        {isSummaryDockExpanded && (
          <div className="dock-expanded-content">
            <div className="dock-left-meta">
              <div className={`dock-status-icon ${highlightedZone.status === 'Alert' ? 'bg-red-alert' : 'bg-emerald-normal'}`}>
                {highlightedZone.status === 'Alert' ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}
              </div>
              <div className="dock-title-block">
                <div className="dock-tag-row">
                  <span className="dock-zone-id">Zone: #{highlightedZone.id.toUpperCase()}</span>
                  <span className={`status-pill ${highlightedZone.status === 'Alert' ? 'tag-critical' : 'pill-active'}`}>
                    {highlightedZone.status === 'Alert' ? 'Active Alarm Breach' : 'Operational Normal'}
                  </span>
                  <span className="dock-stream-live">● Live Stream</span>
                </div>
                <h3 className="dock-zone-name">{highlightedZone.fullName}</h3>
                <p className="dock-zone-sector">{highlightedZone.sector} • <strong>{highlightedZone.devicesCount} IoT Nodes</strong></p>
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

            {/* Quick Zone Switcher Buttons */}
            <div className="dock-zone-quick-pills">
              <span className="quick-pill-label">Zone:</span>
              <div className="quick-pill-scroll">
                {zones.map((z) => (
                  <button
                    key={z.id}
                    className={`zone-switch-btn ${z.id === activeHighlightId ? 'active-zone' : ''} ${z.status === 'Alert' ? 'zone-has-alert' : ''}`}
                    onClick={() => setActiveHighlightId(z.id)}
                  >
                    <span>{z.name}</span>
                    {z.status === 'Alert' && <span className="zone-alert-dot">!</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="dock-actions-cluster">
              <button 
                className="dock-share-btn"
                onClick={() => handleCopyDirectUrl(highlightedZone.id)}
                title={`Copy direct browser URL targeted to ${highlightedZone.name}`}
              >
                <Share2 size={13} />
                <span>Share Link</span>
              </button>

              <button 
                className="dock-launch-inspect-btn"
                onClick={() => onSelectLocation(highlightedZone)}
              >
                <span>Diagnostics</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // STANDALONE FULLSCREEN SCADA VIEW (Opened directly via copied link or mode=fullscreen)
  if (isStandalone) {
    return (
      <div className="standalone-scada-viewport">
        {/* Floating Top SCADA Command Bar */}
        <div className="scada-floating-topbar">
          <div className="scada-topbar-left">
            <div className="scada-brand-cluster">
              <Compass size={18} className="text-emerald" />
              <div>
                <span className="scada-brand-title">DUFIL • RAFFLES OIL</span>
                <span className="scada-brand-sub">DIGITAL TWIN 3D</span>
              </div>
            </div>
            <div className="scada-pulse-cluster">
              <span className="scada-heartbeat-dot"></span>
              <span className="scada-heartbeat-text">LIVE</span>
            </div>
            <div className="scada-alert-badge">
              <AlertTriangle size={13} className="text-alert" />
              <span>Bottling: <strong>68.7 dB</strong></span>
            </div>
          </div>

          <div className="scada-topbar-center">
            {/* Perspective switch */}
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

            {/* Filter pills */}
            <div className="map-filter-pills">
              {[
                { id: 'all', label: 'All' },
                { id: 'alerts', label: 'Alarms', badge: '1' },
                { id: 'temp', label: 'Temp' },
                { id: 'noise', label: 'Noise' },
                { id: 'water', label: 'Water' }
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

            {/* Popups toggle */}
            <button
              className={`map-tool-toggle-btn ${showContinuousPopups ? 'active' : ''}`}
              onClick={() => setShowContinuousPopups(!showContinuousPopups)}
            >
              <Eye size={14} />
              <span>{showContinuousPopups ? 'Popups: ON' : 'Popups: OFF'}</span>
            </button>

            {/* Auto Tour */}
            <button
              className={`map-tool-toggle-btn ${isAutoCycling ? 'active' : ''}`}
              onClick={() => setIsAutoCycling(!isAutoCycling)}
            >
              {isAutoCycling ? <Pause size={14} /> : <Play size={14} />}
              <span>{isAutoCycling ? 'Cycling...' : 'Auto Tour'}</span>
            </button>
          </div>

          <div className="scada-topbar-right">
            {/* Zoom cluster */}
            <div className="fs-zoom-cluster">
              <button className="fs-ctrl-btn" onClick={handleZoomOut} title="Zoom Out (-)">
                <ZoomOut size={15} />
              </button>
              <span className="fs-zoom-readout">{Math.round(zoomLevel * 100)}%</span>
              <button className="fs-ctrl-btn" onClick={handleZoomIn} title="Zoom In (+)">
                <ZoomIn size={15} />
              </button>
              <button className="fs-ctrl-btn fs-btn-reset" onClick={handleResetZoom} title="Reset">
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>

            {/* Copy Map URL */}
            <button
              className={`map-direct-url-btn ${copiedUrl ? 'is-copied' : ''}`}
              onClick={() => handleCopyDirectUrl()}
              title="Copy direct shareable browser URL"
            >
              {copiedUrl ? <Check size={14} className="text-success" /> : <Link size={14} />}
              <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
            </button>

            {/* Exit to Admin Portal */}
            {onOpenAdminDashboard && (
              <button
                className="scada-admin-btn"
                onClick={onOpenAdminDashboard}
                title="Return to full admin console"
              >
                <ExternalLink size={14} />
                <span>Dashboard</span>
              </button>
            )}
          </div>
        </div>

        {/* 100vw x 100vh Fullscreen Canvas */}
        <div className="scada-canvas-fullscreen" ref={mapContainerRef}>
          {renderMapCanvas(true)}
        </div>

        {/* Floating Pinned Summary Dock */}
        {renderFloatingSummaryDock(true)}
      </div>
    );
  }

  return (
    <div className="facility-map-page animate-fade-in">
      {/* Top Banner */}
      <div className="dashboard-title-banner">
        <div>
          <div className="title-with-pill">
            <h1 className="page-title">Plant Digital Twin</h1>
            <span className="live-pill-tag">
              <span className="live-pulse-dot"></span>
              Live: {lastStreamTime}
            </span>
          </div>
          <p className="page-subtitle">
            Dufil Industrial • Raffles Oil 3D Spatial Telemetry
          </p>
        </div>

        {/* Quick Plant Health Metrics */}
        <div className="facility-quick-stats-strip">
          <div className="facility-stat-item">
            <Compass size={16} className="text-primary" />
            <span>10 Zones</span>
          </div>
          <div className="facility-stat-item alert-breach-item">
            <AlertTriangle size={15} className="text-alert" />
            <span>Bottling: <strong>68.4 dB</strong></span>
          </div>
          <div className="facility-stat-item">
            <Radio size={14} className="text-success animate-pulse" />
            <span>Mesh Online</span>
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

            {/* Direct Sharable Browser URL Button */}
            <button
              className={`map-direct-url-btn ${copiedUrl ? 'is-copied' : ''}`}
              onClick={() => handleCopyDirectUrl()}
              title="Copy direct shareable browser URL (paste directly in any browser window to load this map view with popups & summary card)"
            >
              {copiedUrl ? <Check size={14} className="text-success" /> : <Link size={14} />}
              <span>{copiedUrl ? 'URL Copied!' : 'Copy Direct Map URL'}</span>
            </button>

            <button
              className="map-fullscreen-btn"
              onClick={() => {
                if (onLaunchFullscreen) {
                  onLaunchFullscreen();
                } else {
                  setIsFullscreenModal(true);
                  setZoomLevel(1.1);
                  setPanOffset({ x: 0, y: 0 });
                }
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

          {/* Pinned Summary Dock inside fullscreen modal */}
          {renderFloatingSummaryDock(true)}
        </div>
      )}

      {/* Selected Zone Deep Diagnostic Deck */}
      {renderFloatingSummaryDock(false)}

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
