import DashboardLayout from '../../components/DashboardLayout';

export default function Configuracoes() {
  return (
    <DashboardLayout title="Configurações do Sistema">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Configurações Gerais</h3>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nome da Plataforma</label>
            <input type="text" defaultValue="Conecta Cidadão" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">E-mail de Suporte</label>
            <input type="email" defaultValue="suporte@conectacidadao.com" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="manutencao" className="w-4 h-4 text-blue-600" />
            <label htmlFor="manutencao" className="text-sm font-medium text-slate-700">Ativar Modo de Manutenção</label>
          </div>
          <button type="button" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold mt-4 hover:bg-blue-700">
            Salvar Configurações
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
