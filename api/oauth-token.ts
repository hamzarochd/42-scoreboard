import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { code, redirect_uri } = req.body;

    if (!code) {
      res.status(400).json({ error: 'Authorization code is required' });
      return;
    }

    // Use environment variables (without VITE_ prefix for server-side)
    const CLIENT_ID = process.env.VITE_42_CLIENT_ID;
    const CLIENT_SECRET = process.env.VITE_42_CLIENT_SECRET;
    const API_BASE_URL = process.env.VITE_42_API_BASE_URL || 'https://api.intra.42.fr';

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error('Missing OAuth credentials');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    console.log('🔄 Exchanging code for token via serverless function...');
    console.log('Config:', {
      CLIENT_ID: CLIENT_ID.substring(0, 10) + '...',
      redirect_uri,
      API_BASE_URL
    });

    // Exchange code for token
    const tokenResponse = await fetch(`${API_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: redirect_uri || 'https://leeters.vercel.app/oauth/callback',
      }),
    });

    console.log('Token response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      res.status(400).json({ 
        error: `Token exchange failed: ${tokenResponse.status} ${tokenResponse.statusText}`,
        details: errorText
      });
      return;
    }

    const tokens = await tokenResponse.json();
    console.log('✅ Token exchange successful');

    // Get user info
    const userResponse = await fetch(`${API_BASE_URL}/v2/me`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Accept': 'application/json',
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch user info:', userResponse.status);
      res.status(400).json({ error: 'Failed to fetch user information' });
      return;
    }

    const userData = await userResponse.json();
    console.log('✅ User info fetched for:', userData.login);

    // Transform user data to match our interface
    const user = {
      id: userData.id.toString(),
      login: userData.login,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      displayName: userData.displayname,
      avatar: userData.image?.versions?.medium || userData.image?.link || '/default-avatar.png',
    };

    res.status(200).json({
      success: true,
      tokens,
      user,
      message: 'Authentication successful'
    });

  } catch (error) {
    console.error('OAuth endpoint error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
