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
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);

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

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        hamburgerBtnRef.current &&
        !hamburgerBtnRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside, { passive: true });
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
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
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2">
            <span className="font-extrabold text-white text-sm sm:text-base tracking-tight uppercase truncate">Natan Carneiro</span>
            <span className="text-[#2D3948] shrink-0">|</span>
            <span className="text-[#D9DEE7] text-xs sm:text-sm font-medium truncate">Simuladores Financeiros</span>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden sm:flex items-center gap-2" aria-label="Navegação Principal">
            <button
              type="button"
              onClick={() => handleTabChange("juros-compostos")}
              className={`h-8 px-3.5 rounded-[4px] text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center ${
                activeTab === "juros-compostos"
                  ? "bg-[#16804A] text-white border border-[#16804A] shadow-sm"
                  : "bg-[#2D3948] hover:bg-[#374659] text-[#D9DEE7] hover:text-white border border-[#3A495C]/70"
              }`}
            >
              Juros Compostos
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("reserva-emergencia")}
              className={`h-8 px-3.5 rounded-[4px] text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center ${
                activeTab === "reserva-emergencia"
                  ? "bg-[#16804A] text-white border border-[#16804A] shadow-sm"
                  : "bg-[#2D3948] hover:bg-[#374659] text-[#D9DEE7] hover:text-white border border-[#3A495C]/70"
              }`}
            >
              Reserva de Emergência
            </button>
          </nav>

          {/* Hambúrguer Mobile */}
          <div className="sm:hidden flex items-center shrink-0">
            <button
              ref={hamburgerBtnRef}
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white rounded-[4px] hover:bg-[#2A3747] active:bg-[#1A232E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16804A]"
              aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6 text-white" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-menu"
            ref={mobileMenuRef}
            className="sm:hidden border-t border-[#2D3948] bg-[#202B38] shadow-2xl px-4 py-5"
          >
            <div className="flex flex-col gap-[14px]">
              <button
                type="button"
                onClick={() => handleTabChange("juros-compostos")}
                className={`w-full min-h-[52px] px-4 rounded-[6px] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center text-center shadow-sm ${
                  activeTab === "juros-compostos"
                    ? "bg-[#16804A] text-white border border-[#16804A]"
                    : "bg-[#2D3948] hover:bg-[#374659] text-white border border-[#3A495C]"
                }`}
                style={{
                  backgroundColor: activeTab === "juros-compostos" ? "#16804A" : "#2D3948",
                  color: "#FFFFFF",
                }}
              >
                Juros Compostos
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("reserva-emergencia")}
                className={`w-full min-h-[52px] px-4 rounded-[6px] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center text-center shadow-sm ${
                  activeTab === "reserva-emergencia"
                    ? "bg-[#16804A] text-white border border-[#16804A]"
                    : "bg-[#2D3948] hover:bg-[#374659] text-white border border-[#3A495C]"
                }`}
                style={{
                  backgroundColor: activeTab === "reserva-emergencia" ? "#16804A" : "#2D3948",
                  color: "#FFFFFF",
                }}
              >
                Reserva de Emergência
              </button>
            </div>
          </div>
        )}
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
