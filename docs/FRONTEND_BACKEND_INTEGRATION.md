# Frontend-Backend Integration

This document describes how the frontend (option-one) connects to the backend server (option-one-server) with automatic fallback to mock data.

## Architecture

The frontend now connects to the `option-one-server` backend API while maintaining the ability to fall back to mock data when the server is unavailable.

### Backend Server
- **URL**: `http://localhost:3007/api/v1`
- **Repository**: `/Users/ggentli/Development/option-one-server`
- **Tech Stack**: Node.js + Express + TypeScript + Prisma + PostgreSQL

### Frontend Application
- **URL**: `http://localhost:3000`
- **Repository**: `/Users/ggentli/Development/option-one`
- **Tech Stack**: React + TypeScript + Vite + TailwindCSS

## Configuration

### Environment Variables

Create a `.env` file in the frontend root with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3007/api/v1
VITE_USE_MOCK_DATA=false
VITE_ENABLE_MOCK_FALLBACK=true
```

#### Variable Descriptions

- **VITE_API_BASE_URL**: Base URL for the backend API server
- **VITE_USE_MOCK_DATA**: Set to `true` to always use mock data (for development/testing)
- **VITE_ENABLE_MOCK_FALLBACK**: Set to `true` to fall back to mock data if API calls fail

### Configuration Files

1. **`.env.development`** - Development environment settings (auto-loaded in dev mode)
2. **`.env.example`** - Template for environment variables
3. **`vite.config.ts`** - Updated proxy configuration
4. **`src/api/client.ts`** - Enhanced API client with fallback support
5. **`src/api/services.ts`** - Refactored services with automatic fallback

## How It Works

### API Call Flow

```
┌─────────────┐
│ Component   │
└──────┬──────┘
       │
       v
┌─────────────────┐
│ API Service     │ (e.g., instructionsApi.getAll())
└──────┬──────────┘
       │
       v
┌──────────────────────────┐
│ apiCallWithFallback()    │
└──────┬───────────────────┘
       │
       ├─ USE_MOCK_DATA=true? ──────> Return Mock Data
       │
       ├─ ENABLE_MOCK_FALLBACK=true?
       │  │
       │  ├─ Try API Call
       │  │  ├─ Success ──────────────> Return API Data
       │  │  └─ Error ────────────────> Return Mock Data
       │  │
       │  └─ Try API Call
       │     ├─ Success ──────────────> Return API Data
       │     └─ Error ────────────────> Throw Error
```

### Modes of Operation

#### 1. **Production Mode** (Backend Required)
```env
VITE_USE_MOCK_DATA=false
VITE_ENABLE_MOCK_FALLBACK=false
```
- All requests go to the backend
- Errors are thrown if backend is unavailable
- Best for production environments

#### 2. **Development Mode with Fallback** (Recommended)
```env
VITE_USE_MOCK_DATA=false
VITE_ENABLE_MOCK_FALLBACK=true
```
- Attempts to use backend first
- Falls back to mock data if backend is unavailable
- Shows console warning when fallback occurs
- Best for local development

#### 3. **Mock-Only Mode**
```env
VITE_USE_MOCK_DATA=true
VITE_ENABLE_MOCK_FALLBACK=true
```
- Always uses mock data
- Backend is never called
- Best for frontend-only development or testing

## Available Endpoints

### Instructions API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/instructions` | Get all instructions (paginated) |
| GET | `/instructions/:id` | Get instruction by ID |
| POST | `/instructions` | Create new instruction (auth required) |
| PUT | `/instructions/:id` | Update instruction (auth required) |
| DELETE | `/instructions/:id` | Delete instruction (auth required) |
| GET | `/instructions/:id/related` | Get related instructions |

### Prompts API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/prompts` | Get all prompts (paginated) |
| GET | `/prompts/:id` | Get prompt by ID |
| POST | `/prompts` | Create new prompt (auth required) |
| PUT | `/prompts/:id` | Update prompt (auth required) |
| DELETE | `/prompts/:id` | Delete prompt (auth required) |
| GET | `/prompts/:id/related` | Get related prompts |
| POST | `/prompts/:id/execute` | Execute prompt with variables |

### Collections API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/collections` | Get all collections (paginated) |
| GET | `/collections/:id` | Get collection by ID |
| POST | `/collections` | Create new collection (auth required) |
| PUT | `/collections/:id` | Update collection (auth required) |
| DELETE | `/collections/:id` | Delete collection (auth required) |
| POST | `/collections/:id/items` | Add item to collection (auth required) |
| DELETE | `/collections/:id/items/:itemId` | Remove item from collection (auth required) |

### Health API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check API health status |

## Getting Started

### 1. Start the Backend Server

```bash
cd /Users/ggentli/Development/option-one-server
npm run dev
```

