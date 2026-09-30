import { describe, expect, it, vi } from 'vitest';
import {
  VITE_PRELOAD_RELOAD_FLAG_VALUE,
  VITE_PRELOAD_RELOAD_SESSION_KEY,
} from '../constants/chunkReload.constants.js';
import {
  clearStaleChunkReloadFlag,
  consumeStaleChunkReload,
  handleVitePreloadError,
  importOrReload,
} from './staleChunkReload.js';

function createMemoryStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem(key) {
      return Object.hasOwn(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = value;
    },
    removeItem(key) {
      delete store[key];
    },
  };
}

describe('consumeStaleChunkReload', () => {
  it('allows the first reload and blocks the second', () => {
    const storage = createMemoryStorage();
    expect(consumeStaleChunkReload(storage)).toBe(true);
    expect(consumeStaleChunkReload(storage)).toBe(false);
    expect(storage.getItem(VITE_PRELOAD_RELOAD_SESSION_KEY)).toBe(VITE_PRELOAD_RELOAD_FLAG_VALUE);
  });
});

describe('handleVitePreloadError', () => {
  it('prevents default and reloads when the flag is unset', () => {
    const storage = createMemoryStorage();
    const reload = vi.fn();
    const event = { preventDefault: vi.fn() };
    handleVitePreloadError(event, { reload, storage });
    expect(event.preventDefault).toHaveBeenCalled();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload twice in the same session', () => {
    const storage = createMemoryStorage();
    const reload = vi.fn();
    const event = { preventDefault: vi.fn() };
    handleVitePreloadError(event, { reload, storage });
    handleVitePreloadError(event, { reload, storage });
    expect(reload).toHaveBeenCalledTimes(1);
  });
});

describe('importOrReload', () => {
  it('returns the module when the import succeeds', async () => {
    const expectedModule = { default: function Page() {} };
    const actualModule = await importOrReload(() => Promise.resolve(expectedModule));
    expect(actualModule).toBe(expectedModule);
  });

  it('reloads once when the import fails', async () => {
    const storage = createMemoryStorage();
    const reload = vi.fn();
    void importOrReload(() => Promise.reject(new Error('chunk')), { reload, storage });
    await vi.waitFor(() => {
      expect(reload).toHaveBeenCalledTimes(1);
    });
  });

  it('rethrows when a reload was already consumed', async () => {
    const storage = createMemoryStorage();
    consumeStaleChunkReload(storage);
    await expect(
      importOrReload(() => Promise.reject(new Error('chunk')), { reload: vi.fn(), storage }),
    ).rejects.toThrow('chunk');
  });
});

describe('clearStaleChunkReloadFlag', () => {
  it('allows a later deploy in the same tab to reload again', () => {
    const storage = createMemoryStorage();
    consumeStaleChunkReload(storage);
    clearStaleChunkReloadFlag(storage);
    expect(consumeStaleChunkReload(storage)).toBe(true);
  });
});
