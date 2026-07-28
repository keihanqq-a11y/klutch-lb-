const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Fixed epoch so both modes share the same weekly cycle boundary. */
const CYCLE_EPOCH = Date.UTC(2026, 0, 5, 0, 0, 0); // Monday 00:00 UTC

export function getWeeklyCycleBounds(now = Date.now()) {
  const elapsed = now - CYCLE_EPOCH;
  const cycleIndex = Math.floor(elapsed / WEEK_MS);
  const cycleStart = CYCLE_EPOCH + cycleIndex * WEEK_MS;
  const cycleEnd = cycleStart + WEEK_MS;
  return { cycleIndex, cycleStart, cycleEnd, remainingMs: Math.max(0, cycleEnd - now) };
}

export function formatCountdown(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function formatCoins(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
