import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { updateUser } from '../services/storage';
import { User, Mail, Lock, Building, Check } from 'lucide-react';

export default function Perfil() {
  const { user, updateUserSession } = useAuth();
  const [salvo, setSalvo] = useState(false);
  const [nome, setNome] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [erro, setErro] = useState('');

  const isInstituicao = user?.role === 'admin' || user?.role === 'orgao' || user?.role === 'parceiro';

  const handleSave = (e) => {
    e.preventDefault();
    setErro('');

    if (novaSenha && novaSenha !== confirmSenha) {
      setErro('As senhas não coincidem.'); return;
    }

    const updates = { name: nome, email };
    if (novaSenha) updates.password = novaSenha;

    const updated = updateUser(user.id, updates);
    if (updated) {
      updateUserSession(updated);
      setSalvo(true);
      setTimeout(() => setSalvo(false), 3000);
    }
  };

  return (
    <DashboardLayout title="Meu Perfil">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl p-8 border border-b-0 border-slate-100 flex items-end gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-blue-400"></div>
          <div className="relative z-10 w-24 h-24 bg-white rounded-full p-1 shadow-md">
            <div className="w-full h-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
          <div className="relative z-10 pb-2">
            <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-slate-500 capitalize">{user?.role === 'cidadao' ? 'Cidadão' : user?.role === 'orgao' ? 'Órgão Público' : user?.role === 'admin' ? 'Administrador' : 'Parceiro'}</p>
            {user?.role === 'cidadao' && (
              <p className="text-sm text-blue-600 font-medium mt-1">⭐ {user?.pontos || 0} pontos</p>
            )}
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-b-2xl p-8 border border-slate-100 shadow-sm">
          {erro && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg">{erro}</div>}

          <form onSubmit={handleSave} className="space-y-8">
            {/* Dados Pessoais */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Institucionais */}
            {isInstituicao && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Dados da Instituição</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Perfil</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" readOnly value={user?.role === 'orgao' ? 'Órgão Público / Prefeitura' : user?.role === 'admin' ? 'Administrador' : 'Parceiro / Empresa'}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Segurança */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Alterar Senha</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="Deixe em branco para manter"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirmar Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" value={confirmSenha} onChange={e => setConfirmSenha(e.target.value)} placeholder="Repita a nova senha"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
              <button type="submit" className={`px-8 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                salvo ? 'bg-green-500 text-white shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
              }`}>
                {salvo ? <><Check size={18} /> Salvo!</> : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
