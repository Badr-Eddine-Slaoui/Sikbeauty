# Cookie-Based Authentication Setup

## Overview
The application has been migrated from localStorage token storage to HTTP-only cookies for enhanced security.

## Backend Configuration

### 1. Cookie Parser Middleware
- **File**: `server/src/app.ts`
- **Package**: `cookie-parser` (installed)
- Middleware is configured before routes

### 2. CORS Configuration
- **File**: `server/src/app.ts`
- **Allowed Origins**:
  - `http://localhost:5173` (Vite dev server)
  - `http://localhost:3000` (Backend default)
  - `http://localhost:3001` (Backend alternate)
  - Environment variable: `FRONTEND_URL`
- **Settings**:
  - `credentials: true` (required for cookies)
  - Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
  - Headers: Content-Type, Authorization

### 3. Cookie Settings
- **File**: `server/src/controllers/auth.controller.ts`
- **Cookie Name**: `token`
- **Options**:
  - `httpOnly: true` (prevents JavaScript access)
  - `secure: process.env.NODE_ENV === 'production'` (HTTPS only in production)
  - `sameSite: 'lax'` (CSRF protection)
  - `maxAge: 30 days`

### 4. Authentication Middleware
- **File**: `server/src/middlewares/verifyToken.middleware.ts`
- Reads token from `req.cookies.token`
- No longer uses Authorization header

### 5. Endpoints
- `POST /api/v1/auth/register` - Creates account and sets cookie
- `POST /api/v1/auth/login` - Authenticates and sets cookie
- `POST /api/v1/auth/logout` - Clears cookie

## Frontend Configuration

### 1. Axios Instance
- **File**: `frontend/src/config/api.js`
- **Settings**:
  - `withCredentials: true` (sends cookies with every request)
  - `baseURL: http://localhost:3001` (or VITE_API_URL)

### 2. AuthContext
- **File**: `frontend/src/contexts/AuthContext.jsx`
- No localStorage usage
- Stores only user data in React state
- Token is in HTTP-only cookie (not accessible to JavaScript)

### 3. Login/Register Pages
- Use the configured `api` instance
- No manual token handling
- Browser automatically sends cookies

## Troubleshooting

### Issue: Login not working after switching to cookies

**Possible Causes:**

1. **Port Mismatch**
   - Frontend expects: `http://localhost:3001`
   - Backend might be running on: `http://localhost:3000`
   - **Solution**: Check backend port in `.env` file or start backend on port 3001

2. **CORS Not Allowing Credentials**
   - **Check**: Browser console for CORS errors
   - **Solution**: Verify CORS configuration includes frontend origin

3. **Cookie Not Being Set**
   - **Check**: Browser DevTools > Application > Cookies
   - **Solution**: Ensure `res.cookie()` is called before `res.json()`

4. **Cookie Not Being Sent**
   - **Check**: Network tab > Request Headers > Cookie
   - **Solution**: Verify `withCredentials: true` in axios config

5. **SameSite Issues**
   - **Current**: `sameSite: 'lax'`
   - **For localhost**: This should work fine
   - **For cross-domain**: May need `sameSite: 'none'` with `secure: true`

### Testing Steps

1. **Start Backend**
   ```bash
   cd server
   npm run dev
   ```
   Note the port it's running on (should be 3000 or 3001)

2. **Update Frontend API URL if needed**
   - Edit `frontend/src/config/api.js`
   - Set `API_BASE_URL` to match backend port

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Test Login**
   - Open browser DevTools
   - Go to Network tab
   - Attempt login
   - Check:
     - Response has `Set-Cookie` header
     - Subsequent requests include `Cookie` header
     - Application > Cookies shows `token` cookie

5. **Test Protected Routes**
   - After login, try accessing cart or admin features
   - Verify requests include cookie automatically

## Key Changes Made

### Backend
- ✅ Installed `cookie-parser`
- ✅ Updated CORS to allow credentials
- ✅ Modified `register` to set cookie and return user
- ✅ Modified `login` to set cookie instead of returning token
- ✅ Added `logout` endpoint to clear cookie
- ✅ Updated `verifyToken` middleware to read from cookies

### Frontend
- ✅ Removed all `localStorage` usage
- ✅ Configured axios with `withCredentials: true`
- ✅ Updated `AuthContext` to work without token state
- ✅ Updated login/register to use cookie-based auth
- ✅ Removed redundant `withCredentials` from individual requests

## Security Benefits

1. **XSS Protection**: HTTP-only cookies cannot be accessed by JavaScript
2. **CSRF Protection**: `sameSite: 'lax'` prevents cross-site request forgery
3. **Automatic Management**: Browser handles cookie storage and transmission
4. **Secure in Production**: `secure: true` ensures HTTPS-only transmission

## Important Notes

- Cookies are automatically sent with every request to the same origin
- No need to manually attach Authorization headers
- Token is invisible to frontend JavaScript (stored in HTTP-only cookie)
- Logout must call backend endpoint to clear cookie
- For production, ensure `FRONTEND_URL` environment variable is set correctly
