import { useLocation } from 'react-router-dom';
import { authService } from '../services/auth';

const Login = () => {
  const location = useLocation();

  const handleLogin = async () => {
    try {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      sessionStorage.setItem('redirectPath', from);
      await authService.login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome</h1>
      <button onClick={handleLogin} className="fetch-button">
        Login with OIDC
      </button>
    </div>
  );
};

export default Login;
