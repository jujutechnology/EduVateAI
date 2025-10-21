import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

const Toast: React.FC<{ message: string, type: 'success' | 'error' | 'info', onDismiss: () => void }> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const baseClasses = "flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse divide-x rtl:divide-x-reverse rounded-lg shadow text-gray-400 divide-gray-700 space-x dark:bg-gray-800";
  const typeClasses = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div className={baseClasses} role="alert">
       <div className={`w-3 h-3 rounded-full ${typeClasses[type]}`}></div>
      <div className="ps-4 text-sm font-normal text-gray-500 dark:text-gray-400">{message}</div>
      <button onClick={onDismiss} className="pl-4 text-gray-400 hover:text-white">&times;</button>
    </div>
  );
};

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { toasts, removeToast } = useAppContext();

  return (
    <>
      {children}
      <div className="fixed top-5 right-5 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
};
