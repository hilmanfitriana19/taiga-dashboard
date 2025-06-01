import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials, User, AuthResponse } from '../types';
import axios from 'axios';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  taigaUrl: null,
  loading: false,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User; taigaUrl: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        taigaUrl: action.payload.taigaUrl,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for saved credentials on mount
  useEffect(() => {
    const loadSavedCredentials = () => {
      const savedToken = localStorage.getItem('taiga_token');
      const savedUser = localStorage.getItem('taiga_user');
      const savedTaigaUrl = localStorage.getItem('taiga_url');

      if (savedToken && savedUser && savedTaigaUrl) {
        try {
          const user = JSON.parse(savedUser);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { token: savedToken, user, taigaUrl: savedTaigaUrl },
          });
        } catch (error) {
          localStorage.removeItem('taiga_token');
          localStorage.removeItem('taiga_user');
          localStorage.removeItem('taiga_url');
        }
      }
    };

    loadSavedCredentials();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });

      // Normalize Taiga URL (ensure it ends with /)
      const normalizedUrl = credentials.taigaUrl.endsWith('/')
        ? credentials.taigaUrl
        : `${credentials.taigaUrl}/`;

      // Make login request
      const response = await axios.post<AuthResponse>(
        `${normalizedUrl}api/v1/auth`, 
        {
          type: 'normal',
          username: credentials.username,
          password: credentials.password,
        }
      );

      // Format user data
      const userData: User = {
        id: response.data.id,
        username: response.data.username,
        fullName: response.data.full_name,
        email: response.data.email,
      };

      // Store in localStorage for persistence
      localStorage.setItem('taiga_token', response.data.auth_token);
      localStorage.setItem('taiga_user', JSON.stringify(userData));
      localStorage.setItem('taiga_url', normalizedUrl);

      // Update state
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: response.data.auth_token,
          user: userData,
          taigaUrl: normalizedUrl,
        },
      });
    } catch (error) {
      let errorMessage = 'Failed to login. Please check your credentials and Taiga URL.';
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          errorMessage = 'Taiga instance not found. Please check the URL.';
        } else if (error.response?.status === 401) {
          errorMessage = 'Invalid username or password.';
        } else if (!error.response) {
          errorMessage = 'Network error. Please check your connection and Taiga URL.';
        }
      }
      
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('taiga_token');
    localStorage.removeItem('taiga_user');
    localStorage.removeItem('taiga_url');
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Create value object
  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};