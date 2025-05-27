"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { Toaster } from "sonner";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <LoaderProvider>
        <AuthProvider>
          {children}
          <Toaster richColors />
        </AuthProvider>
      </LoaderProvider>
    </QueryClientProvider>
  );
}
