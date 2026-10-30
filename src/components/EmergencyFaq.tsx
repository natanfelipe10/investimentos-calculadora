import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Como criar uma reserva de emergência?',
    answer:
      'Comece mapeando suas despesas essenciais do mês (moradia, alimentação, saúde, contas básicas). Em seguida, defina uma meta de meses (geralmente entre 3 e 12 meses) e separe uma quantia fixa todo mês logo após receber seu salário, transferindo esse dinheiro para uma aplicação segura e de liquidez diária.',
  },
  {
    question: 'Onde guardar o fundo de emergência?',
    answer:
      'A prioridade absoluta da reserva é segurança e liquidez, não rentabilidade alta. As opções mais recomendadas no mercado brasileiro são o Tesouro Selic (título público federal) e CDBs com liquidez diária de bancos sólidos que paguem pelo menos 100% do CDI, garantidos pelo Fundo Garantidor de Créditos (FGC).',
  },
  {
    question: 'Qual valor devo guardar por mês?',
    answer:
      'O ideal é guardar entre 10% e 30% da sua renda mensal disponível, de acordo com o seu orçamento. O mais importante não é o tamanho do valor inicial, mas sim a constância: guardar R$ 100,00 ou R$ 200,00 todos os meses com disciplina é muito melhor do que não guardar nada.',
  },
  {
    question: 'Posso começar minha reserva com pouco dinheiro?',
    answer:
      'Sim, com certeza. Você pode começar com quantias a partir de R$ 30,00 no Tesouro Direto ou R$ 1,00 em contas remuneradas e CDBs de liquidez diária. O hábito de poupar regularmente é o que constrói a segurança financeira com o tempo.',
  },
  {
    question: 'Quando devo utilizar minha reserva?',
    answer:
      'A reserva deve ser acionada exclusivamente diante de imprevistos urgentes e inadiáveis: demissão involuntária, redução drástica de faturamento, despesas médicas e odontológicas emergenciais ou reparos indispensáveis na casa ou no veículo de trabalho. Nunca use para compras de oportunidade, viagens ou lazer.',
  },
  {
    question: 'O que fazer depois de completar minha reserva?',
    answer:
      'Ao atingir o valor correspondente aos meses necessários de cobertura, você terá tranquilidade para dar o próximo passo: direcionar os novos aportes mensais para investimentos de médio e longo prazo mais rentáveis, como títulos de inflação (Tesouro IPCA+), fundos imobiliários e ações.',
  },
];

export const EmergencyFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white">
      <div className="bg-[#F8FAFC] border-b border-[#E4E7EC] px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#16804A]" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#202B38]">
            Dúvidas Frequentes
          </h2>
        </div>
        <span className="text-[11px] text-[#667085]">
          Respostas Rápidas
        </span>
      </div>

      <div className="p-4 sm:p-6 divide-y divide-[#E4E7EC]">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={item.question} className="py-3.5 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                className="w-full text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-[#202B38] hover:text-[#16804A] transition-colors py-2 min-h-[44px] cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#667085] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#16804A]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-2 text-xs sm:text-sm text-[#667085] leading-relaxed pr-6">
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
