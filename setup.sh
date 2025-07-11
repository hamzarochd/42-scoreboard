#!/bin/bash

echo "🚀 42 Scoreboard Setup"
echo "====================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "📋 Current API Configuration:"
echo "VITE_USE_REAL_API=$(grep VITE_USE_REAL_API .env | cut -d '=' -f2)"
echo ""

# Check if using real API
USE_REAL_API=$(grep VITE_USE_REAL_API .env | cut -d '=' -f2)
if [ "$USE_REAL_API" = "true" ]; then
    echo "🔗 You're configured to use the REAL 42 School API"
    echo ""
    echo "📍 Make sure you have:"
    echo "   1. Created a 42 School OAuth application at:"
    echo "      https://profile.intra.42.fr/oauth/applications"
    echo "   2. Set your credentials in .env:"
    echo "      - VITE_42_CLIENT_ID"
    echo "      - VITE_42_CLIENT_SECRET"
    echo "   3. Set redirect URI to: http://localhost:5173/auth/callback"
    echo ""
    echo "🚨 Your current configuration:"
    CLIENT_ID=$(grep VITE_42_CLIENT_ID .env | cut -d '=' -f2)
    if [ -z "$CLIENT_ID" ]; then
        echo "   ❌ VITE_42_CLIENT_ID is not set"
    else
        echo "   ✅ VITE_42_CLIENT_ID is set"
    fi
    
    CLIENT_SECRET=$(grep VITE_42_CLIENT_SECRET .env | cut -d '=' -f2)
    if [ -z "$CLIENT_SECRET" ]; then
        echo "   ❌ VITE_42_CLIENT_SECRET is not set"
    else
        echo "   ✅ VITE_42_CLIENT_SECRET is set"
    fi
else
    echo "🎭 You're configured to use MOCK data (perfect for development!)"
    echo ""
    echo "📋 Demo credentials:"
    echo "   Login: hmrochd"
    echo "   Password: password"
    echo ""
    echo "🔄 To switch to real 42 API, change VITE_USE_REAL_API=true in .env"
fi

echo ""
echo "🚀 Ready to start! Run: npm run dev"
echo ""
