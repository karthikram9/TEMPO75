import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-2 sm:top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none flex items-center justify-center px-2"
    >
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A382B] text-white text-[11px] font-mono font-bold shadow-floating border border-[#3E6F54] animate-in fade-in duration-300">
        <span className="w-2 h-2 rounded-full bg-[#A2B8A0] animate-pulse" aria-hidden="true" />
        <span className="uppercase tracking-wider">OFFLINE MODE • LOCAL DATA ACTIVE</span>
      </div>
    </div>
  );
};
