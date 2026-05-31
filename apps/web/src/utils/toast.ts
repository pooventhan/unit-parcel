import { toast } from 'react-toastify';

/**
 * Show a success toast notification
 */
export function showSuccessToast(message: string): void {
  toast.success(message, {
    position: 'bottom-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

/**
 * Show an error toast notification
 */
export function showErrorToast(message: string): void {
  toast.error(message, {
    position: 'bottom-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

/**
 * Show an info toast notification
 */
export function showInfoToast(message: string): void {
  toast.info(message, {
    position: 'bottom-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}
