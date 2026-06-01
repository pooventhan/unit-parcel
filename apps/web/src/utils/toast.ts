import { toast } from 'react-toastify';

const toastConfig = {
  position: 'bottom-center' as const,
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  limit: 2,
};

export function showSuccessToast(message: string): void {
  toast.success(message, toastConfig);
}

export function showErrorToast(message: string): void {
  toast.error(message, toastConfig);
}

export function showInfoToast(message: string): void {
  toast.info(message, toastConfig);
}
