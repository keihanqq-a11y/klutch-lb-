import { NavLink, Outlet } from "react-router-dom";
import { useVault } from "../context/VaultContext";
import { formatCoins } from "../utils/weekly";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/diceblox", label: "Diceblox" },
  { to: "/rustmagic", label: "Rustmagic" },
  { to: "/bonus", label: "Bonus" },
];

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#141820" />
      <path d="M18 28h28v20H18V28z" stroke="#f0a020" strokeWidth="3" fill="#0c0e12" />
      <path
        d="M24 28v-6a8 8 0 0116 0v6"
        stroke="#2dd4bf"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="32" cy="38" r="3.5" fill="#f0a020" />
    </svg>
  );
}

export function Layout() {
  const { balance } = useVault();

  return (
    <div className="app-shell">
      <header className="nav">
        <NavLink to="/" className="brand" aria-label="Vaultix home">
          <BrandMark />
          <span>Vaultix</span>
        </NavLink>

        <nav className="nav-links" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-balance">
          <div className="balance-pill">
            <span className="label">Coins</span>
            <span className="value">{formatCoins(balance)}</span>
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <strong>Vaultix</strong> is a demo for entertainment only — no real-money wagering.
        Diceblox &amp; Rustmagic cycles reset every 7 days.
      </footer>

      <nav className="mobile-nav" aria-label="Mobile">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
