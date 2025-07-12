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

  try {
    const debug = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      hasClientId: !!process.env.VITE_42_CLIENT_ID,
      hasClientSecret: !!process.env.VITE_42_CLIENT_SECRET,
      hasRedirectUri: !!process.env.VITE_42_REDIRECT_URI,
      clientIdLength: process.env.VITE_42_CLIENT_ID?.length || 0,
      clientSecretLength: process.env.VITE_42_CLIENT_SECRET?.length || 0,
      redirectUri: process.env.VITE_42_REDIRECT_URI || 'NOT_SET',
      apiBaseUrl: process.env.VITE_42_API_BASE_URL || 'https://api.intra.42.fr',
      // Partial values for security
      clientIdPreview: process.env.VITE_42_CLIENT_ID ? 
        process.env.VITE_42_CLIENT_ID.substring(0, 8) + '...' : 'NOT_SET',
      clientSecretPreview: process.env.VITE_42_CLIENT_SECRET ? 
        process.env.VITE_42_CLIENT_SECRET.substring(0, 8) + '...' : 'NOT_SET',
    };

    res.status(200).json({
      status: 'Environment Debug',
      data: debug,
      message: 'Check that all required environment variables are properly set'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
