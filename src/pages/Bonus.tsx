import { useMemo, useState } from "react";
import { WeeklyCountdown } from "../components/WeeklyCountdown";
import { useVault } from "../context/VaultContext";

export function Bonus() {
  const {
    bonus,
    claimWelcome,
    claimDaily,
    claimWeekly,
    redeemCode,
  } = useVault();
  const [code, setCode] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const dailyReady = useMemo(() => {
    if (!bonus.dailyAt) return true;
    return Date.now() - bonus.dailyAt >= 24 * 60 * 60 * 1000;
  }, [bonus.dailyAt]);

  const weeklyReady = useMemo(() => {
    if (!bonus.weeklyAt) return true;
    return Date.now() - bonus.weeklyAt >= 7 * 24 * 60 * 60 * 1000;
  }, [bonus.weeklyAt]);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }

  function onWelcome() {
    flash(claimWelcome() ? "+1,500 welcome coins" : "Welcome pack already claimed");
  }

  function onDaily() {
    flash(claimDaily() ? "+250 daily coins" : "Come back tomorrow");
  }

  function onWeekly() {
    flash(claimWeekly() ? "+1,000 weekly coins" : "Weekly pack already claimed");
  }

  function onRedeem() {
    const res = redeemCode(code);
    flash(res.message);
    if (res.ok) setCode("");
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Bonus</h1>
          <p className="lede">
            Claim packs and promo codes. Aligns with the same 7-day weekly clock used by Diceblox
            and Rustmagic.
          </p>
        </div>
        <WeeklyCountdown />
      </header>

      <div className="bonus-grid">
        <article className="bonus-tile">
          <h3>Welcome pack</h3>
          <p>One-time vault starter for new sessions. Claim once per browser profile.</p>
          <div className="bonus-reward">+1,500</div>
          {bonus.welcome ? (
            <span className="claim-status">Claimed</span>
          ) : (
            <button className="btn btn-primary btn-sm" type="button" onClick={onWelcome}>
              Claim
            </button>
          )}
        </article>

        <article className="bonus-tile">
          <h3>Daily drop</h3>
          <p>Light coin drip every 24 hours. Keeps the vault warm between weekly resets.</p>
          <div className="bonus-reward">+250</div>
          {dailyReady ? (
            <button className="btn btn-primary btn-sm" type="button" onClick={onDaily}>
              Claim
            </button>
          ) : (
            <span className="claim-status">Available again in 24h</span>
          )}
        </article>

        <article className="bonus-tile">
          <h3>Weekly vault</h3>
          <p>Big pack that tracks the 7-day cycle — same rhythm as Diceblox &amp; Rustmagic.</p>
          <div className="bonus-reward">+1,000</div>
          {weeklyReady ? (
            <button className="btn btn-teal btn-sm" type="button" onClick={onWeekly}>
              Claim
            </button>
          ) : (
            <span className="claim-status">Locked until next weekly reset</span>
          )}
        </article>
      </div>

      <section className="panel" style={{ marginTop: "1.25rem" }}>
        <h2>Promo code</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          Try <strong style={{ color: "var(--amber-hot)" }}>VAULTIX</strong>,{" "}
          <strong style={{ color: "var(--amber-hot)" }}>WEEKLY7</strong>, or{" "}
          <strong style={{ color: "var(--amber-hot)" }}>FORGE</strong>.
        </p>
        <div className="code-row">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            aria-label="Promo code"
            onKeyDown={(e) => {
              if (e.key === "Enter") onRedeem();
            }}
          />
          <button className="btn btn-ghost" type="button" onClick={onRedeem}>
            Redeem
          </button>
        </div>
      </section>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
