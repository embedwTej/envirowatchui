import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Building2, 
  Cpu, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  MapPin
} from 'lucide-react';

export default function LocationManagement({ locations, onAddLocation, onUpdateLocation, onDeleteLocation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    devicesCount: 1,
    status: 'Active',
  });

  const openAddModal = () => {
    setEditingLocation(null);
    setFormData({
      name: '',
      department: 'Refinery',
      devicesCount: 2,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (loc) => {
    setEditingLocation(loc);
    setFormData({
      name: loc.name,
      department: loc.department || '',
      devicesCount: loc.devicesCount || 1,
      status: loc.status === 'Normal' || loc.status === 'Active' ? 'Active' : 'Inactive',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingLocation) {
      onUpdateLocation({
        ...editingLocation,
        name: formData.name,
        department: formData.department,
        devicesCount: Number(formData.devicesCount),
        status: formData.status === 'Active' ? 'Normal' : 'Inactive',
      });
    } else {
      onAddLocation({
        id: 'loc-' + Date.now(),
        name: formData.name,
        department: formData.department,
        devicesCount: Number(formData.devicesCount),
        status: formData.status === 'Active' ? 'Normal' : 'Inactive',
        temp: 24.5,
        humidity: 50.0,
        light: 300.0,
        power: '220V AC',
        signal: 'Strong',
        lastSync: 'Just now'
      });
    }
    setIsModalOpen(false);
  };

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loc.department && loc.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredLocations.length / pageSize) || 1;
  const paginatedLocations = filteredLocations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="location-management-page animate-fade-in">
      <div className="dashboard-title-banner">
        <div>
          <h1 className="page-title">Location Management</h1>
          <p className="page-subtitle">Configure plant physical zones, buildings, and sensor cluster bindings</p>
        </div>

        <button className="primary-brand-btn" onClick={openAddModal}>
          <Plus size={16} />
          <span>Add Location</span>
        </button>
      </div>

      <div className="enterprise-table-card">
        {/* Top Control Bar */}
        <div className="table-header-toolbar">
          <div className="search-filter-input">
            <Search size={15} className="search-icon-muted" />
            <input
              type="text"
              placeholder="Search location name or sector..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="table-quick-stats">
            <span className="stats-tag">Total Zones: <strong>{locations.length}</strong></span>
            <span className="stats-tag">Enrolled Nodes: <strong>{locations.reduce((acc, l) => acc + (l.devicesCount || 1), 0)}</strong></span>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-wrapper">
          <table className="enterprise-data-table">
            <thead>
              <tr>
                <th>Location Name</th>
                <th>Department / Sector</th>
                <th>Connected Devices</th>
                <th>Health Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLocations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-table-cell">
                    <div className="empty-table-box">
                      <MapPin size={32} className="text-muted" />
                      <h4>No Locations Found</h4>
                      <p>Register a factory zone to attach IoT sensor nodes.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLocations.map((loc) => {
                  const isActive = loc.status !== 'Inactive' && !loc.isInactive;
                  return (
                    <tr key={loc.id}>
                      <td>
                        <div className="location-title-cell">
                          <div className="loc-table-icon">
                            <Building2 size={16} />
                          </div>
                          <span className="location-name-bold">{loc.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="sector-tag-chip">
                          {loc.department || 'General Plant'}
                        </span>
                      </td>
                      <td>
                        <div className="device-count-badge">
                          <Cpu size={13} className="text-muted" />
                          <span>{loc.devicesCount || 1} Node{(loc.devicesCount || 1) > 1 ? 's' : ''}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${isActive ? 'pill-active' : 'pill-inactive'}`}>
                          <span className="status-dot"></span>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="action-buttons-cell">
                          <button 
                            className="table-action-icon edit-btn" 
                            onClick={() => openEditModal(loc)}
                            title="Edit Location Zone"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="table-action-icon delete-btn" 
                            onClick={() => onDeleteLocation(loc.id)}
                            title="Delete Zone"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
              <option value={6}>6 zones</option>
              <option value={10}>10 zones</option>
              <option value={20}>20 zones</option>
            </select>
          </div>

          <div className="page-pagination">
            <span className="page-numbers-info">
              Page {filteredLocations.length === 0 ? '1 of 1' : `${currentPage} of ${totalPages}`}
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
                disabled={currentPage >= totalPages || filteredLocations.length === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Location Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modern-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-header-title">
                <Building2 size={18} className="text-primary" />
                <h3>{editingLocation ? 'Edit Plant Location' : 'Register New Location'}</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body-form">
              <div className="form-field-group">
                <label>Location Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bottling Line 2, Boiler & WTP"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-field-group">
                <label>Department / Facility Sector</label>
                <input
                  type="text"
                  placeholder="e.g. Refinery, Packaging, Utility, Storage"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Initial Hardware Nodes</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.devicesCount}
                    onChange={(e) => setFormData({ ...formData, devicesCount: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active (Operational)</option>
                    <option value="Inactive">Inactive (Maintenance)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-brand-btn">
                  {editingLocation ? 'Save Updates' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
