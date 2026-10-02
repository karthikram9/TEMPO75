import React from 'react';
import { Dumbbell, Scale, CalendarDays, User, ArrowUpRight } from 'lucide-react';

interface QuickActionsProps {
  hasActiveSession: boolean;
  onStartWorkout: () => void;
  onOpenLogWeight: () => void;
  onViewJourney: () => void;
  onViewProfile: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  hasActiveSession,
  onStartWorkout,
  onOpenLogWeight,
  onViewJourney,
  onViewProfile,
}) => {
  return (
    <section aria-label="Quick Actions" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
          Quick Actions
        </h2>
        <span className="text-[11px] font-mono text-text-tertiary">COMMAND SHORTCUTS</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* 1. Workout Launcher */}
        <button
          type="button"
          onClick={onStartWorkout}
          className="flex items-center justify-between p-3.5 rounded-2xl border border-accent/40 bg-accent text-text-primary transition-all group touch-manipulation hover:opacity-95 shadow-pill focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-full bg-text-primary/10 flex items-center justify-center text-text-primary">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-text-primary tracking-wide">
                {hasActiveSession ? 'RESUME SESSION' : 'START WORKOUT'}
              </div>
              <div className="text-[11px] text-text-secondary font-medium">
                {hasActiveSession ? 'In progress' : 'Begin logging'}
              </div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* 2. Weight Logger */}
        <button
          type="button"
          onClick={onOpenLogWeight}
          className="flex items-center justify-between p-3.5 rounded-2xl border border-border-subtle bg-surface-base hover:bg-surface-subtle active:bg-border-subtle/30 text-text-primary transition-all shadow-daylight group touch-manipulation focus:outline-none focus:ring-2 focus:ring-text-primary/20"
        >
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-full bg-surface-subtle border border-border-subtle flex items-center justify-center text-text-primary">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-text-primary tracking-wide">LOG WEIGHT</div>
              <div className="text-[11px] text-text-tertiary">Morning check-in</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </button>

        {/* 3. Journey Overview */}
        <button
          type="button"
          onClick={onViewJourney}
          className="flex items-center justify-between p-3.5 rounded-2xl border border-border-subtle bg-surface-base hover:bg-surface-subtle active:bg-border-subtle/30 text-text-primary transition-all shadow-daylight group touch-manipulation focus:outline-none focus:ring-2 focus:ring-text-primary/20"
        >
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-full bg-surface-subtle border border-border-subtle flex items-center justify-center text-text-primary">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-text-primary tracking-wide">VIEW JOURNEY</div>
              <div className="text-[11px] text-text-tertiary">75-day timeline</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </button>

        {/* 4. Athlete Profile */}
        <button
          type="button"
          onClick={onViewProfile}
          className="flex items-center justify-between p-3.5 rounded-2xl border border-border-subtle bg-surface-base hover:bg-surface-subtle active:bg-border-subtle/30 text-text-primary transition-all shadow-daylight group touch-manipulation focus:outline-none focus:ring-2 focus:ring-text-primary/20"
        >
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-full bg-surface-subtle border border-border-subtle flex items-center justify-center text-text-primary">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-text-primary tracking-wide">ATHLETE PROFILE</div>
              <div className="text-[11px] text-text-tertiary">Goals &amp; metrics</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </button>
      </div>
    </section>
  );
};
