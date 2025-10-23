# TrimbleID Authentication Integration

This document describes the TrimbleID OAuth authentication integration between the frontend (`option-one`) and backend (`option-one-server`).

## Overview

The system uses TrimbleID as the primary authentication provider with automatic user provisioning, role mapping, and permission-based access control.

## Architecture

### Backend (option-one-server)

**Multi-Provider Authentication System:**
- **Primary**: `TrimbleAuthProvider` - Full OAuth 2.0 with TrimbleID
- **Fallback**: `JwtAuthProvider` - JWT token validation
- **Orchestrator**: `AuthService` - Automatically selects appropriate provider

**Auth Endpoints:**
```
GET  /api/v1/auth/info            - Get provider information
GET  /api/v1/auth/authorize-url   - Get OAuth authorization URL
POST /api/v1/auth/exchange-code   - Exchange auth code for tokens
POST /api/v1/auth/refresh         - Refresh access token
POST /api/v1/auth/validate        - Validate current token
GET  /api/v1/auth/callback        - OAuth callback handler
```

**User Provisioning:**
- Automatically creates users on first login
- Maps Trimble groups to internal roles (ADMIN, PRODUCT_MANAGER, QA_LEAD, DEVELOPER, USER)
- Assigns permissions based on role

**Key Files:**
```
src/application/services/auth/
├── interfaces.ts             - TypeScript interfaces for auth
├── TrimbleAuthProvider.ts    - OAuth implementation
├── JwtAuthProvider.ts        - JWT fallback
├── AuthService.ts            - Provider orchestrator
└── index.ts                  - Exports

src/api/routes/auth.routes.ts - Auth API routes
src/api/middleware/auth.middleware.ts - Enhanced middleware
```

### Frontend (option-one)

**OAuth Flow Manager:**
- `AuthService` - Handles OAuth flow, token management, and API calls
- Automatic token refresh with configurable intervals
- State parameter for CSRF protection
- Secure token storage using obfuscation

**Components:**
```
src/pages/
├── Login.tsx          - Login page with TrimbleID button
└── AuthCallback.tsx   - OAuth callback handler

src/components/
├── ProtectedRoute.tsx - Route wrapper requiring authentication
└── UserMenu.tsx       - User profile dropdown with role/permissions
```

**Key Features:**
- Automatic redirect to login for unauthenticated users
- Return URL support (redirects back after login)
- Role and permission display in user menu
- Logout functionality

## OAuth Flow

```
1. User clicks "Sign in with TrimbleID" on Login page
   ↓
2. Frontend calls AuthService.startTrimbleAuth()
   - Generates random state parameter (CSRF protection)
   - Calls backend GET /auth/authorize-url
   - Stores state in sessionStorage
   - Redirects to TrimbleID authorization URL
   ↓
3. User authenticates with TrimbleID and authorizes app
   ↓
4. TrimbleID redirects to /auth/callback?code=...&state=...
   ↓
5. AuthCallback component validates state parameter
   ↓
6. Frontend calls AuthService.handleOAuthCallback()
   - Extracts code and state from URL
   - Validates state matches stored value
   - Calls backend POST /auth/exchange-code
   ↓
7. Backend exchanges code for tokens with TrimbleID
   - Validates token with TrimbleID
   - Provisions/updates user in database
   - Maps Trimble groups to roles
   - Returns tokens + user info
   ↓
8. Frontend stores tokens securely
   - Access token (obfuscated in sessionStorage)
   - Refresh token (obfuscated in sessionStorage)
   - Sets up automatic token refresh
   ↓
9. User redirected to dashboard (or returnUrl)
```

## Configuration

### Backend Environment Variables

```bash
# TrimbleID OAuth Configuration
TRIMBLE_AUTHORITY=https://id.trimble.com
TRIMBLE_CLIENT_ID=your-client-id
TRIMBLE_CLIENT_SECRET=your-client-secret
TRIMBLE_CALLBACK_URL=http://localhost:3000/auth/callback
TRIMBLE_SCOPES=openid profile email

# Optional: Override TrimbleID token endpoint
TRIMBLE_TOKEN_ENDPOINT=https://id.trimble.com/oauth/token

# JWT Fallback Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

**Get TrimbleID Credentials:**
1. Visit [Trimble Developer Console](https://developer.trimble.com)
2. Create a new application
3. Configure OAuth redirect URI: `http://localhost:3000/auth/callback`
4. Copy Client ID and Client Secret

### Frontend Environment Variables

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3007/api/v1

# Optional: Mock data fallback
VITE_USE_MOCK_DATA=false
VITE_ENABLE_MOCK_FALLBACK=true
```

## User Roles & Permissions

### Role Hierarchy
1. **ADMIN** - Full system access
2. **PRODUCT_MANAGER** - Product and release management
3. **QA_LEAD** - Quality assurance and testing
4. **DEVELOPER** - Development and code access
5. **USER** - Basic read access

### Permission Mapping

Roles automatically grant the following permissions:

**ADMIN:**
- All permissions (full access)

**PRODUCT_MANAGER:**
- `prompts.create`, `prompts.read`, `prompts.update`, `prompts.delete`
- `instructions.create`, `instructions.read`, `instructions.update`, `instructions.delete`
- `deployments.read`, `deployments.approve`
- `collections.create`, `collections.read`, `collections.update`, `collections.delete`

**QA_LEAD:**
- `prompts.read`, `prompts.update`
- `instructions.read`, `instructions.update`
- `deployments.read`, `deployments.approve`
- `collections.read`

**DEVELOPER:**
- `prompts.create`, `prompts.read`, `prompts.update`
- `instructions.create`, `instructions.read`, `instructions.update`
- `deployments.read`
- `collections.read`

**USER:**
- `prompts.read`
- `instructions.read`
- `deployments.read`
- `collections.read`

## Protected Routes

All application routes require authentication except `/login` and `/auth/callback`.

**Example: Protect with specific role**
```tsx
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="ADMIN">
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

