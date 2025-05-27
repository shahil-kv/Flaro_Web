import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/auth.types";

export const handleApiError = (error: unknown): ApiErrorResponse => {
    if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as ApiErrorResponse;
        return {
            message: data.message || "An error occurred",
            errors: data.errors,
        };
    }
    return {
        message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
};