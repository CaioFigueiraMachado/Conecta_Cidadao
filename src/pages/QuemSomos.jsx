import Layout from '../components/Layout';
import { Info, Target, Eye, Heart, AlertCircle, Zap, Shield, Award, Users, Leaf } from 'lucide-react';

export default function QuemSomos() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Sobre o Conecta Cidadão</h1>
          <p className="text-lg text-slate-500">Empoderando cidadãos para construir cidades inteligentes e humanas.</p>
        </div>

        <div className="space-y-8">
          {/* Quem Somos */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-6">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0 mt-1">
              <Info size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">Quem Somos</h2>
              <p className="text-slate-600 leading-relaxed">
                Somos uma plataforma cívica inovadora que atua como ponte entre a população e os agentes de transformação da cidade — poder público, ONGs, projetos sociais e empresas parceiras. O Conecta Cidadão nasceu da crença de que a tecnologia, aliada à participação social ativa, é o caminho mais rápido e eficiente para a melhoria da infraestrutura urbana.
              </p>
            </div>
          </section>

          {/* As Dificuldades */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-6">
            <div className="bg-red-100 text-red-500 p-3 rounded-full flex-shrink-0 mt-1">
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">As Dificuldades</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                As grandes e médias cidades sofrem com problemas crônicos de infraestrutura: ruas esburacadas, falta de iluminação, calçadas intransitáveis, praças abandonadas e pontos de descarte irregular de lixo.
              </p>
              <p className="text-slate-600 leading-relaxed">
                A prefeitura e os órgãos competentes frequentemente não possuem capilaridade para mapear todos esses problemas em tempo real. Por outro lado, o cidadão sente-se frustrado e sem canais eficientes para reportar essas demandas e, principalmente, para acompanhar suas resoluções. O resultado é a degradação urbana, o desperdício de recursos públicos e a queda na qualidade de vida.
              </p>
            </div>
          </section>

          {/* Missão e Visão */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
                <Target size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">Nossa Missão</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Democratizar a gestão urbana oferecendo uma ferramenta acessível para que qualquer cidadão possa relatar problemas da cidade, garantindo que as demandas cheguem aos responsáveis de forma organizada, georreferenciada e priorizada por dados inteligentes.
              </p>
            </section>

            <section className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
                <Eye size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">Nossa Visão</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Ser a principal rede de inteligência cidadã do país, transformando todas as cidades conectadas em ambientes inteligentes, colaborativos, seguros e sustentáveis — onde cada relato é tratado como um dado valioso para a gestão pública.
              </p>
            </section>
          </div>

          {/* Nossos Valores */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Heart size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Nossos Valores</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Shield size={16} className="text-blue-500" /> Transparência</h3>
                <p className="text-xs text-slate-500">Dados abertos e visíveis para todos no mapa inteligente da cidade.</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Users size={16} className="text-blue-500" /> Engajamento</h3>
                <p className="text-xs text-slate-500">Acreditamos no poder da ação coletiva e da voz do cidadão.</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Zap size={16} className="text-blue-500" /> Inovação Social</h3>
                <p className="text-xs text-slate-500">Uso de tecnologia de ponta para resolver problemas reais da sociedade.</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Leaf size={16} className="text-blue-500" /> Sustentabilidade</h3>
                <p className="text-xs text-slate-500">Foco na recuperação de espaços e qualidade de vida no longo prazo.</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Award size={16} className="text-blue-500" /> Reconhecimento</h3>
                <p className="text-xs text-slate-500">Valorizar e recompensar a cidadania ativa pelo nosso sistema de benefícios.</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Heart size={16} className="text-blue-500" /> Empatia</h3>
                <p className="text-xs text-slate-500">Garantir acessibilidade e segurança para todos os transeuntes urbanos.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
