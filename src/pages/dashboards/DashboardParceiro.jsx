import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getAllBenefits, getBenefitsByPartner, addBenefit, deleteBenefit, subscribeToBenefits } from '../../services/storage';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Trash2, Gift, Star, X, Image as ImageIcon, Loader2, Camera } from 'lucide-react';
import Swal from 'sweetalert2';

const categorias = ['Alimentação', 'Lazer', 'Varejo', 'Serviços'];

export default function DashboardParceiro() {
  const { user } = useAuth();
  const [benefits, setBenefits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBenefit, setNewBenefit] = useState({ nome: '', pontos: 0, categoria: 'Alimentação', code: '', imagem: '', descricao: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagemError, setImagemError] = useState('');
  const imagemInputRef = useRef(null);

  const loadBenefits = async () => {
    const data = user?.id ? await getBenefitsByPartner(user.id) : await getAllBenefits();
    setBenefits(data);
  };

  useEffect(() => {
    loadBenefits();
    // Realtime: atualiza lista quando novo benefício for adicionado
    const unsub = subscribeToBenefits(() => {
      loadBenefits();
    });
    return () => {
      if (unsub) unsub();
    }
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImagemError('Selecione apenas imagens.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImagemError('Imagem deve ter no máximo 2MB.');
      return;
    }

    setUploadingImage(true);
    setImagemError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewBenefit({ ...newBenefit, imagem: reader.result });
      setUploadingImage(false);
    };
    reader.onerror = () => {
      setImagemError('Erro ao ler imagem.');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addBenefit({ 
        ...newBenefit, 
        partnerId: user?.id, 
        empresa: user?.name || 'Parceiro' 
      });
      setNewBenefit({ nome: '', pontos: 0, categoria: 'Alimentação', code: '', imagem: '', descricao: '' });
      setShowForm(false);
      await loadBenefits();
      Swal.fire({ icon: 'success', title: 'Benefício Adicionado!', confirmButtonColor: '#2563eb' });
    } catch (error) {
      console.error('Erro ao adicionar benefício:', error);
      Swal.fire({ icon: 'error', title: 'Erro ao Adicionar', text: error.message, confirmButtonColor: '#ef4444' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Excluir benefício?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
      confirmButtonText: 'Excluir', cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteBenefit(id);
        await loadBenefits();
        Swal.fire({ icon: 'success', title: 'Excluído!', confirmButtonColor: '#2563eb' });
      }
    });
  };

  return (
    <DashboardLayout title="Painel do Parceiro">
      <div className="mb-8 bg-blue-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-2">Bem-vindo</p>
            <h2 className="text-3xl font-black">{user?.name}</h2>
            <p className="text-blue-200 text-sm font-medium mt-1">{benefits.length} benefícios cadastrados</p>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-blue-50 transition-all shadow-xl">
            <Plus size={20} /> Novo Benefício
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-30">
            <Gift size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Nenhum benefício cadastrado</p>
          </div>
        ) : benefits.map(b => (
          <div key={b.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
            {b.imagem ? (
              <img src={b.imagem} alt={b.nome} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-40 bg-slate-100 flex items-center justify-center"><Gift size={40} className="text-slate-300" /></div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-lg">{b.categoria}</span>
              </div>
              <h3 className="font-black text-slate-800 mb-1">{b.nome}</h3>
              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-black text-blue-600">{b.pontos} <span className="text-xs font-bold text-slate-400 uppercase">pts</span></span>
                <button onClick={() => handleDelete(b.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-xl font-black">Novo Benefício</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nome do Benefício</label>
                <input required value={newBenefit.nome} onChange={e => setNewBenefit({ ...newBenefit, nome: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Ex: Desconto 10%" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Descrição</label>
                <textarea required value={newBenefit.descricao} onChange={e => setNewBenefit({ ...newBenefit, descricao: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Detalhes de como funciona o benefício..." rows={3}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Custo (Pontos)</label>
                  <input required type="number" value={newBenefit.pontos} onChange={e => setNewBenefit({ ...newBenefit, pontos: parseInt(e.target.value) })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Categoria</label>
                  <select value={newBenefit.categoria} onChange={e => setNewBenefit({ ...newBenefit, categoria: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold">
                    {categorias.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Código do Voucher</label>
                <input value={newBenefit.code} onChange={e => setNewBenefit({ ...newBenefit, code: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Gerado automaticamente se vazio" />
              </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Imagem do Benefício</label>
                 <input 
                   type="file" 
                   ref={imagemInputRef}
                   className="hidden" 
                   accept="image/*" 
                   onChange={handleImageUpload}
                 />
                 <div 
                   onClick={() => imagemInputRef.current.click()}
                   className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all overflow-hidden"
                 >
                   {newBenefit.imagem ? (
                     <img src={newBenefit.imagem} alt="Preview" className="w-full h-full object-contain p-2" />
                   ) : uploadingImage ? (
                     <Loader2 size={32} className="animate-spin text-blue-600" />
                   ) : (
                     <>
                       <ImageIcon size={32} className="text-slate-300 mb-2" />
                       <span className="text-xs text-slate-400 font-medium">Clique para enviar imagem</span>
                     </>
                   )}
                 </div>
                 {imagemError && <p className="text-red-500 text-xs mt-2 font-bold">{imagemError}</p>}
               </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 disabled:opacity-60">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <><Star size={20} /> Adicionar Benefício</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
