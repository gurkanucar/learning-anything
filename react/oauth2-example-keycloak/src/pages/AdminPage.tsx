import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Page</h1>
      <div className="profile-card">
        <h3>Admin Controls</h3>
        <p>This page is only accessible to administrators.</p>
      </div>
    </div>
  );
};

export default AdminPage; 