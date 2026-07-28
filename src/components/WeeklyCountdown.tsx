import { pad2 } from "../utils/weekly";
import { useWeeklyCountdown } from "../hooks/useWeeklyCountdown";

type Props = {
  accent?: "amber" | "teal";
};

export function WeeklyCountdown({ accent = "amber" }: Props) {
  const { parts } = useWeeklyCountdown();

  return (
    <div className={`countdown ${accent === "teal" ? "teal" : ""}`} aria-live="polite">
      <span className="countdown-label">Weekly reset</span>
      <div className="countdown-digits">
        <div className="countdown-unit">
          <span>{parts.days}</span>
          <small>d</small>
        </div>
        <span>:</span>
        <div className="countdown-unit">
          <span>{pad2(parts.hours)}</span>
          <small>h</small>
        </div>
        <span>:</span>
        <div className="countdown-unit">
          <span>{pad2(parts.minutes)}</span>
          <small>m</small>
        </div>
        <span>:</span>
        <div className="countdown-unit">
          <span>{pad2(parts.seconds)}</span>
          <small>s</small>
        </div>
      </div>
    </div>
  );
}
