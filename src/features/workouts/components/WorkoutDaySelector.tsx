import React, { useRef, useEffect } from 'react';

interface WorkoutDaySelectorProps {
  activeDayNumber: number;
  selectedDayNumber: number;
  totalDays?: number;
  onSelectDay: (dayNumber: number) => void;
  isRestDay: (dayNumber: number) => boolean;
  className?: string;
}

export const WorkoutDaySelector: React.FC<WorkoutDaySelectorProps> = ({
  activeDayNumber,
  selectedDayNumber,
  totalDays = 75,
  onSelectDay,
  isRestDay,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);

  // Center selected day button in the scroll container
  useEffect(() => {
    if (selectedButtonRef.current && containerRef.current) {
      const container = containerRef.current;
      const button = selectedButtonRef.current;
      const scrollLeft = button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [selectedDayNumber]);

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Workout Day Navigation"
      className={`w-full flex flex-col gap-2 ${className}`}
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E7A72] font-bold">
          Day Schedule
        </span>

        {selectedDayNumber !== activeDayNumber && (
          <button
            type="button"
            onClick={() => onSelectDay(activeDayNumber)}
            className="text-xs font-mono font-bold text-[#1A382B] hover:opacity-90 transition-all flex items-center gap-1.5 min-h-[32px] px-3 py-1 rounded-full bg-[#EDF0EA] border border-[#DEE5DC] active:scale-95 shadow-sm"
          >
            <span>Jump to Today (Day {activeDayNumber})</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Day Strip */}
      <div
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none focus:outline-none"
        tabIndex={0}
        role="tablist"
        aria-label="Days of Tempo 75"
      >
        {days.map((day) => {
          const isSelected = day === selectedDayNumber;
          const isActive = day === activeDayNumber;
          const isPast = day < activeDayNumber;
          const isFuture = day > activeDayNumber;
          const isRest = isRestDay(day);

          const statusBadgeText = isRest
            ? 'REST'
            : isActive
            ? 'TODAY'
            : isPast
            ? 'PAST'
            : 'UPCOMING';

          return (
            <button
              key={day}
              ref={isSelected ? selectedButtonRef : null}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-label={`Day ${day}${isActive ? ', Today' : ''}${isRest ? ', Recovery Day' : ''}${isFuture ? ', View only' : ''}`}
              onClick={() => onSelectDay(day)}
              className={`min-w-[68px] min-h-[52px] sm:min-h-[56px] px-2.5 py-1.5 rounded-2xl flex flex-col items-center justify-center shrink-0 border transition-all text-xs font-mono select-none active:scale-95 ${
                isSelected
                  ? 'bg-[#1A382B] border-transparent text-white font-black shadow-sm'
                  : isActive
                  ? 'bg-surface-base border-2 border-text-primary text-text-primary shadow-daylight'
                  : isRest
                  ? 'bg-blue-50/80 border-blue-200 text-blue-800 hover:bg-blue-100/70'
                  : 'bg-surface-base border-border-subtle text-text-secondary hover:text-text-primary hover:bg-surface-subtle shadow-daylight'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-sm tracking-tight">
                <span>D{String(day).padStart(2, '0')}</span>
                {isActive && !isSelected && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-text-primary animate-pulse"
                    aria-hidden="true"
                  />
                )}
              </div>

              <span
                className={`text-[9px] font-bold tracking-wider uppercase mt-0.5 ${
                  isSelected
                    ? 'text-white/90 font-bold'
                    : isActive
                    ? 'text-text-primary font-bold'
                    : isRest
                    ? 'text-blue-700'
                    : 'text-[#6E7A72]'
                }`}
              >
                {statusBadgeText}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
