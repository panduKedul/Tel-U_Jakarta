// LAPIS 2 — app: rem brute-force login.
// Kunci akun per-username setelah gagal beruntun, backoff eksponensial.
// Storage injectable agar bisa unit-test di node.

export const MAX_FAILS = 5; // gagal beruntun sebelum kunci
export const BASE_LOCK_MS = 60 * 1000; // kunci awal 60 detik
export const MAX_LOCK_MS = 15 * 60 * 1000; // kunci maks 15 menit
export const KEY_PREFIX = "login-lock:";

const memStore = () => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  };
};

function pickStore(store) {
  if (store) return store;
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch { /* private mode: fallback memori */ }
  return memStore();
}

export function lockKey(user) {
  return KEY_PREFIX + String(user ?? "").trim().toLowerCase();
}

function readState(store, user) {
  try {
    const raw = store.getItem(lockKey(user));
    if (!raw) return { fails: 0, lockedUntil: 0 };
    const s = JSON.parse(raw);
    return { fails: Number(s.fails) || 0, lockedUntil: Number(s.lockedUntil) || 0 };
  } catch {
    return { fails: 0, lockedUntil: 0 };
  }
}

function writeState(store, user, state) {
  try {
    store.setItem(lockKey(user), JSON.stringify(state));
  } catch { /* storage penuh/diblokir: proteksi non-fatal */ }
}

// Dipanggil sebelum kirim kredensial. return { allowed, retryAfterMs }
export function checkLoginAllowed(user, now = Date.now(), store) {
  const st = pickStore(store);
  const s = readState(st, user);
  const wait = s.lockedUntil - now;
  if (wait > 0) return { allowed: false, retryAfterMs: wait };
  return { allowed: true, retryAfterMs: 0, failsLeft: Math.max(0, MAX_FAILS - s.fails) };
}

// Gagal: fails+1. Kena kunci saat capai MAX_FAILS, durasi ganda tiap kunci.
export function recordLoginFailure(user, now = Date.now(), store) {
  const st = pickStore(store);
  const s = readState(st, user);
  s.fails += 1;
  let lockMs = 0;
  if (s.fails >= MAX_FAILS) {
    const locks = s.fails - MAX_FAILS; // 0,1,2,...
    lockMs = Math.min(BASE_LOCK_MS * 2 ** locks, MAX_LOCK_MS);
    s.lockedUntil = now + lockMs;
  }
  writeState(st, user, s);
  return { fails: s.fails, lockMs };
}

// Sukses: reset biar user sah tak kena sisa lockout.
export function recordLoginSuccess(user, store) {
  const st = pickStore(store);
  try {
    st.removeItem(lockKey(user));
  } catch { /* abaikan */ }
}

export function formatWait(ms) {
  const s = Math.ceil(ms / 1000);
  if (s < 60) return `${s} detik`;
  const m = Math.floor(s / 60);
  return `${m} menit ${s % 60} detik`;
}
