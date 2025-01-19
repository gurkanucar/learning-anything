import React from 'react';

const UserPage: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Page</h1>
      <div className="profile-card">
        <h3>User Content</h3>
        <p>This page is accessible to all authenticated users.</p>
      </div>
    </div>
  );
};

export default UserPage; 