import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { VaultProvider } from "./context/VaultContext";
import { Bonus } from "./pages/Bonus";
import { DiceBlox } from "./pages/DiceBlox";
import { Home } from "./pages/Home";
import { RustMagic } from "./pages/RustMagic";

export default function App() {
  return (
    <VaultProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="diceblox" element={<DiceBlox />} />
            <Route path="rustmagic" element={<RustMagic />} />
            <Route path="bonus" element={<Bonus />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </VaultProvider>
  );
}
