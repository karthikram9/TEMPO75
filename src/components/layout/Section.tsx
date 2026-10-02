import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  ...props
}) => {
  return (
    <section className={cn('mb-8 sm:mb-10 last:mb-0', className)} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 mb-3.5">
          <div>
            {title && (
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};
