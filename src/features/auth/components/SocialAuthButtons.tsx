import React, { useState } from 'react';
import { Info } from 'lucide-react';

export const SocialAuthButtons: React.FC = () => {
  const [notice, setNotice] = useState<string | null>(null);

  const handlePreviewClick = (provider: 'Google' | 'Apple') => {
    setNotice(`${provider} sign-in will be enabled in a future cloud synchronization release.`);
    setTimeout(() => {
      setNotice(null);
    }, 4500);
  };

  return (
    <div className="space-y-3 w-full">
      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-subtle" />
        </div>
        <div className="relative px-3 bg-surface-base text-[11px] font-mono font-bold uppercase tracking-wider text-text-tertiary">
          OR
        </div>
      </div>

      {/* Info notice if clicked */}
      {notice && (
        <div
          role="status"
          className="flex items-center gap-2 p-3 rounded-2xl bg-surface-subtle border border-border-subtle text-text-secondary text-xs animate-fade-in"
        >
          <Info className="w-4 h-4 shrink-0 text-text-primary" />
          <span>{notice}</span>
        </div>
      )}

      {/* Google Button */}
      <button
        type="button"
        onClick={() => handlePreviewClick('Google')}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border border-border-subtle bg-white hover:bg-surface-subtle active:bg-border-subtle/30 text-sm font-bold text-text-primary transition-all shadow-sm touch-manipulation focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.27 21.43 7.37 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.1z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.57 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Apple Button */}
      <button
        type="button"
        onClick={() => handlePreviewClick('Apple')}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border border-border-subtle bg-white hover:bg-surface-subtle active:bg-border-subtle/30 text-sm font-bold text-text-primary transition-all shadow-sm touch-manipulation focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <svg className="w-4 h-4 shrink-0 fill-current text-text-primary" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.77 1.05-1.84.93-2.92-.93.04-2.03.62-2.68 1.39-.58.67-1.09 1.76-.95 2.81 1.03.08 2.08-.53 2.7-1.28z" />
        </svg>
        <span>Continue with Apple</span>
      </button>
    </div>
  );
};
