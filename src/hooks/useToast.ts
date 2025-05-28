import { toast } from "sonner";

type ToastType = 'success' | 'error' | 'info';

export const useToast = () => {
  const showToast = (type: ToastType, message: string) => {
    toast[type](message, {
      position: "top-center",
      duration: 3000,
      richColors: true,
    });
  };

  return {
    showSuccess: (message: string) => showToast('success', message),
    showError: (message: string) => showToast('error', message),
    showInfo: (message: string) => showToast('info', message),
  };
};