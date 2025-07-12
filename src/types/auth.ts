export interface User {
  id: string;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar: string;
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
