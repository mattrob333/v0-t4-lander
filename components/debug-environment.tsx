'use client';

import { useEffect, useState } from 'react';

export function DebugEnvironment() {
  const [environment, setEnvironment] = useState({
    isClient: false,
    isDevelopment: false,
    userAgent: '',
    viewport: { width: 0, height: 0 },
    errors: [] as string[]
  });

  useEffect(() => {
    // Check if we're in development mode safely
    const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    
    setEnvironment({
      isClient: true,
      isDevelopment: isDev,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      errors: []
    });

    // Only add error listener in development
    if (isDev) {
      const handleError = (event: ErrorEvent) => {
        setEnvironment(prev => ({
          ...prev,
          errors: [...prev.errors, event.error?.message || 'Unknown error']
        }));
      };

      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    }
  }, []);

  // Don't render anything if not client-side or not in development
  if (!environment.isClient || !environment.isDevelopment) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-yellow-100 border border-yellow-400 rounded p-4 max-w-sm text-xs">
      <h3 className="font-bold mb-2">🔧 Debug Info</h3>
      <div className="space-y-1">
        <div><strong>Environment:</strong> Development</div>
        <div><strong>Viewport:</strong> {environment.viewport.width}x{environment.viewport.height}</div>
        <div><strong>Errors:</strong> {environment.errors.length}</div>
        {environment.errors.length > 0 && (
          <div className="mt-2">
            <strong>Recent Errors:</strong>
            <ul className="list-disc list-inside mt-1">
              {environment.errors.slice(-3).map((error, i) => (
                <li key={i} className="text-red-600">{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
