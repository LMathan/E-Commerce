"use client";

import React, { useState, createContext, useContext, useCallback, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToasterContextValue {
  toasts: Toast[];
  toast: (options: Omit<Toast, "id">) => void;
  addToast: (options: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToasterContext = createContext<ToasterContextValue | null>(null);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    const newToast: Toast = { id, duration: 5000, ...options };
    setToasts((prev) => [...prev.slice(-4), newToast]); // Max 5 toasts

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => dismiss(id), newToast.duration);
    }
  }, [dismiss]);

  return (
    <ToasterContext.Provider value={{ toasts, toast, addToast: toast, dismiss }}>
      {children}
    </ToasterContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToasterContext);
  if (!ctx) throw new Error("useToast must be used within ToasterProvider");
  return ctx;
}

const TOAST_ICONS = {
  success: <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />,
  error: <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />,
  info: <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />,
};

const TOAST_STYLES = {
  success: "border-green-200 bg-green-50",
  error: "border-red-200 bg-red-50",
  warning: "border-yellow-200 bg-yellow-50",
  info: "border-blue-200 bg-blue-50",
};

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300 w-full max-w-sm",
        TOAST_STYLES[t.type],
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      {TOAST_ICONS[t.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900">{t.title}</p>
        {t.description && (
          <p className="text-sm text-neutral-600 mt-0.5">{t.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0 mt-0.5"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const ctx = useContext(ToasterContext);

  // Toaster can be used without provider — render nothing
  if (!ctx || ctx.toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[1500] flex flex-col gap-2 items-end"
      aria-label="Notifications"
    >
      {ctx.toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => ctx.dismiss(t.id)} />
      ))}
    </div>
  );
}

// Standalone toast store for use outside React (e.g., in API handlers)
// This is a simple broadcast pattern
let _toastFn: ((options: Omit<Toast, "id">) => void) | null = null;

export function registerToastFn(fn: (options: Omit<Toast, "id">) => void) {
  _toastFn = fn;
}

export function showToast(options: Omit<Toast, "id">) {
  _toastFn?.(options);
}
