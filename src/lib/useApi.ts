/**
 * @file useApi.ts
 * @description Custom hooks for making API calls with built-in error handling and loading states
 * @author System
 */
'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiErrorResponse } from "@/types/auth.types";
import { handleApiError } from "@/utils/error-handler";
import { useToast } from "@/hooks/useToast"; // We'll create this hook
import { useLoader } from "../context/LoaderContext"; // We'll create this context

interface MutationConfig {
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    showLoader?: boolean;
    invalidateQueriesOnSuccess?: string[];
}

const formatErrorMessage = (error: unknown): string => {
    try {
        if (error instanceof Error) {
            const parsedError = JSON.parse(error.message) as ApiErrorResponse;
            if (parsedError.errors && parsedError.errors.length > 0) {
                return parsedError.errors.map((err) => err.message).join("\n");
            }
            return parsedError.message;
        }
        return "An unexpected error occurred";
    } catch {
        return error instanceof Error ? error.message : "An unexpected error occurred";
    }
};

interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
}

/**
 * @function usePost
 * @description Hook for making POST requests with built-in error handling and loading states
 * @template TData - Type of the response data
 * @template TVariables - Type of the request variables
 * @param {string} endpoint - API endpoint to call
 * @param {MutationConfig} [config] - Configuration options
 * @returns {UseMutationResult<TData, Error, TVariables>} Mutation result object
 * 
 * @example
 * const { mutate, isLoading } = usePost<ResponseType, RequestType>('/api/endpoint', {
 *   showSuccessToast: true,
 *   showErrorToast: true,
 *   showLoader: true
 * });
 * 
 * // Use the mutation
 * mutate(requestData);
 */
export const usePost = <TData = unknown, TVariables = unknown>(
    endpoint: string,
    config: MutationConfig = {}
) => {
    const queryClient = useQueryClient();
    const toast = useToast();
    const { showLoader, hideLoader } = useLoader();
    const {
        showSuccessToast = false,
        showErrorToast = true,
        showLoader: shouldShowLoader = true,
        invalidateQueriesOnSuccess,
    } = config;

    return useMutation({
        mutationFn: async (variables: TVariables) => {
            try {
                if (shouldShowLoader) {
                    showLoader();
                }
                const response = await api.post<ApiResponse<TData>>(endpoint, variables);
                if (showSuccessToast && response.data.message) {
                    toast.showSuccess(response.data.message);
                }
                return response.data;
            } catch (error) {
                const appError = handleApiError(error);
                if (showErrorToast) {
                    toast.showError(appError.message);
                }
                throw error;
            } finally {
                if (shouldShowLoader) {
                    hideLoader();
                }
            }
        },
        onSuccess: () => {
            if (invalidateQueriesOnSuccess) {
                invalidateQueriesOnSuccess.forEach((queryKey) => {
                    queryClient.invalidateQueries({ queryKey: [queryKey] });
                });
            }
        },
    });
};

/**
 * @function useGet
 * @description Hook for making GET requests with built-in error handling and loading states using useQuery
 * @template TData - Type of the response data
 * @template TVariables - Type of the request variables
 * @param {string} endpoint - API endpoint to call
 * @param {TVariables} [variables] - Query parameters
 * @param {MutationConfig} [config] - Configuration options
 * @returns {UseQueryResult<TData, Error>} Query result object
 * 
 * @example
 * const { data, isLoading, refetch } = useGet<ResponseType, { userId: string }>('/api/endpoint', { userId: '123' }, {
 *   showErrorToast: true,
 *   showLoader: true
 * });
 */
export const useGet = <TData = any, TVariables extends { userId?: string | number; sessionId?: number } = any>(
    endpoint: string,
    variables?: TVariables,
    config: MutationConfig & { enabled?: boolean } = {}
) => {
    const toast = useToast();
    const { showLoader, hideLoader } = useLoader();
    const {
        showSuccessToast = false,
        showErrorToast = true,
        showLoader: shouldShowLoader = true,
        enabled = true,
    } = config;

    return useQuery({
        queryKey: [endpoint, variables],
        queryFn: async () => {
            try {
                if (shouldShowLoader) {
                    showLoader();
                }
                const response = await api.get<TData>(endpoint, { params: variables });
                if (showSuccessToast) {
                    toast.showSuccess("Data fetched successfully");
                }
                return response.data;
            } catch (error) {
                const appError = handleApiError(error);
                if (showErrorToast) {
                    toast.showError(appError.message);
                }
                throw error;
            } finally {
                if (shouldShowLoader) {
                    hideLoader();
                }
            }
        },
        enabled,
    });
};

export { formatErrorMessage };