import { useEffect, useState } from "react";
import { formatCountdown, getWeeklyCycleBounds } from "../utils/weekly";

export function useWeeklyCountdown() {
  const [tick, setTick] = useState(() => getWeeklyCycleBounds());

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick(getWeeklyCycleBounds());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return {
    ...tick,
    parts: formatCountdown(tick.remainingMs),
  };
}
