import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  ShieldAlert, 
  Sliders, 
  BellRing,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AlertManagement({ rules, onAddRule, onUpdateRule, onDeleteRule }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    deviceName: '',
    sensor: 'Temperature',
    min: '',
    max: '',
    severity: 'High',
    status: 'Active',
    notify: 'Email & SMS'
  });

  const openAddModal = () => {
    setEditingRule(null);
    setFormData({
      name: '',
      deviceName: '',
      sensor: 'Temperature',
      min: '15.0',
      max: '35.0',
      severity: 'High',
      status: 'Active',
      notify: 'Email & SMS'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (rule) => {
    setEditingRule(rule);
    setFormData({ ...rule });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.deviceName.trim()) return;

    if (editingRule) {
      onUpdateRule({ ...formData, id: editingRule.id });
    } else {
      onAddRule({
        ...formData,
        id: 'rule-' + Date.now(),
      });
    }
    setIsModalOpen(false);
  };

  const filteredRules = rules.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.sensor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRules.length / pageSize) || 1;
  const paginatedRules = filteredRules.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="alert-management-page animate-fade-in">
      <div className="dashboard-title-banner">
        <div>
          <h1 className="page-title">Alert Threshold Management</h1>
          <p className="page-subtitle">Configure automated condition rules, min/max thresholds, and notification pipelines</p>
        </div>

        <button className="primary-brand-btn" onClick={openAddModal}>
          <Plus size={16} />
          <span>Add New Rule</span>
        </button>
      </div>

      <div className="enterprise-table-card">
        {/* Top Control Bar */}
        <div className="table-header-toolbar">
          <div className="search-filter-input">
            <Search size={15} className="search-icon-muted" />
            <input
              type="text"
              placeholder="Search rule name, device, or sensor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="table-quick-stats">
            <span className="stats-tag">Total Rules: <strong>{rules.length}</strong></span>
            <span className="stats-tag">Active Policies: <strong>{rules.filter(r => r.status === 'Active').length}</strong></span>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-wrapper">
          <table className="enterprise-data-table">
            <thead>
              <tr>
                <th>Alert Rule Name</th>
                <th>Monitored Device</th>
                <th>Sensor Parameter</th>
                <th>Min Safe</th>
                <th>Max Safe</th>
                <th>Severity</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-cell">
                    <div className="empty-table-box">
                      <ShieldAlert size={32} className="text-muted" />
                      <h4>No Alert Rules Found</h4>
                      <p>Create a rule to begin automated boundary monitoring.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRules.map((rule) => (
                  <tr key={rule.id}>
                    <td>
                      <div className="rule-title-cell">
                        <span className="rule-name-text">{rule.name}</span>
                        <span className="rule-notify-sub">{rule.notify || 'Email Alert'}</span>
                      </div>
                    </td>
                    <td className="text-muted">{rule.deviceName}</td>
                    <td>
                      <span className="parameter-chip">{rule.sensor}</span>
                    </td>
                    <td className="font-mono text-dark">{rule.min ? `${rule.min}` : '—'}</td>
                    <td className="font-mono text-dark">{rule.max ? `${rule.max}` : '—'}</td>
                    <td>
                      <span className={`severity-tag ${rule.severity === 'Critical' ? 'tag-critical' : 'tag-high'}`}>
                        {rule.severity || 'High'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${rule.status === 'Active' ? 'pill-active' : 'pill-inactive'}`}>
                        <span className="status-dot"></span>
                        {rule.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons-cell">
                        <button 
                          className="table-action-icon edit-btn" 
                          onClick={() => openEditModal(rule)}
                          title="Edit Configuration"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="table-action-icon delete-btn" 
                          onClick={() => onDeleteRule(rule.id)}
                          title="Delete Policy"
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

        {/* Pagination Footer */}
        <div className="table-footer-controls">
          <div className="rows-per-page">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rows-select-input"
            >
              <option value={5}>5 entries</option>
              <option value={10}>10 entries</option>
              <option value={20}>20 entries</option>
            </select>
          </div>

          <div className="page-pagination">
            <span className="page-numbers-info">
              Page {filteredRules.length === 0 ? '1 of 1' : `${currentPage} of ${totalPages}`}
            </span>
            <div className="pagination-nav-btns">
              <button
                className="nav-page-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="nav-page-btn"
                disabled={currentPage >= totalPages || filteredRules.length === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modern-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-header-title">
                <Sliders size={18} className="text-primary" />
                <h3>{editingRule ? 'Edit Threshold Rule' : 'Create Threshold Alert Rule'}</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body-form">
              <div className="form-field-group">
                <label>Rule Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical Compressor Overheating"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-field-group">
                <label>Assigned Device *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Refinery 6 MTR Node"
                  value={formData.deviceName}
                  onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Sensor Type</label>
                  <select
                    value={formData.sensor}
                    onChange={(e) => setFormData({ ...formData, sensor: e.target.value })}
                  >
                    <option value="Temperature">Temperature (°C)</option>
                    <option value="Noise">Noise (dB)</option>
                    <option value="Light">Light (lx)</option>
                    <option value="Humidity">Humidity (%)</option>
                    <option value="pH">pH Balance</option>
                    <option value="COD">COD (mg/L)</option>
                    <option value="TDS">TDS (ppm)</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Severity Level</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Lower Threshold (Min)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 15.0"
                    value={formData.min}
                    onChange={(e) => setFormData({ ...formData, min: e.target.value })}
                  />
                </div>
                <div className="form-field-group">
                  <label>Upper Threshold (Max)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 35.0"
                    value={formData.max}
                    onChange={(e) => setFormData({ ...formData, max: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Notification Dispatch</label>
                <input
                  type="text"
                  placeholder="e.g. Email & SMS Alerts to Duty Engineers"
                  value={formData.notify}
                  onChange={(e) => setFormData({ ...formData, notify: e.target.value })}
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-brand-btn">
                  {editingRule ? 'Save Changes' : 'Create Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
