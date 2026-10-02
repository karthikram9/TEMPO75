import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from './PageContainer';
import { useMobileHeader } from '@/hooks';
import { EmptyState, Button } from '@/components/ui';

export interface RoutePlaceholderProps {
  moduleName: string;
  icon: React.ReactNode;
  description: string;
  scheduledModule?: string;
}

export const RoutePlaceholder: React.FC<RoutePlaceholderProps> = ({
  moduleName,
  icon,
  description,
  scheduledModule,
}) => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  // Dynamically set the mobile header for placeholder pages
  useMobileHeader({
    title: moduleName,
    subtitle: scheduledModule,
    showBack: true,
    onBack: handleBack,
  });

  return (
    <PageContainer maxWidth="focused">
      <div className="py-12 sm:py-16">
        <EmptyState
          icon={icon}
          title={moduleName}
          description={description}
          action={
            <div className="flex flex-col items-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/dashboard')}
              >
                Return to Dashboard
              </Button>
            </div>
          }
        />
      </div>
    </PageContainer>
  );
};
