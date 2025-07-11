# 42 Scoreboard

A modern React application for displaying 42 School student and pooler rankings with a beautiful, responsive interface.

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

## 🌐 API Integration

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

## 🔧 Available Scripts