import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  INITIAL_LOCATIONS, 
  INITIAL_DEVICES, 
  INITIAL_RULES, 
  INITIAL_USERS, 
  INITIAL_ALERTS 
} from './data/mockData';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './components/Login';
import RealtimeMonitoring from './components/RealtimeMonitoring';
import AlertsThresholds from './components/AlertsThresholds';
import AlertManagement from './components/AlertManagement';
import LocationManagement from './components/LocationManagement';
import DeviceManagement from './components/DeviceManagement';
import UsersRoles from './components/UsersRoles';
import HistoricalDataTrends from './components/HistoricalDataTrends';
import FacilityMapView from './components/FacilityMapView';
import LocationDetailModal from './components/LocationDetailModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Helper to parse view from URL (e.g. ?tab=facility-map or ?view=map or #map)
  const getViewFromURL = () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const queryTab = searchParams.get('tab') || searchParams.get('view');
      if (queryTab) {
        if (queryTab === 'map' || queryTab === 'facility-map') return 'facility-map';
        return queryTab;
      }
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'map' || hash === 'facility-map') return 'facility-map';
      if (hash) return hash;
    } catch (e) {
      // ignore
    }
    return 'realtime';
  };

  const [currentView, setCurrentView] = useState(getViewFromURL);

  // Synchronize view changes with browser URL
  const handleSetCurrentView = (newView) => {
    setCurrentView(newView);
    try {
      const url = new URL(window.location.href);
      if (newView === 'realtime') {
        url.searchParams.delete('tab');
        url.searchParams.delete('view');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : '') + (url.hash || ''));
      } else {
        url.searchParams.set('tab', newView);
        window.history.replaceState({}, '', url.toString());
      }
    } catch (e) {
      // ignore
    }
  };

  // Listen to browser navigation (back/forward or hash change)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromURL());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);
  
  // App Data States
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [devicesByLocation, setDevicesByLocation] = useState(INITIAL_DEVICES);
  const [rules, setRules] = useState(INITIAL_RULES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  // Modals & UI States
  const [selectedDetailLoc, setSelectedDetailLoc] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Subtle real-time telemetry simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLocations((prevLocations) =>
        prevLocations.map((loc) => {
          if (loc.status === 'Normal') {
            const tempDelta = (Math.random() - 0.5) * 0.2;
            const newTemp = loc.temp !== null ? Number((loc.temp + tempDelta).toFixed(1)) : null;
            return { ...loc, temp: newTemp, lastSync: 'Just now' };
          }
          return loc;
        })
      );
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleSimulatePulse = () => {
    setLocations((prevLocations) =>
      prevLocations.map((loc) => {
        if (loc.status === 'Normal') {
          const tempDelta = (Math.random() - 0.5) * 0.4;
          const newTemp = loc.temp !== null ? Number((loc.temp + tempDelta).toFixed(1)) : null;
          return { ...loc, temp: newTemp, lastSync: 'Just now' };
        }
        return loc;
      })
    );
    showToast('Live Telemetry Packet Synchronized: 22 Nodes Connected');
  };

  // Handlers for Locations
  const handleAddLocation = (newLoc) => {
    setLocations([newLoc, ...locations]);
    setDevicesByLocation({
      ...devicesByLocation,
      [newLoc.name]: [
        {
          id: 'dev-' + Date.now(),
          sensorId: 'A' + Math.random().toString(16).substr(2, 10).toUpperCase(),
          name: 'Telemetry Probe Node',
          type: 'temperature',
          lastSeen: 'Just now',
          status: 'Active',
          value: '24.5 °C',
          firmware: 'v2.5.0',
          battery: '100%'
        }
      ]
    });
    showToast(`Plant Zone "${newLoc.name}" enrolled successfully.`);
  };

  const handleUpdateLocation = (updatedLoc) => {
    setLocations(locations.map(l => l.id === updatedLoc.id ? updatedLoc : l));
    showToast(`Plant Zone "${updatedLoc.name}" updated.`);
  };

  const handleDeleteLocation = (id) => {
    const locToDelete = locations.find(l => l.id === id);
    setLocations(locations.filter(l => l.id !== id));
    showToast(`Zone "${locToDelete?.name || ''}" decommissioned.`);
  };

  // Handlers for Rules
  const handleAddRule = (newRule) => {
    setRules([newRule, ...rules]);
    showToast(`Alert policy "${newRule.name}" activated.`);
  };

  const handleUpdateRule = (updatedRule) => {
    setRules(rules.map(r => r.id === updatedRule.id ? updatedRule : r));
    showToast(`Policy "${updatedRule.name}" modified.`);
  };

  const handleDeleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
    showToast('Alert policy removed.');
  };

  // Handlers for Devices
  const handleAddDevice = (locName, newDevice) => {
    const existing = devicesByLocation[locName] || [];
    setDevicesByLocation({
      ...devicesByLocation,
      [locName]: [newDevice, ...existing]
    });
    setLocations(locations.map(l => l.name === locName ? { ...l, devicesCount: (l.devicesCount || 0) + 1 } : l));
    showToast(`Hardware Sensor "${newDevice.name}" registered to ${locName}.`);
  };

  const handleUpdateDevice = (locName, updatedDevice) => {
    const list = devicesByLocation[locName] || [];
    setDevicesByLocation({
      ...devicesByLocation,
      [locName]: list.map(d => d.id === updatedDevice.id ? updatedDevice : d)
    });
    showToast(`Sensor "${updatedDevice.name}" parameters saved.`);
  };

  const handleDeleteDevice = (locName, deviceId) => {
    const list = devicesByLocation[locName] || [];
    setDevicesByLocation({
      ...devicesByLocation,
      [locName]: list.filter(d => d.id !== deviceId)
    });
    setLocations(locations.map(l => l.name === locName ? { ...l, devicesCount: Math.max(0, (l.devicesCount || 1) - 1) } : l));
    showToast('Sensor removed from active fleet.');
  };

  // Handlers for Users
  const handleAddUser = (newUser) => {
    setUsers([newUser, ...users]);
    showToast(`User account "${newUser.name}" created.`);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    showToast(`Account credentials for "${updatedUser.name}" updated.`);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    showToast('User account revoked.');
  };

  // Handlers for Alerts
  const handleAcknowledgeAlert = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    showToast('Threshold violation incident marked as acknowledged.');
  };

  // Export Data to CSV
  const handleExportData = (exportItems) => {
    const headers = ['Location,Department,Status,Temperature_C,Light_Lux,Noise_dB,Humidity_Pct,pH,COD_mgL,TDS_ppm\n'];
    const rows = exportItems.map(l => 
      `"${l.name}","${l.department || ''}","${l.status}","${l.temp ?? ''}","${l.light ?? ''}","${l.noise ?? ''}","${l.humidity ?? ''}","${l.ph ?? ''}","${l.cod ?? ''}","${l.tds ?? ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + headers.concat(rows).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `enviro_watch_telemetry_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${exportItems.length} facility zones to CSV report.`);
  };

  if (!isAuthenticated) {
    return <Login onLogin={(user) => { setIsAuthenticated(true); showToast(`Logged in as ${user.name} (${user.role})`); }} />;
  }

  const activeAlertCount = alerts.filter(a => !a.acknowledged).length;

  const viewTitles = {
    'realtime': 'Realtime Monitoring',
    'facility-map': 'Plant GIS Digital Twin',
    'alerts': 'Alerts & Thresholds',
    'alert-management': 'Alert Management',
    'historical': 'Historical Data & Trends',
    'locations': 'Locations Management',
    'devices': 'Devices Management',
    'users': 'Users & Roles Management',
  };

  return (
    <div className="app-layout">
      {/* Enterprise Dark Forest Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={handleSetCurrentView}
        onLogout={() => {
          setIsAuthenticated(false);
          showToast('Signed out of Enviro Watch.');
        }}
        activeAlertCount={activeAlertCount}
      />

      {/* Main Content Workspace */}
      <div className="main-wrapper">
        {/* Sleek Top Navbar */}
        <Navbar
          currentViewTitle={viewTitles[currentView] || 'Realtime Monitoring'}
          alerts={alerts}
          onSimulatePulse={handleSimulatePulse}
          onOpenAlerts={() => handleSetCurrentView('alerts')}
        />

        <div className="main-content">
          {currentView === 'realtime' && (
            <RealtimeMonitoring
              locations={locations}
              onSelectLocation={(loc) => setSelectedDetailLoc(loc)}
              onExport={handleExportData}
            />
          )}

          {currentView === 'facility-map' && (
            <FacilityMapView
              onSelectLocation={(loc) => setSelectedDetailLoc(loc)}
              onShowToast={showToast}
            />
          )}

          {currentView === 'alerts' && (
            <AlertsThresholds
              alerts={alerts}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              locations={locations}
            />
          )}

          {currentView === 'alert-management' && (
            <AlertManagement
              rules={rules}
              onAddRule={handleAddRule}
              onUpdateRule={handleUpdateRule}
              onDeleteRule={handleDeleteRule}
            />
          )}

          {currentView === 'historical' && (
            <HistoricalDataTrends
              locations={locations}
            />
          )}

          {currentView === 'locations' && (
            <LocationManagement
              locations={locations}
              onAddLocation={handleAddLocation}
              onUpdateLocation={handleUpdateLocation}
              onDeleteLocation={handleDeleteLocation}
            />
          )}

          {currentView === 'devices' && (
            <DeviceManagement
              locations={locations}
              devicesByLocation={devicesByLocation}
              onAddDevice={handleAddDevice}
              onUpdateDevice={handleUpdateDevice}
              onDeleteDevice={handleDeleteDevice}
            />
          )}

          {currentView === 'users' && (
            <UsersRoles
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>
      </div>

      {/* Location Details Modal */}
      {selectedDetailLoc && (
        <LocationDetailModal
          location={selectedDetailLoc}
          devices={devicesByLocation[selectedDetailLoc.name] || []}
          onClose={() => setSelectedDetailLoc(null)}
        />
      )}

      {/* Floating Action Toast */}
      {toast && (
        <div className="toast-notification animate-fade-in">
          <span className="toast-dot-pulse"></span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
