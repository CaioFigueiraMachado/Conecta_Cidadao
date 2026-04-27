import Layout from '../components/Layout';
import { Info, Target, Eye, Heart, Shield, Award, Users, CheckCircle2, Accessibility, Zap, Droplets } from 'lucide-react';

export default function QuemSomos() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Sobre o Conecta Cidadão</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Empoderando cidadãos para construir cidades inteligentes e humanas.
          </p>
        </div>

        <div className="space-y-8">
          {/* Card: Quem Somos */}
          <section className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-600 text-white p-2.5 rounded-xl">
                <Info size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Quem Somos</h2>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Somos uma plataforma cívica inovadora que atua como ponte entre a população e os agentes de transformação da cidade (poder público, ONGs, projetos sociais e empresas parceiras). O Conecta Cidadão nasceu da crença de que a tecnologia, aliada à participação social ativa, é o caminho mais rápido e eficiente para a melhoria da infraestrutura urbana.
            </p>
          </section>

          {/* Card: As Dificuldades */}
          <section className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-600 text-white p-2.5 rounded-xl">
                <Info size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">As Dificuldades</h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
              <p>
                As grandes e médias cidades sofrem com problemas crônicos de infraestrutura: ruas esburacadas, falta de iluminação, calçadas intransitáveis, praças abandonadas e pontos de descarte irregular de lixo.
              </p>
              <p>
                A prefeitura e os órgãos competentes frequentemente não possuem capilaridade para mapear todos esses problemas em tempo real. Por outro lado, o cidadão sente-se frustrado e sem canais eficientes para reportar essas demandas e, principalmente, para acompanhar suas resoluções. O resultado é a degradação urbana, o desperdício de recursos públicos e a queda na qualidade de vida e segurança.
              </p>
            </div>
          </section>

          {/* Grid: Missão e Visão */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50/30 p-10 rounded-[2.5rem] border border-blue-100/50 shadow-sm">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-6">
                <Target size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Nossa Missão</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-sm">
                Democratizar a gestão urbana oferecendo uma ferramenta acessível para que qualquer cidadão possa relatar problemas da cidade, garantindo que as demandas cheguem aos responsáveis de forma organizada, georreferenciada e priorizada através de dados inteligentes.
              </p>
            </div>

            <div className="bg-blue-50/30 p-10 rounded-[2.5rem] border border-blue-100/50 shadow-sm">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-6">
                <Eye size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Nossa Visão</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-sm">
                Ser a principal rede de inteligência cidadã do país, transformando todas as cidades conectadas em ambientes inteligentes, colaborativos, seguros e sustentáveis até 2030, onde cada relato é tratado como um dado valioso para a gestão.
              </p>
            </div>
          </div>

          {/* Card: Nossos Valores */}
          <section className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-blue-600 text-white p-2.5 rounded-xl">
                <Heart size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Nossos Valores</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { title: 'Transparência', desc: 'Dados abertos e visíveis para todos no mapa inteligente da cidade.' },
                { title: 'Engajamento', desc: 'Acreditamos profundamente no poder da ação coletiva e da voz do cidadão.' },
                { title: 'Inovação Social', desc: 'Uso da tecnologia de ponta para resolver problemas reais da sociedade.' },
                { title: 'Sustentabilidade', desc: 'Foco na recuperação de espaços e qualidade de vida no longo prazo.' },
                { title: 'Reconhecimento', desc: 'Valorizar e recompensar a cidadania ativa através do nosso sistema de benefícios.' },
                { title: 'Empatia', desc: 'Garantir acessibilidade e segurança para todos os transeuntes urbanos.' },
              ].map((v, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50">
                  <h4 className="font-bold text-slate-800 mb-2">{v.title}</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
