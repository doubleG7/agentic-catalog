import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService, AuthProviderInfo } from '../services/AuthService';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [providerInfo, setProviderInfo] = useState<AuthProviderInfo | null>(null);
  const [showDevLogin, setShowDevLogin] = useState(false);
  const [devEmail, setDevEmail] = useState('dev@example.com');
  const [devRole, setDevRole] = useState('ADMIN');

  useEffect(() => {
    // Check if already authenticated
    if (AuthService.isAuthenticated()) {
      navigate('/');
      return;
    }

    // Get provider info
    const loadProviderInfo = async () => {
      const info = await AuthService.getAuthInfo();
      setProviderInfo(info);
    };

    loadProviderInfo();
  }, [navigate]);

  const handleTrimbleLogin = async () => {
    try {
      setLoading(true);
      
      // Store return URL if provided
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
      if (returnUrl) {
        sessionStorage.setItem('auth_return_url', returnUrl);
      }

      // Start OAuth flow
      await AuthService.startTrimbleAuth();
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to start authentication');
      setLoading(false);
    }
  };

  const handleDevLogin = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:3007/api/v1/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: devEmail, role: devRole })
      });

      if (!response.ok) {
        throw new Error('Dev login failed');
      }

      const data = await response.json();
      
      // Store tokens using AuthUtils and AuthService methods
      const AuthUtils = await import('../utils/security').then(m => m.AuthUtils);
      AuthUtils.setSecureToken(data.data.accessToken);
      
      // Store refresh token separately
      if (data.data.refreshToken) {
        sessionStorage.setItem('__refresh_token', btoa(data.data.refreshToken + ':' + Date.now()));
      }
      
      toast.success('Logged in successfully!');
      
      // Redirect
      const returnUrl = sessionStorage.getItem('auth_return_url') || '/';
      sessionStorage.removeItem('auth_return_url');
      navigate(returnUrl);
    } catch (error) {
      console.error('Dev login error:', error);
      toast.error('Development login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to Option One
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Prompt & Instruction Management System
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {providerInfo?.requiresOAuth ? (
            <button
              onClick={handleTrimbleLogin}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  </span>
                  Connecting to TrimbleID...
                </>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-blue-300 group-hover:text-blue-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                  Sign in with TrimbleID
                </>
              )}
            </button>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p>Loading authentication provider...</p>
            </div>
          )}

          {/* Development Login - Only show if provider is available */}
          {providerInfo && !showDevLogin && (
            <button
              onClick={() => setShowDevLogin(false)}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Use development login →
            </button>
          )}

          {showDevLogin && (
            <div className="mt-4 space-y-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-700">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Development Login</p>
              <input
                type="email"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                value={devRole}
                onChange={(e) => setDevRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="ADMIN">Admin</option>
                <option value="PRODUCT_MANAGER">Product Manager</option>
                <option value="QA_LEAD">QA Lead</option>
                <option value="DEVELOPER">Developer</option>
                <option value="USER">User</option>
              </select>
              <button
                onClick={handleDevLogin}
                disabled={loading}
                className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Dev Login'}
              </button>
              <button
                onClick={() => setShowDevLogin(false)}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ← Back to TrimbleID
              </button>
            </div>
          )}

          {providerInfo && (
            <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-500">
              <p>Provider: {providerInfo.name}</p>
              {providerInfo.authority && (
                <p className="mt-1">Authority: {providerInfo.authority}</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Secure authentication powered by TrimbleID
          </p>
        </div>
      </div>
    </div>
  );
}