The backend will start on `http://localhost:3007`

### 2. Start the Frontend Application

```bash
cd /Users/ggentli/Development/option-one
npm run dev
```

The frontend will start on `http://localhost:3000`

### 3. Verify Connection

Open `http://localhost:3000` in your browser. The application will:
1. Attempt to connect to the backend at `http://localhost:3007`
2. If successful, use real API data
3. If backend is unavailable and `VITE_ENABLE_MOCK_FALLBACK=true`, fall back to mock data
4. Display a console warning when fallback occurs

## Response Format

All API responses follow this structure:

```typescript
{
  success: boolean;
  data: T;              // The actual data
  message?: string;     // Success/error message
  errors?: any[];       // Validation errors (if any)
}
```

### Paginated Responses

```typescript
{
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Error Handling

The API client includes comprehensive error handling:

1. **Network Errors**: Automatically caught and fallback to mock data (if enabled)
2. **Authentication Errors** (401): Shows "Authentication required" toast
3. **Authorization Errors** (403): Shows "Access forbidden" toast
4. **Server Errors** (500+): Shows "Server error occurred" toast
5. **Validation Errors** (400): Shows specific validation messages

## Security Features

The API client includes several security features:

- **Secure Headers**: Automatically adds authentication and CSRF tokens
- **Data Sanitization**: Sanitizes request data to prevent XSS attacks
- **Error Message Sanitization**: Prevents information disclosure through error messages
- **Token Management**: Secure storage and handling of authentication tokens

## Development Tips

### Testing with Mock Data

To test the frontend without the backend:

1. Set `VITE_USE_MOCK_DATA=true`
2. Run only the frontend: `npm run dev`
3. All data will come from `src/data/mockData.ts`

### Testing Fallback Behavior

To test automatic fallback:

1. Set `VITE_ENABLE_MOCK_FALLBACK=true`
2. Start the frontend
3. Stop the backend server
4. Observe console warnings about fallback
5. Verify mock data is displayed

### Debugging API Calls

The API client logs warnings to the console when fallback occurs:

```
API call failed, falling back to mock data: [Error details]
```

Check the browser console for these messages to understand when fallback is being used.

## Next Steps

1. **Database Setup**: Configure PostgreSQL and run Prisma migrations in the backend
2. **Authentication**: Implement TrimbleID OAuth authentication
3. **Additional Endpoints**: Add promotion, deployment, and user management endpoints
4. **Testing**: Create integration tests for frontend-backend communication
5. **Production Deployment**: Configure production environment variables and deploy both services

## Troubleshooting

### Backend not connecting

**Problem**: Frontend shows mock data even when backend is running

**Solutions**:
1. Verify backend is running: `curl http://localhost:3007/api/v1/health`
2. Check CORS settings in backend
3. Verify `VITE_API_BASE_URL` in `.env`
4. Check browser console for CORS or network errors

### CORS Errors

**Problem**: Browser shows CORS policy errors

**Solution**: The backend is configured to accept requests from `http://localhost:3000`. If you're running the frontend on a different port, update the CORS configuration in `/Users/ggentli/Development/option-one-server/src/infrastructure/config/index.ts`

### Mock Data Not Loading

**Problem**: Application shows errors instead of mock data

**Solutions**:
1. Verify `VITE_ENABLE_MOCK_FALLBACK=true` is set
2. Check that `src/data/mockData.ts` exists and exports data correctly
3. Clear browser cache and restart dev server

## File Structure

```
option-one/
├── .env                          # Environment variables (create this)
├── .env.development              # Development environment (auto-loaded)
├── .env.example                  # Environment template
├── vite.config.ts                # Updated proxy configuration
├── environment-config.ts         # Environment-specific settings
└── src/
    ├── api/
    │   ├── client.ts             # Enhanced API client
    │   └── services.ts           # Refactored with fallback
    └── data/
        └── mockData.ts           # Mock data for fallback

option-one-server/
├── src/
│   ├── api/
│   │   ├── controllers/         # Request handlers
│   │   ├── routes/              # Route definitions
│   │   └── validators/          # Request validation
│   ├── application/
│   │   ├── services/            # Business logic
│   │   └── dtos/                # Data transfer objects
│   ├── core/
│   │   ├── entities/            # Domain models
│   │   └── interfaces/          # Repository interfaces
│   └── infrastructure/
│       ├── database/            # Prisma repositories
│       ├── di/                  # Dependency injection
│       └── config/              # Configuration
└── prisma/
    └── schema.prisma            # Database schema
```

## Support

For issues or questions:
1. Check this documentation
2. Review console errors in browser dev tools
3. Check backend logs: `/Users/ggentli/Development/option-one-server/logs/`
4. Verify environment variables are set correctly
