import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import Instructions from './pages/Instructions';
import Prompts from './pages/Prompts';
import Collections from './pages/Collections';
import Settings from './pages/Settings';
import InstructionDetail from './pages/InstructionDetail';
import PromptDetail from './pages/PromptDetail';
import FlowVisualization from './pages/FlowVisualization';
import Deployments from './pages/Deployments';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import { AuthService } from './services/AuthService';

function App() {
  // Initialize AuthService on app mount
  useEffect(() => {
    AuthService.initialize();
    
    // Auto-login in development mode if not already authenticated
    if (import.meta.env.DEV && !AuthService.isAuthenticated()) {
      const devLogin = async () => {
        try {
          const response = await fetch('http://localhost:3007/api/v1/auth/dev-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: 'dev@example.com',
              name: 'Developer',
              role: 'ADMIN'
            })
          });

          if (response.ok) {
            const data = await response.json();
            // Store token
            const { AuthUtils } = await import('./utils/security');
            AuthUtils.setSecureToken(data.data.accessToken);
            if (data.data.refreshToken) {
              sessionStorage.setItem('__refresh_token', btoa(data.data.refreshToken + ':' + Date.now()));
            }
          }
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      };
      
      devLogin();
    }
  }, []);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/api/v1/auth/callback" element={<AuthCallback />} />
          
          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/instructions" element={<Instructions />} />
                    <Route path="/instructions/:id" element={<InstructionDetail />} />
                    <Route path="/prompts" element={<Prompts />} />
                    <Route path="/prompts/:id" element={<PromptDetail />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/flow" element={<FlowVisualization />} />
                    <Route path="/deployments" element={<Deployments />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;