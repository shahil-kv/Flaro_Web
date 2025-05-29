import axios, { AxiosError, AxiosInstance } from "axios";
import { AUTH_CONFIG } from "@/utils/auth.config";

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("access_token");
        const tokenExpiry = localStorage.getItem("token_expiry");
        const refreshToken = localStorage.getItem("refresh_token");

        if (accessToken && tokenExpiry && refreshToken) {
            const expiryDate = new Date(tokenExpiry);
            const now = new Date();
            const isExpired = now >= expiryDate;

            if (isExpired) {
                // Token is expired, refresh it
                try {
                    console.log('expired');

                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/refresh-token`, {
                        refreshToken,
                    });
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.tokens;
                    const newExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15-minute expiry

                    localStorage.setItem("access_token", newAccessToken);
                    localStorage.setItem("refresh_token", newRefreshToken);
                    localStorage.setItem("token_expiry", newExpiry.toISOString());
                    document.cookie = `access_token=${newAccessToken}; path=/; secure; samesite=strict`;

                    config.headers.Authorization = `Bearer ${newAccessToken}`;
                } catch (refreshError) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("token_expiry");
                    localStorage.removeItem("user_data");
                    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    window.location.href = AUTH_CONFIG.ROUTES.LOGIN;
                    return Promise.reject(refreshError);
                }
            } else {
                // Token is still valid
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const storedRefreshToken = localStorage.getItem("refresh_token");
                if (!storedRefreshToken) throw new Error("No refresh token available");
                console.log('users refresh token');

                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/refresh-token`, {
                    refreshToken: storedRefreshToken,
                });
                const { accessToken, refreshToken } = response.data.tokens;
                const newExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15-minute expiry
                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", refreshToken);
                localStorage.setItem("token_expiry", newExpiry.toISOString());
                document.cookie = `access_token=${accessToken}; path=/; secure; samesite=strict`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("token_expiry");
                localStorage.removeItem("user_data");
                document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                window.location.href = AUTH_CONFIG.ROUTES.LOGIN;
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export { api };