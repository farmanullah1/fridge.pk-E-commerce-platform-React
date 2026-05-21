import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingOverlay({ message = 'Loading...', fullScreen = false }: LoadingOverlayProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? 'fixed inset-0 z-[100] bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm' : 'py-16'
      }`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="w-8 h-8 text-brand-coral animate-spin" />
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{message}</p>
    </div>
  );
}
