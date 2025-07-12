# Configurazione Autenticazione 42 School

## Setup Rapido per Localhost

### 1. Crea un'applicazione OAuth2 su 42 Intra

1. Vai su https://profile.intra.42.fr/oauth/applications
2. Clicca su "New Application"
3. Compila i campi:
   - **Name**: `42-Scoreboard-Local` (o un nome a tua scelta)
   - **Redirect URI**: `http://localhost:5173/oauth/callback`
   - **Scopes**: Seleziona almeno `public` (per accedere ai dati pubblici degli utenti)

### 2. Configura le variabili d'ambiente

1. Copia il file `.env.example` in `.env`:
   ```bash
   cp .env.example .env
   ```

2. Apri il file `.env` e sostituisci i placeholder con i tuoi dati:
   ```env
   VITE_42_CLIENT_ID=il_tuo_client_id_qui
   VITE_42_CLIENT_SECRET=il_tuo_client_secret_qui
   VITE_42_REDIRECT_URI=http://localhost:5173/oauth/callback
   VITE_42_API_BASE_URL=https://api.intra.42.fr
   ```

### 3. Avvia l'applicazione

```bash
npm run dev
```

L'applicazione sarà disponibile su http://localhost:5173/

## Redirect URI da configurare su 42 Intra

**URL esatto da inserire nel campo "Redirect URI":**
```
http://localhost:5173/oauth/callback
```

⚠️ **Importante**: L'URL deve essere esattamente questo, senza spazi o caratteri aggiuntivi.

## Scopes consigliati

- `public`: Per accedere ai dati pubblici degli utenti (nome, login, livello)
- `projects`: Per accedere ai progetti e alle valutazioni
- `profile`: Per accedere a informazioni più dettagliate del profilo

## Flusso di autenticazione

1. L'utente clicca su "Login with 42"
2. Viene reindirizzato a 42 Intra per autorizzare l'app
3. Dopo l'autorizzazione, viene reindirizzato a `http://localhost:5173/oauth/callback`
4. L'app scambia il codice di autorizzazione con un token di accesso
5. L'utente viene autenticato e reindirizzato alla dashboard

## Risoluzione problemi

### Errore "Invalid redirect URI"
- Verifica che l'URL sia esattamente `http://localhost:5173/oauth/callback`
- Controlla che non ci siano spazi prima o dopo l'URL
- Assicurati di aver salvato le modifiche nell'applicazione 42

### Errore "Invalid client"
- Verifica che il CLIENT_ID sia corretto nel file `.env`
- Controlla che l'applicazione sia attiva su 42 Intra

### Il server non si avvia sulla porta 5173
- Controlla che la porta non sia occupata
- Prova a usare una porta diversa modificando il file `vite.config.ts`
