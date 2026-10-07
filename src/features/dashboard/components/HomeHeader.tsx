import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Dumbbell, Menu } from 'lucide-react';
import { useNavigationDrawer } from '@/hooks';

interface HomeHeaderProps {
  onOpenLogWeight: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onOpenLogWeight }) => {
  const navigate = useNavigate();
  const { openDrawer } = useNavigationDrawer();

  return (
    <header className="w-full pt-4 pb-2 sm:pt-6 sm:pb-3">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Menu Access */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Drawer trigger button */}
          <button
            type="button"
            onClick={openDrawer}
            className="w-10 h-10 -ml-1 sm:-ml-2 rounded-xl flex items-center justify-center text-[#141815] hover:bg-[#EBF0EA] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A382B]"
            aria-label="Open navigation menu"
            data-testid="home-menu-button"
          >
            <Menu className="w-5 h-5 text-[#141815]" />
          </button>

          {/* TEMPO 75 Brandmark */}
          <div className="flex items-center gap-2.5 select-none">
            {/* Geometric Athletic Logo Glyph */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A382B] flex items-center justify-center text-white shadow-sm shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                {/* Stylized sharp angular athletic T / 75 emblem */}
                <path d="M4 5h16l-3 4H13v10h-2V9H7L4 5z" />
              </svg>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#141815] uppercase leading-none font-sans">
                TEMPO 75
              </span>
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#6E7A72] uppercase leading-none mt-1">
                YOUR BODY. OUR TEMPO.
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Editorial Headline */}
        <div className="hidden lg:flex items-center justify-center text-center">
          <h1 className="text-2xl xl:text-[26px] font-black tracking-tight uppercase leading-none text-[#141815]">
            75 DAYS.{' '}
            <span className="text-[#2D5A43]">ONE TRANSFORMATION.</span>
          </h1>
        </div>

        {/* Right: Clean Top Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* + Log Weight primary action */}
          <button
            type="button"
            onClick={onOpenLogWeight}
            className="h-10 sm:h-11 px-4 sm:px-5 rounded-full bg-[#1A382B] hover:bg-[#234A39] active:bg-[#142C22] active:scale-[0.98] text-white text-xs sm:text-sm font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A382B] cursor-pointer"
            aria-label="Log current weight"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Weight</span>
          </button>

          {/* Profile / Gym Icon button */}
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-10 h-10 sm:h-11 sm:w-11 rounded-full bg-[#141815] hover:bg-[#222824] active:scale-[0.96] text-white flex items-center justify-center transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A382B] cursor-pointer"
            aria-label="View Athlete Profile"
          >
            <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Headline (Rendered directly under top bar on small viewports) */}
      <div className="lg:hidden mt-5 sm:mt-6 mb-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase leading-[1.08] text-[#141815]">
          75 DAYS.
          <span className="block text-[#2D5A43]">ONE TRANSFORMATION.</span>
        </h1>
      </div>
    </header>
  );
};
