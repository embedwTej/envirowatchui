import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Filter, 
  Users, 
  ShieldCheck, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  UserCheck
} from 'lucide-react';

export default function UsersRoles({ users, onAddUser, onUpdateUser, onDeleteUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'ADMIN',
    status: 'Active',
    department: 'Plant Operations'
  });

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'OPERATOR',
      status: 'Active',
      department: 'Refinery Sector'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({ ...user });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (editingUser) {
      onUpdateUser({ ...formData, id: editingUser.id });
    } else {
      const colors = ['#059669', '#2563eb', '#7c3aed', '#ea580c', '#0891b2'];
      onAddUser({
        ...formData,
        id: 'usr-' + Date.now(),
        lastLogin: 'Never',
        avatarColor: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="users-roles-page animate-fade-in">
      <div className="dashboard-title-banner">
        <div>
          <h1 className="page-title">Users & Access Control</h1>
          <p className="page-subtitle">Manage plant administrative privileges, operator accounts, and security roles</p>
        </div>

        <button className="primary-brand-btn" onClick={openAddModal}>
          <Plus size={16} />
          <span>Add User Account</span>
        </button>
      </div>

      <div className="enterprise-table-card">
        {/* Top Control Bar */}
        <div className="table-header-toolbar">
          <div className="search-filter-input">
            <Search size={15} className="search-icon-muted" />
            <input
              type="text"
              placeholder="Search user name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="table-quick-stats">
            <span className="stats-tag">Enrolled Users: <strong>{users.length}</strong></span>
            <span className="stats-tag">Admins: <strong>{users.filter(u => u.role === 'ADMIN').length}</strong></span>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-wrapper">
          <table className="enterprise-data-table">
            <thead>
              <tr>
                <th>Operator & Account</th>
                <th>Department / Unit</th>
                <th>Security Role</th>
                <th>Last Active</th>
                <th>
                  <div className="th-filter-wrapper">
                    <span>Status</span>
                    <Filter size={12} className="filter-icon-inline" />
                  </div>
                </th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-table-cell">
                    <div className="empty-table-box">
                      <Users size={32} className="text-muted" />
                      <h4>No User Accounts Found</h4>
                      <p>Add team members to grant dashboard access.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-profile-cell">
                        <div 
                          className="user-avatar-circle"
                          style={{ backgroundColor: user.avatarColor || '#059669' }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-name-box">
                          <span className="user-full-name">{user.name}</span>
                          <span className="user-email-text">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="sector-tag-chip">{user.department || 'Plant Operations'}</span>
                    </td>
                    <td>
                      <span className={`role-badge ${user.role === 'ADMIN' ? 'role-admin' : 'role-operator'}`}>
                        <ShieldCheck size={12} />
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="last-sync-cell">
                        <Clock size={12} className="text-muted" />
                        <span>{user.lastLogin || 'Today, 10:30 AM'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${user.status === 'Active' ? 'pill-active' : 'pill-inactive'}`}>
                        <span className="status-dot"></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons-cell">
                        <button 
                          className="table-action-icon edit-btn" 
                          onClick={() => openEditModal(user)}
                          title="Edit User Profile"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="table-action-icon delete-btn" 
                          onClick={() => onDeleteUser(user.id)}
                          title="Revoke User Access"
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
              <option value={6}>6 users</option>
              <option value={10}>10 users</option>
              <option value={20}>20 users</option>
            </select>
          </div>

          <div className="page-pagination">
            <span className="page-numbers-info">
              Page {filteredUsers.length === 0 ? '1 of 1' : `${currentPage} of ${totalPages}`}
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
                disabled={currentPage >= totalPages || filteredUsers.length === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modern-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-header-title">
                <UserCheck size={18} className="text-primary" />
                <h3>{editingUser ? 'Edit User Credentials' : 'Add New Team Member'}</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body-form">
              <div className="form-field-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faizal Rahman"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-field-group">
                <label>Official Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. faizal.rahman@metayb.ai"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-field-group">
                <label>Department / Facility Sector</label>
                <input
                  type="text"
                  placeholder="e.g. Refinery Operations, Metayb Engineering"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Access Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="ADMIN">ADMIN (Full Supervisory Control)</option>
                    <option value="OPERATOR">OPERATOR (Read & Acknowledge)</option>
                    <option value="VIEWER">VIEWER (Auditor Read Only)</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-brand-btn">
                  {editingUser ? 'Save Updates' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
