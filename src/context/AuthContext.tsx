'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { usePost } from '@/lib/useApi';
import { AUTH_CONFIG } from '@/utils/auth.config';
import { AuthTokens, LoginResponse, User } from '@/types/auth.types';

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  signIn: (phoneNumber: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to manage authentication state
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Hook to make POST requests for login
  const { mutateAsync: login } = usePost<LoginResponse>('/user/login', {
    invalidateQueriesOnSuccess: ['users', 'auth'],
    showErrorToast: true,
    showSuccessToast: true,
  });

  // Hook to make POST requests for logout
  const { mutateAsync: logout } = usePost<null>('/user/logout', {
    invalidateQueriesOnSuccess: ['users', 'auth'],
    showErrorToast: true,
    showSuccessToast: true,
  });

  // Function to load stored authentication data on mount
  const loadStoredAuth = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refresh_token');
      const storedUserData = localStorage.getItem('user_data');
      const tokenExpiry = localStorage.getItem('token_expiry');
      const storedAccessToken = localStorage.getItem('access_token');

      console.log('[AuthContext] loadStoredAuth', {
        hasRefreshToken: !!storedRefreshToken,
        hasUserData: !!storedUserData,
        hasAccessToken: !!storedAccessToken,
        tokenExpiry,
      });

      if (!storedRefreshToken || !storedAccessToken) {
        console.log('[AuthContext] No tokens found, clearing auth state');
        setUser(null);
        setTokens(null);
        return;
      }

      let userData: User | null = null;
      if (storedUserData) {
        try {
          userData = JSON.parse(storedUserData);
        } catch (parseError) {
          console.error('[AuthContext] Failed to parse user data:', parseError);
          // Clear invalid data
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expiry');
          localStorage.removeItem('user_data');
          document.cookie =
            'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          setUser(null);
          setTokens(null);
          router.push(AUTH_CONFIG.ROUTES.LOGIN);
          return;
        }
      }

      // Set auth state with stored tokens - let API interceptor handle expiry
      console.log('[AuthContext] Loading stored auth state');
      setTokens({ accessToken: storedAccessToken, refreshToken: storedRefreshToken });
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('[AuthContext] Auth check failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expiry');
      localStorage.removeItem('user_data');
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setUser(null);
      setTokens(null);
      router.push(AUTH_CONFIG.ROUTES.LOGIN);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Function to handle user sign-in
  const signIn = async (phoneNumber: string, password: string) => {
    try {
      const response = await login({ phoneNumber, password });
      if (!response?.data) throw new Error('Invalid response structure');
      const { user, tokens: newTokens } = response.data;
      if (!user || !newTokens) throw new Error('Missing user or tokens');

      console.log('[AuthContext] signIn success', { user, newTokens });

      const tokenExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minute for debugging
      localStorage.setItem('access_token', newTokens.accessToken);
      localStorage.setItem('refresh_token', newTokens.refreshToken);
      localStorage.setItem('token_expiry', tokenExpiry.toISOString());
      localStorage.setItem('user_data', JSON.stringify(user));
      document.cookie = `access_token=${newTokens.accessToken}; path=/; secure; samesite=strict`;

      setUser(user);
      setTokens(newTokens);
      router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
    } catch (error: any) {
      console.error('[AuthContext] signIn failed:', error);
      throw new Error(error.message || 'Invalid email or password');
    }
  };

  // Function to handle user sign-out
  const signOut = async () => {
    try {
      await logout({});
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expiry');
      localStorage.removeItem('user_data');
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setUser(null);
      setTokens(null);
      router.push(AUTH_CONFIG.ROUTES.LOGIN);
      console.log('[AuthContext] signOut: User logged out and redirected to login');
    } catch (error) {
      console.error('[AuthContext] Logout failed:', error);
      throw new Error('Logout failed');
    }
  };

  // Run loadStoredAuth on component mount to initialize auth state
  useEffect(() => {
    // Skip running loadStoredAuth if on the login page to prevent loops
    const currentPath = window.location.pathname;
    if (currentPath !== AUTH_CONFIG.ROUTES.LOGIN) {
      loadStoredAuth();
    } else {
      setIsLoading(false);
    }
  }, [loadStoredAuth]);

  // Context value to provide to consumers
  const value: AuthContextType = {
    user,
    tokens,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
