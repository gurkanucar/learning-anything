import React from 'react';
import { useKeycloak } from '@react-keycloak/web';

interface UserProfile {
  sub: string;
  email_verified: boolean;
  roles: string[];
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

const Profile: React.FC = () => {
  const { keycloak } = useKeycloak();
  const userProfile = keycloak?.tokenParsed as UserProfile;

  if (!userProfile) {
    return (
      <div className="profile-container">
        <div className="profile-error">Unable to load profile information</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {userProfile.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-title">
          <h1>{userProfile.name}</h1>
          <span className="profile-username">@{userProfile.preferred_username}</span>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>Personal Information</h3>
          <div className="profile-field">
            <span className="field-label">First Name</span>
            <span className="field-value">{userProfile.given_name}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Last Name</span>
            <span className="field-value">{userProfile.family_name}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Email</span>
            <span className="field-value">
              {userProfile.email}
              {userProfile.email_verified && (
                <span className="verified-badge" title="Email Verified">✓</span>
              )}
            </span>
          </div>
        </div>

        <div className="profile-card">
          <h3>Account Details</h3>
          <div className="profile-field">
            <span className="field-label">User ID</span>
            <span className="field-value user-id">{userProfile.sub}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Roles</span>
            <div className="roles-container">
              {userProfile.roles.map((role) => (
                <span key={role} className="role-badge">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
