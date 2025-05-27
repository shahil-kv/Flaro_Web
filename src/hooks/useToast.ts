// Placeholder for useToast hook
export function useToast() {
  return {
    toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
      console.log(`Toast: ${title} - ${description} (${variant})`);
    },
  };
}