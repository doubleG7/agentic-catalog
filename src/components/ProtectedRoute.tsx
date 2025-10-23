import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
  requiredPermission?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole,
  requiredPermission,
}: ProtectedRouteProps) {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getCurrentUser();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Store the current URL to redirect back after login
    const returnUrl = window.location.pathname + window.location.search;
    sessionStorage.setItem('auth_return_url', returnUrl);
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }

  // If a specific role is required
  if (requiredRole && !AuthService.hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full text-center p-8">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have the required role to access this page.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Required role: <span className="font-medium">{requiredRole}</span>
            <br />
            Your role: <span className="font-medium">{user?.role || 'None'}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If a specific permission is required
  if (requiredPermission && !AuthService.hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full text-center p-8">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Insufficient Permissions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have the required permission to access this page.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Required permission: <span className="font-medium">{requiredPermission}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
