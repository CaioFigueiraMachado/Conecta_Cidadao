import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { AlertTriangle, MapPin, Zap, Trash2, Accessibility, Droplets } from 'lucide-react';

export default function Problematica() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">A Problemática Urbana</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Entenda os desafios que enfrentamos e como a nossa solução propõe transformar a realidade das cidades.
          </p>
        </div>

        {/* Desafios */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2 border-b border-slate-200 pb-4">
            <span className="text-red-500">📉</span> Desafios Urbanos Recorrentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <MapPin size={18} className="text-slate-400" /> Vias e Conservação
              </h3>
              <p className="text-sm text-slate-600">Buracos e má conservação do asfalto que causam acidentes e danos aos veículos.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Zap size={18} className="text-slate-400" /> Iluminação Pública
              </h3>
              <p className="text-sm text-slate-600">Ruas escuras que aumentam a sensação de insegurança e o risco de crimes.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Trash2 size={18} className="text-slate-400" /> Acúmulo de Lixo
              </h3>
              <p className="text-sm text-slate-600">Descarte irregular que atrai pragas e causa problemas de saúde pública.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Accessibility size={18} className="text-slate-400" /> Acessibilidade
              </h3>
              <p className="text-sm text-slate-600">Calçadas quebradas e falta de rampas que excluem pessoas com mobilidade reduzida.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Droplets size={18} className="text-slate-400" /> Drenagem
              </h3>
              <p className="text-sm text-slate-600">Bocas de lobo entupidas que resultam em alagamentos durante as chuvas.</p>
            </div>
          </div>
        </div>

        {/* Impactos */}
        <div className="mb-16 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Impactos na Sociedade</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-1">◼</span>
              <span className="text-slate-700">Queda drástica na qualidade de vida dos moradores da região.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-1">◼</span>
              <span className="text-slate-700">Redução da mobilidade urbana e aumento no tempo de deslocamento.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-1">◼</span>
              <span className="text-slate-700">Diminuição da segurança pública em áreas mal iluminadas e abandonadas.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-1">◼</span>
              <span className="text-slate-700">Desvalorização imobiliária de bairros inteiros.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-1">◼</span>
              <span className="text-slate-700">Desperdício de recursos públicos devido à falta de planejamento preventivo.</span>
            </li>
          </ul>
        </div>

        {/* Solução */}
        <div className="bg-blue-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl">
          {/* Decorative circles */}
          <div className="absolute right-0 top-0 w-64 h-64 border-4 border-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute right-0 top-0 w-48 h-48 border-4 border-white/10 rounded-full -mr-12 -mt-12"></div>
          
          <h2 className="text-3xl font-bold mb-8 relative z-10">A Solução: Conecta Cidadão</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 relative z-10">
            <div>
              <h3 className="text-lg font-bold mb-2 text-blue-200">Reporte Fácil</h3>
              <p className="text-sm text-blue-50">Aplicativo mobile e web para reportar problemas em 3 cliques com foto e GPS.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 text-blue-200">Tempo Real</h3>
              <p className="text-sm text-blue-50">Acompanhamento do status da sua denúncia, do registro até a resolução.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 text-blue-200">Gamificação</h3>
              <p className="text-sm text-blue-50">Sistema de pontos e recompensas que viabiliza a participação ativa do cidadão.</p>
            </div>
          </div>

          <Link to="/login" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors relative z-10">
            Fazer Parte da Solução <span className="text-lg">+</span>
          </Link>
        </div>

      </div>
    </Layout>
  );
}
