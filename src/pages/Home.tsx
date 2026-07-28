import { Link } from "react-router-dom";
import { WeeklyCountdown } from "../components/WeeklyCountdown";

export function Home() {
  return (
    <>
      <section className="hero">
        <p className="hero-brand">Vaultix</p>
        <h1>Two vault modes. One weekly cycle. Open, roll, reset.</h1>
        <div className="hero-cta">
          <Link to="/diceblox" className="btn btn-primary">
            Play Diceblox
          </Link>
          <Link to="/rustmagic" className="btn btn-teal">
            Open Rustmagic
          </Link>
          <Link to="/bonus" className="btn btn-ghost">
            Bonus vault
          </Link>
        </div>
        <p className="demo-note">Demo coins only — not a real casino.</p>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Modes this week</h2>
            <p>Stake and Roulo are out. Only Diceblox and Rustmagic run — both end every 7 days.</p>
          </div>
          <WeeklyCountdown />
        </div>

        <div className="mode-grid">
          <Link to="/diceblox" className="mode-tile diceblox">
            <span className="tag">Dice mode</span>
            <h3>Diceblox</h3>
            <p>
              Set a target, roll the cube, bank the multiplier. Fresh leaderboard energy every
              weekly reset.
            </p>
            <div className="meta">
              <span>7-day cycle</span>
              <span>Enter →</span>
            </div>
          </Link>

          <Link to="/rustmagic" className="mode-tile rustmagic">
            <span className="tag">Crate mode</span>
            <h3>Rustmagic</h3>
            <p>
              Crack forge crates for skins and coin bursts. Same weekly clock as Diceblox — when
              it hits zero, the cycle rolls over.
            </p>
            <div className="meta">
              <span>7-day cycle</span>
              <span>Enter →</span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
