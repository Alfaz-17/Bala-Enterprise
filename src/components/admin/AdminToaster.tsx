'use client';

import { Toaster } from 'react-hot-toast';

export function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1A1A18',
          color: '#FFFFFF',
          borderRadius: '0px',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#D85A30',
            secondary: '#FFFFFF',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
}
