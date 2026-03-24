import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { gsap } from 'gsap';

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToast({ message, id });

    // Animate in
    setTimeout(() => {
      gsap.fromTo('.toast-notification', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }, 10);

    // Animate out
    setTimeout(() => {
      gsap.to('.toast-notification', {
        y: 50, opacity: 0, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
          setToast((current) => (current?.id === id ? null : current));
        }
      });
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast-notification fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="glass px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
