'use client';

import { useEffect, useState } from 'react';

interface DebugHydrationProps {
  children: React.ReactNode;
  name?: string;
}

export function DebugHydration({ children, name = 'Component' }: DebugHydrationProps) {
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('MutationObserver')) {
        console.warn(`Hydration issue detected in ${name}:`, event.error);
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [name]);

  if (hasError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md">
        <p className="text-red-800 dark:text-red-200">
          Hydration error detected in {name}. Please refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className={isClient ? 'client-rendered' : 'server-rendered'}>
      {children}
    </div>
  );
}
