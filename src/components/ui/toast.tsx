"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastProps = {
  id: string;
  title: string;
  description?: string;
  type?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
};

type ToastContextType = {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, "id">) => {
    const id = `toast-${Date.now()}`;
    const newToast = {
      id,
      title: toast.title,
      description: toast.description,
      type: toast.type || "default",
      duration: toast.duration || 5000,
      onClose: toast.onClose,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast?.onClose) {
        toast.onClose();
      }
      return prev.filter((t) => t.id !== id);
    });
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col items-end p-4 space-y-2 max-w-md w-full sm:w-auto">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function Toast({
  id,
  title,
  description,
  type = "default",
  duration = 5000,
  onClose,
}: ToastProps) {
  // Auto dismiss after duration
  useEffect(() => {
    if (duration === Infinity) return;
    
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Get the appropriate color based on type
  const getTypeClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      default:
        return "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800";
    }
  };

  return (
    <div 
      className={cn(
        "flex w-full sm:max-w-sm overflow-hidden rounded-lg border shadow-lg",
        "animate-in fade-in slide-in-from-right-5",
        getTypeClasses()
      )}
      role="alert"
    >
      <div className="flex-1 p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="ml-4 inline-flex text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {description && (
          <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </div>
        )}
      </div>
    </div>
  );
} 