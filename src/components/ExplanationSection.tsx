import React from 'react';
import { HelpCircle } from 'lucide-react';

export const ExplanationSection: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="p-4 sm:p-6 text-xs sm:text-sm text-[#536174] leading-relaxed space-y-3">
        <p>
          Os <strong>juros compostos</strong> representam a aplicação de juros sobre o capital investido somado aos juros acumulados em períodos anteriores — o efeito conhecido como <strong>&ldquo;juros sobre juros&rdquo;</strong>.
        </p>
        <p>
          Ao longo do tempo, a curva de rentabilidade torna-se exponencial, fazendo com que a parcela gerada pelos rendimentos supere significativamente o montante total desembolsado pelo investidor.
        </p>

        <div className="pt-2">
          <p className="text-[11px] text-[#6B7280] border-t border-[#D1D5DB] pt-3 leading-normal">
            <strong>Aviso Legal:</strong> Os valores apresentados são simulações matemáticas e não constituem garantia de rentabilidade futura. Os resultados são brutos, sem dedução de alíquotas de imposto de renda, taxas de administração ou correção inflacionária.
          </p>
        </div>
      </div>
    </div>
  );
};
