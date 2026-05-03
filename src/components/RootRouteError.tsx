import { useLayoutEffect, useState } from 'react';
import { useRouteError } from 'react-router-dom';
import {
  isProbablyStaleChunkError,
  STALE_CHUNK_RELOAD_KEY,
  tryReloadOnceForStaleChunks,
} from '../lib/staleChunkRecovery.ts';

type Mode = 'pending' | 'stale-manual' | 'generic';

/**
 * Root route error UI: after a deploy, lazy chunks can 404 while an old main bundle is still
 * cached; recover with one automatic reload, then offer a manual retry.
 */
export function RootRouteError() {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : String(error);
  const [mode, setMode] = useState<Mode>('pending');

  useLayoutEffect(() => {
    if (!isProbablyStaleChunkError(message)) {
      setMode('generic');
      return;
    }
    if (!tryReloadOnceForStaleChunks()) {
      setMode('stale-manual');
    }
  }, [message]);

  if (mode === 'generic') {
    return (
      <div className="flex min-h-[50dvh] flex-col items-center justify-center gap-4 bg-white px-6 text-center dark:bg-zinc-950">
        <h1 className="text-lg font-semibold text-npf-charcoal dark:text-zinc-100">Something went wrong</h1>
        <p className="max-w-md text-sm text-npf-muted dark:text-zinc-400">{message}</p>
        <button
          type="button"
          className="rounded-lg bg-npf-red px-4 py-2 text-sm font-semibold text-white hover:bg-npf-red-dark"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      </div>
    );
  }

  if (mode === 'stale-manual') {
    return (
      <div className="flex min-h-[50dvh] flex-col items-center justify-center gap-4 bg-white px-6 text-center dark:bg-zinc-950">
        <h1 className="text-lg font-semibold text-npf-charcoal dark:text-zinc-100">Update didn’t load</h1>
        <p className="max-w-md text-sm text-npf-muted dark:text-zinc-400">
          This usually clears with a fresh reload after the site was redeployed.
        </p>
        <button
          type="button"
          className="rounded-lg bg-npf-red px-4 py-2 text-sm font-semibold text-white hover:bg-npf-red-dark"
          onClick={() => {
            try {
              sessionStorage.removeItem(STALE_CHUNK_RELOAD_KEY);
            } catch {
              /* ignore */
            }
            window.location.reload();
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50dvh] items-center justify-center bg-white text-sm text-npf-muted dark:bg-zinc-950 dark:text-zinc-400">
      Loading latest version…
    </div>
  );
}
