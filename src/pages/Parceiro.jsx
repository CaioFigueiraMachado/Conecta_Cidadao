import { useState } from 'react';
import Layout from '../components/Layout';
import { Building, Send, Loader2, CheckCircle, Briefcase, Globe, BarChart3, Heart, Rocket, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { addPartnerRequest } from '../services/storage';

export default function Parceiro() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    empresa: '', cnpj: '', responsavel: '', cargo: '', email: '', telefone: '', ideia: '', beneficios: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addPartnerRequest(form);
      setSuccess(true);
      setForm({ empresa: '', cnpj: '', responsavel: '', cargo: '', email: '', telefone: '', ideia: '', beneficios: '' });
      setTimeout(() => setSuccess(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Building size={24} />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Seja uma Empresa Parceira</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Junte-se à rede de transformação urbana. Ofereça benefícios, engaje com a comunidade e fortaleça a responsabilidade social da sua marca.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Benefits & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <h3 className="text-xl font-bold text-slate-800 mb-8">Por que ser parceiro?</h3>
              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: 'Visibilidade de Marca', desc: 'Sua empresa em destaque para milhares de cidadãos ativos.' },
                  { icon: Heart, title: 'Engajamento Real', desc: 'Conecte-se com pessoas que estão ativamente melhorando a cidade.' },
                  { icon: BarChart3, title: 'Relatórios de Impacto', desc: 'Receba métricas de ESG detalhadas sobre o impacto das suas ações.' },
                  { icon: Award, title: 'Selo Cidadão', desc: 'Certificado oficial de Empresa Parceira da Cidade Inteligente.' },
                ].map((v, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl h-fit">
                      <v.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">{v.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-blue-100">
              <h3 className="text-xl font-bold mb-6">Como funciona?</h3>
              <ul className="space-y-5 text-sm font-medium text-blue-50">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
                  Você preenche o formulário de interesse.
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
                  Nossa equipe analisa a proposta.
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
                  Definimos juntos os benefícios (descontos, cortesias).
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">4</span>
                  Sua empresa entra no catálogo de recompensas do app!
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <section className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)]">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Formulário de Solicitação</h2>
              
              {success ? (
                <div className="bg-green-50 border border-green-100 p-12 rounded-[2rem] text-center">
                  <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Solicitação Enviada!</h3>
                  <p className="text-green-600 font-medium leading-relaxed">Nossa equipe analisará sua proposta e entrará em contato em breve.</p>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Nome da Empresa</label>
                      <input required type="text" value={form.empresa} onChange={e => setForm({...form, empresa: e.target.value})} placeholder="Ex: Mercado Compre Bem" className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">CNPJ</label>
                      <input required type="text" value={form.cnpj} onChange={e => setForm({...form, cnpj: e.target.value})} placeholder="00.000.000/0000-00" className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Nome do Responsável</label>
                      <input required type="text" value={form.responsavel} onChange={e => setForm({...form, responsavel: e.target.value})} placeholder="Nome Completo" className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Cargo</label>
                      <input required type="text" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} placeholder="Ex: Gerente de Marketing" className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">E-mail Corporativo</label>
                      <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="contato@empresa.com.br" className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Telefone / WhatsApp</label>
                      <input required type="text" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} placeholder="(00) 00000-0000" className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Qual sua ideia de parceria?</label>
                    <textarea required rows="4" value={form.ideia} onChange={e => setForm({...form, ideia: e.target.value})} placeholder="Conte-nos um pouco sobre a sua empresa e por que deseja se juntar ao Conecta Cidadão..." className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium resize-none"></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Benefícios que deseja oferecer (Exemplos)</label>
                    <textarea required rows="3" value={form.beneficios} onChange={e => setForm({...form, beneficios: e.target.value})} placeholder="Ex: 10% de desconto em compras acima de R$100, Ingressos cortesias às terças, etc." className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium resize-none"></textarea>
                  </div>

                  <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white rounded-xl font-bold py-4 hover:bg-blue-700 transition-all flex justify-center items-center gap-3 disabled:opacity-70 shadow-lg shadow-blue-100">
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    {loading ? 'Enviando Solicitação...' : 'Enviar Solicitação'}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-medium">Ao enviar, você concorda com nossos Termos de Uso e Política de Privacidade.</p>
                </form>
              )}
            </section>
          </div>

        </div>
      </div>
    </Layout>
  );
}
