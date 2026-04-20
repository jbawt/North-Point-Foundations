import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from './theme/ThemeProvider.tsx';
import {
  isProbablyStaleChunkError,
  tryReloadOnceForStaleChunks,
} from './lib/staleChunkRecovery.ts';
import './index.css';

/** Same stale-chunk case as `RootRouteError`, for failures outside the router (e.g. Vite preload). */
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  tryReloadOnceForStaleChunks();
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const message =
    reason instanceof Error ? reason.message : typeof reason === 'string' ? reason : '';
  if (isProbablyStaleChunkError(message)) {
    event.preventDefault();
    tryReloadOnceForStaleChunks();
  }
});

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
