import React from 'react';

interface TempoBrandmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'lime';
  showIconOnly?: boolean;
  className?: string;
}

export const TempoBrandmark: React.FC<TempoBrandmarkProps> = ({
  size = 'md',
  variant = 'lime',
  showIconOnly = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      slash: 'w-4 h-5',
      text: 'text-xl tracking-tight',
      num: 'text-xl',
      tm: 'text-[9px]',
      gap: 'gap-2',
    },
    md: {
      slash: 'w-5 h-6',
      text: 'text-2xl sm:text-3xl tracking-tight',
      num: 'text-2xl sm:text-3xl',
      tm: 'text-[10px]',
      gap: 'gap-2.5',
    },
    lg: {
      slash: 'w-7 h-8',
      text: 'text-4xl sm:text-5xl tracking-tighter',
      num: 'text-4xl sm:text-5xl',
      tm: 'text-xs',
      gap: 'gap-3',
    },
    xl: {
      slash: 'w-8 sm:w-10 h-10 sm:h-12',
      text: 'text-5xl sm:text-6xl md:text-7xl tracking-tighter',
      num: 'text-5xl sm:text-6xl md:text-7xl',
      tm: 'text-sm',
      gap: 'gap-3.5',
    },
  };

  const current = sizeClasses[size];

  // Colors based on variant (Aligned to Home monochromatic green/sage system)
  const slashBg = 'bg-[#1A382B]';
  const slashGlow = 'shadow-xs';
  const tempoTextColor = variant === 'dark' ? 'text-white' : 'text-[#141815]';
  const numberTextColor = variant === 'dark' ? 'text-[#58A672]' : 'text-[#1A382B]';

  // The distinctive TEMPO 75 double-slash emblem
  const DoubleSlashIcon = (
    <div className={`flex items-center gap-1.5 shrink-0 select-none ${current.slash}`} aria-hidden="true">
      <div className={`w-1.5 h-full ${slashBg} -skew-x-[20deg] rounded-sm ${slashGlow}`} />
      <div className={`w-1.5 h-full ${slashBg} -skew-x-[20deg] rounded-sm ${slashGlow}`} />
    </div>
  );

  if (showIconOnly) {
    return <div className={`inline-flex items-center ${className}`}>{DoubleSlashIcon}</div>;
  }

  return (
    <div
      className={`inline-flex items-center ${current.gap} select-none ${className}`}
      aria-label="TEMPO 75"
    >
      {DoubleSlashIcon}

      <div className="flex items-baseline font-black italic uppercase font-sans">
        <span className={`tracking-wider ${tempoTextColor} ${current.text}`}>
          TEMPO
        </span>
        <span className={`font-mono ml-1 ${numberTextColor} ${current.num}`}>
          75
        </span>
        <span className={`text-neutral-400 font-normal ml-0.5 align-super ${current.tm}`}>
          &trade;
        </span>
      </div>
    </div>
  );
};
