# Vercel Environment Variables Setup

## Required Environment Variables

Add these variables in your Vercel project settings:

### Required Variables:
```
VITE_42_CLIENT_ID=your_42_app_client_id
VITE_42_CLIENT_SECRET=your_42_app_client_secret
VITE_42_REDIRECT_URI=https://leeters.vercel.app/oauth/callback
VITE_USE_REAL_API=true
```

### Optional Variables:
```
VITE_42_API_BASE_URL=https://api.intra.42.fr
```

## 42 School App Configuration

Make sure your 42 School application is configured with:
- **Redirect URI**: `https://leeters.vercel.app/oauth/callback`
- **Scopes**: `public` (default)

## Steps to Configure:

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add each variable with the correct values
4. **IMPORTANT**: Redeploy your application after adding variables

## Testing:

After deployment, test the OAuth flow:
1. Visit `https://leeters.vercel.app`
2. Click "Login with 42"
3. If issues persist, visit `https://leeters.vercel.app/debug` for troubleshooting
4. Use the "Test Server Environment" button to verify server-side variables

## Common Issues:

### "Authentication Failed"
- Verify all environment variables are set correctly
- Ensure redirect URI matches exactly between 42 app and Vercel
- Check server environment using `/api/debug-env` endpoint

### "Page not found" 
- Make sure redirect URI is `/oauth/callback` not `/auth/callback`
- Verify the route exists in App.tsx

### "Failed to fetch"
- Check CORS configuration
- Verify API endpoints are accessible
- Test serverless functions deployment