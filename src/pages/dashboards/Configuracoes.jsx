import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Save, Shield, Bell, Globe, Mail, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getSystemConfig, saveSystemConfig } from '../../services/storage';

export default function Configuracoes() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState({
    platformName: 'Conecta Cidadão', supportEmail: 'admin@conectacidadao.com', language: 'Português (Brasil)', maintenanceMode: false, auditLogs: true, sessionTimeout: 60
  });

  useEffect(() => {
    getSystemConfig().then(setConfig);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await saveSystemConfig(config);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <DashboardLayout title="Configurações">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        
        {/* Header Hero */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2 tracking-tight">Configurações do Sistema</h2>
            <p className="text-slate-400 text-sm font-medium max-w-lg">Gerencie as diretrizes globais e segurança da plataforma.</p>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-3 animate-in slide-in-from-top-4">
            <CheckCircle2 size={18} className="text-green-600" />
            Configurações salvas com sucesso!
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Global Config */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8 flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Globe size={24} /></div>
              <h3 className="text-lg font-bold text-slate-800">Geral</h3>
            </div>

            <div className="space-y-6 w-full">
              <div className="flex flex-col items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nome da Plataforma</label>
                <input required type="text" value={config.platformName} onChange={e => setConfig({...config, platformName: e.target.value})} className="w-full text-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700" />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">E-mail de Suporte</label>
                <input required type="email" value={config.supportEmail} onChange={e => setConfig({...config, supportEmail: e.target.value})} className="w-full text-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700" />
              </div>
            </div>
          </div>

          {/* Security Config */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8 flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-orange-50 p-3 rounded-xl text-orange-600"><Shield size={24} /></div>
              <h3 className="text-lg font-bold text-slate-800">Segurança</h3>
            </div>

            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 w-full">
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Modo Manutenção</p>
                  <p className="text-[9px] font-medium text-slate-400 uppercase">Bloqueia acesso público</p>
                </div>
                <input type="checkbox" checked={config.maintenanceMode} onChange={e => setConfig({...config, maintenanceMode: e.target.checked})} className="w-10 h-5 bg-slate-200 checked:bg-blue-600 rounded-full appearance-none cursor-pointer transition-all relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-all checked:after:left-5" />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 w-full">
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Logs de Auditoria</p>
                  <p className="text-[9px] font-medium text-slate-400 uppercase">Registrar ações</p>
                </div>
                <input type="checkbox" checked={config.auditLogs} onChange={e => setConfig({...config, auditLogs: e.target.checked})} className="w-10 h-5 bg-slate-200 checked:bg-blue-600 rounded-full appearance-none cursor-pointer transition-all relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-all checked:after:left-5" />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="md:col-span-2 flex justify-center pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-3 hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-widest"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <Save size={20} /> Salvar Alterações
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}
