import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profile-error">
        <h2>Error loading profile</h2>
        <p>Unable to load user information.</p>
      </div>
    );
  }

  // Get first letter of name for avatar
  const avatarLetter = user.profile.name?.[0] || user.profile.preferred_username?.[0] || '?';

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {avatarLetter.toUpperCase()}
        </div>
        <div className="profile-title">
          <h1>{user.profile.name}</h1>
          <span className="profile-username">@{user.profile.preferred_username}</span>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>Personal Information</h3>
          <div className="profile-field">
            <span className="field-label">Given Name</span>
            <span className="field-value">{user.profile.given_name}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Family Name</span>
            <span className="field-value">{user.profile.family_name}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Email</span>
            <span className="field-value">
              {user.profile.email}
              {user.profile.email_verified && (
                <span className="verified-badge">✓ Verified</span>
              )}
            </span>
          </div>
        </div>

        <div className="profile-card">
          <h3>Account Details</h3>
          <div className="profile-field">
            <span className="field-label">User ID</span>
            <span className="field-value user-id">{user.profile.sub}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Roles</span>
            <div className="roles-container">
              {user.profile.roles?.map((role: string) => (
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
