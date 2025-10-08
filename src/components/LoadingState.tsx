import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'white' | 'gray';
}

/**
 * Reusable loading spinner component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  color = 'primary'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-500',
  };

  return (
    <Loader2 
      className={clsx(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )} 
    />
  );
};

interface LoadingStateProps {
  loading: boolean;
  error?: string | null;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  isEmpty?: boolean;
  className?: string;
}

/**
 * Higher-order component for handling loading, error, and empty states
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
  isEmpty = false,
  className,
}) => {
  if (loading) {
    return (
      <div className={clsx('flex items-center justify-center p-8', className)}>
        {loadingComponent || (
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={clsx('flex items-center justify-center p-8', className)}>
        {errorComponent || (
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-sm text-red-600">
              {typeof error === 'string' ? error : 'An error occurred'}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={clsx('flex items-center justify-center p-8', className)}>
        {emptyComponent || (
          <div className="text-center">
            <div className="text-gray-400 mb-2">📝</div>
            <p className="text-sm text-gray-500">No data available</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Loading skeleton for cards
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('animate-pulse', className)}>
    <div className="bg-gray-200 rounded-lg p-6">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
    </div>
  </div>
);

/**
 * Loading skeleton for list items
 */
export const ListSkeleton: React.FC<{ items?: number; className?: string }> = ({ 
  items = 3, 
  className 
}) => (
  <div className={clsx('space-y-3', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Loading skeleton for table rows
 */
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string 
}> = ({ rows = 5, columns = 4, className }) => (
  <div className={clsx('animate-pulse', className)}>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-gray-300 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

/**
 * Inline loading state for buttons and small actions
 */
export const InlineLoading: React.FC<{ 
  loading: boolean; 
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}> = ({ loading, children, loadingText, className }) => {
  if (loading) {
    return (
      <span className={clsx('flex items-center gap-2', className)}>
        <LoadingSpinner size="sm" />
        {loadingText && <span>{loadingText}</span>}
      </span>
    );
  }

  return <>{children}</>;
};

/**
 * Page-level loading component
 */
export const PageLoading: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  </div>
);

/**
 * Section loading component
 */
export const SectionLoading: React.FC<{ 
  message?: string; 
  className?: string 
}> = ({ message = 'Loading...', className }) => (
  <div className={clsx('flex items-center justify-center py-12', className)}>
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-3 text-gray-600">{message}</p>
    </div>
  </div>
);

/**
 * Overlay loading component
 */
export const LoadingOverlay: React.FC<{ 
  loading: boolean; 
  children: React.ReactNode;
  message?: string;
}> = ({ loading, children, message = 'Loading...' }) => (
  <div className="relative">
    {children}
    {loading && (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-2 text-gray-600">{message}</p>
        </div>
      </div>
    )}
  </div>
);

/**
 * Hook for managing loading states
 */
export const useLoadingState = (initialLoading = false) => {
  const [loading, setLoading] = React.useState(initialLoading);
  const [error, setError] = React.useState<string | null>(null);

  const startLoading = React.useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = React.useCallback(() => {
    setLoading(false);
  }, []);

  const setLoadingError = React.useCallback((error: string | Error) => {
    setLoading(false);
    setError(typeof error === 'string' ? error : error.message);
  }, []);

  const reset = React.useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setError: setLoadingError,
    reset,
  };
};