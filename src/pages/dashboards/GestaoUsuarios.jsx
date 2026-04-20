import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getAllUsers, updateUser, registerUser } from '../../services/storage';
import { Pencil, Plus, X, Check, Shield, Users, Landmark, User, Search, Filter, MoreHorizontal, Trash2 } from 'lucide-react';

const roleLabel = (role) => ({ cidadao: 'Cidadão', orgao: 'Órgão Público', admin: 'Admin', parceiro: 'Parceiro' }[role] || role);
const roleColor = (role) => ({ 
  admin: 'bg-purple-50 text-purple-600 border-purple-100', 
  orgao: 'bg-indigo-50 text-indigo-600 border-indigo-100', 
  parceiro: 'bg-pink-50 text-pink-600 border-pink-100', 
  cidadao: 'bg-blue-50 text-blue-600 border-blue-100' 
}[role] || 'bg-slate-50 text-slate-600 border-slate-100');

export default function GestaoUsuarios() {
  const [users, setUsers] = useState(getAllUsers());
  const [filtro, setFiltro] = useState('todos');
  const [editando, setEditando] = useState(null);
  const [showNovo, setShowNovo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cidadao' });
  const [novoForm, setNovoForm] = useState({ name: '', email: '', password: '', role: 'orgao' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const reload = () => setUsers(getAllUsers());
  const filtrados = (filtro === 'todos' ? users : users.filter(u => u.role === filtro))
    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const abrirEdicao = (u) => {
    setEditando(u.id);
    setForm({ name: u.name, email: u.email, password: u.password, role: u.role });
    setErro('');
  };

  const salvarEdicao = () => {
    if (!form.name || !form.email) { setErro('Campos obrigatórios!'); return; }
    updateUser(editando, form);
    reload();
    setEditando(null);
    setSucesso('Usuário atualizado!');
    setTimeout(() => setSucesso(''), 3000);
  };

  const criarUsuario = () => {
    setErro('');
    if (!novoForm.name || !novoForm.email || !novoForm.password) { setErro('Preencha tudo!'); return; }
    try {
      registerUser(novoForm);
      reload();
      setShowNovo(false);
      setNovoForm({ name: '', email: '', password: '', role: 'orgao' });
      setSucesso('Usuário criado!');
      setTimeout(() => setSucesso(''), 3000);
    } catch (e) { setErro(e.message); }
  };

  return (
    <DashboardLayout title="Gestão Estratégica de Usuários">
      
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
        <div className="flex-1 flex flex-col md:flex-row gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou e-mail..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
            />
          </div>
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {['todos', 'cidadao', 'orgao', 'parceiro'].map(f => (
              <button key={f} onClick={() => setFiltro(f)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filtro === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowNovo(true)} className="bg-blue-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">
          <Plus size={20} /> ADICIONAR USUÁRIO
        </button>
      </div>

      {sucesso && (
        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl border border-green-100 flex items-center gap-3 animate-in slide-in-from-top-4">
          <Check size={18} className="bg-green-600 text-white rounded-full p-0.5" />
          <span className="text-xs font-black uppercase tracking-widest">{sucesso}</span>
        </div>
      )}

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo / Perfil</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pontuação</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtrados.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg border border-blue-100">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        {editando === u.id ? (
                          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-3 py-1.5 bg-slate-100 border-none rounded-lg font-bold text-sm focus:ring-2 focus:ring-blue-500 mb-1 block" />
                        ) : (
                          <p className="text-sm font-black text-slate-800">{u.name}</p>
                        )}
                        {editando === u.id ? (
                          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="px-3 py-1.5 bg-slate-100 border-none rounded-lg font-bold text-xs focus:ring-2 focus:ring-blue-500 block" />
                        ) : (
                          <p className="text-xs font-bold text-slate-400">{u.email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    {editando === u.id ? (
                      <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="px-3 py-1.5 bg-slate-100 border-none rounded-lg font-black text-xs">
                        <option value="cidadao">Cidadão</option>
                        <option value="orgao">Órgão</option>
                        <option value="parceiro">Parceiro</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${roleColor(u.role)}`}>
                        {roleLabel(u.role)}
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-800">{u.pontos ?? 0}</span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase">PTS</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {editando === u.id ? (
                        <>
                          <button onClick={salvarEdicao} className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-green-100 transition-all"><Check size={18} /></button>
                          <button onClick={() => setEditando(null)} className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-all"><X size={18} /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => abrirEdicao(u)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Pencil size={18} /></button>
                          <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNovo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Novo Acesso</h3>
              <button onClick={() => setShowNovo(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              {erro && <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm">{erro}</div>}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Nome / Organização</label>
                <input value={novoForm.name} onChange={e => setNovoForm({...novoForm, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">E-mail Corporativo</label>
                <input type="email" value={novoForm.email} onChange={e => setNovoForm({...novoForm, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Senha de Acesso</label>
                <input type="text" value={novoForm.password} onChange={e => setNovoForm({...novoForm, password: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Senha provisória" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Perfil de Acesso</label>
                <div className="grid grid-cols-2 gap-3">
                  {['orgao', 'parceiro', 'cidadao', 'admin'].map(r => (
                    <button key={r} onClick={() => setNovoForm({...novoForm, role: r})} className={`p-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${novoForm.role === r ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100' : 'bg-slate-50 text-slate-400 border-slate-50 hover:bg-slate-100'}`}>
                      {roleLabel(r)}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={criarUsuario} className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all mt-4">FINALIZAR CADASTRO</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
