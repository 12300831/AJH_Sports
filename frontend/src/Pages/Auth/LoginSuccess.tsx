import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginSuccess() {
  const { login } = useAuth();

  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const provider = urlParams.get('provider');

    if (token) {
      // Use auth context to login
      login(token);
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Redirect to player dashboard
      window.location.href = '/#player';
    } else {
      // No token found, redirect to signin
      window.location.href = '/#signin';
    }
  }, [login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging you in...</h1>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
