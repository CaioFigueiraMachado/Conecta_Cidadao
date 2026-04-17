import Layout from '../components/Layout';
import { Building, Award, BarChart3, CheckCircle, Send } from 'lucide-react';

export default function Parceiro() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Seja uma Empresa Parceira</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Junte-se à rede de transformação urbana. Ofereça benefícios, engaje com a comunidade e fortaleça a responsabilidade social da sua marca.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Coluna Esquerda: Informações */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Por que ser parceiro?</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Visibilidade de Marca</h3>
                    <p className="text-sm text-slate-500 mt-1">Sua empresa em destaque para milhares de cidadãos ativos.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Engajamento Real</h3>
                    <p className="text-sm text-slate-500 mt-1">Conecte-se com pessoas que estão ativamente melhorando a cidade.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Relatórios de Impacto</h3>
                    <p className="text-sm text-slate-500 mt-1">Receba métricas de ESG detalhadas sobre o impacto das suas ações.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Selo Cidadão</h3>
                    <p className="text-sm text-slate-500 mt-1">Certificado oficial de Empresa Parceira da Cidade Inteligente.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500 p-8 rounded-2xl shadow-md text-white">
              <h2 className="text-xl font-bold mb-6">Como funciona?</h2>
              <ol className="space-y-4 list-decimal list-inside text-sm text-blue-50">
                <li>Você preenche o formulário de interesse.</li>
                <li>Nossa equipe analisa a proposta.</li>
                <li>Definimos juntos os benefícios (descontos, cortesias, brindes).</li>
                <li>Sua empresa entra no catálogo de recompensas do app!</li>
              </ol>
            </div>

          </div>

          {/* Coluna Direita: Formulário */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Formulário de Solicitação</h2>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nome da Empresa</label>
                    <input type="text" placeholder="Ex: Mercado Compre Bem" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">CNPJ</label>
                    <input type="text" placeholder="00.000.000/0000-00" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Responsável</label>
                    <input type="text" placeholder="Nome Completo" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Cargo</label>
                    <input type="text" placeholder="Ex: Gerente de Marketing" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">E-mail Corporativo</label>
                    <input type="email" placeholder="contato@empresa.com.br" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Telefone / WhatsApp</label>
                    <input type="text" placeholder="(00) 00000-0000" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Qual sua ideia de parceria?</label>
                  <textarea rows="3" placeholder="Conte-nos um pouco sobre a sua empresa e por que deseja se juntar ao Conecta Cidadão..." className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Benefícios que deseja oferecer (Exemplos)</label>
                  <textarea rows="2" placeholder="Ex: 10% de desconto em compras acima de R$100, ingressos cortesias..." className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"></textarea>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2 mt-4">
                  <Send size={20} /> Enviar Solicitação
                </button>
                <p className="text-xs text-center text-slate-400 mt-4">
                  Ao enviar, você concorda com nossos Termos de Uso e Política de Privacidade.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
