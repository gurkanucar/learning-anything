import React from 'react';
import { useKeycloak } from '@react-keycloak/web';

const Profile: React.FC = () => {
  const { keycloak } = useKeycloak();

  const tokenParsed = keycloak?.tokenParsed || {};
  const username = tokenParsed?.preferred_username || '';

  return (
    <div style={{ padding: '20px' }}>
      <h1>Profile (Private)</h1>
      <p>Username: {username}</p>
      <p>Email: {tokenParsed?.email}</p>
    </div>
  );
};

export default Profile;
