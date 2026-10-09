import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Download, 
  Calendar, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Layers,
  Thermometer,
  Sun,
  Volume2,
  Droplets,
  Check,
  PlusCircle,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function HistoricalDataTrends({ locations }) {
  const [selectedLocId, setSelectedLocId] = useState(locations[0]?.id || '1');
  // MULTI-SENSOR SELECTION STATE: array of active sensor keys!
  const [selectedSensors, setSelectedSensors] = useState(['temp', 'humidity', 'noise']);
  const [timeRange, setTimeRange] = useState('24h');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const selectedLoc = locations.find(l => l.id === selectedLocId) || locations[0];

  const SENSOR_CATALOG = {
    temp: { 
      id: 'temp',
      label: 'Temperature', 
      unit: '°C', 
      color: '#f97316', 
      bgLight: 'rgba(249, 115, 22, 0.12)',
      defaultVal: selectedLoc?.temp || 26.5, 
      minLimit: 15, 
      maxLimit: 35, 
      icon: Thermometer,
      scaleMin: 10,
      scaleMax: 45
    },
    humidity: { 
      id: 'humidity',
      label: 'Humidity', 
      unit: '%', 
      color: '#0284c7', 
      bgLight: 'rgba(2, 132, 199, 0.12)',
      defaultVal: selectedLoc?.humidity || 52.1, 
      minLimit: 40, 
      maxLimit: 60, 
      icon: Droplets,
      scaleMin: 20,
      scaleMax: 90
    },
    noise: { 
      id: 'noise',
      label: 'Noise Level', 
      unit: 'dB', 
      color: '#a855f7', 
      bgLight: 'rgba(168, 85, 247, 0.12)',
      defaultVal: selectedLoc?.noise || 58.2, 
      minLimit: 30, 
      maxLimit: 55, 
      icon: Volume2,
      scaleMin: 20,
      scaleMax: 90
    },
    light: { 
      id: 'light',
      label: 'Light (Lux)', 
      unit: 'lx', 
      color: '#eab308', 
      bgLight: 'rgba(234, 179, 8, 0.12)',
      defaultVal: selectedLoc?.light || 320, 
      minLimit: 200, 
      maxLimit: 800, 
      icon: Sun,
      scaleMin: 50,
      scaleMax: 1000
    },
    ph: { 
      id: 'ph',
      label: 'pH Balance', 
      unit: 'pH', 
      color: '#10b981', 
      bgLight: 'rgba(16, 185, 129, 0.12)',
      defaultVal: selectedLoc?.ph || 7.5, 
      minLimit: 6.5, 
      maxLimit: 8.5, 
      icon: Activity,
      scaleMin: 5.0,
      scaleMax: 10.0
    },
    cod: { 
      id: 'cod',
      label: 'COD Water Quality', 
      unit: 'mg/L', 
      color: '#0d9488', 
      bgLight: 'rgba(13, 148, 136, 0.12)',
      defaultVal: selectedLoc?.cod || 80.0, 
      minLimit: 20, 
      maxLimit: 100, 
      icon: Activity,
      scaleMin: 10,
      scaleMax: 150
    },
  };

  const toggleSensor = (sensorKey) => {
    if (selectedSensors.includes(sensorKey)) {
      if (selectedSensors.length > 1) {
        setSelectedSensors(selectedSensors.filter(k => k !== sensorKey));
      }
    } else {
      setSelectedSensors([...selectedSensors, sensorKey]);
    }
  };

  const selectAllSensors = () => {
    setSelectedSensors(Object.keys(SENSOR_CATALOG));
  };

  const selectSingleSensor = (sensorKey) => {
    setSelectedSensors([sensorKey]);
  };

  // Generate synchronized multi-sensor time-series dataset
  const timeSeriesData = useMemo(() => {
    const pointsCount = timeRange === '1h' ? 12 : timeRange === '6h' ? 18 : timeRange === '24h' ? 24 : 14;
    const series = [];

    for (let i = 0; i < pointsCount; i++) {
      let timeLabel = `${i}:00`;
      if (timeRange === '1h') timeLabel = `${i * 5}m`;
      else if (timeRange === '7d') timeLabel = `Day ${i + 1}`;

      const point = { time: timeLabel, index: i };

      // Compute data point for each sensor in the catalog
      Object.keys(SENSOR_CATALOG).forEach((key) => {
        const cfg = SENSOR_CATALOG[key];
        const base = Number(cfg.defaultVal) || 25;
        // Seeded harmonic variation for realistic curves
        const shift = key === 'temp' ? 0 : key === 'humidity' ? 2 : key === 'noise' ? 4 : 1;
        const wave = Math.sin((i + shift) / 2) * (base * 0.1) + Math.cos((i * 1.3) + shift) * (base * 0.05);
        const val = Number((base + wave).toFixed(1));
        point[key] = val;
      });

      series.push(point);
    }

    return series;
  }, [timeRange, selectedLoc]);

  // Dimensions for SVG Graph
  const width = 940;
  const height = 320;
  const paddingLeft = 55;
  const paddingRight = 40;
  const paddingTop = 35;
  const paddingBottom = 45;

  const getX = (idx) => paddingLeft + (idx / (timeSeriesData.length - 1)) * (width - paddingLeft - paddingRight);

  // Compute normalized Y coordinate for a sensor value so all parameters fit neatly
  const getY = (val, sensorKey) => {
    const cfg = SENSOR_CATALOG[sensorKey];
    const sMin = cfg.scaleMin;
    const sMax = cfg.scaleMax;
    const norm = Math.max(0, Math.min(1, (val - sMin) / (sMax - sMin)));
    return height - paddingBottom - norm * (height - paddingTop - paddingBottom);
  };

  return (
    <div className="historical-page animate-fade-in">
      {/* Top Banner */}
      <div className="dashboard-title-banner">
        <div>
          <h1 className="page-title">Historical Trends & Multi-Sensor Telemetry</h1>
          <p className="page-subtitle">Overlay and compare multiple environmental parameters simultaneously on a unified graph</p>
        </div>

        <button 
          className="primary-brand-btn"
          onClick={() => alert(`Exporting composite telemetry log for ${selectedLoc?.name} (${selectedSensors.join(', ')})`)}
        >
          <Download size={15} />
          <span>Export Multi-Sensor CSV</span>
        </button>
      </div>

      {/* Control Panel: Zone & Multi-Sensor Selector */}
      <div className="modern-filter-card">
        <div className="multi-sensor-control-layout">
          {/* Zone Selector */}
          <div className="control-zone-picker">
            <label className="filter-cell-label">Monitored Zone</label>
            <div className="select-box-wrap">
              <select
                value={selectedLocId}
                onChange={(e) => setSelectedLocId(e.target.value)}
                className="modern-select"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} {loc.department ? `(${loc.department})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Window Buttons */}
          <div className="control-time-picker">
            <label className="filter-cell-label">Time Window</label>
            <div className="segmented-range-pills">
              {['1h', '6h', '24h', '7d', '30d'].map((range) => (
                <button
                  key={range}
                  className={`range-pill ${timeRange === range ? 'active' : ''}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-Sensor Selection Pills (User's core request!) */}
        <div className="multi-sensor-selector-strip">
          <div className="strip-title-row">
            <span className="strip-label">
              <Layers size={14} className="text-primary" />
              Active Graph Overlays (Select multiple to compare together):
            </span>
            <div className="strip-quick-actions">
              <button className="strip-text-btn" onClick={selectAllSensors}>Select All</button>
              <span className="text-muted">•</span>
              <button className="strip-text-btn" onClick={() => selectSingleSensor('temp')}>Solo Temp</button>
            </div>
          </div>

          <div className="sensor-checkbox-pills">
            {Object.keys(SENSOR_CATALOG).map((key) => {
              const cfg = SENSOR_CATALOG[key];
              const isSelected = selectedSensors.includes(key);
              const Icon = cfg.icon;

              return (
                <button
                  key={key}
                  className={`sensor-toggle-chip ${isSelected ? 'is-selected' : ''}`}
                  style={{
                    borderColor: isSelected ? cfg.color : '#e2e8f0',
                    backgroundColor: isSelected ? cfg.bgLight : '#ffffff',
                    color: isSelected ? '#0f172a' : '#64748b'
                  }}
                  onClick={() => toggleSensor(key)}
                >
                  <span 
                    className="sensor-dot-marker"
                    style={{ backgroundColor: cfg.color }}
                  ></span>
                  <Icon size={14} style={{ color: cfg.color }} />
                  <span className="sensor-chip-name">{cfg.label}</span>
                  <span className="sensor-chip-unit">({cfg.unit})</span>
                  {isSelected && <Check size={13} className="chip-check-icon" style={{ color: cfg.color }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Summary Cards for All Active Sensors */}
      <div className="historical-stats-grid">
        {selectedSensors.map((key) => {
          const cfg = SENSOR_CATALOG[key];
          const vals = timeSeriesData.map(d => d[key]);
          const min = Math.min(...vals);
          const max = Math.max(...vals);
          const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
          const current = vals[vals.length - 1];
          const Icon = cfg.icon;

          return (
            <div key={key} className="telemetry-stat-card" style={{ borderLeft: `4px solid ${cfg.color}` }}>
              <div className="stat-card-icon" style={{ backgroundColor: cfg.bgLight, color: cfg.color }}>
                <Icon size={18} />
              </div>
              <div className="stat-card-content">
                <span className="stat-title">{cfg.label}</span>
                <span className="stat-large-val" style={{ color: cfg.color }}>{current} {cfg.unit}</span>
                <div className="stat-multi-summary">
                  <span>Avg: <strong>{avg}</strong></span>
                  <span>Min: <strong>{min}</strong></span>
                  <span>Max: <strong>{max}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Multi-Sensor Composite Graph */}
      <div className="executive-chart-card">
        <div className="chart-card-top">
          <div className="chart-title-stack">
            <h3>{selectedLoc?.name} — Composite Multi-Sensor Telemetry Comparison</h3>
            <p className="chart-subtext">
              Simultaneous overlay of {selectedSensors.length} parameters ({selectedSensors.map(k => SENSOR_CATALOG[k].label).join(', ')}) over {timeRange}
            </p>
          </div>

          {/* Interactive Graph Legend */}
          <div className="chart-legend-row multi-legend-wrap">
            {selectedSensors.map((key) => {
              const cfg = SENSOR_CATALOG[key];
              const latestVal = timeSeriesData[timeSeriesData.length - 1][key];
              return (
                <div key={key} className="legend-chip-interactive" style={{ backgroundColor: cfg.bgLight }}>
                  <span className="legend-dot" style={{ backgroundColor: cfg.color }}></span>
                  <span className="legend-sensor-name">{cfg.label}:</span>
                  <strong style={{ color: cfg.color }}>{latestVal} {cfg.unit}</strong>
                </div>
              );
            })}
          </div>
        </div>

        {/* SVG Multi-Line Chart */}
        <div className="svg-chart-container">
          <svg viewBox={`0 0 ${width} ${height}`} className="main-telemetry-svg">
            <defs>
              {selectedSensors.map((key) => {
                const cfg = SENSOR_CATALOG[key];
                return (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={cfg.color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={cfg.color} stopOpacity="0.0" />
                  </linearGradient>
                );
              })}
            </defs>

            {/* Horizontal Grid Lines with Y-Axis Percentage Labels */}
            {[0.0, 0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
              const y = height - paddingBottom - ratio * (height - paddingTop - paddingBottom);
              const labelPercent = Math.round(ratio * 100);
              return (
                <g key={i}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray={ratio === 0 || ratio === 1 ? 'none' : '3 3'}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="#94a3b8"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {labelPercent}%
                  </text>
                </g>
              );
            })}

            {/* Render Multi-Sensor Paths */}
            {selectedSensors.map((key) => {
              const cfg = SENSOR_CATALOG[key];
              const pointsString = timeSeriesData.map((d, i) => `${getX(i)},${getY(d[key], key)}`).join(' ');
              const areaPath = `M ${getX(0)},${height - paddingBottom} L ${pointsString} L ${getX(timeSeriesData.length - 1)},${height - paddingBottom} Z`;

              return (
                <g key={key}>
                  {/* Subtle Area for First Selected Sensor */}
                  {selectedSensors[0] === key && (
                    <path d={areaPath} fill={`url(#grad-${key})`} />
                  )}

                  {/* Main Line */}
                  <polyline
                    fill="none"
                    stroke={cfg.color}
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsString}
                  />

                  {/* Data Points on Line */}
                  {timeSeriesData.map((d, i) => {
                    const cx = getX(i);
                    const cy = getY(d[key], key);
                    const isHovered = hoveredIndex === i;

                    return (
                      <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={isHovered ? "5" : "3"}
                        fill="#ffffff"
                        stroke={cfg.color}
                        strokeWidth="2"
                        className="telemetry-svg-dot"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <title>{`${cfg.label} (${d.time}): ${d[key]} ${cfg.unit}`}</title>
                      </circle>
                    );
                  })}
                </g>
              );
            })}

            {/* Crosshair & Multi-Sensor Tooltip */}
            {hoveredIndex !== null && (
              <g>
                <line
                  x1={getX(hoveredIndex)}
                  y1={paddingTop}
                  x2={getX(hoveredIndex)}
                  y2={height - paddingBottom}
                  stroke="#64748b"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <rect
                  x={Math.min(width - 180, Math.max(paddingLeft, getX(hoveredIndex) - 90))}
                  y={paddingTop - 10}
                  width="180"
                  height={24 + selectedSensors.length * 18}
                  rx="8"
                  fill="#0f172a"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                />
                <text
                  x={Math.min(width - 180, Math.max(paddingLeft, getX(hoveredIndex) - 90)) + 12}
                  y={paddingTop + 8}
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="700"
                >
                  TIMESTAMP: {timeSeriesData[hoveredIndex]?.time}
                </text>
                {selectedSensors.map((key, idx) => {
                  const cfg = SENSOR_CATALOG[key];
                  const val = timeSeriesData[hoveredIndex][key];
                  const textY = paddingTop + 26 + idx * 18;

                  return (
                    <g key={key}>
                      <circle
                        cx={Math.min(width - 180, Math.max(paddingLeft, getX(hoveredIndex) - 90)) + 16}
                        cy={textY - 3}
                        r="3.5"
                        fill={cfg.color}
                      />
                      <text
                        x={Math.min(width - 180, Math.max(paddingLeft, getX(hoveredIndex) - 90)) + 26}
                        y={textY}
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {cfg.label}: {val} {cfg.unit}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* X-Axis Time Labels */}
            {timeSeriesData.map((d, i) => {
              if (i % (timeRange === '24h' ? 4 : 2) === 0 || i === timeSeriesData.length - 1) {
                return (
                  <text
                    key={i}
                    x={getX(i)}
                    y={height - 15}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="11"
                    fontFamily="inherit"
                  >
                    {d.time}
                  </text>
                );
              }
              return null;
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
