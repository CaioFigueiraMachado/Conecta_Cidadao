import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getAllUsers, updateUser, registerUser } from '../../services/storage';
import { Pencil, Plus, X, Check, Shield, Users, Landmark, User } from 'lucide-react';

const roleLabel = (role) => ({ cidadao: 'Cidadão', orgao: 'Órgão Público', admin: 'Admin', parceiro: 'Parceiro' }[role] || role);
const roleColor = (role) => ({ admin: 'bg-purple-100 text-purple-700', orgao: 'bg-indigo-100 text-indigo-700', parceiro: 'bg-pink-100 text-pink-700', cidadao: 'bg-blue-100 text-blue-700' }[role] || 'bg-slate-100 text-slate-700');

export default function GestaoUsuarios() {
  const [users, setUsers] = useState(getAllUsers());
  const [filtro, setFiltro] = useState('todos');
  const [editando, setEditando] = useState(null); // usuário sendo editado
  const [showNovo, setShowNovo] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cidadao' });
  const [novoForm, setNovoForm] = useState({ name: '', email: '', password: '', role: 'orgao' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const reload = () => setUsers(getAllUsers());

  const filtrados = filtro === 'todos' ? users : users.filter(u => u.role === filtro);

  const abrirEdicao = (u) => {
    setEditando(u.id);
    setForm({ name: u.name, email: u.email, password: u.password, role: u.role });
    setErro('');
  };

  const salvarEdicao = () => {
    if (!form.name || !form.email) { setErro('Nome e e-mail são obrigatórios.'); return; }
    updateUser(editando, form);
    reload();
    setEditando(null);
    setSucesso('Usuário atualizado com sucesso!');
    setTimeout(() => setSucesso(''), 3000);
  };

  const criarUsuario = () => {
    setErro('');
    if (!novoForm.name || !novoForm.email || !novoForm.password) { setErro('Preencha todos os campos.'); return; }
    try {
      registerUser(novoForm);
      reload();
      setShowNovo(false);
      setNovoForm({ name: '', email: '', password: '', role: 'orgao' });
      setSucesso('Usuário criado com sucesso!');
      setTimeout(() => setSucesso(''), 3000);
    } catch (e) { setErro(e.message); }
  };

  return (
    <DashboardLayout title="Gestão de Usuários">

      {/* Modal Novo Usuário */}
      {showNovo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Adicionar Novo Usuário</h3>
              <button onClick={() => { setShowNovo(false); setErro(''); }}><X size={22} className="text-slate-400 hover:text-slate-700" /></button>
            </div>
            {erro && <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded-lg">{erro}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo / Instituição</label>
                <input value={novoForm.name} onChange={e => setNovoForm({...novoForm, name: e.target.value})} placeholder="Ex: Prefeitura de São Paulo" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
                <input type="email" value={novoForm.email} onChange={e => setNovoForm({...novoForm, email: e.target.value})} placeholder="contato@prefeitura.gov.br" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Senha Inicial</label>
                <input type="password" value={novoForm.password} onChange={e => setNovoForm({...novoForm, password: e.target.value})} placeholder="••••••••" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Perfil / Cargo</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { role: 'orgao', label: 'Órgão Público', icon: Landmark },
                    { role: 'parceiro', label: 'Parceiro/Empresa', icon: Shield },
                    { role: 'cidadao', label: 'Cidadão', icon: User },
                    { role: 'admin', label: 'Administrador', icon: Shield },
                  ].map(({ role, label, icon: Icon }) => (
                    <button key={role} type="button" onClick={() => setNovoForm({...novoForm, role})}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${novoForm.role === role ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <Icon size={16} />{label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowNovo(false); setErro(''); }} className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50">Cancelar</button>
              <button onClick={criarUsuario} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Criar Usuário</button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de ações */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          {['todos', 'cidadao', 'orgao', 'parceiro', 'admin'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filtro === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {f === 'todos' ? 'Todos' : roleLabel(f)} ({f === 'todos' ? users.length : users.filter(u => u.role === f).length})
            </button>
          ))}
        </div>
        <button onClick={() => { setShowNovo(true); setErro(''); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          <Plus size={18} /> Adicionar Usuário
        </button>
      </div>

      {sucesso && <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-lg flex items-center gap-2"><Check size={16} /> {sucesso}</div>}

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Usuário</th>
                <th className="p-4 font-semibold">E-mail</th>
                <th className="p-4 font-semibold">Cargo / Perfil</th>
                <th className="p-4 font-semibold">Pontos</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtrados.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Nenhum usuário encontrado.</td></tr>
              ) : filtrados.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    {editando === u.id ? (
                      <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                        className="border border-blue-300 rounded-lg px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    ) : (
                      <div className="flex items-center gap-2 font-medium text-slate-800">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        {u.name}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-slate-600">
                    {editando === u.id ? (
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                        className="border border-blue-300 rounded-lg px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    ) : u.email}
                  </td>
                  <td className="p-4">
                    {editando === u.id ? (
                      <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                        className="border border-blue-300 rounded-lg px-2 py-1 text-sm focus:outline-none">
                        <option value="cidadao">Cidadão</option>
                        <option value="orgao">Órgão Público</option>
                        <option value="parceiro">Parceiro</option>
                        <option value="admin">Administrador</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${roleColor(u.role)}`}>{roleLabel(u.role)}</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-600">{u.pontos ?? '—'}</td>
                  <td className="p-4 text-right">
                    {editando === u.id ? (
                      <div className="flex justify-end gap-2">
                        {erro && <span className="text-red-500 text-xs mr-2">{erro}</span>}
                        <button onClick={() => { setEditando(null); setErro(''); }} className="text-slate-400 hover:text-slate-700 p-1"><X size={18} /></button>
                        <button onClick={salvarEdicao} className="text-green-600 hover:text-green-800 p-1"><Check size={18} /></button>
                      </div>
                    ) : (
                      <button onClick={() => abrirEdicao(u)} className="text-slate-400 hover:text-blue-600 p-1 transition-colors">
                        <Pencil size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
