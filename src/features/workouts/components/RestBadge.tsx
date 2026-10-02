import React from 'react';

interface RestBadgeProps {
  seconds: number;
  className?: string;
}

export const RestBadge: React.FC<RestBadgeProps> = ({ seconds, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-secondary border border-border-primary text-text-secondary text-xs font-mono font-medium tracking-wide ${className}`}
    >
      <svg
        className="w-3.5 h-3.5 text-text-tertiary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>{seconds}s REST</span>
    </span>
  );
};
