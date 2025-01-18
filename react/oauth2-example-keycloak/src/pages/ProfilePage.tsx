import { useKeycloak } from '@react-keycloak/web';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const { keycloak } = useKeycloak();

  return (
    <div>
      <h1>Profile Page</h1>
      {keycloak.authenticated && (
        <div>
          <p>Welcome, {keycloak.tokenParsed?.preferred_username}</p>
          <p>Email: {keycloak.tokenParsed?.email}</p>
          <Link to="/">Back to Home</Link>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;