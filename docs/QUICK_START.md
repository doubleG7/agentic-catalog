# Quick Start Guide - Frontend Connected to Backend

## What Changed?

The frontend now connects to the `option-one-server` backend API instead of using only mock data.

## Quick Setup

### 1. Environment Variables

The frontend already has `.env.development` configured:

```env
VITE_API_BASE_URL=http://localhost:3007/api/v1
VITE_USE_MOCK_DATA=false
VITE_ENABLE_MOCK_FALLBACK=true
```

**No changes needed!** This is already set up for you.

### 2. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd /Users/ggentli/Development/option-one-server
npm run dev
```
Backend runs on: `http://localhost:3007`

**Terminal 2 - Frontend:**
```bash
cd /Users/ggentli/Development/option-one
npm run dev
```
Frontend runs on: `http://localhost:3000`

### 3. Test the Connection

Open http://localhost:3000 in your browser.

The app will:
✅ Try to connect to backend at `localhost:3007`  
✅ If backend is available, use real API  
✅ If backend is down, automatically fall back to mock data  

## How It Works

### Smart Fallback System

```
API Request
    ↓
Backend Available? 
    ├─ YES → Use Real API Data ✅
    └─ NO  → Use Mock Data ⚠️ (shows warning in console)
```

### Configuration Options

Change behavior by editing `.env.development`:

**Option 1: Production Mode (requires backend)**
```env
VITE_USE_MOCK_DATA=false
VITE_ENABLE_MOCK_FALLBACK=false  # Will throw errors if backend is down
```

**Option 2: Development Mode (recommended - current setting)**
```env
VITE_USE_MOCK_DATA=false
VITE_ENABLE_MOCK_FALLBACK=true  # Falls back to mock data
```

**Option 3: Mock-Only Mode**
```env
VITE_USE_MOCK_DATA=true         # Always uses mock data
```

## Available APIs

### Instructions
- `GET /api/v1/instructions` - List instructions
- `GET /api/v1/instructions/:id` - Get instruction
- `POST /api/v1/instructions` - Create instruction
- `PUT /api/v1/instructions/:id` - Update instruction
- `DELETE /api/v1/instructions/:id` - Delete instruction

### Prompts
- `GET /api/v1/prompts` - List prompts
- `GET /api/v1/prompts/:id` - Get prompt
- `POST /api/v1/prompts` - Create prompt
- `PUT /api/v1/prompts/:id` - Update prompt
- `DELETE /api/v1/prompts/:id` - Delete prompt
- `POST /api/v1/prompts/:id/execute` - Execute prompt

### Collections
- `GET /api/v1/collections` - List collections
- `GET /api/v1/collections/:id` - Get collection
- `POST /api/v1/collections` - Create collection
- `PUT /api/v1/collections/:id` - Update collection
- `DELETE /api/v1/collections/:id` - Delete collection
- `POST /api/v1/collections/:id/items` - Add item
- `DELETE /api/v1/collections/:id/items/:itemId` - Remove item

## Troubleshooting

### "Can't connect to backend"

**Check if backend is running:**
```bash
curl http://localhost:3007/api/v1/health
```

If this works, backend is fine. If not, start the backend server.

### "Still seeing old data"

1. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Clear browser cache
3. Check browser console for errors

### "CORS errors"

Backend is configured for `http://localhost:3000`. If you're using a different port, update backend CORS settings.

## Files Changed

### Frontend (option-one)
- ✅ `vite.config.ts` - Updated proxy to port 3007
- ✅ `src/api/client.ts` - Added fallback support
- ✅ `src/api/services.ts` - Refactored with `apiCallWithFallback()`
- ✅ `.env.development` - Backend URL configuration
- ✅ `.env.example` - Template for environment vars
- ✅ `environment-config.ts` - Updated default URL
- ✅ `docs/FRONTEND_BACKEND_INTEGRATION.md` - Full documentation

### Backend (option-one-server)
- ✅ All routes configured and running
- ✅ Repositories registered in DI container
- ✅ Server running on port 3007

## Next Steps

1. **Test API Calls**: Try creating/updating instructions and prompts
2. **Database Setup**: Configure PostgreSQL for persistent data
3. **Authentication**: Currently not required - will be added later
4. **Production Deploy**: Configure for production environments

## Need Help?

- 📖 Read full docs: `/Users/ggentli/Development/option-one/docs/FRONTEND_BACKEND_INTEGRATION.md`
- 🐛 Check console: Open browser dev tools → Console tab
- 📊 Check backend logs: Backend terminal shows all requests

---

**Status**: ✅ Frontend is now connected to backend with automatic fallback to mock data!
