// /app/lib/api.ts
import axios, { AxiosInstance } from "axios";
import { AUTH_CONFIG } from "@/utils/auth.config";

// Global variable to track ongoing refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Centralized token refresh function
const refreshTokens = async (): Promise<string> => {
    const storedRefreshToken = localStorage.getItem("refresh_token");
    if (!storedRefreshToken) {
        throw new Error("No refresh token available");
    }

    console.log("[API] Refreshing tokens...");
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/refresh-token`,
        { refreshToken: storedRefreshToken }
    );

    if (!response.data?.data?.tokens) {
        throw new Error("Invalid refresh token response: missing tokens structure");
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

    if (!newAccessToken || !newRefreshToken) {
        throw new Error("Refresh token response does not contain valid tokens");
    }

    // Store new tokens
    const newExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minute for debugging
    localStorage.setItem("access_token", newAccessToken);
    localStorage.setItem("refresh_token", newRefreshToken);
    localStorage.setItem("token_expiry", newExpiry.toISOString());
    document.cookie = `access_token=${newAccessToken}; path=/; secure; samesite=strict`;

    console.log("[API] Tokens refreshed successfully");
    return newAccessToken;
};

// Centralized token refresh with concurrency control
const getValidToken = async (): Promise<string | null> => {
    const accessToken = localStorage.getItem("access_token");
    const tokenExpiry = localStorage.getItem("token_expiry");

    if (!accessToken || !tokenExpiry) {
        return null;
    }

    const expiryDate = new Date(tokenExpiry);
    const now = new Date();
    const isExpired = now >= expiryDate;

    if (!isExpired) {
        return accessToken;
    }

    // If already refreshing, wait for the existing refresh
    if (isRefreshing && refreshPromise) {
        console.log("[API] Token refresh already in progress, waiting...");
        return await refreshPromise;
    }

    // Start new refresh
    isRefreshing = true;
    refreshPromise = refreshTokens()
        .then((newToken) => {
            isRefreshing = false;
            refreshPromise = null;
            return newToken;
        })
        .catch((error) => {
            isRefreshing = false;
            refreshPromise = null;
            // Clear auth data on refresh failure
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("token_expiry");
            localStorage.removeItem("user_data");
            document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            window.location.href = AUTH_CONFIG.ROUTES.LOGIN;
            throw error;
        });

    return await refreshPromise;
};

api.interceptors.request.use(
    async (config) => {
        try {
            const validToken = await getValidToken();
            if (validToken) {
                config.headers.Authorization = `Bearer ${validToken}`;
            }
        } catch (error) {
            console.error("[API] Failed to get valid token:", error);
            return Promise.reject(error);
        }
        return config;
    },
    (error) => {
        console.error("[API] Request Interceptor Error:", error);
        return Promise.reject(error);
    }
);

// Simplified response interceptor - only handle 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const validToken = await getValidToken();
                if (validToken) {
                    originalRequest.headers.Authorization = `Bearer ${validToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("[API] Token refresh failed in response interceptor:", refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export { api };