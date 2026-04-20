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
    setConfig(getSystemConfig());
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    saveSystemConfig(config);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      window.location.reload();
    }, 1500);
  };

  return (
    <DashboardLayout title="Configurações do Sistema">
      <div className="max-w-4xl space-y-10 pb-20">
        
        {/* Header Hero */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl font-black mb-3 tracking-tight">Painel de Controle</h2>
            <p className="text-slate-400 font-medium max-w-lg">Gerencie as diretrizes globais, e-mails de suporte e segurança da plataforma Conecta Cidadão.</p>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-[2.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-4 animate-in slide-in-from-top-4 shadow-sm">
            <div className="bg-green-600 text-white p-2 rounded-xl"><CheckCircle2 size={20} /></div>
            Configurações atualizadas com sucesso!
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Global Config */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-10 group hover:border-blue-100 transition-all flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-sm"><Globe size={24} /></div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Geral</h3>
            </div>

            <div className="space-y-8 w-full">
              <div className="relative group flex flex-col items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Nome da Plataforma</label>
                <input required type="text" value={config.platformName} onChange={e => setConfig({...config, platformName: e.target.value})} className="w-full text-center px-8 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black text-slate-700" />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">E-mail de Suporte</label>
                <input required type="email" value={config.supportEmail} onChange={e => setConfig({...config, supportEmail: e.target.value})} className="w-full text-center px-8 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black text-slate-700" />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Idioma Oficial</label>
                <select value={config.language} onChange={e => setConfig({...config, language: e.target.value})} className="w-full text-center px-8 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black text-slate-700 appearance-none">
                  <option>Português (Brasil)</option>
                  <option>English (US)</option>
                  <option>Español</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Config */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-10 group hover:border-orange-100 transition-all flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 shadow-sm"><Shield size={24} /></div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Segurança</h3>
            </div>

            <div className="space-y-6 w-full">
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-50 gap-4">
                <div>
                  <p className="text-sm font-black text-slate-800">Modo Manutenção</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bloqueia acesso público</p>
                </div>
                <input type="checkbox" checked={config.maintenanceMode} onChange={e => setConfig({...config, maintenanceMode: e.target.checked})} className="w-14 h-7 bg-slate-200 checked:bg-blue-600 rounded-full appearance-none cursor-pointer transition-all relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-5 after:h-5 after:rounded-full after:transition-all checked:after:left-8 shadow-inner" />
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-50 gap-4">
                <div>
                  <p className="text-sm font-black text-slate-800">Logs de Auditoria</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registrar toda ação</p>
                </div>
                <input type="checkbox" checked={config.auditLogs} onChange={e => setConfig({...config, auditLogs: e.target.checked})} className="w-14 h-7 bg-slate-200 checked:bg-blue-600 rounded-full appearance-none cursor-pointer transition-all relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-5 after:h-5 after:rounded-full after:transition-all checked:after:left-8 shadow-inner" />
              </div>

              <div className="flex flex-col items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Tempo de Sessão (min)</label>
                <input type="number" value={config.sessionTimeout} onChange={e => setConfig({...config, sessionTimeout: e.target.value})} className="w-full text-center px-8 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-black text-slate-700" />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="md:col-span-2 flex justify-center pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-xl hover:bg-blue-700 shadow-[0_20px_40px_rgba(59,130,246,0.2)] transition-all flex items-center gap-4 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <Save size={24} /> SALVAR ALTERAÇÕES
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}
