import { useKeycloak } from '@react-keycloak/web';
import { Link } from 'react-router-dom';

function HomePage() {
  const { keycloak } = useKeycloak();

  return (
    <div>
      <h1>Welcome to Home Page</h1>
      {!keycloak.authenticated ? (
        <button onClick={() => keycloak.login()}>Login</button>
      ) : (
        <div>
          <button onClick={() => keycloak.logout()}>Logout</button>
          <Link to="/profile">Go to Profile</Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;