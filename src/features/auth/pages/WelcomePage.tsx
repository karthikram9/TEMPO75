import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  BarChart2,
  Heart,
  Zap,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { TempoBrandmark } from '../components/TempoBrandmark';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const featurePillars = [
    {
      icon: Dumbbell,
      label: 'TRAIN BETTER',
      description: 'Deterministic split programming tailored to your schedule and equipment.',
    },
    {
      icon: BarChart2,
      label: 'SEE PROGRESS',
      description: 'Automated double progression calculating your target loads.',
    },
    {
      icon: Heart,
      label: 'RECOVER WELL',
      description: 'Configurable sleep floors, cardio targets, and active recovery.',
    },
    {
      icon: Zap,
      label: 'STAY CONSISTENT',
      description: 'Uncompromising daily execution tracking across all 75 days.',
    },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-bg-base text-text-primary flex flex-col justify-between overflow-x-hidden selection:bg-[#1A382B] selection:text-white relative">
      {/* Subtle architectural daylight ambient glow */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(206,240,36,0.12),transparent_70%)] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* ------------------------------------------------------------------ */}
      {/* CONTAINER                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-5 sm:py-7 flex-1 flex flex-col justify-between">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between pb-6">
          <TempoBrandmark size="md" variant="lime" />

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-text-primary hover:text-black transition-all px-5 py-2 rounded-full border border-border-subtle bg-surface-base hover:bg-surface-subtle shadow-sm touch-manipulation focus:outline-none focus:ring-2 focus:ring-accent"
          >
            LOG IN
          </button>
        </header>

        {/* Main Body: Desktop 2-Column Split / Mobile Vertical Flow */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-6 sm:py-10">
          {/* LEFT COLUMN: Editorial Presentation & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-20">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-text-primary">
              <span className="w-2 h-2 rounded-full bg-text-primary" aria-hidden="true" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">
                THE 75-DAY TRANSFORMATION PROTOCOL
              </span>
            </div>

            {/* Display Headline */}
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight text-text-primary leading-[0.95]">
                STRUCTURED PROGRESSION. <br />
                <span className="text-text-secondary tracking-tight">
                  EVERY SINGLE DAY.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed pt-2 font-normal">
                A structured 75-day system for training, nutrition, recovery and progress. Built with conservative overload math, deterministic workouts, and zero fluff.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="h-13 px-8 rounded-full bg-[#1A382B] hover:bg-[#234A39] active:bg-[#142C22] active:scale-[0.99] text-white font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-sm transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#1A382B] cursor-pointer"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="h-13 px-7 rounded-full border border-border-subtle bg-surface-base hover:bg-surface-subtle active:bg-border-subtle/30 text-text-primary font-bold text-sm tracking-wider uppercase transition-all shadow-sm touch-manipulation focus:outline-none focus:ring-2 focus:ring-text-primary/20"
              >
                LOG IN
              </button>
            </div>

            {/* 4 Feature Pillars Grid */}
            <div className="pt-8 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featurePillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.label} className="space-y-2">
                    <div className="w-8 h-8 rounded-full bg-surface-subtle border border-border-subtle flex items-center justify-center text-text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-wider uppercase text-text-primary font-mono">
                        {pillar.label}
                      </div>
                      <p className="text-[11px] text-text-tertiary mt-1 leading-snug line-clamp-2">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Architectural Live Telemetry Card (Pure Code / Zero Image Assets) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-border-subtle bg-surface-base p-6 sm:p-7 shadow-floating space-y-6 relative overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-border-subtle/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-accent/25 border border-accent/40 flex items-center justify-center text-text-primary">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                      PROTOCOL STATUS
                    </div>
                    <div className="text-sm font-black text-text-primary font-mono">
                      DAY 01 OF 75
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>ACTIVE</span>
                </div>
              </div>

              {/* Progressive Overload Telemetry Preview */}
              <div className="space-y-3 p-4 rounded-2xl bg-surface-subtle/60 border border-border-subtle/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-text-secondary">
                    Primary Compound Lift
                  </span>
                  <span className="font-mono text-[11px] font-bold text-text-primary flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                    PROGRESSION
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <div className="text-xl font-black text-text-primary tracking-tight">
                      Barbell Back Squat
                    </div>
                    <div className="text-xs text-text-tertiary mt-0.5">
                      3 sets × 8–12 reps target zone
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold font-mono text-text-primary tabular-nums">
                      82.5 <span className="text-xs font-normal text-text-tertiary">kg</span>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-700 font-bold">
                      +2.5 kg next session
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Floor Targets Preview */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-surface-subtle/40 border border-border-subtle/60 space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-tertiary">
                    DAILY STEPS
                  </div>
                  <div className="text-sm font-bold font-mono text-text-primary">
                    8,000 / day
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-subtle/40 border border-border-subtle/60 space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-tertiary">
                    SLEEP FLOOR
                  </div>
                  <div className="text-sm font-bold font-mono text-text-primary">
                    8.0 hrs / night
                  </div>
                </div>
              </div>

              {/* Daily Checklist Pill */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-accent/15 border border-accent/30 text-text-primary text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-text-primary" />
                  <span className="font-bold">System Accountability</span>
                </div>
                <span className="font-mono text-[11px] font-semibold text-text-secondary">
                  Continuous Logging
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Ticker */}
        <footer className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-text-tertiary">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-text-primary" />
              <div className="w-6 h-0.5 bg-accent" />
            </div>
            <span className="font-bold tracking-wider text-text-secondary">
              75-DAY PROTOCOL LIFECYCLE
            </span>
          </div>

          <div className="flex items-center gap-2 tracking-widest text-[11px] text-text-secondary font-bold">
            <span>TRAIN</span>
            <span>•</span>
            <span>PROGRESS</span>
            <span>•</span>
            <span>RECOVER</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
