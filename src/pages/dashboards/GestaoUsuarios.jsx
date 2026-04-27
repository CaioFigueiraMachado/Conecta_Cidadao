import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getAllUsers, updateUser, registerUser, deleteUser } from '../../services/storage';
import { Pencil, Plus, X, Check, Search, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const roleLabel = (role) => ({ cidadao: 'Cidadão', orgao: 'Órgão Público', admin: 'Admin', parceiro: 'Parceiro' }[role] || role);
const roleColor = (role) => ({ admin: 'bg-purple-50 text-purple-600 border-purple-100', orgao: 'bg-indigo-50 text-indigo-600 border-indigo-100', parceiro: 'bg-pink-50 text-pink-600 border-pink-100', cidadao: 'bg-blue-50 text-blue-600 border-blue-100' }[role] || 'bg-slate-50 text-slate-600 border-slate-100');

export default function GestaoUsuarios() {
  const [users, setUsers] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [editando, setEditando] = useState(null);
  const [showNovo, setShowNovo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cidadao' });
  const [novoForm, setNovoForm] = useState({ name: '', email: '', password: '', role: 'orgao' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const reload = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  useEffect(() => { reload(); }, []);

  const filtrados = (filtro === 'todos' ? users : users.filter(u => u.role === filtro))
    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const abrirEdicao = (u) => { setEditando(u.id); setForm({ name: u.name, email: u.email, password: u.password, role: u.role }); setErro(''); };

  const salvarEdicao = async () => {
    if (!form.name || !form.email) { setErro('Campos obrigatórios!'); return; }
    await updateUser(editando, form);
    await reload();
    setEditando(null);
    setSucesso('Usuário atualizado!');
    setTimeout(() => setSucesso(''), 3000);
  };

  const criarUsuario = async () => {
    setErro('');
    if (!novoForm.name || !novoForm.email || !novoForm.password) { setErro('Preencha tudo!'); return; }
    try {
      await registerUser(novoForm);
      await reload();
      setShowNovo(false);
      setNovoForm({ name: '', email: '', password: '', role: 'orgao' });
      setSucesso('Usuário criado!');
      setTimeout(() => setSucesso(''), 3000);
    } catch (e) { setErro(e.message); }
  };

  const deletarUsuario = async (u) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: `Você está prestes a excluir o usuário ${u.name}. Esta ação não pode ser desfeita.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(u.id);
        await reload();
        Swal.fire('Excluído!', 'O usuário foi removido com sucesso.', 'success');
      } catch (error) {
        Swal.fire('Erro!', `Não foi possível excluir: ${error.message}`, 'error');
      }
    }
  };

  return (
    <DashboardLayout title="Gestão Estratégica de Usuários">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="flex-1 flex flex-col md:flex-row gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Pesquisar usuários..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-sm" />
          </div>
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
            {['todos', 'cidadao', 'orgao', 'parceiro'].map(f => (
              <button key={f} onClick={() => setFiltro(f)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filtro === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{f}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowNovo(true)} className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center gap-3 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
          <Plus size={20} /> Novo Usuário
        </button>
      </div>

      {sucesso && (
        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl border border-green-100 flex items-center gap-3 animate-in slide-in-from-top-4">
          <Check size={18} className="bg-green-600 text-white rounded-full p-0.5" />
          <span className="text-xs font-bold uppercase tracking-wider">{sucesso}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Identificação</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Perfil</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Pontos</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-200 overflow-hidden">
                         {u.profilepic || u.profilePic ? <img src={u.profilepic || u.profilePic} className="w-full h-full object-cover" alt="" /> : u.name.charAt(0).toUpperCase()}
                       </div>
                      <div>
                        {editando === u.id ? (
                          <><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-sm focus:ring-2 focus:ring-blue-500 mb-1 block" />
                          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-xs focus:ring-2 focus:ring-blue-500 block" /></>
                        ) : (
                          <><p className="text-sm font-bold text-slate-800">{u.name}</p><p className="text-xs font-medium text-slate-400">{u.email}</p></>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {editando === u.id ? (
                      <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-xs">
                        <option value="cidadao">Cidadão</option><option value="orgao">Órgão</option><option value="parceiro">Parceiro</option><option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${roleColor(u.role)}`}>{roleLabel(u.role)}</span>
                    )}
                  </td>
                  <td className="px-6 py-5"><span className="text-sm font-bold text-slate-800">{u.pontos ?? 0} <span className="text-[10px] text-slate-400 ml-0.5">PTS</span></span></td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {editando === u.id ? (
                        <><button onClick={salvarEdicao} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md"><Check size={16} /></button>
                        <button onClick={() => setEditando(null)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200"><X size={16} /></button></>
                      ) : (
                        <>
                          <button onClick={() => abrirEdicao(u)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Pencil size={16} /></button>
                          <button onClick={() => deletarUsuario(u)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Novo Acesso</h3>
              <button onClick={() => setShowNovo(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              {erro && <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 font-bold text-xs">{erro}</div>}
              <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Nome Completo</label><input value={novoForm.name} onChange={e => setNovoForm({ ...novoForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold" /></div>
              <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">E-mail</label><input type="email" value={novoForm.email} onChange={e => setNovoForm({ ...novoForm, email: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold" /></div>
              <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Senha Provisória</label><input type="text" value={novoForm.password} onChange={e => setNovoForm({ ...novoForm, password: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold" /></div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Perfil</label>
                <div className="grid grid-cols-2 gap-2">
                  {['orgao', 'parceiro', 'cidadao', 'admin'].map(r => (
                    <button key={r} onClick={() => setNovoForm({ ...novoForm, role: r })} className={`py-2 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-wider ${novoForm.role === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'}`}>{roleLabel(r)}</button>
                  ))}
                </div>
              </div>
              <button onClick={criarUsuario} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md mt-2 uppercase tracking-wider">Criar Usuário</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
