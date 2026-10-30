import React from "react";
import { Calculator, ShieldAlert, ArrowRight, Check, LayoutGrid } from "lucide-react";

export type CalculatorTab = "juros-compostos" | "reserva-emergencia";

interface CalculatorsDirectoryProps {
  activeTab: CalculatorTab;
  onSelectTab: (tab: CalculatorTab) => void;
}

interface CalculatorCardInfo {
  id: CalculatorTab;
  name: string;
  shortDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const CALCULATORS_LIST: CalculatorCardInfo[] = [
  {
    id: "juros-compostos",
    name: "Calculadora de Juros Compostos",
    shortDescription:
      "Simule a multiplicação temporal do patrimônio com depósitos regulares e acompanhe a curva de rendimentos.",
    icon: Calculator,
    tag: "Projeção no tempo",
  },
  {
    id: "reserva-emergencia",
    name: "Simulador de Reserva de Emergência",
    shortDescription:
      "Estime o montante de proteção orçamentária indispensável com base nas despesas essenciais e previsibilidade de renda.",
    icon: ShieldAlert,
    tag: "Segurança orçamentária",
  },
];

export const CalculatorsDirectory: React.FC<CalculatorsDirectoryProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <section className="bg-white border border-[#E4E7EC] rounded-[6px] shadow-xs overflow-hidden">
      <div className="bg-[#F8FAFC] border-b border-[#E4E7EC] px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-[#16804A]" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#202B38] truncate">
            Outras Ferramentas
          </h2>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CALCULATORS_LIST.map((calc) => {
            const Icon = calc.icon;
            const isActive = activeTab === calc.id;

            return (
              <div
                key={calc.id}
                className={`p-5 rounded-[6px] border transition-all flex flex-col justify-between ${
                  isActive
                    ? "border-[#16804A] bg-[#16804A]/[0.02]"
                    : "border-[#E4E7EC] bg-white hover:border-[#16804A]/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 h-9 w-9 rounded-[4px] flex items-center justify-center shrink-0 ${isActive ? "text-[#16804A]" : "text-[#667085]"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#202B38] mb-1.5">{calc.name}</h3>
                    <p className="text-xs text-[#667085] leading-relaxed mb-4">{calc.shortDescription}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4E7EC] flex justify-end">
                  {isActive ? (
                    <span className="text-xs font-bold text-[#16804A]">Ferramenta ativa</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectTab(calc.id)}
                      className="text-xs font-bold text-[#16804A] hover:text-[#136e3f] transition-colors cursor-pointer"
                    >
                      Acessar simulador &rarr;
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
