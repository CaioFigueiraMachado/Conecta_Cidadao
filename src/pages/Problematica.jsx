import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { AlertTriangle, MapPin, Zap, Trash2, Accessibility, Droplets, ArrowRight } from 'lucide-react';

export default function Problematica() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">A Problemática Urbana</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Entenda os desafios que enfrentamos e como a nossa solução propõe transformar a realidade das cidades.
          </p>
        </div>

        {/* Desafios */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="text-red-500">〰</span> Desafios Urbanos Recorrentes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-100 transition-all">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-3">
                <MapPin size={18} className="text-slate-400" /> Vias e Conservação
              </h3>
              <p className="text-sm text-slate-500 font-medium">Buracos e má conservação do asfalto que causam acidentes e danos aos veículos.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-100 transition-all">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-3">
                <Zap size={18} className="text-slate-400" /> Iluminação Pública
              </h3>
              <p className="text-sm text-slate-500 font-medium">Ruas escuras que aumentam a sensação de insegurança e o risco de crimes.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-100 transition-all">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-3">
                <Trash2 size={18} className="text-slate-400" /> Acúmulo de Lixo
              </h3>
              <p className="text-sm text-slate-500 font-medium">Descarte irregular que atrai pragas e causa problemas de saúde pública.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-100 transition-all">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-3">
                <Accessibility size={18} className="text-slate-400" /> Acessibilidade
              </h3>
              <p className="text-sm text-slate-500 font-medium">Calçadas quebradas e falta de rampas que excluem pessoas com mobilidade reduzida.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-100 transition-all md:col-span-2">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-3">
                <Droplets size={18} className="text-slate-400" /> Drenagem
              </h3>
              <p className="text-sm text-slate-500 font-medium">Bocas de lobo entupidas que resultam em alagamentos durante as chuvas.</p>
            </div>
          </div>
        </div>

        {/* Impactos */}
        <div className="mb-16 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-8">Impactos na Sociedade</h2>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <span className="text-red-500 mt-1.5 text-[8px]">●</span>
              <span className="text-slate-600 font-medium">Queda drástica na qualidade de vida dos moradores da região.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-red-500 mt-1.5 text-[8px]">●</span>
              <span className="text-slate-600 font-medium">Redução da mobilidade urbana e aumento no tempo de deslocamento.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-red-500 mt-1.5 text-[8px]">●</span>
              <span className="text-slate-600 font-medium">Diminuição da segurança pública em áreas mal iluminadas e abandonadas.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-red-500 mt-1.5 text-[8px]">●</span>
              <span className="text-slate-600 font-medium">Desvalorização imobiliária de bairros inteiros.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-red-500 mt-1.5 text-[8px]">●</span>
              <span className="text-slate-600 font-medium">Desperdício de recursos públicos devido à falta de planejamento preventivo.</span>
            </li>
          </ul>
        </div>

        {/* Solução */}
        <div className="bg-blue-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-100">
          <div className="absolute right-[-10%] top-[-10%] w-80 h-80 border-[20px] border-white/5 rounded-full"></div>
          <h2 className="text-3xl font-bold mb-10 relative z-10">A Solução: Conecta Cidadão</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 relative z-10">
            <div>
              <h3 className="text-lg font-bold mb-3 text-blue-100">Reporte Fácil</h3>
              <p className="text-sm text-blue-50 leading-relaxed font-medium">Aplicativo mobile e web para reportar problemas em 3 cliques com foto e GPS.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3 text-blue-100">Tempo Real</h3>
              <p className="text-sm text-blue-50 leading-relaxed font-medium">Acompanhamento do status da sua denúncia, do registro até a resolução.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3 text-blue-100">Gamificação</h3>
              <p className="text-sm text-blue-50 leading-relaxed font-medium">Sistema de pontos e recompensas que viabiliza a participação ativa do cidadão.</p>
            </div>
          </div>

          <Link to="/login" className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all shadow-xl relative z-10 text-sm">
            Fazer Parte da Solução <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </Layout>
  );
}
