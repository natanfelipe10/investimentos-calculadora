import React, { useState, useMemo, useRef } from "react";
import {
  Calculator,
  RotateCcw,
  Percent,
  Calendar,
  CheckCircle,
  BarChart2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { CurrencyInput } from "./CurrencyInput";
import { InfoTooltip } from "./InfoTooltip";
import { EvolutionChart } from "./EvolutionChart";
import { EvolutionTable } from "./EvolutionTable";
import { ResultsSection } from "./ResultsSection";
import { EducationalSection } from "./EducationalSection";
import {
  calculateCompoundInterest,
  SimulationParams,
} from "../utils/calculator";

export const CompoundInterestCalculator: React.FC = () => {
  // Form State - Inicializado limpo/zerado
  const [initialAmount, setInitialAmount] = useState<number>(0);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<string>("");
  const [rateType, setRateType] = useState<"month" | "year">("month");
  const [period, setPeriod] = useState<string>("");
  const [periodType, setPeriodType] = useState<"years" | "months">("years");

  // Status da simulação: inicia falso para não exibir resultados anteriores
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [calculatedParams, setCalculatedParams] = useState<SimulationParams | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Calculations executed only when user explicitly clicks "Calcular"
  const results = useMemo(() => {
    if (!hasCalculated || !calculatedParams) return null;
    return calculateCompoundInterest(calculatedParams);
  }, [hasCalculated, calculatedParams]);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const parsedRate = parseFloat(interestRate.replace(",", ".")) || 0;
    const parsedPeriod = parseFloat(period.replace(",", ".")) || 0;

    const newParams: SimulationParams = {
      initialAmount,
      monthlyContribution,
      interestRate: parsedRate,
      rateType,
      period: parsedPeriod,
      periodType,
    };

    setCalculatedParams(newParams);
    setHasCalculated(true);

    // Smooth scroll to results on smaller screens
    if (resultsRef.current && window.innerWidth < 1024) {
      const topOffset = resultsRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const handleClear = () => {
    setInitialAmount(0);
    setMonthlyContribution(0);
    setInterestRate("");
    setPeriod("");
    setRateType("month");
    setPeriodType("years");

    setHasCalculated(false);
    setCalculatedParams(null);
  };

  return (
    <div className="space-y-8">
      {/* TÍTULO DA CALCULADORA */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-[#667085] font-medium">
          <span>Início</span>
          <ChevronRight className="h-3 w-3" />
          <span>Ferramentas</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#202B38] font-semibold">Calculadora de Juros Compostos</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#202B38] tracking-tight">
          Calculadora de Juros Compostos
        </h1>
        <p className="text-sm text-[#667085] leading-relaxed max-w-2xl">
          Simule a multiplicação do patrimônio com aportes mensais e descubra como a curva dos juros sobre juros acelera seus rendimentos no longo prazo.
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
            <CurrencyInput
              id="initialAmount"
              label="Valor inicial"
              tooltip="Quantia disponível hoje."
              value={initialAmount}
              onChange={setInitialAmount}
              placeholder="0,00"
            />

            <CurrencyInput
              id="monthlyContribution"
              label="Investimento mensal"
              tooltip="Valor mensal adicionado."
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              placeholder="0,00"
            />

            {/* Taxa de juros */}
            <div className="flex flex-col gap-2">
              <label htmlFor="interestRate" className="text-xs font-semibold text-[#202B38]">
                Taxa de juros
              </label>
              <div className="h-11 flex rounded-[4px] border border-[#D9DEE7] bg-white">
                <input
                  type="text"
                  inputMode="decimal"
                  id="interestRate"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value.replace(/[^0-9.,]/g, ""))}
                  placeholder="0"
                  className="w-full bg-transparent px-3 text-sm font-semibold text-[#202B38] focus:outline-none tabular-nums"
                />
                <div className="flex items-center border-l border-[#D9DEE7] bg-[#F8FAFC] p-1">
                  <button type="button" onClick={() => setRateType("month")} className={`px-3 py-1 text-[11px] font-bold uppercase rounded-[2px] transition-colors ${rateType === "month" ? "bg-[#202B38] text-white" : "text-[#667085] hover:text-[#202B38]"}`}>Mês</button>
                  <button type="button" onClick={() => setRateType("year")} className={`px-3 py-1 text-[11px] font-bold uppercase rounded-[2px] transition-colors ${rateType === "year" ? "bg-[#202B38] text-white" : "text-[#667085] hover:text-[#202B38]"}`}>Ano</button>
                </div>
              </div>
            </div>

            {/* Período */}
            <div className="flex flex-col gap-2">
              <label htmlFor="period" className="text-xs font-semibold text-[#202B38]">
                Período
              </label>
              <div className="h-11 flex rounded-[4px] border border-[#D9DEE7] bg-white">
                <input
                  type="text"
                  inputMode="numeric"
                  id="period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="0"
                  className="w-full bg-transparent px-3 text-sm font-semibold text-[#202B38] focus:outline-none tabular-nums"
                />
                <div className="flex items-center border-l border-[#D9DEE7] bg-[#F8FAFC] p-1">
                  <button type="button" onClick={() => setPeriodType("years")} className={`px-3 py-1 text-[11px] font-bold uppercase rounded-[2px] transition-colors ${periodType === "years" ? "bg-[#202B38] text-white" : "text-[#667085] hover:text-[#202B38]"}`}>Anos</button>
                  <button type="button" onClick={() => setPeriodType("months")} className={`px-3 py-1 text-[11px] font-bold uppercase rounded-[2px] transition-colors ${periodType === "months" ? "bg-[#202B38] text-white" : "text-[#667085] hover:text-[#202B38]"}`}>Meses</button>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 h-11 rounded-[4px] bg-[#16804A] hover:bg-[#11643A] text-white text-xs font-bold uppercase tracking-wide transition-colors"
              >
                Calcular
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="h-11 px-6 rounded-[4px] border border-[#D9DEE7] text-[#667085] hover:text-[#202B38] text-xs font-bold uppercase tracking-wide transition-colors"
              >
                Limpar
              </button>
            </div>
          </form>
        </div>

        {/* RESULTADOS */}
        <div ref={resultsRef} className="min-w-0 w-full space-y-8">
          {!hasCalculated || !results ? (
            <div className="border border-[#D9DEE7] rounded-[6px] p-12 text-center text-[#667085] bg-white shadow-[var(--shadow-card)]">
              <BarChart2 className="h-10 w-10 mx-auto mb-4 text-[#E5E9F0]" />
              <p className="text-sm">Preencha os dados acima para visualizar a projeção.</p>
            </div>
          ) : (
            <>
              <ResultsSection
                finalAmount={results.finalAmount}
                totalInvested={results.totalInvested}
                totalInterest={results.totalInterest}
              />
              <EvolutionChart data={results.chartData} />
            </>
          )}
        </div>
      </div>

      {hasCalculated && results && (
        <div className="bg-white border border-[#D9DEE7] rounded-[6px] shadow-[var(--shadow-card)]">
          <EvolutionTable rows={results.tableData} />
        </div>
      )}

      <EducationalSection />
    </div>
  );
};
