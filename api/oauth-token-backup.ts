import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel serverless function to handle OAuth token exchange
 * This runs server-side and can safely make requests to 42 API
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, redirect_uri } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    console.log('OAuth Token Exchange - Server side');
    console.log('Environment check:', {
      client_id: process.env.VITE_42_CLIENT_ID ? 'present' : 'missing',
      client_secret: process.env.VITE_42_CLIENT_SECRET ? 'present' : 'missing',
      api_base: process.env.VITE_42_API_BASE_URL || 'https://api.intra.42.fr'
    });

    // Prepare token exchange request
    const tokenData = new URLSearchParams();
    tokenData.append('grant_type', 'authorization_code');
    tokenData.append('client_id', process.env.VITE_42_CLIENT_ID || '');
    tokenData.append('client_secret', process.env.VITE_42_CLIENT_SECRET || '');
    tokenData.append('code', code);
    tokenData.append('redirect_uri', redirect_uri || process.env.VITE_42_REDIRECT_URI || '');

    console.log('Making token exchange request to 42 API...');

    // Exchange code for token
    const tokenResponse = await fetch(`${process.env.VITE_42_API_BASE_URL || 'https://api.intra.42.fr'}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenData,
    });

    console.log('Token response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return res.status(400).json({ 
        error: 'Token exchange failed', 
        details: errorText,
        status: tokenResponse.status 
      });
    }

    const tokens = await tokenResponse.json();
    console.log('Token exchange successful');

    // Get user info using the access token
    console.log('Fetching user info...');
    const userResponse = await fetch(`${process.env.VITE_42_API_BASE_URL || 'https://api.intra.42.fr'}/v2/me`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('User info fetch failed:', errorText);
      return res.status(400).json({ 
        error: 'Failed to fetch user info', 
        details: errorText 
      });
    }

    const userInfo = await userResponse.json();
    console.log('User info fetched successfully:', { id: userInfo.id, login: userInfo.login });

    // Return tokens and user info
    res.status(200).json({
      success: true,
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        token_type: tokens.token_type,
      },
      user: {
        id: userInfo.id.toString(),
        login: userInfo.login,
        email: userInfo.email,
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        displayName: userInfo.displayname,
        avatar: userInfo.image?.versions?.medium || userInfo.image?.link || '/default-avatar.png',
      },
    });

  } catch (error) {
    console.error('OAuth handler error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
