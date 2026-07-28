import { useMemo, useState } from "react";
import { WeeklyCountdown } from "../components/WeeklyCountdown";
import { useVault } from "../context/VaultContext";
import { formatCoins } from "../utils/weekly";

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

type Loot = {
  name: string;
  rarity: Rarity;
  value: number;
  weight: number;
};

const LOOT: Loot[] = [
  { name: "Scrap Cloth", rarity: "common", value: 40, weight: 32 },
  { name: "Iron Pipe", rarity: "common", value: 60, weight: 28 },
  { name: "Teal Shard", rarity: "uncommon", value: 180, weight: 18 },
  { name: "Forge Key", rarity: "uncommon", value: 240, weight: 12 },
  { name: "Blue Ember", rarity: "rare", value: 520, weight: 6 },
  { name: "Void Shell", rarity: "rare", value: 680, weight: 3 },
  { name: "Arc Wand", rarity: "epic", value: 1400, weight: 0.8 },
  { name: "Mythic Crate", rarity: "legendary", value: 4200, weight: 0.2 },
];

const CRATE_COST = 200;

function pickLoot(): Loot {
  const total = LOOT.reduce((s, l) => s + l.weight, 0);
  let r = Math.random() * total;
  for (const item of LOOT) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return LOOT[0];
}

export function RustMagic() {
  const { balance, debit, credit, addHistory, history } = useVault();
  const [opening, setOpening] = useState(false);
  const [loot, setLoot] = useState<Loot | null>(null);
  const [result, setResult] = useState<{ win: boolean; text: string } | null>(null);

  const modeHistory = history.filter((h) => h.mode === "rustmagic");
  const odds = useMemo(
    () =>
      LOOT.map((l) => ({
        ...l,
        pct: ((l.weight / LOOT.reduce((s, x) => s + x.weight, 0)) * 100).toFixed(1),
      })),
    [],
  );

  async function openCrate() {
    if (opening) return;
    if (!debit(CRATE_COST)) {
      setResult({ win: false, text: "Not enough coins for a crate." });
      return;
    }

    setOpening(true);
    setLoot(null);
    setResult(null);

    await new Promise((r) => setTimeout(r, 700));
    const item = pickLoot();
    setLoot(item);
    setOpening(false);

    credit(item.value);
    const delta = item.value - CRATE_COST;
    addHistory({
      mode: "rustmagic",
      label: item.name,
      delta,
    });
    setResult({
      win: delta >= 0,
      text: `${item.name} · ${formatCoins(item.value)} coins (${delta >= 0 ? "+" : ""}${formatCoins(delta)})`,
    });
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Rustmagic</h1>
          <p className="lede">
            Crack forge crates for loot. Same 7-day weekly reset as Diceblox — no Stake, no Roulo.
          </p>
        </div>
        <WeeklyCountdown accent="teal" />
      </header>

      <div className="game-layout">
        <div className="panel">
          <h2>Forge crate</h2>
          <div className="stage rust">
            {loot && !opening ? (
              <div className="loot-reveal">
                <div className={`rarity rarity-${loot.rarity}`}>{loot.rarity}</div>
                <div className="item-name">{loot.name}</div>
                <div className="item-value">{formatCoins(loot.value)} coins</div>
              </div>
            ) : (
              <div className={`crate${opening ? " opening" : ""}`}>
                <div className="crate-body">
                  <span className="crate-glyph">RM</span>
                </div>
              </div>
            )}
          </div>

          <div className="controls">
            <div className="field">
              <label>Crate cost</label>
              <input value={`${CRATE_COST} coins`} readOnly />
            </div>
            <button
              className="btn btn-teal"
              type="button"
              disabled={opening || balance < CRATE_COST}
              onClick={openCrate}
            >
              {opening ? "Opening…" : "Open crate"}
            </button>
          </div>

          {result && (
            <div className={`result-banner ${result.win ? "win" : "lose"}`}>{result.text}</div>
          )}
        </div>

        <div className="panel">
          <h2>Drop table</h2>
          <div className="loot-table" style={{ marginBottom: "1.25rem" }}>
            {odds.map((item) => (
              <div key={item.name} className="loot-cell">
                <div className={`name rarity-${item.rarity}`}>{item.name}</div>
                <div className="odds">
                  {item.pct}% · {formatCoins(item.value)}
                </div>
              </div>
            ))}
          </div>

          <h2>Recent opens</h2>
          {modeHistory.length === 0 ? (
            <p className="empty-state">No crates opened yet.</p>
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
