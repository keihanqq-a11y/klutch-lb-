# Vaultix

Demo gambling-style UI with **Diceblox** and **Rustmagic** modes, a **Bonus** tab, and shared **7-day weekly resets**. Stake and Roulo are not included.

## Run (Windows)

1. Download the repo again (main now includes the full site), unzip it.
2. Open **Command Prompt** in that folder. You must see `package.json` there:
   ```bat
   dir package.json
   ```
   If that fails, you are in the wrong folder — `cd` into the unzipped project root first.
3. Install and start:
   ```bat
   npm install
   npm run dev
   ```
4. Open the local URL Vite prints (usually `http://localhost:5173`).

## Notes

- Demo coins only — not real-money gambling.
- Promo codes: `VAULTIX`, `WEEKLY7`, `FORGE`.
- Requires [Node.js](https://nodejs.org/) (LTS) installed.