**Example: Protect with specific permission**
```tsx
<Route
  path="/deployments"
  element={
    <ProtectedRoute requiredPermission="deployments.approve">
      <DeploymentsPage />
    </ProtectedRoute>
  }
/>
```

## API Usage

### Check Authentication Status
```typescript
import { AuthService } from '@/services/AuthService';

const isAuthenticated = AuthService.isAuthenticated();
```

### Get Current User
```typescript
const user = AuthService.getCurrentUser();
// Returns: { id, email, name, role, permissions, groups }
```

### Check Permissions
```typescript
const canDeploy = AuthService.hasPermission('deployments.approve');
const isAdmin = AuthService.hasRole('ADMIN');
```

### Manual Login
```typescript
// Redirect to TrimbleID
await AuthService.startTrimbleAuth('/dashboard');
```

### Logout
```typescript
AuthService.logout();
```

## Token Refresh

Access tokens are automatically refreshed when they expire. The AuthService handles this transparently:

- Tokens are validated before each API request
- Expired tokens trigger automatic refresh
- Refresh tokens have a 7-day lifetime
- Users are redirected to login if refresh fails

**Manual Token Refresh:**
```typescript
const newTokens = await AuthService.refreshToken();
```

## Security Features

1. **CSRF Protection**: State parameter validation in OAuth flow
2. **Secure Token Storage**: Tokens obfuscated in sessionStorage
3. **Automatic Token Cleanup**: Cleared on logout or expiration
4. **Role-Based Access**: Routes and APIs check permissions
5. **Audit Logging**: All auth events logged in backend

## Testing

### Test OAuth Flow Locally

1. **Start Backend Server:**
```bash
cd option-one-server
npm run dev
# Server runs on http://localhost:3007
```

2. **Start Frontend Server:**
```bash
cd option-one
npm run dev
# Frontend runs on http://localhost:3000
```

3. **Test Login Flow:**
   - Navigate to http://localhost:3000
   - Click "Sign in with TrimbleID"
   - Authenticate with your Trimble credentials
   - Verify redirect back to app with user info

### Mock Authentication (Development)

If TrimbleID is not configured, the backend falls back to JWT provider. You can create a local user:

```bash
# In backend, create a development user
curl -X POST http://localhost:3007/api/v1/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"email": "dev@example.com", "name": "Dev User", "role": "ADMIN"}'
```

## Troubleshooting

### "Invalid redirect URI"
- Ensure `TRIMBLE_CALLBACK_URL` matches exactly what's configured in Trimble Developer Console
- Check for trailing slashes

### "State parameter mismatch"
- Clear sessionStorage and try again
- Ensure cookies/storage is enabled in browser

### "Token validation failed"
- Check backend logs for detailed error
- Verify `TRIMBLE_AUTHORITY` is correct
- Ensure system clock is synchronized

### "Insufficient permissions"
- Check user's role in backend database
- Verify permission mapping in TrimbleAuthProvider
- User may need to be added to appropriate Trimble groups

### "CORS errors"
- Ensure backend CORS is configured for frontend URL
- Check `app.ts` for CORS middleware configuration

## Deployment

### Production Checklist

**Backend:**
- [ ] Set production `TRIMBLE_CLIENT_ID` and `TRIMBLE_CLIENT_SECRET`
- [ ] Update `TRIMBLE_CALLBACK_URL` to production domain
- [ ] Set secure `JWT_SECRET` (minimum 32 characters)
- [ ] Enable HTTPS for all endpoints
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting on auth endpoints
- [ ] Set up monitoring for failed auth attempts

**Frontend:**
- [ ] Update `VITE_API_BASE_URL` to production backend
- [ ] Disable mock data: `VITE_USE_MOCK_DATA=false`
- [ ] Enable HTTPS
- [ ] Configure CSP headers
- [ ] Set up error tracking (Sentry, etc.)

## API Reference

### AuthService Methods (Frontend)

```typescript
// Initialize auth (call on app mount)
AuthService.initialize(): void

// Start OAuth flow
AuthService.startTrimbleAuth(returnUrl?: string): Promise<void>

// Handle OAuth callback
AuthService.handleOAuthCallback(): Promise<void>

// Check authentication status
AuthService.isAuthenticated(): boolean

// Get current user
AuthService.getCurrentUser(): AuthUser | null

// Check role
AuthService.hasRole(role: string): boolean

// Check permission
AuthService.hasPermission(permission: string): boolean

// Refresh token manually
AuthService.refreshToken(): Promise<AuthTokens>

// Validate current token
AuthService.validateToken(): Promise<boolean>

// Logout
AuthService.logout(): void
```

### Backend Auth API

See complete API documentation in backend's `auth.routes.ts` for request/response schemas.

## Further Reading

- [TrimbleID Documentation](https://developer.trimble.com/docs/identity)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
