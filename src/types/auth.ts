export interface User {
  id: string;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar: string;
  campus?: string;
  cursus?: string;
  level?: number;
  grade?: string | null;
  wallet?: number;
  correction_point?: number;
  pool_month?: string | null;
  pool_year?: string | null;
  location?: string | null;
  kind?: string;
  staff?: boolean;
  active?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
