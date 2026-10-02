import { createBrowserRouter, Navigate } from 'react-router-dom';
import { TrendingUp, BarChart3, User } from 'lucide-react';
import { AppShell, RoutePlaceholder } from '@/components/layout';
import { FoundationScreen } from '@/features/foundation/FoundationScreen';
import { OnboardingFlow } from '@/features/onboarding';
import { DashboardScreen } from '@/features/dashboard';
import { WorkoutScreen } from '@/features/workouts';
import { JourneyScreen } from '@/features/journey';
import { WelcomePage, LoginPage, SignupPage, EntryRoute } from '@/features/auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <EntryRoute />,
  },
  {
    path: '/welcome',
    element: <WelcomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: 'onboarding',
        element: <OnboardingFlow />,
      },
      {
        path: 'dashboard',
        element: <DashboardScreen />,
      },
      {
        path: 'workout',
        element: <WorkoutScreen />,
      },
      {
        path: 'journey',
        element: <JourneyScreen />,
      },
      {
        path: 'progress',
        element: (
          <RoutePlaceholder
            moduleName="Body Metrics & Progress"
            icon={<TrendingUp className="w-6 h-6 text-text-primary" />}
            description="Morning weigh-ins, body circumference measurements, and standardized progress photos will appear here."
          />
        ),
      },
      {
        path: 'analytics',
        element: (
          <RoutePlaceholder
            moduleName="System Settings & Analytics"
            icon={<BarChart3 className="w-6 h-6 text-text-primary" />}
            description="Volume per muscle group, strength progression velocity, and local persistence settings."
          />
        ),
      },
      {
        path: 'settings',
        element: (
          <RoutePlaceholder
            moduleName="System Settings"
            icon={<BarChart3 className="w-6 h-6 text-text-primary" />}
            description="Training volume configuration, progression parameters, data backup, and local storage controls."
          />
        ),
      },
      {
        path: 'profile',
        element: (
          <RoutePlaceholder
            moduleName="Athlete Profile"
            icon={<User className="w-6 h-6 text-text-primary" />}
            description="Athlete demographics, preference tokens, local storage backups, and data export."
          />
        ),
      },
      {
        path: 'foundation',
        element: <FoundationScreen />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
