import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-[max(4.75rem,env(safe-area-inset-top))] left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:max-w-md z-50 flex flex-col items-center gap-2 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full flex items-start justify-between gap-3 px-4 py-3 rounded-2xl bg-white/98 backdrop-blur-md border shadow-[0_10px_35px_rgba(0,0,0,0.14)] transition-all duration-200 animate-in slide-in-from-top-2 fade-in zoom-in-95 ${
              isSuccess
                ? 'border-emerald-300 text-slate-900 ring-1 ring-emerald-500/20'
                : isError
                ? 'border-rose-300 text-slate-900 ring-1 ring-rose-500/20'
                : 'border-[#FFD7C2] text-slate-900 ring-1 ring-[#F4511E]/20'
            }`}
          >
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <div className="shrink-0 mt-0.5">
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
              <p className="text-xs sm:text-sm font-semibold leading-snug break-words text-[#171717] flex-1">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors mt-0.5"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
