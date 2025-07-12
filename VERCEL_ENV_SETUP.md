# Vercel Deployment Guide - OAuth2 Authentication

## 🔧 1. Configure 42 School Application

### Create OAuth2 Application:
1. Go to https://profile.intra.42.fr/oauth/applications/new
2. Fill the form:
   - **Name**: `42 Scoreboard` (or your preferred name)
   - **Redirect URI**: `https://leeters.vercel.app/auth/callback`
   - **Scopes**: `public` (default)
3. Click "Submit"
4. Copy the **CLIENT_ID** and **CLIENT_SECRET**

⚠️ **Important**: The redirect URI must be exactly `/auth/callback`

## 🌐 2. Vercel Environment Variables

Add these variables in your Vercel project:
**Dashboard → Project → Settings → Environment Variables**

### Required Variables:
```bash
VITE_42_CLIENT_ID=your_42_client_id_here
VITE_42_CLIENT_SECRET=your_42_client_secret_here  
VITE_42_REDIRECT_URI=https://leeters.vercel.app/auth/callback
```

### Optional Variables (have defaults):
```bash
VITE_42_API_BASE_URL=https://api.intra.42.fr
VITE_USE_REAL_API=true
```

## 🚀 3. Deployment Steps

1. **Set Environment Variables** in Vercel dashboard
2. **Redeploy** your application (or it will auto-deploy on next push)
3. **Test** the authentication flow at `https://leeters.vercel.app/login`

## 🔍 4. Testing & Debugging

### Test URLs:
- **Login**: https://leeters.vercel.app/login
- **Debug**: https://leeters.vercel.app/debug
- **Status Check**: Check environment variables and OAuth config

### Common Issues:

#### "Client ID not configured"
- ✅ **Solution**: Add `VITE_42_CLIENT_ID` to Vercel environment variables
- ✅ **Verify**: Check Vercel Dashboard → Settings → Environment Variables

#### "Redirect URI mismatch"  
- ✅ **Solution**: Ensure 42 School app has exactly: `https://leeters.vercel.app/auth/callback`
- ✅ **Verify**: Check your 42 School OAuth app settings

#### "Authentication failed"
- ✅ **Solution**: Verify `VITE_42_CLIENT_SECRET` is correctly set in Vercel
- ✅ **Check**: Use `/debug` page to see configuration status

#### "Failed to fetch"
- ✅ **Solution**: Check network connectivity and API availability
- ✅ **Debug**: Check browser console for detailed error messages

## 🛡️ Security Features

This OAuth2 implementation includes:
- ✅ **PKCE** (Proof Key for Code Exchange) for enhanced security
- ✅ **CSRF Protection** with state parameter validation
- ✅ **Rate Limiting** (2 requests/second, 1200/hour)
- ✅ **Automatic Token Refresh** (when supported by API)
- ✅ **Secure Token Storage** with encryption
- ✅ **Error Recovery** with automatic retry logic

## 📚 OAuth2 Flow Overview

1. **User clicks "Login with 42 School"**
2. **Redirect to 42 School** with PKCE challenge
3. **User authorizes** the application
4. **42 School redirects back** to `/auth/callback` with code
5. **Exchange code for token** using PKCE verifier
6. **Store token securely** and fetch user profile
7. **Redirect to dashboard** with authenticated session

## 🔗 Useful Links

- **42 OAuth Apps**: https://profile.intra.42.fr/oauth/applications
- **42 API Documentation**: https://api.intra.42.fr/apidoc
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Application URL**: https://leeters.vercel.app