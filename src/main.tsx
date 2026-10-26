import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from '@/app/App';
import '@/styles/index.css';

// Register service worker with active workout session update protection
const updateSW = registerSW({
  onNeedRefresh() {
    // Check if user is in an active workout session
    const activeSessionId = localStorage.getItem('tempo:active-workout-session:v1');
    if (!activeSessionId) {
      // Safe to activate update when no workout is running
      void updateSW(true);
    } else {
      console.log('[PWA] Service worker update deferred during active workout session.');
      // Defer update until active session is completed or dismissed
      const handleStorageChange = (e: Event) => {
        const customEvent = e as CustomEvent<{ key?: string }>;
        if (customEvent.detail?.key === 'tempo:active-workout-session:v1' || customEvent.detail?.key === '*') {
          const current = localStorage.getItem('tempo:active-workout-session:v1');
          if (!current) {
            window.removeEventListener('tempo-storage-change', handleStorageChange);
            void updateSW(true);
          }
        }
      };
      window.addEventListener('tempo-storage-change', handleStorageChange);
    }
  },
  onOfflineReady() {
    console.log('[PWA] TEMPO 75 application shell cached and ready to work fully offline.');
    window.dispatchEvent(new CustomEvent('tempo-offline-ready'));
  },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element in index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
