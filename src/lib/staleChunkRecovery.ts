/** Session flag so we only auto-reload once per tab (avoids loops if a chunk is genuinely missing). */
export const STALE_CHUNK_RELOAD_KEY = 'npf-stale-chunk-reload';

export function isProbablyStaleChunkError(message: string): boolean {
  return /error loading dynamically imported module|dynamically imported module|Loading chunk \d+ failed|ChunkLoadError/i.test(
    message,
  );
}

/** @returns whether a full reload was scheduled */
export function tryReloadOnceForStaleChunks(): boolean {
  try {
    if (sessionStorage.getItem(STALE_CHUNK_RELOAD_KEY)) return false;
    sessionStorage.setItem(STALE_CHUNK_RELOAD_KEY, '1');
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}
