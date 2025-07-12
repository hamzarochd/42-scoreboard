# 42 Scoreboard

A modern React application for displaying 42 School student and pooler rankings with a beautiful, responsive interface.

## 🚀 Quick Start

### 1. Setup Authentication
1. Go to https://profile.intra.42.fr/oauth/applications
2. Create a new application with redirect URI: `http://localhost:5173/oauth/callback`
3. Copy `.env.example` to `.env` and add your credentials
4. See [AUTH_SETUP.md](./AUTH_SETUP.md) for detailed instructions

### 2. Install & Run
```bash
npm install
npm run dev
```

**Redirect URI for 42 Intra:** `http://localhost:5173/oauth/callback`

## 🚀 Features

### Authentication
- **Mock Authentication**: Demo system for development (hmrochd / password)
- **42 OAuth Integration**: Real 42 School OAuth2 authentication
- **Protected Routes**: Secure access to dashboard
- **Session Persistence**: Automatic token management

### Scoreboard Display
- **Student Cards**: Display avatar, name, login, level progress, promo year, wallet, eval points, and online status
- **Pooler Cards**: Show avatar, name, login, level progress, pool year, campus, pool month, and dates
- **Responsive Grid**: Mobile-first design that adapts to all screen sizes
- **Profile Links**: Cards link to 42 profile URLs

### Filtering & Ranking
- **Year Filters**: Filter by promotion year (2019-2024) for students or pool year for poolers
- **Search**: Real-time search by name or login
- **Sorting**: Sort by level, name, or login in ascending/descending order
- **View Toggle**: Switch between Students and Poolers (never mixed)

### Statistics Panel
- **Student Stats**: Total count, average level, highest level, online count
- **Pooler Stats**: Total poolers, average level, highest level, in-progress count

### UI/UX Features
- **42 School Theming**: Official color scheme (blue, white, dark)
- **Dark/Light Mode**: Toggle with persistence
- **Smooth Animations**: Card hover effects and transitions
- **Loading States**: Elegant loading spinners
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🛠 Tech Stack

- **React 18+** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **42 School API** integration with OAuth2
- **Mock API** fallback for development

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd 42-scoreboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🎯 Demo Credentials

**Login:** `hmrochd`  
**Password:** `password`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common components (LoadingSpinner, ErrorBoundary, etc.)
│   ├── filters/        # Filter components (SearchBar, Select, SortControls)
│   └── scoreboard/     # Scoreboard components (StudentCard, PoolerCard, etc.)
├── context/            # React Context providers
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useStudents.ts  # Students data hook
│   ├── usePoolers.ts   # Poolers data hook
│   └── useTheme.ts     # Theme management hook
├── pages/              # Page components
├── services/           # API services and mock data
│   ├── mockApi.ts      # Mock API implementation
│   └── mockData.ts     # Mock data generators
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and constants
└── App.tsx             # Main application component
```

## 🌐 API 42 School - Configurazione

### 🚀 Setup Rapido

#### 1. Crea un'Applicazione 42 School
1. Vai su [42 OAuth Applications](https://profile.intra.42.fr/oauth/applications)
2. Clicca "New Application"
3. Compila i campi:
   - **Name**: 42 Scoreboard (o il nome che preferisci)
   - **Redirect URI**: `https://leeters.vercel.app/auth/callback`
   - **Scopes**: `public` (minimo richiesto)
4. Salva e copia **Client ID** e **Client Secret**

#### 2. Configura le Credenziali
Modifica il file `.env` nella root del progetto:

```env
# API Configuration - Set to use real 42 School API  
VITE_USE_REAL_API=true
VITE_42_API_BASE_URL=https://api.intra.42.fr
VITE_42_REDIRECT_URI=https://leeters.vercel.app/auth/callback

# Sostituisci con le tue credenziali reali
VITE_42_CLIENT_ID=il_tuo_client_id
VITE_42_CLIENT_SECRET=il_tuo_client_secret
```

#### 3. Avvia l'Applicazione
```bash
npm run dev
```

L'app ora userà l'API ufficiale di 42! Vedrai il pulsante **"Sign in with 42 School"** nella pagina di login.

### 🔧 Endpoint API Supportati

- **Autenticazione**: OAuth2 con gestione automatica dei token
- **Studenti**: Cursus principale (ID 21) con livelli, progetti, wallet
- **Poolers**: Piscine (ID 9) con date, campus, progressi
- **Profili Utente**: Informazioni dettagliate per ogni utente

### 🚨 Note Importanti

- **Redirect URI**: Deve corrispondere esattamente a quella configurata nell'app 42
- **Scopes**: `public` è sufficiente per accedere ai dati degli studenti
- **CORS**: L'API 42 supporta richieste da localhost per sviluppo

## 🌐 API Integration (English)

### Quick Start with Mock API
The application comes with a comprehensive mock API that simulates the 42 School API behavior:

```bash
# Uses mock data by default
npm run dev
```

### Connecting to 42 School API

#### 1. Create a 42 School Application
1. Go to [42 OAuth Applications](https://profile.intra.42.fr/oauth/applications)
2. Click "New Application"
3. Fill in the details:
   - **Name**: Your app name (e.g., "42 Scoreboard")
   - **Redirect URI**: `http://localhost:5173/auth/callback`
   - **Scopes**: `public` (minimum required)

#### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your 42 application credentials:
```env
# Set to 'true' to use real 42 API
VITE_USE_REAL_API=true

# Your 42 application credentials
VITE_42_CLIENT_ID=your_app_client_id
VITE_42_CLIENT_SECRET=your_app_client_secret
VITE_42_REDIRECT_URI=http://localhost:5173/auth/callback
```

#### 3. Start the Application
```bash
npm run dev
```

The application will now use the real 42 School API and show an OAuth login button.

### API Architecture

The application uses a unified API interface that automatically switches between mock and real APIs:

```typescript
// Automatically switches based on VITE_USE_REAL_API
import { api } from '@/services';

// Works with both mock and real API
const students = await api.students.getStudents();
const poolers = await api.poolers.getPoolers();
```

### Supported 42 API Endpoints

- **Authentication**: OAuth2 flow with automatic token management
- **Students**: `/v2/cursus/21/users` (Main curriculum students)
- **Poolers**: `/v2/cursus/9/users` (Piscine participants)
- **User Details**: `/v2/users/{login}` (Individual user information)

### Production Deployment

For production deployment, update your environment variables:

```env
VITE_USE_REAL_API=true
VITE_42_CLIENT_ID=your_production_client_id
VITE_42_CLIENT_SECRET=your_production_client_secret
VITE_42_REDIRECT_URI=https://yourdomain.com/auth/callback
```

**Important**: Update the redirect URI in your 42 application settings to match your production domain.

## 🔧 Available Scripts# Force redeploy Sat Jul 12 16:13:36 UTC 2025
