import React, { useState, useMemo, useRef } from "react";
import {
  ShieldAlert,
  RotateCcw,
  CheckCircle,
  Briefcase,
  Sliders,
  AlertCircle,
  Calculator,
  ChevronRight,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { CurrencyInput } from "./CurrencyInput";
import { InfoTooltip } from "./InfoTooltip";
import { EmergencyFaq } from "./EmergencyFaq";
import { EducationalSection } from "./EducationalSection";
import {
  WorkModel,
  WORK_MODEL_OPTIONS,
  EmergencyParams,
  calculateEmergencyReserve,
  getDefaultMonthsForModel,
} from "../utils/emergencyCalculator";
import { formatCurrencyBRL } from "../utils/calculator";

export const EmergencyCalculator: React.FC = () => {
  // Form State - Inicializado limpo/zerado
  const [workModel, setWorkModel] = useState<WorkModel>("clt");
  const [monthlySalary, setMonthlySalary] = useState<number>(0);
  const [essentialMonthlyCost, setEssentialMonthlyCost] = useState<number>(0);
  const [monthlySavings, setMonthlySavings] = useState<number>(0);
  const [targetMonths, setTargetMonths] = useState<number>(6);
  const [isMonthsCustomized, setIsMonthsCustomized] = useState<boolean>(false);
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);

  // Status da simulação: inicia falso para não exibir resultados anteriores
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [calculatedParams, setCalculatedParams] = useState<EmergencyParams | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Compute Results only when user clicks "Calcular"
  const results = useMemo(() => {
    if (!hasCalculated || !calculatedParams) return null;
    return calculateEmergencyReserve(calculatedParams);
  }, [hasCalculated, calculatedParams]);

  const handleWorkModelChange = (newModel: WorkModel) => {
    setWorkModel(newModel);
    if (!isMonthsCustomized) {
      const defaultMonths = getDefaultMonthsForModel(newModel);
      setTargetMonths(defaultMonths);
    }
  };

  const handleCustomMonthsChange = (val: number) => {
    const clamped = Math.max(1, Math.min(24, val));
    setTargetMonths(clamped);
    setIsMonthsCustomized(true);
  };

  const handleResetToDefaultMonths = () => {
    const defaultMonths = getDefaultMonthsForModel(workModel);
    setTargetMonths(defaultMonths);
    setIsMonthsCustomized(false);
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newParams: EmergencyParams = {
      workModel,
      monthlySalary,
      essentialMonthlyCost,
      monthlySavings,
      targetMonths,
      isMonthsCustomized,
    };

    setCalculatedParams(newParams);
    setHasCalculated(true);

    if (resultsRef.current && window.innerWidth < 1024) {
      const topOffset = resultsRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const handleClear = () => {
    setWorkModel("clt");
    setMonthlySalary(0);
    setEssentialMonthlyCost(0);
    setMonthlySavings(0);
    setTargetMonths(6);
    setIsMonthsCustomized(false);
    setShowCustomizer(false);

    setHasCalculated(false);
    setCalculatedParams(null);
  };

  const defaultMonthsForCurrent = getDefaultMonthsForModel(workModel);

  return (
    <div className="space-y-8">
      {/* TÍTULO DA CALCULADORA */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-[#667085] font-medium">
          <span>Início</span>
          <ChevronRight className="h-3 w-3" />
          <span>Ferramentas</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#202B38] font-semibold">Simulador de Reserva de Emergência</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#202B38] tracking-tight">
          Simulador de Reserva de Emergência
        </h1>
        <p className="text-sm text-[#667085] leading-relaxed max-w-2xl">
          Calcule o montante financeiro recomendado para cobrir despesas essenciais em caso de imprevistos e saiba quanto tempo levará para atingir sua meta.
        </p>
      </div>

      {/* FORMULÁRIO + COCKPIT */}
      <div className="flex flex-col gap-8">
        
        {/* FORMULÁRIO */}
        <div className="min-w-0 w-full bg-white border border-[#D9DEE7] rounded-[6px] p-6 sm:p-8 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#202B38] mb-6">
            Dados da Simulação
          </h2>

          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="workModel" className="text-xs font-semibold text-[#202B38]">
                Modelo de trabalho
              </label>
              <div className="h-11 flex rounded-[4px] border border-[#D9DEE7] bg-white overflow-hidden">
                <div className="flex items-center justify-center min-w-[42px] px-3 bg-[#F8FAFC] border-r border-[#D9DEE7] text-[#667085]">
                  <Briefcase className="h-4 w-4" />
                </div>
                <select
                  id="workModel"
                  value={workModel}
                  onChange={(e) => handleWorkModelChange(e.target.value as WorkModel)}
                  className="w-full bg-transparent px-3 text-sm font-semibold text-[#202B38] focus:outline-none cursor-pointer"
                >
                  {WORK_MODEL_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label} ({opt.defaultMonths} meses)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px] text-[#667085]">
                <span>Referência: {defaultMonthsForCurrent} meses de despesas.</span>
                <button type="button" onClick={() => setShowCustomizer(!showCustomizer)} className="font-bold text-[#16804A] hover:underline">
                  {showCustomizer ? "Ocultar" : "Personalizar"}
                </button>
              </div>
            </div>

            {/* Painel de personalização */}
            {showCustomizer && (
              <div className="p-4 rounded-[4px] border border-[#D9DEE7] bg-[#F8FAFC] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#202B38]">Meses da reserva:</span>
                  <span className="text-xs font-bold text-[#16804A] font-mono tabular-nums bg-white px-2 py-0.5 rounded border border-[#D9DEE7]">
                    {targetMonths}
                  </span>
                </div>
                <input type="range" min="1" max="24" value={targetMonths} onChange={(e) => handleCustomMonthsChange(parseInt(e.target.value, 10))} className="w-full accent-[#16804A] cursor-pointer" />
                <div className="flex justify-between text-[11px] text-[#667085]">
                  <span>1</span>
                  {isMonthsCustomized && <button type="button" onClick={handleResetToDefaultMonths} className="text-[#16804A] font-bold hover:underline">Restaurar</button>}
                  <span>24</span>
                </div>
              </div>
            )}

            <CurrencyInput
              id="monthlySalary"
              label="Salário Mensal"
              value={monthlySalary}
              onChange={setMonthlySalary}
              placeholder="0,00"
            />
            <CurrencyInput
              id="essentialMonthlyCost"
              label="Custo Fixo Mensal"
              value={essentialMonthlyCost}
              onChange={setEssentialMonthlyCost}
              placeholder="0,00"
            />
            <CurrencyInput
              id="monthlySavings"
              label="Quanto você guarda por mês?"
              value={monthlySavings}
              onChange={setMonthlySavings}
              placeholder="0,00"
            />

            <div className="pt-4 flex items-center gap-3">
              <button type="submit" className="flex-1 h-11 rounded-[4px] bg-[#16804A] hover:bg-[#11643A] text-white text-xs font-bold uppercase tracking-wide transition-colors">Calcular</button>
              <button type="button" onClick={handleClear} className="h-11 px-6 rounded-[4px] border border-[#D9DEE7] text-[#667085] hover:text-[#202B38] text-xs font-bold uppercase tracking-wide transition-colors">Limpar</button>
            </div>
          </form>
        </div>

        {/* RESULTADOS */}
        <div ref={resultsRef} className="min-w-0 w-full space-y-8">
          {!hasCalculated || !results || !calculatedParams ? (
            <div className="border border-[#D9DEE7] rounded-[6px] p-12 text-center text-[#667085] bg-white shadow-[var(--shadow-card)]">
              <ShieldAlert className="h-10 w-10 mx-auto mb-4 text-[#E5E9F0]" />
              <p className="text-sm">Informe seus dados para calcular a reserva de emergência.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white border border-[#D9DEE7] rounded-[6px] shadow-[var(--shadow-card)] p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#202B38] mb-4">Resultado da Simulação</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-[#667085]">Valor Alvo</p>
                    <p className="text-3xl font-extrabold text-[#16804A] font-mono tabular-nums">{formatCurrencyBRL(results.reserveTarget)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#667085]">Prazo Estimado</p>
                    <p className="text-3xl font-extrabold text-[#202B38] font-mono tabular-nums">{results.formattedDuration}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E4E7EC] rounded-[6px] p-4 text-xs leading-relaxed text-[#202B38]">
                <strong>Resumo:</strong> Com um alvo de <strong>{formatCurrencyBRL(results.reserveTarget)}</strong> e aportes mensais de <strong>{formatCurrencyBRL(results.monthlySavings)}</strong>, você poderá alcançar sua meta em aproximadamente <strong>{results.formattedDuration}</strong>.
              </div>
            </div>
          )}
        </div>
      </div>

      <EducationalSection />
      <section className="bg-white border border-[#D9DEE7] rounded-[6px] overflow-hidden shadow-[var(--shadow-card)]">
        <EmergencyFaq />
      </section>
    </div>
  );
};
