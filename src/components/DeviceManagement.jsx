import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Cpu, 
  Wifi, 
  Battery, 
  Clock, 
  Radio, 
  Copy, 
  Check, 
  Building2,
  ChevronRight
} from 'lucide-react';

export default function DeviceManagement({ 
  locations, 
  devicesByLocation, 
  onAddDevice, 
  onUpdateDevice, 
  onDeleteDevice 
}) {
  const [selectedLocation, setSelectedLocation] = useState('QA Lab');
  const [searchQuery, setSearchQuery] = useState('');
  const [locSearchQuery, setLocSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Temperature Probe',
    sensorId: '',
    type: 'temperature',
    status: 'Active',
    location: 'QA Lab',
    firmware: 'v2.5.0',
    battery: '98%'
  });

  const locationList = locations.map(l => l.name);
  const filteredLocationList = locationList.filter(l => 
    l.toLowerCase().includes(locSearchQuery.toLowerCase())
  );

  const currentDevices = devicesByLocation[selectedLocation] || [];

  const filteredDevices = currentDevices.filter(dev => 
    dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.sensorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyMac = (id) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAddModal = () => {
    setEditingDevice(null);
    const randomHex = 'A4' + Math.random().toString(16).substr(2, 10).toUpperCase();
    setFormData({
      name: 'Temperature Probe',
      sensorId: randomHex,
      type: 'temperature',
      status: 'Active',
      location: selectedLocation,
      firmware: 'v2.5.0',
      battery: '100%'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dev) => {
    setEditingDevice(dev);
    setFormData({
      name: dev.name,
      sensorId: dev.sensorId,
      type: dev.type,
      status: dev.status,
      location: selectedLocation,
      firmware: dev.firmware || 'v2.5.0',
      battery: dev.battery || '95%'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sensorId.trim()) return;

    if (editingDevice) {
      onUpdateDevice(selectedLocation, {
        ...editingDevice,
        name: formData.name,
        sensorId: formData.sensorId,
        type: formData.type,
        status: formData.status,
        firmware: formData.firmware,
      });
    } else {
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      
      onAddDevice(formData.location, {
        id: 'dev-' + Date.now(),
        name: formData.name,
        sensorId: formData.sensorId,
        type: formData.type,
        lastSeen: timeStr,
        status: formData.status,
        firmware: formData.firmware || 'v2.5.0',
        battery: '100%',
        value: formData.type === 'temperature' ? '24.5 °C' : '300 lx',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="device-management-page animate-fade-in">
      <div className="dashboard-title-banner">
        <div>
          <h1 className="page-title">Device & Sensor Fleet Management</h1>
          <p className="page-subtitle">Manage edge hardware nodes, MAC addresses, firmware versions, and telemetry streams</p>
        </div>

        <button className="primary-brand-btn" onClick={openAddModal}>
          <Plus size={16} />
          <span>Register New Device</span>
        </button>
      </div>

      <div className="device-layout-master">
        {/* Left Sub-Navigation for Locations */}
        <aside className="device-loc-subnav">
          <div className="subnav-header">
            <span className="subnav-title">Select Zone</span>
            <div className="subnav-search-wrap">
              <Search size={13} className="subnav-search-icon" />
              <input
                type="text"
                placeholder="Filter zones..."
                value={locSearchQuery}
                onChange={(e) => setLocSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="subnav-scroll-list">
            {filteredLocationList.map((locName) => {
              const count = (devicesByLocation[locName] || []).length;
              const isSelected = selectedLocation === locName;
              return (
                <button
                  key={locName}
                  className={`subnav-loc-item ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedLocation(locName)}
                >
                  <span className="subnav-item-name">{locName}</span>
                  <span className="subnav-item-count">{count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="device-main-panel">
          <div className="enterprise-table-card">
            <div className="table-header-toolbar">
              <div className="zone-current-heading">
                <Building2 size={18} className="text-primary" />
                <h3>{selectedLocation}</h3>
                <span className="zone-active-nodes-tag">{currentDevices.length} Installed Sensors</span>
              </div>

              <div className="search-filter-input">
                <Search size={15} className="search-icon-muted" />
                <input
                  type="text"
                  placeholder="Search sensor name, MAC, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="table-wrapper">
              <table className="enterprise-data-table">
                <thead>
                  <tr>
                    <th>Sensor Hardware ID & Name</th>
                    <th>Type</th>
                    <th>Firmware</th>
                    <th>Last Synchronized</th>
                    <th>Power & Link</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-table-cell">
                        <div className="empty-table-box">
                          <Cpu size={32} className="text-muted" />
                          <h4>No Devices Found for {selectedLocation}</h4>
                          <p>Click "Register New Device" to pair an IoT sensor with this facility sector.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDevices.map((dev) => (
                      <tr key={dev.id}>
                        <td>
                          <div className="device-name-stack">
                            <span className="device-friendly-name">{dev.name}</span>
                            <div className="device-mac-row">
                              <span className="device-mac-code">{dev.sensorId}</span>
                              <button 
                                className="copy-mac-btn" 
                                onClick={() => handleCopyMac(dev.sensorId)}
                                title="Copy MAC ID"
                              >
                                {copiedId === dev.sensorId ? <Check size={11} className="text-success" /> : <Copy size={11} />}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="parameter-chip parameter-chip-alt">{dev.type}</span>
                        </td>
                        <td className="font-mono text-muted">{dev.firmware || 'v2.4.1'}</td>
                        <td>
                          <div className="last-sync-cell">
                            <Clock size={12} className="text-muted" />
                            <span>{dev.lastSeen}</span>
                          </div>
                        </td>
                        <td>
                          <div className="power-signal-cell">
                            <Battery size={13} className="text-success" />
                            <span>{dev.battery || '100%'}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${dev.status === 'Active' ? 'pill-active' : 'pill-inactive'}`}>
                            <span className="status-dot"></span>
                            {dev.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="action-buttons-cell">
                            <button 
                              className="table-action-icon edit-btn" 
                              onClick={() => openEditModal(dev)}
                              title="Edit Sensor"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              className="table-action-icon delete-btn" 
                              onClick={() => onDeleteDevice(selectedLocation, dev.id)}
                              title="Decommission Sensor"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add / Edit Device Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modern-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-header-title">
                <Cpu size={18} className="text-primary" />
                <h3>{editingDevice ? 'Configure Sensor Node' : 'Register New Hardware Sensor'}</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body-form">
              <div className="form-field-group">
                <label>Assigned Plant Zone</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  {locationList.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="form-field-group">
                <label>Hardware MAC Address / Identifier *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A4F0D1503EA4"
                  value={formData.sensorId}
                  onChange={(e) => setFormData({ ...formData, sensorId: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="form-field-group">
                <label>Sensor Friendly Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Precision Temperature Probe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Telemetry Measurement Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="temperature">temperature</option>
                    <option value="light">light</option>
                    <option value="noise">noise</option>
                    <option value="humidity">humidity</option>
                    <option value="ph">ph</option>
                    <option value="cod">cod</option>
                    <option value="tds">tds</option>
                    <option value="vibration">vibration</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Firmware Revision</label>
                  <input
                    type="text"
                    value={formData.firmware}
                    onChange={(e) => setFormData({ ...formData, firmware: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Node Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active (Streaming Telemetry)</option>
                  <option value="Inactive">Inactive (Offline / Maintenance)</option>
                </select>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-brand-btn">
                  {editingDevice ? 'Update Sensor' : 'Enroll Sensor Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
