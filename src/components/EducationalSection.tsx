import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { BookOpen, TrendingUp, HelpCircle, Layers, Target, AlertTriangle } from 'lucide-react';
import { formatCompactBRL, formatCurrencyBRL } from '../utils/calculator';

// Fixed illustrative dataset for the simple vs compound interest comparison:
// Capital inicial: R$ 50.000,00 | Taxa: 8% a.a. | 10 anos | Sem novos aportes
const COMPARATIVE_DATA = [
  { year: 'Início', simple: 50000, compound: 50000, invested: 50000 },
  { year: 'Ano 1', simple: 54000, compound: 54000, invested: 50000 },
  { year: 'Ano 2', simple: 58000, compound: 58320, invested: 50000 },
  { year: 'Ano 3', simple: 62000, compound: 62985.6, invested: 50000 },
  { year: 'Ano 4', simple: 66000, compound: 68024.45, invested: 50000 },
  { year: 'Ano 5', simple: 70000, compound: 73466.4, invested: 50000 },
  { year: 'Ano 6', simple: 74000, compound: 79343.72, invested: 50000 },
  { year: 'Ano 7', simple: 78000, compound: 85691.21, invested: 50000 },
  { year: 'Ano 8', simple: 82000, compound: 92546.51, invested: 50000 },
  { year: 'Ano 9', simple: 86000, compound: 99950.23, invested: 50000 },
  { year: 'Ano 10', simple: 90000, compound: 107946.25, invested: 50000 },
];

