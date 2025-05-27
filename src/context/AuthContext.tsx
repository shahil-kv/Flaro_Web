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

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAccessToken: () => Promise<AuthTokens>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { mutateAsync: login } = usePost<LoginResponse>("/user/login", {
    invalidateQueriesOnSuccess: ["users", "auth"],
    showErrorToast: true,
    showSuccessToast: true,
  });

  const { mutateAsync: refreshToken } = usePost<RefreshTokenResponse>(
    "/user/refresh-token",
    {
      invalidateQueriesOnSuccess: ["users", "auth"],
      showErrorToast: false,
      showSuccessToast: false,
    }
  );

  const { mutateAsync: logout } = usePost<null>("/user/logout", {
    invalidateQueriesOnSuccess: ["users", "auth"],
    showErrorToast: true,
    showSuccessToast: true,
  });

  const loadStoredAuth = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refresh_token");
      const storedUserData = localStorage.getItem("user_data");

      if (!storedRefreshToken) {
        setUser(null);
        setTokens(null);
        router.push(AUTH_CONFIG.ROUTES.LOGIN);
        return;
      }

      try {
        const response = await refreshToken({
          refreshToken: storedRefreshToken,
        });
        const { tokens: newTokens } = response.data;

        const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
        localStorage.setItem("access_token", newTokens.accessToken);
        localStorage.setItem("refresh_token", newTokens.refreshToken);
        localStorage.setItem("token_expiry", tokenExpiry.toISOString());
        document.cookie = `access_token=${newTokens.accessToken}; path=/; secure; samesite=strict`;
        setTokens(newTokens);

        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUser(userData);
          router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
        localStorage.removeItem("user_data");
        document.cookie =
          "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
      router.push(AUTH_CONFIG.ROUTES.LOGIN);
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken, router]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await login({ email, password });
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
      console.error("Sign-in failed:", error);
      throw new Error(error.message || "Invalid email or password");
    }
  };

  const signOut = async () => {
    try {
      await logout({});
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_expiry");
      localStorage.removeItem("user_data");
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setUser(null);
      setTokens(null);
      router.push(AUTH_CONFIG.ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Logout failed");
    }
  };

  const refreshAccessToken = async () => {
    try {
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

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
