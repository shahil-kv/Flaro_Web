"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { usePost } from "@/lib/useApi";
import { AUTH_CONFIG } from "@/utils/auth.config";
import {
  AuthTokens,
  LoginResponse,
  RefreshTokenResponse,
  User,
} from "@/types/auth.types";

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  signIn: (phoneNumber: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAccessToken: () => Promise<AuthTokens>;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to manage authentication state
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Hook to make POST requests for login
  const { mutateAsync: login } = usePost<LoginResponse>("/user/login", {
    invalidateQueriesOnSuccess: ["users", "auth"],
    showErrorToast: true,
    showSuccessToast: true,
  });

  // Hook to make POST requests for refreshing tokens
  const { mutateAsync: refreshToken } = usePost<RefreshTokenResponse>(
    "/user/refresh-token",
    {
      invalidateQueriesOnSuccess: ["users", "auth"],
      showErrorToast: false,
      showSuccessToast: false,
    }
  );

  // Hook to make POST requests for logout
  const { mutateAsync: logout } = usePost<null>("/user/logout", {
    invalidateQueriesOnSuccess: ["users", "auth"],
    showErrorToast: true,
    showSuccessToast: true,
  });

  // Function to load stored authentication data on mount
  const loadStoredAuth = useCallback(async () => {
    try {
      // Retrieve refresh token, user data, and token expiry from localStorage
      const storedRefreshToken = localStorage.getItem("refresh_token");
      const storedUserData = localStorage.getItem("user_data");
      const tokenExpiry = localStorage.getItem("token_expiry");

      // If no refresh token or expiry exists, clear the auth state
      if (!storedRefreshToken || !tokenExpiry) {
        console.log("No refresh token or expiry found, clearing auth state");
        setUser(null);
        setTokens(null);
        return;
      }

      // Parse user data if it exists, with error handling
      let userData: User | null = null;
      if (storedUserData) {
        try {
          userData = JSON.parse(storedUserData);
        } catch (parseError) {
          console.error("Failed to parse user data:", parseError);
          // Clear auth state since user data is invalid
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token_expiry");
          localStorage.removeItem("user_data");
          document.cookie =
            "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          setUser(null);
          setTokens(null);
          router.push(AUTH_CONFIG.ROUTES.LOGIN);
          return;
        }
      }

      // Check if the token is expired
      const expiryDate = new Date(tokenExpiry);
      const now = new Date();
      const isExpired = now >= expiryDate;

      if (!isExpired) {
        // Token is still valid, use the existing access token
        console.log("Access token is still valid, loading auth state");
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          setTokens({ accessToken, refreshToken: storedRefreshToken });
          if (userData) {
            setUser(userData);
          }
        }
        return;
      }

      try {
        // Token is expired, attempt to refresh the access token
        console.log("Access token expired, attempting to refresh");
        const response = await refreshToken({
          refreshToken: storedRefreshToken,
        });
        const { tokens: newTokens } = response.data;

        // Set the new tokens in localStorage and cookies
        const newExpiry = new Date(Date.now() + 15 * 60 * 1000);
        localStorage.setItem("access_token", newTokens.accessToken);
        localStorage.setItem("refresh_token", newTokens.refreshToken);
        localStorage.setItem("token_expiry", newExpiry.toISOString());
        document.cookie = `access_token=${newTokens.accessToken}; path=/; secure; samesite=strict`;
        setTokens(newTokens);

        // Set user data if it exists
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
        localStorage.removeItem("user_data");
        document.cookie =
          "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setUser(null);
        setTokens(null);
        router.push(AUTH_CONFIG.ROUTES.LOGIN);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_expiry");
      localStorage.removeItem("user_data");
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setUser(null);
      setTokens(null);
      router.push(AUTH_CONFIG.ROUTES.LOGIN);
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken, router]);

  // Function to handle user sign-in
  const signIn = async (phoneNumber: string, password: string) => {
    try {
      const response = await login({ phoneNumber, password });
      if (!response?.data) throw new Error("Invalid response structure");
      const { user, tokens: newTokens } = response.data;
      if (!user || !newTokens) throw new Error("Missing user or tokens");

      const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
      localStorage.setItem("access_token", newTokens.accessToken);
      localStorage.setItem("refresh_token", newTokens.refreshToken);
      localStorage.setItem("token_expiry", tokenExpiry.toISOString());
      localStorage.setItem("user_data", JSON.stringify(user));
      document.cookie = `access_token=${newTokens.accessToken}; path=/; secure; samesite=strict`;
      setUser(user);
      setTokens(newTokens);
      router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
    } catch (error: any) {
      throw new Error(error.message || "Invalid email or password");
    }
  };

  // Function to handle user sign-out
  const signOut = async () => {
    try {
      await logout({});
      // Clear all auth-related data
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_expiry");
      localStorage.removeItem("user_data");
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setUser(null);
      setTokens(null);
      // Redirect to login page after logout
      router.push(AUTH_CONFIG.ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Logout failed");
    }
  };

  // Function to refresh the access token
  const refreshAccessToken = async () => {
    try {
      console.log("auth refresh token");
      const storedRefreshToken = localStorage.getItem("refresh_token");
      if (!storedRefreshToken) throw new Error("No refresh token available");

      const response = await refreshToken({ refreshToken: storedRefreshToken });
      const { tokens: newTokens } = response.data;
      const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
      localStorage.setItem("access_token", newTokens.accessToken);
      localStorage.setItem("refresh_token", newTokens.refreshToken);
      localStorage.setItem("token_expiry", tokenExpiry.toISOString());
      document.cookie = `access_token=${newTokens.accessToken}; path=/; secure; samesite=strict`;
      setTokens(newTokens);
      return newTokens;
    } catch (error) {
      console.error("Error refreshing token:", error);
      await signOut();
      throw error;
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
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
