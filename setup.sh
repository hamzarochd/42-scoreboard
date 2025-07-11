#!/bin/bash

echo "🚀 42 Scoreboard - Configurazione API"
echo "===================================="
echo ""

# Verifica se il file .env esiste
if [ ! -f .env ]; then
    echo "📝 Creazione file .env..."
    cp .env.example .env
    echo "✅ File .env creato!"
else
    echo "✅ File .env già esistente"
fi

echo ""
echo "📋 Configurazione attuale:"
echo "VITE_USE_REAL_API=$(grep VITE_USE_REAL_API .env | cut -d '=' -f2)"
echo ""

# Controlla se sta usando l'API reale
USE_REAL_API=$(grep VITE_USE_REAL_API .env | cut -d '=' -f2)
if [ "$USE_REAL_API" = "true" ]; then
    echo "🔗 CONFIGURATO PER API UFFICIALE 42 SCHOOL"
    echo ""
    
    # Controlla le credenziali
    CLIENT_ID=$(grep VITE_42_CLIENT_ID .env | cut -d '=' -f2)
    CLIENT_SECRET=$(grep VITE_42_CLIENT_SECRET .env | cut -d '=' -f2)
    
    if [ "$CLIENT_ID" = "your_client_id_here" ] || [ -z "$CLIENT_ID" ]; then
        echo "❌ VITE_42_CLIENT_ID non configurato"
        echo ""
        echo "📋 PASSI PER CONFIGURARE L'API:"
        echo "1. Vai su: https://profile.intra.42.fr/oauth/applications"
        echo "2. Clicca 'New Application'"
        echo "3. Nome: 42 Scoreboard"
        echo "4. Redirect URI: http://localhost:5174/auth/callback"
        echo "5. Scopes: public"
        echo "6. Copia Client ID e Client Secret"
        echo "7. Modifica il file .env con le tue credenziali"
        echo ""
        echo "🔧 Modifica .env:"
        echo "VITE_42_CLIENT_ID=il_tuo_client_id"
        echo "VITE_42_CLIENT_SECRET=il_tuo_client_secret"
    else
        echo "✅ VITE_42_CLIENT_ID configurato"
        
        if [ "$CLIENT_SECRET" = "your_client_secret_here" ] || [ -z "$CLIENT_SECRET" ]; then
            echo "❌ VITE_42_CLIENT_SECRET non configurato"
            echo "🔧 Aggiungi il Client Secret nel file .env"
        else
            echo "✅ VITE_42_CLIENT_SECRET configurato"
            echo ""
            echo "🎉 TUTTO PRONTO! L'app userà l'API ufficiale di 42"
            echo "� Avvia con: npm run dev"
        fi
    fi
else
    echo "🎭 CONFIGURATO PER DATI MOCK (sviluppo)"
    echo ""
    echo "🔄 Per usare l'API ufficiale 42:"
    echo "   Cambia VITE_USE_REAL_API=true nel file .env"
    echo "   Poi aggiungi le tue credenziali 42"
fi

echo ""
echo "� Per istruzioni complete: vedi README.md"
echo ""
