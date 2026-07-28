import { useState } from "react";
import { WeeklyCountdown } from "../components/WeeklyCountdown";
import { useVault } from "../context/VaultContext";
import { formatCoins } from "../utils/weekly";

const BETS = [50, 100, 250, 500, 1000];

function rollDie(): number {
  return 1 + Math.floor(Math.random() * 6);
}

function multiplierForTarget(target: number): number {
  // Higher target = rarer roll-over = higher payout
  const chance = (7 - target) / 6;
  return Math.max(1.2, Math.round((0.96 / chance) * 100) / 100);
}

export function DiceBlox() {
  const { balance, debit, credit, addHistory, history } = useVault();
  const [bet, setBet] = useState(100);
  const [target, setTarget] = useState(4);
  const [face, setFace] = useState(4);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<{ win: boolean; text: string } | null>(null);

  const mult = multiplierForTarget(target);
  const modeHistory = history.filter((h) => h.mode === "diceblox");

  async function play() {
    if (rolling) return;
    if (bet > balance) {
      setResult({ win: false, text: "Not enough coins." });
      return;
    }
    if (!debit(bet)) {
      setResult({ win: false, text: "Not enough coins." });
      return;
    }

    setRolling(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 900));
    const rolled = rollDie();
    setFace(rolled);
    setRolling(false);

    const win = rolled >= target;
    if (win) {
      const payout = Math.floor(bet * mult);
      credit(payout);
      addHistory({
        mode: "diceblox",
        label: `Rolled ${rolled} ≥ ${target}`,
        delta: payout - bet,
      });
      setResult({ win: true, text: `Hit ${rolled}! +${formatCoins(payout)} coins` });
    } else {
      addHistory({
        mode: "diceblox",
        label: `Rolled ${rolled} < ${target}`,
        delta: -bet,
      });
      setResult({ win: false, text: `Missed with ${rolled}. −${formatCoins(bet)}` });
    }
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Diceblox</h1>
          <p className="lede">
            Pick a target face. Roll equal or higher to cash the multiplier. Cycle ends in 7 days.
          </p>
        </div>
        <WeeklyCountdown accent="amber" />
      </header>

      <div className="game-layout">
        <div className="panel">
          <h2>Roll stage</h2>
          <div className="stage">
            <div className="dice-wrap">
              <div className={`dice${rolling ? " rolling" : ""}`} aria-live="polite">
                <div className="die-face">{face}</div>
              </div>
            </div>
          </div>

          <div className="target-meter">
            <span>
              Win if roll ≥ <strong>{target}</strong>
            </span>
            <span className="multiplier">{mult.toFixed(2)}×</span>
          </div>

          <div className="controls">
            <div className="field">
              <label htmlFor="bet">Bet</label>
              <input
                id="bet"
                type="number"
                min={10}
                max={balance}
                value={bet}
                onChange={(e) => setBet(Math.max(10, Number(e.target.value) || 0))}
              />
            </div>
            <div className="field">
              <label htmlFor="target">Target</label>
              <select
                id="target"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
              >
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    ≥ {n}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" type="button" disabled={rolling} onClick={play}>
              {rolling ? "Rolling…" : "Roll"}
            </button>
          </div>

          <div className="chip-row" style={{ marginTop: "0.85rem" }}>
            {BETS.map((b) => (
              <button
                key={b}
                type="button"
                className={`chip${bet === b ? " active" : ""}`}
                onClick={() => setBet(b)}
              >
                {b}
              </button>
            ))}
          </div>

          {result && (
            <div className={`result-banner ${result.win ? "win" : "lose"}`}>{result.text}</div>
          )}
        </div>

        <div className="panel">
          <h2>Recent rolls</h2>
          {modeHistory.length === 0 ? (
            <p className="empty-state">No rolls yet this session.</p>
          ) : (
            <ul className="history-list">
              {modeHistory.map((h) => (
                <li key={h.id}>
                  <span>{h.label}</span>
                  <span className={h.delta >= 0 ? "win" : "lose"}>
                    {h.delta >= 0 ? "+" : ""}
                    {formatCoins(h.delta)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
