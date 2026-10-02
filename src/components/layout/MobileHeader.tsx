import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { MobileHeaderConfig } from './headerContextDef';
import { useMobileHeader } from '@/hooks';

import { TempoBrandmark } from '@/features/auth/components/TempoBrandmark';

export interface MobileHeaderProps extends MobileHeaderConfig {
  className?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title: propTitle,
  subtitle: propSubtitle,
  showBack: propShowBack,
  onBack: propOnBack,
  rightAction: propRightAction,
  badge: propBadge,
  className,
}) => {
  const { headerConfig } = useMobileHeader();
  const navigate = useNavigate();

  const title = propTitle ?? headerConfig.title ?? 'TEMPO 75';
  const subtitle = propSubtitle ?? headerConfig.subtitle;
  const showBack = propShowBack ?? headerConfig.showBack ?? false;
  const onBack = propOnBack ?? headerConfig.onBack;
  const rightAction = propRightAction ?? headerConfig.rightAction;
  const badge = propBadge ?? headerConfig.badge;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const isDefaultBrand = !showBack && title === 'TEMPO 75';

  return (
    <header
      className={`lg:hidden sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-border pt-safe transition-all select-none ${
        className ?? ''
      }`}
    >
      <div className="flex items-center justify-between h-14 px-4 gap-2">
        {/* Left Section: Back button or Brand logo */}
        <div className="flex items-center gap-2.5 min-w-[44px]">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-11 h-11 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : isDefaultBrand ? (
            <NavLink
              to="/"
              className="flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
              aria-label="Tempo 75 Home"
            >
              <TempoBrandmark size="sm" variant="lime" showIconOnly />
            </NavLink>
          ) : null}

          {/* Title Hierarchy */}
          <div className="flex flex-col justify-center truncate">
            <h1 className="font-extrabold tracking-tight text-sm sm:text-base text-text-primary leading-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <span className="text-2xs text-text-muted font-mono tracking-widest uppercase truncate mt-0.5">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Contextual action or status badge */}
        <div className="flex items-center gap-2 shrink-0 min-h-[44px]">
          {rightAction ? (
            <div className="flex items-center">{rightAction}</div>
          ) : badge ? (
            <div>{badge}</div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
