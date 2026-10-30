import React from 'react';
import { formatCurrencyBRL } from '../utils/calculator';
import { TrendingUp, Wallet, Coins } from 'lucide-react';

interface ResultsSectionProps {
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  finalAmount,
  totalInvested,
  totalInterest,
}) => {
  const investedRatio = finalAmount > 0 ? Math.min(100, Math.max(0, (totalInvested / finalAmount) * 100)) : 0;
  const interestRatio = finalAmount > 0 ? Math.min(100, Math.max(0, (totalInterest / finalAmount) * 100)) : 0;

  const investedFormatted = investedRatio.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const interestFormatted = interestRatio.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-[6px] overflow-hidden shadow-xs">
      
      {/* CABEÇALHO DO COCKPIT DE RESULTADOS */}
      <div className="bg-[#F8FAFC] border-b border-[#E4E7EC] px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#16804A]" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#202B38]">
            Resultado da Simulação
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-[#16804A] bg-[#16804A]/10 px-2.5 py-0.5 rounded-[4px]">
          Projeção Final
        </span>
      </div>

      {/* INDICADOR PRINCIPAL: PATRIMÔNIO FINAL ACUMULADO */}
      <div className="p-4 sm:p-6 bg-white border-b border-[#E4E7EC]">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
            Valor Total Final (Montante)
          </span>
          <span className="text-[11px] text-[#667085]">
            Capital somado aos juros acumulados
          </span>
        </div>
        
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-[#16804A] font-mono tabular-nums tracking-tight break-words">
            {formatCurrencyBRL(finalAmount)}
          </span>
        </div>

        <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
          Estimativa do patrimônio bruto total acumulado ao término do período informado.
        </p>

        {/* BARRA PROPORCIONAL DE DISTRIBUIÇÃO PATRIMONIAL (ESTILO INVESTIDOR10) */}
        {finalAmount > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E4E7EC]/70">
            <div className="flex items-center justify-between text-[11px] text-[#667085] mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-[2px] bg-[#202B38] inline-block"></span>
                <span>Total Aportado: <strong className="text-[#202B38]">{investedFormatted}%</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-[2px] bg-[#16804A] inline-block"></span>
                <span>Rendimento em Juros: <strong className="text-[#16804A]">{interestFormatted}%</strong></span>
              </span>
            </div>
            
            <div className="h-2.5 w-full bg-[#E4E7EC] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${investedRatio}%` }}
                className="bg-[#202B38] transition-all duration-500"
                title={`Total Investido: ${investedFormatted}%`}
              />
              <div
                style={{ width: `${interestRatio}%` }}
                className="bg-[#16804A] transition-all duration-500"
                title={`Total em Juros: ${interestFormatted}%`}
              />
            </div>
          </div>
        )}
      </div>

      {/* INDICADORES SECUNDÁRIOS: ALINHADOS LADO A LADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#E4E7EC] bg-[#F8FAFC]/70">
        
        {/* Total Investido (Aportes) */}
        <div className="p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet className="h-3.5 w-3.5 text-[#667085]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                Valor Total Investido
              </span>
            </div>
            <div className="text-lg xs:text-xl sm:text-2xl font-bold text-[#202B38] font-mono tabular-nums tracking-tight break-words">
              {formatCurrencyBRL(totalInvested)}
            </div>
          </div>
          <span className="text-[11px] text-[#667085] mt-2 block">
            Capital inicial somado aos depósitos periódicos
          </span>
        </div>

        {/* Total em Juros (Rendimentos) */}
        <div className="p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Coins className="h-3.5 w-3.5 text-[#16804A]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#16804A]">
                Total Ganho em Juros
              </span>
            </div>
            <div className="text-lg xs:text-xl sm:text-2xl font-bold text-[#16804A] font-mono tabular-nums tracking-tight break-words">
              +{formatCurrencyBRL(totalInterest)}
            </div>
          </div>
          <span className="text-[11px] text-[#667085] mt-2 block">
            Crescimento gerado pelo efeito dos juros sobre juros
          </span>
        </div>

      </div>

    </div>
  );
};
