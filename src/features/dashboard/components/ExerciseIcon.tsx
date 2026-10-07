import React from 'react';

interface ExerciseIconProps {
  name: string;
  className?: string;
}

export const ExerciseIcon: React.FC<ExerciseIconProps> = ({ name, className = 'w-7 h-7' }) => {
  const normalized = name.toLowerCase();

  // Bench press (Barbell / Dumbbell)
  if (normalized.includes('bench') || normalized.includes('flat') || normalized.includes('incline')) {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        {/* Bench base & uprights */}
        <path d="M4 24h24v2H4z" opacity="0.2" />
        <path d="M7 16v8h2v-8H7zm16 0v8h2v-8h-2z" />
        {/* Bench pad */}
        <rect x="6" y="15" width="20" height="3" rx="1" />
        {/* Athlete head & torso on bench */}
        <circle cx="10" cy="12" r="2" />
        <path d="M12 14h8v2h-8z" />
        {/* Arms holding barbell / dumbbells overhead */}
        <path d="M15 14v-4h2v4h-2zm-3-4h8v2h-8z" />
        {/* Barbell bar and plates */}
        <rect x="5" y="7" width="22" height="2" rx="1" />
        <rect x="5" y="5" width="2" height="6" rx="1" />
        <rect x="25" y="5" width="2" height="6" rx="1" />
      </svg>
    );
  }

  // Overhead press / Shoulder press
  if (normalized.includes('overhead') || normalized.includes('ohp') || normalized.includes('shoulder press')) {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        {/* Seat / bench */}
        <path d="M10 24h12v2H10z" opacity="0.2" />
        <path d="M11 18v6h2v-6h-2zm8 0v6h2v-6h-2z" />
        <rect x="10" y="17" width="12" height="3" rx="1" />
        <rect x="10" y="12" width="3" height="8" rx="1" />
        {/* Athlete head & seated body */}
        <circle cx="16" cy="11" r="2" />
        <path d="M14 14h4v4h-4z" />
        {/* Arms pressing up */}
        <path d="M13 14l-2-4h2l1 4zm5 0l2-4h-2l-1 4z" />
        {/* Barbell overhead */}
        <rect x="6" y="5" width="20" height="2" rx="1" />
        <rect x="6" y="3" width="2" height="6" rx="1" />
        <rect x="24" y="3" width="2" height="6" rx="1" />
      </svg>
    );
  }

  // Lateral raise
  if (normalized.includes('lateral') || normalized.includes('raise')) {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        {/* Floor */}
        <path d="M6 26h20v2H6z" opacity="0.2" />
        {/* Athlete standing */}
        <circle cx="16" cy="7" r="2" />
        <path d="M14 10h4v8h-4z" />
        <path d="M14 18l-1 8h2l1-7 1 7h2l-1-8h-4z" />
        {/* Arms raised out laterally */}
        <path d="M14 11L7 11v2l7-1zm4 0l7 0v2l-7-1z" />
        {/* Dumbbells at hands */}
        <rect x="5" y="9" width="3" height="6" rx="1" />
        <rect x="24" y="9" width="3" height="6" rx="1" />
      </svg>
    );
  }

  // Cable fly / Fly
  if (normalized.includes('fly') || normalized.includes('pec deck')) {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        {/* Dual cable towers */}
        <path d="M4 4h3v24H4zM25 4h3v24h-3z" opacity="0.25" />
        {/* Pulleys */}
        <circle cx="5.5" cy="9" r="1.5" />
        <circle cx="26.5" cy="9" r="1.5" />
        {/* Athlete center */}
        <circle cx="16" cy="9" r="2" />
        <path d="M14 12h4v8h-4z" />
        <path d="M13 20l2 6h2l-1-6zm4 0l-1 6h2l1-6z" />
        {/* Cables converging to athlete hands */}
        <path d="M5.5 9L12 14v1.5L5.5 10zM26.5 9L20 14v1.5L26.5 10z" opacity="0.5" />
        {/* Handles in hands */}
        <circle cx="13" cy="15" r="1.5" />
        <circle cx="19" cy="15" r="1.5" />
      </svg>
    );
  }

  // Triceps Pushdown / Cable
  if (normalized.includes('pushdown') || normalized.includes('pulldown') || normalized.includes('cable')) {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        {/* Cable tower & high pulley */}
        <path d="M8 4h16v2H8zM8 4v24h2V6h14v22h2V4z" opacity="0.2" />
        <circle cx="16" cy="7" r="2" />
        {/* Cable line down */}
        <path d="M16 8v6h-1v-6h1z" />
        {/* Athlete standing */}
        <circle cx="19" cy="12" r="2" />
        <path d="M18 15h3v7h-3z" />
        <path d="M18 22l-1 6h2l1-6zm3 0l-1 6h2l1-6z" />
        {/* Arms pushing down on bar/rope */}
        <path d="M18 16l-3 2v2l3-1.5z" />
        <rect x="13" y="19" width="4" height="2" rx="1" />
      </svg>
    );
  }

  // Overhead triceps extension / Extension
  if (normalized.includes('extension') || normalized.includes('skull crusher')) {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        {/* Athlete seated */}
        <path d="M10 24h12v2H10z" opacity="0.2" />
        <rect x="11" y="16" width="10" height="3" rx="1" />
        <rect x="11" y="11" width="2.5" height="8" rx="1" />
        {/* Athlete */}
        <circle cx="15" cy="10" r="2" />
        <path d="M13 13h4v5h-4z" />
        {/* Elbows high, hands behind head extending weight */}
        <path d="M14 13l-1-5 2-1 1 5zm2 0l1-5 2 1-1 5z" />
        {/* Weight behind head */}
        <rect x="13" y="6" width="4" height="3" rx="1" />
      </svg>
    );
  }

  // Squat / Leg Press / Lower Body
  if (normalized.includes('squat') || normalized.includes('leg') || normalized.includes('lunge') || normalized.includes('deadlift')) {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M6 26h20v2H6z" opacity="0.2" />
        {/* Athlete squatting */}
        <circle cx="16" cy="7" r="2" />
        <path d="M14 10h4v6h-4z" />
        {/* Squatting legs angle */}
        <path d="M14 16l-4 3 2 4 4-4zm4 0l4 3-2 4-4-4z" />
        {/* Barbell on traps */}
        <rect x="5" y="8" width="22" height="2" rx="1" />
        <rect x="5" y="6" width="2" height="6" rx="1" />
        <rect x="25" y="6" width="2" height="6" rx="1" />
      </svg>
    );
  }

  // Generic Dumbbell / Athletic silhouette
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <circle cx="16" cy="8" r="2.5" />
      <path d="M14 12h4v7h-4z" />
      <path d="M13 19l-1 7h2.5l1-6 1 6H19l-1-7h-5z" />
      {/* Dumbbells in hands */}
      <rect x="8" y="14" width="3" height="5" rx="1" />
      <rect x="21" y="14" width="3" height="5" rx="1" />
    </svg>
  );
};
