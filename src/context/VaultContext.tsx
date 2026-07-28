import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "vaultix-demo-v1";

type HistoryItem = {
  id: string;
  mode: "diceblox" | "rustmagic";
  label: string;
  delta: number;
  at: number;
};

type BonusClaims = {
  welcome: boolean;
  dailyAt: number | null;
  weeklyAt: number | null;
};

type Store = {
  balance: number;
  history: HistoryItem[];
  bonus: BonusClaims;
};

type VaultContextValue = {
  balance: number;
  history: HistoryItem[];
  bonus: BonusClaims;
  credit: (amount: number) => void;
  debit: (amount: number) => boolean;
  addHistory: (item: Omit<HistoryItem, "id" | "at">) => void;
  claimWelcome: () => boolean;
  claimDaily: () => boolean;
  claimWeekly: () => boolean;
  redeemCode: (code: string) => { ok: boolean; message: string };
};

const DEFAULT: Store = {
  balance: 2500,
  history: [],
  bonus: { welcome: false, dailyAt: null, weeklyAt: null },
};

function load(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function save(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

const VaultContext = createContext<VaultContextValue | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(() =>
    typeof window === "undefined" ? DEFAULT : load(),
  );

  const persist = useCallback((updater: (prev: Store) => Store) => {
    setStore((prev) => {
      const next = updater(prev);
      save(next);
      return next;
    });
  }, []);

  const credit = useCallback(
    (amount: number) => {
      persist((prev) => ({ ...prev, balance: prev.balance + amount }));
    },
    [persist],
  );

  const debit = useCallback(
    (amount: number) => {
      if (store.balance < amount) return false;
      persist((prev) => {
        if (prev.balance < amount) return prev;
        return { ...prev, balance: prev.balance - amount };
      });
      return true;
    },
    [persist, store.balance],
  );

  const addHistory = useCallback(
    (item: Omit<HistoryItem, "id" | "at">) => {
      persist((prev) => ({
        ...prev,
        history: [
          { ...item, id: crypto.randomUUID(), at: Date.now() },
          ...prev.history,
        ].slice(0, 40),
      }));
    },
    [persist],
  );

  const claimWelcome = useCallback(() => {
    let ok = false;
    persist((prev) => {
      if (prev.bonus.welcome) return prev;
      ok = true;
      return {
        ...prev,
        balance: prev.balance + 1500,
        bonus: { ...prev.bonus, welcome: true },
      };
    });
    return ok;
  }, [persist]);

  const claimDaily = useCallback(() => {
    let ok = false;
    persist((prev) => {
      const now = Date.now();
      if (prev.bonus.dailyAt && now - prev.bonus.dailyAt < 24 * 60 * 60 * 1000) {
        return prev;
      }
      ok = true;
      return {
        ...prev,
        balance: prev.balance + 250,
        bonus: { ...prev.bonus, dailyAt: now },
      };
    });
    return ok;
  }, [persist]);

  const claimWeekly = useCallback(() => {
    let ok = false;
    persist((prev) => {
      const now = Date.now();
      if (prev.bonus.weeklyAt && now - prev.bonus.weeklyAt < 7 * 24 * 60 * 60 * 1000) {
        return prev;
      }
      ok = true;
      return {
        ...prev,
        balance: prev.balance + 1000,
        bonus: { ...prev.bonus, weeklyAt: now },
      };
    });
    return ok;
  }, [persist]);

  const redeemCode = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      const codes: Record<string, number> = {
        VAULTIX: 500,
        WEEKLY7: 700,
        FORGE: 300,
      };
      const amount = codes[normalized];
      if (!amount) return { ok: false, message: "Invalid code." };

      const usedKey = `code:${normalized}`;
      const used = localStorage.getItem(usedKey);
      if (used) return { ok: false, message: "Code already redeemed." };

      localStorage.setItem(usedKey, "1");
      credit(amount);
      return { ok: true, message: `+${amount} coins added.` };
    },
    [credit],
  );

  const value = useMemo(
    () => ({
      balance: store.balance,
      history: store.history,
      bonus: store.bonus,
      credit,
      debit,
      addHistory,
      claimWelcome,
      claimDaily,
      claimWeekly,
      redeemCode,
    }),
    [
      store,
      credit,
      debit,
      addHistory,
      claimWelcome,
      claimDaily,
      claimWeekly,
      redeemCode,
    ],
  );

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be used within VaultProvider");
  return ctx;
}
