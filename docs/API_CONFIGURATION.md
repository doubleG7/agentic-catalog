# API Configuration - Using Real Database

## Current Configuration

### Frontend (.env.development)
```bash
VITE_API_BASE_URL=http://localhost:3007/api/v1
VITE_USE_MOCK_DATA=false                 # ✅ Mock data DISABLED
VITE_ENABLE_MOCK_FALLBACK=false          # ✅ Mock fallback DISABLED
```

### Backend (.env)
```bash
ENABLE_AUTH_BYPASS=true                  # ✅ Dev mode auth bypass ENABLED
DATABASE_URL=postgresql://...            # ✅ Connected to PostgreSQL
```

## How Data Flows

1. **Frontend Makes Request**
   ```typescript
   // In src/api/services.ts
   const USE_MOCK_DATA = false;          // From VITE_USE_MOCK_DATA
   const ENABLE_MOCK_FALLBACK = false;   // From VITE_ENABLE_MOCK_FALLBACK
   
   // apiCallWithFallback will ONLY call the real API
   // NO mock data will be used
   ```

2. **API Client Sends Request**
   ```typescript
   // src/api/client.ts
   axios.create({
     baseURL: 'http://localhost:3007/api/v1',  // Real backend
     headers: { Authorization: 'Bearer <token>' }
   })
   ```

3. **Backend Processes Request**
   ```typescript
   // Auth bypass in development
   if (ENABLE_AUTH_BYPASS === 'true') {
     req.user = { id: '<admin-user-id>', role: 'ADMIN' }
   }
   
   // Controller → Service → Repository → Prisma → PostgreSQL
   ```

4. **Database Returns Data**
   - Instructions from `Instruction` table
   - Prompts from `Prompt` table  
   - Promotions from `PromotionRequest` table
   - All with real UUIDs, timestamps, relationships

## Verification Checklist

- ✅ No `.env` file in frontend root (only `.env.development`)
- ✅ `VITE_USE_MOCK_DATA=false` in `.env.development`
- ✅ `VITE_ENABLE_MOCK_FALLBACK=false` in `.env.development`
- ✅ Backend running on port 3007
- ✅ Backend connected to PostgreSQL
- ✅ Auth bypass enabled for development
- ✅ Promotion endpoints registered in routes

## What Happens Now

### Instructions & Prompts
- Fetched from PostgreSQL via `/api/v1/instructions` and `/api/v1/prompts`
- Seed data available (8 instructions, 5 prompts)
- Real UUIDs like `550e8400-e29b-41d4-a716-446655440000`

### Promotions
- Created via `POST /api/v1/promotions`
- Saved to `PromotionRequest` table
- Retrieved via `GET /api/v1/promotions/pending`
- Real database relationships with Instructions/Prompts

### Collections
- Fetched from PostgreSQL via `/api/v1/collections`
- Empty by default (no seed data for collections yet)

## Console Logs to Verify

Open browser DevTools console on Deployments page:

```
📊 Pending promotions API response: { success: true, data: [...] }
✅ Got pending promotions: <count> [array of promotion objects]
🔍 Processing pending promotions: { realPendingPromotions: <count>, ... }
```

If you see these logs with real data, the system is using the database correctly.

## Troubleshooting

### If you see mock data:
1. Check `.env.development` exists and has correct values
2. Restart Vite dev server: `npm run dev`
3. Hard refresh browser: `Cmd+Shift+R`

### If API calls fail:
1. Ensure backend is running: `cd option-one-server && npm run dev`
2. Check backend logs for errors
3. Verify `ENABLE_AUTH_BYPASS=true` in backend `.env`

### If no data appears:
1. Run seed script: `cd option-one-server && npm run seed`
2. Check database connection in backend logs
3. Verify Prisma client is generated: `npx prisma generate`

## Current Status

✅ **CONFIRMED**: Application is configured to use real database, NOT mock data
- All API calls go to `http://localhost:3007/api/v1`
- No mock fallback is active
- All data comes from PostgreSQL via Prisma
