import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/features/auth';
import { OfflineIndicator } from '@/components/ui';
import { router } from './routes';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <OfflineIndicator />
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
