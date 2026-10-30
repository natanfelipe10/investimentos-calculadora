import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'O que é a Calculadora de Dividendos?',
    answer:
      'É uma ferramenta didática de simulação financeira criada para estimar quanto patrimônio e quantas ações ou cotas você precisaria acumular em determinado ativo para atingir uma meta desejada de renda em proventos.',
  },
  {
    question: 'Como funciona a simulação?',
    answer:
      'A ferramenta cruza a sua meta de renda mensal com o histórico de proventos distribuídos pelo ativo nos últimos 12 meses (D12) e com o preço atual da ação ou cota, calculando a quantidade necessária de cotas e o investimento total correspondente.',
  },
  {
    question: 'O que é Dividend Yield?',
    answer:
      'O Dividend Yield (DY) é um indicador percentual que expressa a relação entre os proventos pagos por uma ação ou fundo imobiliário em um período (normalmente 12 meses) e o preço atual de mercado daquele ativo.',
  },
  {
    question: 'Como calcular quanto preciso investir para receber R$ 1.000 por mês?',
    answer:
      'Primeiro calcula-se a renda anual almejada (R$ 1.000 × 12 = R$ 12.000). Em seguida, divide-se essa renda pelo Dividend Yield anual do ativo. Por exemplo, em um ativo com DY de 6% ao ano, o patrimônio teórico necessário seria de aproximadamente R$ 200.000,00 (R$ 12.000 ÷ 0,06).',
  },
  {
    question: 'Os dividendos são pagos todos os meses?',
    answer:
      'Depende da categoria do ativo. Fundos de Investimento Imobiliário (FIIs) costumam distribuir rendimentos mensalmente na legislação brasileira. Já empresas de capital aberto (ações) podem pagar trimestralmente, semestralmente ou anualmente, conforme a política de distribuição de cada companhia.',
  },
  {
    question: 'Os dividendos futuros são garantidos?',
    answer:
      'Não. Proventos decorrem dos lucros das empresas ou da receita operacional dos imóveis/títulos dos fundos. Resultados operacionais oscilam, e as empresas podem reter lucros para investimentos ou passar por períodos de prejuízo. Rentabilidade passada nunca é garantia de proventos futuros.',
  },
];

export const DividendFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white">
      <div className="bg-[#F7F7F7] border-b border-[#D1D5DB] px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#26313D]" />
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#26313D]">
            Dúvidas Comuns
          </h2>
        </div>
        <span className="text-[11px] text-[#6B7280]">
          Perguntas Frequentes
        </span>
      </div>

      <div className="p-4 sm:p-6 divide-y divide-[#D1D5DB]/60">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={item.question} className="py-3 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                className="w-full text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-[#26313D] hover:text-[#176B45] transition-colors py-1 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#536174] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#176B45]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-2 text-xs sm:text-sm text-[#536174] leading-relaxed pr-6">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
