/**
 * Flexi App IndexedDB Key-Value Store
 * Drop-in async replacement for localStorage for larger data (questions, exam state, etc.)
 * API: IDB.getItem(key), IDB.setItem(key, value), IDB.removeItem(key)
 * Values are stored as-is (strings recommended for compatibility with previous localStorage usage).
 */
const IDB = (() => {
  const DB_NAME = 'FlexiAppDB';
  const STORE_NAME = 'kv';
  const DB_VERSION = 1;
  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => {
        console.error('IndexedDB open failed:', e.target.error);
        reject(e.target.error);
      };
    });
    return dbPromise;
  }

  async function getItem(key) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          const val = req.result;
          resolve(val !== undefined ? val : null);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('IDB.getItem error:', e);
      // Fallback to localStorage for resilience
      try { return localStorage.getItem(key); } catch (_) { return null; }
    }
  }

  async function setItem(key, value) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('IDB.setItem error:', e);
      try { localStorage.setItem(key, value); } catch (_) {}
    }
  }

  async function removeItem(key) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('IDB.removeItem error:', e);
      try { localStorage.removeItem(key); } catch (_) {}
    }
  }

  /**
   * One-time migration of existing localStorage keys into IndexedDB.
   * Safe to call on every page load; it only runs once.
   */
  async function migrateFromLocalStorage() {
    try {
      const already = await getItem('__migrated_from_ls__');
      if (already === '1') return;
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }
      for (const key of keys) {
        if (!key) continue;
        try {
          const val = localStorage.getItem(key);
          if (val !== null) await setItem(key, val);
        } catch (e) {
          console.warn('Migration skip for', key, e);
        }
      }
      await setItem('__migrated_from_ls__', '1');
      console.log('✅ Migrated localStorage → IndexedDB');
    } catch (e) {
      console.warn('Migration failed (non-fatal):', e);
    }
  }

  // Kick off migration early (non-blocking)
  if (typeof indexedDB !== 'undefined') {
    migrateFromLocalStorage().catch(() => {});
  }

  return {
    getItem,
    setItem,
    removeItem,
    migrateFromLocalStorage,
    openDB
  };
})();
