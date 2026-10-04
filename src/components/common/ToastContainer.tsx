import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-md w-[92vw] sm:w-full pointer-events-none px-2"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-200 animate-in slide-in-from-top-3 fade-in zoom-in-95 ${
              isSuccess
                ? 'border-emerald-200/80 text-slate-800'
                : isError
                ? 'border-rose-200/80 text-slate-800'
                : 'border-[#FFD7C2] text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="shrink-0">
                {isSuccess && (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {isError && (
                  <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
                {!isSuccess && !isError && (
                  <div className="w-6 h-6 rounded-full bg-[#FFF4ED] flex items-center justify-center text-[#F4511E]">
                    <Info className="w-4 h-4" />
                  </div>
                )}
              </div>
              <p className="text-xs font-semibold leading-snug truncate text-[#171717]">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
