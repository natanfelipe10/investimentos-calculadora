import React, { useState, useEffect, useRef } from "react";
import {
  Calculator,
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { CompoundInterestCalculator } from "./components/CompoundInterestCalculator";
import { EmergencyCalculator } from "./components/EmergencyCalculator";
import { CalculatorsDirectory, CalculatorTab } from "./components/CalculatorsDirectory";

type ActiveTab = CalculatorTab;

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>("juros-compostos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#reserva-de-emergencia") {
        setActiveTab("reserva-emergencia");
      } else {
        setActiveTab("juros-compostos");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Close mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab === "reserva-emergencia") {
      window.location.hash = "#reserva-de-emergencia";
    } else {
      window.location.hash = "#juros-compostos";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#EEF1F5] text-[#202B38] antialiased">
      {/* CABEÇALHO INSTITUCIONAL GRAFITE */}
      <header className="bg-[#202B38] sticky top-0 z-30 border-b border-[#2D3948]">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
          
          {/* Marca / Identidade */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-base tracking-tight uppercase">Natan Carneiro</span>
            <span className="text-[#2D3948]">|</span>
            <span className="text-[#D9DEE7] text-sm font-medium">Simuladores Financeiros</span>
          </div>

          {/* Navegação */}
          <nav className="hidden sm:flex items-center gap-6" aria-label="Navegação">
            <button
              type="button"
              onClick={() => handleTabChange("juros-compostos")}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "juros-compostos"
                  ? "text-[#16804A]"
                  : "text-[#D9DEE7] hover:text-white"
              }`}
            >
              Juros Compostos
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("reserva-emergencia")}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "reserva-emergencia"
                  ? "text-[#16804A]"
                  : "text-[#D9DEE7] hover:text-white"
              }`}
            >
              Reserva de Emergência
            </button>
          </nav>

          {/* Hambúrguer Mobile */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        
        {/* Calculadora Ativa */}
        {activeTab === "juros-compostos" && (
          <CompoundInterestCalculator key="juros-compostos" />
        )}
        {activeTab === "reserva-emergencia" && (
          <EmergencyCalculator key="reserva-emergencia" />
        )}

        {/* Diretório */}
        <CalculatorsDirectory
          activeTab={activeTab}
          onSelectTab={handleTabChange}
        />
      </main>

      {/* Rodapé */}
      <footer className="border-t border-[#D9DEE7] mt-16 py-8 text-center bg-white">
        <p className="text-[11px] text-[#667085]">
          © 2026 Simuladores Financeiros. Conteúdo didático sem fins de recomendação.
        </p>
      </footer>
    </div>
  );

}