interface CustomComparativeTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomComparativeTooltip: React.FC<CustomComparativeTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const compound = payload.find((p) => p.dataKey === 'compound')?.value || 0;
    const simple = payload.find((p) => p.dataKey === 'simple')?.value || 0;
    const invested = payload.find((p) => p.dataKey === 'invested')?.value || 0;
    const diff = Math.max(0, compound - simple);

    return (
      <div className="rounded-[3px] border border-[#E4E7EC] bg-white p-3 shadow-xs min-w-[210px] text-xs">
        <p className="font-semibold text-[#202B38] border-b border-[#E5E8EB] pb-1 mb-2 font-sans">
          {label}
        </p>
        <div className="space-y-1.5 font-mono tabular-nums">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#667085] font-sans">
              <span className="h-2 w-2 rounded-[2px] bg-[#16804A] inline-block"></span>
              Juros Compostos:
            </span>
            <span className="font-bold text-[#16804A]">
              {formatCurrencyBRL(compound)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#667085] font-sans">
              <span className="h-2 w-2 rounded-[2px] bg-[#202B38] inline-block"></span>
              Juros Simples:
            </span>
            <span className="font-semibold text-[#202B38]">
              {formatCurrencyBRL(simple)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#667085] font-sans">
              <span className="h-2 w-2 rounded-[2px] bg-[#667085] inline-block"></span>
              Capital Investido:
            </span>
            <span className="text-[#667085]">
              {formatCurrencyBRL(invested)}
            </span>
          </div>

          {diff > 0 && (
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#E5E8EB] text-[11px]">
              <span className="text-[#667085] font-sans">Vantagem Composta:</span>
              <span className="font-semibold text-[#16804A]">
                +{formatCurrencyBRL(diff)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const EducationalSection: React.FC = () => {
  return (
    <article className="bg-white">
      {/* Cabeçalho da Seção Educativa */}
      <div className="bg-[#F8FAFC] border-b border-[#E4E7EC] px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#202B38]" />
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#202B38]">
            Guia Completo sobre Juros Compostos
          </h2>
        </div>
        <span className="text-[11px] text-[#667085]">
          Educação e Análise Financeira
        </span>
      </div>

      <div className="p-4 sm:p-8 space-y-8 text-xs sm:text-sm text-[#667085] leading-relaxed">
        
        {/* 2. INTRODUÇÃO */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#202B38]">
            Calculadora de Juros Compostos
          </h2>
          <p>
            A calculadora de juros compostos é uma ferramenta para simular o crescimento de investimentos ao longo do tempo. Informe quanto pretende investir inicialmente, qual rentabilidade deseja considerar, por quanto tempo pretende investir e quanto poderá adicionar mensalmente. A ferramenta calcula a evolução estimada do seu patrimônio e mostra quanto poderá vir do seu próprio dinheiro e quanto poderá vir dos rendimentos.
          </p>
        </section>

        {/* 3. O QUE SÃO JUROS COMPOSTOS E COMO SÃO CALCULADOS? */}
        <section className="space-y-3 border-t border-[#E4E7EC]/60 pt-6">
          <h2 className="text-sm sm:text-base font-bold text-[#202B38]">
            O que são juros compostos e como são calculados?
          </h2>
          <p>
            Os juros compostos são amplamente conhecidos como <strong>&ldquo;juros sobre juros&rdquo;</strong> porque os rendimentos acumulados ao fim de cada período passam a fazer parte integrante do saldo principal que gerará os novos rendimentos no período subsequente.
          </p>

          <div className="my-3 p-3.5 bg-[#F8FAFC] border border-[#E4E7EC] rounded-[3px] text-xs sm:text-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] block mb-1">
              Fórmula básica de juros compostos:
            </span>
            <div className="font-mono text-sm sm:text-base font-bold text-[#202B38] py-1">
              VF = VP &times; (1 + i)<sup>n</sup>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-[#667085]">
              <li>&bull; <strong className="text-[#202B38]">VF:</strong> valor futuro do investimento (montante final acumulado).</li>
              <li>&bull; <strong className="text-[#202B38]">VP:</strong> valor inicial investido (capital presente).</li>
              <li>&bull; <strong className="text-[#202B38]">i:</strong> taxa de juros por período (em formato decimal).</li>
              <li>&bull; <strong className="text-[#202B38]">n:</strong> quantidade de períodos (meses ou anos de aplicação).</li>
            </ul>
          </div>

          <p>
            É importante esclarecer que essa fórmula básica representa um investimento único sem aportes adicionais. Quando existem aportes mensais recorrentes, o cálculo precisa considerar cada depósito individualmente e o tempo exato durante o qual cada parcela permaneceu rendendo.
          </p>

          <div className="p-3 bg-[#F1F3F5] border-l-2 border-[#16804A] text-xs leading-relaxed text-[#202B38]">
            <strong>Exemplo prático:</strong> Imagine um investimento inicial de <strong>R$ 10.000,00</strong>, com rentabilidade hipotética de <strong>1% ao mês</strong>, durante <strong>12 meses</strong>, sem novos aportes. Ao final do período, o saldo será de aproximadamente <strong>R$ 11.268,25</strong>, antes de impostos e custos. Desse total, os rendimentos acumulados correspondem a aproximadamente <strong>R$ 1.268,25</strong> (enquanto nos juros simples o rendimento seria fixo em R$ 1.200,00).
          </div>
        </section>

        {/* 4. QUAL A DIFERENÇA ENTRE JUROS SIMPLES E JUROS COMPOSTOS? */}
        <section className="space-y-3 border-t border-[#E4E7EC]/60 pt-6">
          <h2 className="text-sm sm:text-base font-bold text-[#202B38]">
            Qual a diferença entre juros simples e juros compostos?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3 border border-[#E4E7EC] rounded-[3px] bg-[#F8FAFC]">
              <strong className="text-[#202B38] block mb-1">Juros simples:</strong>
              <p className="text-[#667085]">
                Os juros são calculados sempre e exclusivamente sobre o capital inicial. O rendimento em dinheiro é exatamente igual em todos os períodos, gerando um crescimento linear e previsível.
              </p>
            </div>
            <div className="p-3 border border-[#E4E7EC] rounded-[3px] bg-[#F8FAFC]">
              <strong className="text-[#16804A] block mb-1">Juros compostos:</strong>
              <p className="text-[#667085]">
                Os juros de cada período são incorporados ao saldo e passam a gerar novos rendimentos. O montante cresce de forma exponencial, acelerando à medida que o tempo avança.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className="font-semibold text-[#202B38]">
              Exemplo comparativo (R$ 50.000,00 aplicados a 8% ao ano por 10 anos, sem aportes adicionais):
            </p>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border border-[#E4E7EC] rounded-[3px] overflow-hidden min-w-[500px]">
                <thead className="bg-[#F8FAFC] text-[#202B38] border-b border-[#E4E7EC]">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Modalidade</th>
                    <th className="py-2 px-3 font-semibold text-right">Capital Inicial</th>
                    <th className="py-2 px-3 font-semibold text-right">Total em Juros</th>
                    <th className="py-2 px-3 font-semibold text-right">Montante Final (10 anos)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E7EC]/60 bg-white font-mono tabular-nums">
                  <tr>
                    <td className="py-2 px-3 font-medium text-[#202B38] font-sans">Juros Simples</td>
                    <td className="py-2 px-3 text-right text-[#667085]">R$ 50.000,00</td>
                    <td className="py-2 px-3 text-right text-[#667085]">R$ 40.000,00</td>
                    <td className="py-2 px-3 text-right font-bold text-[#202B38]">R$ 90.000,00</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="py-2 px-3 font-medium text-[#16804A] font-sans">Juros Compostos</td>
                    <td className="py-2 px-3 text-right text-[#667085]">R$ 50.000,00</td>
                    <td className="py-2 px-3 text-right text-[#16804A] font-semibold">R$ 57.946,25</td>
                    <td className="py-2 px-3 text-right font-bold text-[#16804A]">R$ 107.946,25</td>
                  </tr>
                  <tr className="bg-[#16804A]/10 font-semibold font-sans">
                    <td className="py-2 px-3 text-[#16804A]">Diferença a favor dos juros compostos</td>
                    <td className="py-2 px-3 text-right text-slate-400 font-mono">—</td>
                    <td className="py-2 px-3 text-right font-mono text-[#16804A]">+R$ 17.946,25</td>
                    <td className="py-2 px-3 text-right font-mono text-[#16804A]">+R$ 17.946,25 (+19,9%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-[#667085]">
              * Valores matemáticos calculados com base em uma taxa hipotética ilustrativa de 8% a.a., sem representar promessa de rentabilidade futura.
            </p>
          </div>
        </section>

        {/* 5. GRÁFICO EDUCATIVO */}
        <section className="space-y-3 border-t border-[#E4E7EC]/60 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#202B38]">
                Gráfico Comparativo: Juros Simples vs. Juros Compostos
              </h3>
              <p className="text-[11px] text-[#667085]">
                Simulação de R$ 50.000,00 aplicados a 8% ao ano ao longo de 10 anos
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#667085]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-[2px] bg-[#667085] inline-block"></span>
                <span>Capital (R$ 50k)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-[2px] bg-[#202B38] inline-block"></span>
                <span>Juros Simples</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-4 rounded-[2px] bg-[#16804A] inline-block"></span>
                <span className="font-semibold text-[#16804A]">Juros Compostos</span>
              </div>
            </div>
          </div>

          <div className="h-[220px] sm:h-[260px] w-full min-w-0 border border-[#E4E7EC] rounded-[3px] p-2.5 sm:p-3 bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={COMPARATIVE_DATA}
                margin={{ top: 10, right: 8, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E5E8EB" />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={{ stroke: '#E4E7EC' }}
                  tick={{ fill: '#667085', fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#667085', fontSize: 10 }}
                  tickFormatter={(v) => formatCompactBRL(v)}
                  domain={[40000, 120000]}
                  width={55}
                />
                <Tooltip content={<CustomComparativeTooltip />} />
                <Line
                  type="monotone"
                  dataKey="invested"
                  name="Capital Investido"
                  stroke="#667085"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="simple"
                  name="Juros Simples"
                  stroke="#202B38"
                  strokeWidth={1.75}
                  dot={{ r: 2.5, fill: '#202B38' }}
                />
                <Line
                  type="monotone"
                  dataKey="compound"
                  name="Juros Compostos"
                  stroke="#16804A"
                  strokeWidth={2.25}
                  dot={{ r: 3, fill: '#16804A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-[#667085] italic">
            No início, a diferença entre juros simples e compostos pode parecer pequena. Ao longo do tempo, os rendimentos acumulados fazem com que o crescimento composto se acelere em relação ao crescimento linear dos juros simples.
          </p>
        </section>

        {/* 6. QUAIS INFORMAÇÕES VOCÊ PRECISA PARA USAR A CALCULADORA? */}
        <section className="space-y-3 border-t border-[#E4E7EC]/60 pt-6">
          <h2 className="text-sm sm:text-base font-bold text-[#202B38]">
            Quais informações você precisa para usar a calculadora?
          </h2>
          <p>
            Para realizar uma simulação na ferramenta, são necessários quatro dados fundamentais:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3 border border-[#E4E7EC] rounded-[3px] bg-[#F8FAFC]">
              <h3 className="font-bold text-[#202B38] mb-1">Valor inicial</h3>
              <p className="text-[#667085]">
                É o dinheiro disponível para iniciar o investimento. Pode ser zero, caso a pessoa pretenda começar apenas com aportes recorrentes.
              </p>
            </div>

            <div className="p-3 border border-[#E4E7EC] rounded-[3px] bg-[#F8FAFC]">
              <h3 className="font-bold text-[#202B38] mb-1">Taxa de juros</h3>
              <p className="text-[#667085]">
                É a rentabilidade utilizada na simulação. Pode ser informada ao mês ou ao ano. Esclareça que a taxa é uma premissa do cálculo e não uma garantia de retorno futuro.
              </p>
            </div>

            <div className="p-3 border border-[#E4E7EC] rounded-[3px] bg-[#F8FAFC]">
              <h3 className="font-bold text-[#202B38] mb-1">Período</h3>
              <p className="text-[#667085]">
                É o tempo durante o qual o dinheiro ficará investido. Quanto maior o período, maior poderá ser o efeito da capitalização composta, dependendo da rentabilidade considerada.
              </p>
            </div>

            <div className="p-3 border border-[#E4E7EC] rounded-[3px] bg-[#F8FAFC]">
              <h3 className="font-bold text-[#202B38] mb-1">Investimento mensal</h3>
              <p className="text-[#667085]">
                É a quantia que a pessoa pretende adicionar ao investimento todos os meses. Os aportes recorrentes podem aumentar significativamente o patrimônio acumulado ao longo do tempo.
              </p>
            </div>
          </div>
        </section>

        {/* 7. POR QUE UTILIZAR UMA CALCULADORA DE JUROS COMPOSTOS? */}
        <section className="space-y-3 border-t border-[#E4E7EC]/60 pt-6">
          <h2 className="text-sm sm:text-base font-bold text-[#202B38]">
            Por que utilizar uma calculadora de juros compostos?
          </h2>
          <p>
            O simulador financeiro é um recurso valioso para o planejamento orçamentário e patrimonial pessoal, permitindo que qualquer pessoa:
          </p>

          <ul className="space-y-1.5 text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#16804A] font-bold mt-0.5">&bull;</span>
              <span><strong>Planejar objetivos financeiros:</strong> Estimar com clareza o esforço de poupança necessário para metas de curto, médio e longo prazo (como aposentadoria, compra de imóvel ou reserva de emergência).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16804A] font-bold mt-0.5">&bull;</span>
              <span><strong>Simular a formação de patrimônio:</strong> Visualizar com antecedência como pequenas quantias investidas com disciplina podem se multiplicar nas próximas décadas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16804A] font-bold mt-0.5">&bull;</span>
              <span><strong>Entender o efeito dos aportes mensais:</strong> Perceber que a regularidade e consistência dos depósitos muitas vezes pesam mais na construção inicial do que a taxa em si.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16804A] font-bold mt-0.5">&bull;</span>
              <span><strong>Comparar diferentes taxas hipotéticas de rentabilidade:</strong> Testar cenários conservadores e moderados para avaliar a sensibilidade dos resultados.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16804A] font-bold mt-0.5">&bull;</span>
              <span><strong>Estimar quanto tempo pode levar para alcançar uma meta:</strong> Descobrir se aumentar o valor mensal investido encurta anos na conquista do objetivo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16804A] font-bold mt-0.5">&bull;</span>
              <span><strong>Compreender a importância da regularidade:</strong> Constatar que começar mais cedo com valores modestos supera adiar investimentos à espera de quantias elevadas.</span>
            </li>
          </ul>

          <div className="p-3 bg-[#F8FAFC] border border-[#E4E7EC] rounded-[3px] text-xs leading-relaxed">
            <strong>Exemplo de planejamento:</strong> Um jovem de 25 anos que poupa R$ 300,00 por mês a uma taxa média estimada de 0,8% ao mês acumulará aproximadamente R$ 575 mil aos 55 anos (30 anos de aplicação), tendo desembolsado diretamente apenas R$ 108 mil do próprio bolso. Todos os cálculos são estimativas matemáticas que demonstram o poder do fator tempo.
          </div>
        </section>

        {/* 8. COMO INTERPRETAR OS RESULTADOS DA CALCULADORA? */}
        <section className="space-y-3 border-t border-[#E4E7EC]/60 pt-6">
          <h2 className="text-sm sm:text-base font-bold text-[#202B38]">
            Como interpretar os resultados da calculadora?
          </h2>
          <p>
            Após o cálculo, a ferramenta resume os resultados financeiros em três indicadores principais:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="p-3 border border-[#E4E7EC] rounded-[3px] bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#16804A] block mb-1">
                Total em juros
              </h3>
              <p className="text-[#667085]">
                É a diferença entre o patrimônio final e o dinheiro total investido, antes de impostos e custos, conforme as premissas da calculadora.
              </p>
            </div>

            <div className="p-3 border border-[#E4E7EC] rounded-[3px] bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#202B38] block mb-1">
                Valor total investido
              </h3>
              <p className="text-[#667085]">
                É a soma do capital inicial com todos os aportes efetivamente realizados durante a simulação.
              </p>
            </div>

            <div className="p-3 border-2 border-[#202B38] rounded-[3px] bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#202B38] block mb-1">
                Valor total final
              </h3>
              <p className="text-[#667085]">
                É o patrimônio estimado ao final do período, considerando o capital inicial, os aportes e os rendimentos calculados.
              </p>
            </div>
          </div>

          <p>
            O gráfico permite visualizar como o patrimônio pode evoluir ao longo do tempo. A tabela mostra os valores por período, facilitando a análise da evolução dos aportes, dos rendimentos e do saldo acumulado.
          </p>
        </section>

        {/* 9. INFLAÇÃO, IMPOSTOS E RENTABILIDADE REAL */}
        <section className="space-y-3 border-t border-[#E4E7EC]/60 pt-6">
          <h2 className="text-sm sm:text-base font-bold text-[#202B38]">
            Inflação, impostos e rentabilidade real
          </h2>
          <p>
            Ao planejar investimentos para horizontes longos, é essencial compreender que o crescimento nominal do saldo não representa necessariamente o mesmo avanço no poder de compra real:
          </p>

          <ul className="space-y-1.5 text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#667085] font-bold mt-0.5">&bull;</span>
              <span><strong>Impacto da inflação:</strong> A alta generalizada dos preços reduz o poder aquisitivo da moeda com o passar dos anos. Um milhão de reais daqui a 30 anos não comprará a mesma quantidade de bens que compra hoje.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#667085] font-bold mt-0.5">&bull;</span>
              <span><strong>Impostos e taxas:</strong> A depender do ativo financeiro escolhido (como títulos de renda fixa, fundos ou ações), incidem tributos como o Imposto de Renda (tabela regressiva) e eventuais taxas de administração ou custódia, reduzindo o rendimento líquido.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#667085] font-bold mt-0.5">&bull;</span>
              <span><strong>Rentabilidade real:</strong> Corresponde ao retorno do investimento que efetivamente supera a inflação medida no mesmo período, calculado aproximadamente pela fórmula de Fisher.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#667085] font-bold mt-0.5">&bull;</span>
              <span><strong>Particularidades de cada ativo:</strong> Cada produto financeiro possui regras tributárias próprias (isenção de IR em LCIs, LCAs e dividendos vigentes, tributação em fundos com come-cotas, etc.).</span>
            </li>
          </ul>

          <div className="p-3 bg-[#F8FAFC] border border-[#E4E7EC] rounded-[3px] text-[11px] text-[#667085] leading-relaxed">
            <strong>Nota da Calculadora:</strong> Os cálculos efetuados por este simulador são estritamente matemáticos e brutos. A ferramenta não desconta automaticamente alíquotas tributárias nem corrige saldos pela inflação futura, servindo como modelo didático e referencial de análise econômica.
          </div>
        </section>

      </div>
    </article>
  );
};
