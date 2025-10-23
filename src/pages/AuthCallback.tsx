import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Handle OAuth error
      if (error) {
        setStatus('error');
        setMessage(errorDescription || error);
        toast.error(`Authentication failed: ${errorDescription || error}`);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      // No code provided
      if (!code) {
        setStatus('error');
        setMessage('No authorization code received');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        // Exchange code for tokens
        const user = await AuthService.handleOAuthCallback(code, state || undefined);

        if (user) {
          setStatus('success');
          setMessage(`Welcome, ${user.name}!`);
          toast.success(`Successfully logged in as ${user.name}`);
          
          // Redirect to dashboard or intended page
          const returnUrl = sessionStorage.getItem('auth_return_url') || '/';
          sessionStorage.removeItem('auth_return_url');
          
          setTimeout(() => navigate(returnUrl), 1500);
        } else {
          setStatus('error');
          setMessage('Failed to complete authentication');
          toast.error('Authentication failed');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Authenticating...
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Success!
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                Redirecting...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-10 w-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Authentication Failed
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                Redirecting to home...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
