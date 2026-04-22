import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({ name: '', email: '', status: 'New' });
  
  // UI State for the impressive features
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // 1. Fetch leads from your Node.js backend
  useEffect(() => {
    fetch('http://localhost:5000/api/leads')
      .then(response => response.json())
      .then(data => setLeads(data))
      .catch(error => console.error("Error fetching leads:", error));
  }, []);

  // 2. Save lead to backend and trigger animations
  const handleAddLead = (e) => {
    e.preventDefault(); 
    
    fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    })
    .then(response => response.json())
    .then(savedLead => {
      setLeads([...leads, savedLead]); 
      setNewLead({ name: '', email: '', status: 'New' }); 
      setIsModalOpen(false); // Close the popup
      
      // Show success notification for 3 seconds
      setNotification(`Successfully added ${savedLead.name}!`);
      setTimeout(() => setNotification(''), 3000);
    })
    .catch(error => console.error("Error saving lead:", error));
  };

  // 3. Dynamic Analytics Calculations
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    converted: leads.filter(l => l.status === 'Converted').length,
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar glass-panel">
        <div className="logo-area">
          <div className="logo-icon">⚡</div>
          <h2>Nexus CRM</h2>
        </div>
        <ul className="nav-menu">
          <li className="active">📊 Dashboard</li>
          <li>👥 All Leads</li>
          <li>⚙️ Settings</li>
        </ul>
        <div className="intern-badge">
          <p>Future Interns</p>
          <span>Task 02</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          <h1>Lead Overview</h1>
          <button className="primary-btn pulse-effect" onClick={() => setIsModalOpen(true)}>
            + Add New Lead
          </button>
        </header>

        {/* Live Analytics Cards */}
        <section className="stats-grid">
          <div className="stat-card glass-panel">
            <h3>Total Leads</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card glass-panel stat-blue">
            <h3>New Leads</h3>
            <p className="stat-number">{stats.new}</p>
          </div>
          <div className="stat-card glass-panel stat-yellow">
            <h3>Contacted</h3>
            <p className="stat-number">{stats.contacted}</p>
          </div>
          <div className="stat-card glass-panel stat-green">
            <h3>Converted</h3>
            <p className="stat-number">{stats.converted}</p>
          </div>
        </section>

        {/* Beautiful Leads Table */}
        <section className="table-section glass-panel">
          <div className="table-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="table-container">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Client Profile</th>
                  <th>Contact Information</th>
                  <th>Current Status</th>
                  <th>ID Tracker</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">No leads found. Add one to start!</td>
                  </tr>
                ) : (
                  leads.map((lead, index) => (
                    <tr key={lead.id} className="animate-row" style={{ animationDelay: `${index * 0.1}s` }}>
                      <td className="profile-cell">
                        <div className="avatar">{lead.name.charAt(0)}</div>
                        <strong>{lead.name}</strong>
                      </td>
                      <td className="email-cell">✉️ {lead.email}</td>
                      <td>
                        <span className={`status-pill status-${lead.status.toLowerCase()}`}>
                          {lead.status === 'New' && '🔵 '}
                          {lead.status === 'Contacted' && '🟡 '}
                          {lead.status === 'Converted' && '🟢 '}
                          {lead.status}
                        </span>
                      </td>
                      <td className="id-cell">#{lead.id.toString().slice(-4)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Glassmorphism Modal (Popup Form) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-modal">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            <h2>Initialize Lead</h2>
            <p>Enter client data into the system.</p>
            
            <form onSubmit={handleAddLead} className="modern-form">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" placeholder="e.g. John Doe" value={newLead.name} onChange={(e) => setNewLead({...newLead, name: e.target.value})} required autoFocus />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Pipeline Status</label>
                <select value={newLead.status} onChange={(e) => setNewLead({...newLead, status: e.target.value})}>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Converted">Converted</option>
                </select>
              </div>
              <button type="submit" className="primary-btn full-width">Save to Database</button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="toast-notification slide-up">
          ✅ {notification}
        </div>
      )}
    </div>
  );
}

export default App;