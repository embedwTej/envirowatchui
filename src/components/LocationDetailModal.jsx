import React from 'react';
import { 
  X, 
  Building2, 
  Activity, 
  Wifi, 
  ShieldAlert, 
  CheckCircle2, 
  Cpu, 
  Clock, 
  Battery, 
  Download,
  AlertTriangle,
  Thermometer,
  Sun,
  Volume2,
  Droplets
} from 'lucide-react';

export default function LocationDetailModal({ location, onClose, devices = [] }) {
  if (!location) return null;

  const isAlert = location.status === 'Alert';
  const isInactive = location.status === 'Inactive' || location.isInactive;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modern-modal-dialog modal-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="modal-header-bar">
          <div className="modal-title-composite">
            <div className="modal-icon-bubble">
              <Building2 size={20} />
            </div>
            <div>
              <div className="modal-title-row">
                <h3>{location.name}</h3>
                <span className="sector-tag-chip">{location.department || 'General Plant'}</span>
              </div>
              <p className="modal-subtext">Realtime IoT Sensor Telemetry & Diagnostics</p>
            </div>
          </div>

          <div className="modal-top-actions">
            {isAlert && (
              <span className="status-tag status-alert-tag">
                <span className="status-dot-blink"></span> Active Alert
              </span>
            )}
            {!isAlert && !isInactive && (
              <span className="status-tag status-normal-tag">
                <span className="status-dot"></span> Operational Normal
              </span>
            )}
            {isInactive && (
              <span className="status-tag status-inactive-tag">
                Standby Mode
              </span>
            )}
            <button className="modal-close-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-telemetry-body">
          {/* Active Alert Banner if triggered */}
          {isAlert && (
            <div className="modal-incident-alert">
              <AlertTriangle size={20} className="text-alert" />
              <div>
                <strong>Active Operational Breach Detected</strong>
                <p>{location.alertMsg || 'Environmental parameter exceeded safety standard boundary.'}</p>
              </div>
            </div>
          )}

          {/* Real-time Environmental Gauges Grid */}
          <div className="detail-gauges-grid">
            {location.temp !== null && location.temp !== undefined && (
              <div className="gauge-metric-card">
                <div className="gauge-card-header">
                  <div className="gauge-icon gauge-temp">
                    <Thermometer size={16} />
                  </div>
                  <span className="gauge-label">Ambient Temperature</span>
                </div>
                <div className="gauge-reading">
                  <span className="gauge-num">{location.temp}</span>
                  <span className="gauge-unit">°C</span>
                </div>
                <div className="gauge-bounds-bar">
                  <div className="bounds-fill fill-temp" style={{ width: '65%' }}></div>
                </div>
                <span className="gauge-target-hint">Safe Range: 18.0°C – 32.0°C</span>
              </div>
            )}

            {location.light !== null && location.light !== undefined && (
              <div className="gauge-metric-card">
                <div className="gauge-card-header">
                  <div className="gauge-icon gauge-light">
                    <Sun size={16} />
                  </div>
                  <span className="gauge-label">Luminosity (Light)</span>
                </div>
                <div className="gauge-reading">
                  <span className="gauge-num">{location.light}</span>
                  <span className="gauge-unit">lx</span>
                </div>
                <div className="gauge-bounds-bar">
                  <div className="bounds-fill fill-light" style={{ width: '48%' }}></div>
                </div>
                <span className="gauge-target-hint">Standard: &gt; 250 lx</span>
              </div>
            )}

            {location.noise !== null && location.noise !== undefined && (
              <div className={`gauge-metric-card ${location.noise > 55 ? 'card-breach-glow' : ''}`}>
                <div className="gauge-card-header">
                  <div className="gauge-icon gauge-noise">
                    <Volume2 size={16} />
                  </div>
                  <span className="gauge-label">Acoustic Noise</span>
                </div>
                <div className="gauge-reading">
                  <span className={`gauge-num ${location.noise > 55 ? 'text-alert' : ''}`}>
                    {location.noise}
                  </span>
                  <span className="gauge-unit">dB</span>
                </div>
                <div className="gauge-bounds-bar">
                  <div className={`bounds-fill ${location.noise > 55 ? 'fill-red' : 'fill-noise'}`} style={{ width: `${(location.noise / 90) * 100}%` }}></div>
                </div>
                <span className={`gauge-target-hint ${location.noise > 55 ? 'text-alert font-bold' : ''}`}>
                  Limit: &le; 55.0 dB (OSHA Max)
                </span>
              </div>
            )}

            {location.humidity !== null && location.humidity !== undefined && (
              <div className="gauge-metric-card">
                <div className="gauge-card-header">
                  <div className="gauge-icon gauge-humidity">
                    <Droplets size={16} />
                  </div>
                  <span className="gauge-label">Relative Humidity</span>
                </div>
                <div className="gauge-reading">
                  <span className="gauge-num">{location.humidity}</span>
                  <span className="gauge-unit">%</span>
                </div>
                <div className="gauge-bounds-bar">
                  <div className="bounds-fill fill-humidity" style={{ width: `${location.humidity}%` }}></div>
                </div>
                <span className="gauge-target-hint">Target Range: 40% – 60%</span>
              </div>
            )}

            {location.ph !== null && location.ph !== undefined && (
              <div className="gauge-metric-card">
                <div className="gauge-card-header">
                  <div className="gauge-icon gauge-ph">
                    <Activity size={16} />
                  </div>
                  <span className="gauge-label">Effluent pH Level</span>
                </div>
                <div className="gauge-reading">
                  <span className="gauge-num">{location.ph}</span>
                  <span className="gauge-unit">pH</span>
                </div>
                <div className="gauge-bounds-bar">
                  <div className="bounds-fill fill-ph" style={{ width: `${(location.ph / 14) * 100}%` }}></div>
                </div>
                <span className="gauge-target-hint">Environmental Law: 6.5 – 8.5</span>
              </div>
            )}

            {location.cod !== null && location.cod !== undefined && (
              <div className="gauge-metric-card">
                <div className="gauge-card-header">
                  <div className="gauge-icon gauge-cod">
                    <Activity size={16} />
                  </div>
                  <span className="gauge-label">Chemical Oxygen Demand</span>
                </div>
                <div className="gauge-reading">
                  <span className="gauge-num">{location.cod}</span>
                  <span className="gauge-unit">mg/L</span>
                </div>
                <div className="gauge-bounds-bar">
                  <div className="bounds-fill fill-cod" style={{ width: `${(location.cod / 120) * 100}%` }}></div>
                </div>
                <span className="gauge-target-hint">Discharge Limit: &le; 100 mg/L</span>
              </div>
            )}
          </div>

          {/* Hardware Device Nodes Installed in Zone */}
          <div className="detail-hardware-section">
            <div className="section-title-line">
              <div className="title-left">
                <Cpu size={16} className="text-primary" />
                <h4>Installed Edge Sensors ({devices.length || location.devicesCount || 1})</h4>
              </div>
              <span className="telemetry-ping-badge">
                <Wifi size={13} className="text-success" />
                Signal: {location.signal || 'Strong (-65 dBm)'}
              </span>
            </div>

            <div className="hardware-cards-row">
              {devices.length > 0 ? (
                devices.map(d => (
                  <div key={d.id} className="hardware-mini-card">
                    <div className="hw-mini-top">
                      <span className="hw-friendly-name">{d.name}</span>
                      <span className="status-pill pill-active">
                        <span className="status-dot"></span> Online
                      </span>
                    </div>
                    <div className="hw-meta-grid">
                      <div>
                        <span className="hw-meta-lbl">Hardware MAC:</span>
                        <span className="hw-meta-val font-mono">{d.sensorId}</span>
                      </div>
                      <div>
                        <span className="hw-meta-lbl">Type:</span>
                        <span className="hw-meta-val capitalize">{d.type}</span>
                      </div>
                      <div>
                        <span className="hw-meta-lbl">Battery:</span>
                        <span className="hw-meta-val">{d.battery || '98%'}</span>
                      </div>
                      <div>
                        <span className="hw-meta-lbl">Firmware:</span>
                        <span className="hw-meta-val">{d.firmware || 'v2.5.0'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-hw-card">
                  <span>Central multi-sensor industrial gateway streaming telemetry packets.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer-actions">
          <button 
            type="button" 
            className="secondary-btn" 
            onClick={() => alert(`Exported telemetry audit log for ${location.name}`)}
          >
            <Download size={14} />
            <span>Export Diagnostic Report</span>
          </button>
          <button type="button" className="primary-brand-btn" onClick={onClose}>
            Close Inspection
          </button>
        </div>
      </div>
    </div>
  );
}
