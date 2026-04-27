import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { updateUser, findUserByEmail } from '../services/storage';
import { User, Mail, Lock, Building, Check, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Perfil() {
  const { user, updateUserSession } = useAuth();
  const [salvo, setSalvo] = useState(false);
  const [nome, setNome] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [profilePic, setProfilePic] = useState(user?.profilepic || null);
  const [bannerPic, setBannerPic] = useState(user?.bannerpic || null);
  const [erro, setErro] = useState('');
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const profileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const isInstituicao = user?.role === 'admin' || user?.role === 'orgao' || user?.role === 'parceiro';

  const handleImageUpload = (e, setPic, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setErro('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErro('A imagem deve ter no máximo 2MB.');
      return;
    }

    if (type === 'profile') setUploadingProfile(true);
    else setUploadingBanner(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPic(reader.result);
      if (type === 'profile') setUploadingProfile(false);
      else setUploadingBanner(false);
      setErro('');
    };
    reader.onerror = () => {
      setErro('Erro ao ler a imagem.');
      if (type === 'profile') setUploadingProfile(false);
      else setUploadingBanner(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErro('');
    if (novaSenha && novaSenha !== confirmSenha) { setErro('As senhas não coincidem.'); return; }
    const updates = { name: nome, email };
    if (novaSenha) updates.password = novaSenha;
    if (profilePic) updates.profilepic = profilePic;
    if (bannerPic) updates.bannerpic = bannerPic;
    try {
      await updateUser(user.id, updates);
      // Busca o usuario ATUALIZADO do banco (força leitura fresca)
      const freshUser = await findUserByEmail(user.email);
      if (freshUser) {
        updateUserSession(freshUser);
        setSalvo(true);
        setTimeout(() => setSalvo(false), 3000);
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setErro(`Erro ao salvar: ${error.message}`);
    }
  };

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-[3rem] border border-b-0 border-slate-100 relative overflow-hidden shadow-sm">
            <div
              className="w-full h-48 md:h-64 bg-gradient-to-r from-blue-600 to-blue-400 bg-cover bg-center"
              style={{ backgroundImage: bannerPic ? `url(${bannerPic})` : undefined }}
            ></div>
            <button
              onClick={() => bannerInputRef.current.click()}
              className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-2xl transition-all shadow-sm group disabled:opacity-50"
              title="Alterar Banner"
              disabled={uploadingBanner}
            >
              {uploadingBanner ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <ImageIcon size={22} className="group-hover:scale-110 transition-transform" />
              )}
            </button>

            <div className="px-10 pb-10 flex flex-col md:flex-row md:items-end gap-6 relative">
              <div
                className={`relative -mt-16 md:-mt-20 z-10 w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2rem] p-1.5 shadow-2xl flex-shrink-0 group cursor-pointer hover:scale-105 transition-transform duration-300 ${uploadingProfile ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => !uploadingProfile && profileInputRef.current.click()}
              >
                <div className="w-full h-full bg-blue-50 text-blue-600 rounded-[1.7rem] flex items-center justify-center text-4xl md:text-6xl font-black overflow-hidden relative border border-slate-100">
                  {profilePic ? (
                    <img src={profilePic} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase()
                  )}
                  {uploadingProfile ? (
                    <div className="absolute inset-0 bg-blue-50/90 flex items-center justify-center">
                      <Loader2 size={40} className="animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Camera className="text-white" size={32} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 mt-4 md:mt-0 md:pb-2">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">{user?.name}</h2>
                <p className="text-slate-500 capitalize font-bold tracking-widest text-xs uppercase mt-1">{user?.role === 'cidadao' ? 'Cidadão' : user?.role === 'orgao' ? 'Órgão Público' : user?.role === 'admin' ? 'Administrador' : 'Parceiro'}</p>
                {user?.role === 'cidadao' && (
                  <p className="text-sm text-blue-600 font-black mt-3 bg-blue-50 inline-flex items-center px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">⭐ {user?.pontos || 0} pontos disponíveis</p>
                )}
              </div>
            </div>

            <input
              type="file"
              ref={profileInputRef}
              className="hidden"
              accept="image/*"
              onChange={e => handleImageUpload(e, setProfilePic, 'profile')}
            />
            <input
              type="file"
              ref={bannerInputRef}
              className="hidden"
              accept="image/*"
              onChange={e => handleImageUpload(e, setBannerPic, 'banner')}
            />
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-b-[3rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10">
            {erro && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl font-bold flex items-center gap-2"><Lock size={18} />{erro}</div>}

            <form onSubmit={handleSave} className="space-y-10">
              {/* Dados Pessoais */}
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><User size={18} /></span>
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Nome Completo</label>
                    <div className="relative">
                      <input type="text" value={nome} onChange={e => setNome(e.target.value)} required
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">E-mail Corporativo</label>
                    <div className="relative">
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Institucionais */}
              {isInstituicao && (
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Building size={18} /></span>
                    Dados da Instituição
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Tipo de Perfil</label>
                      <div className="relative">
                        <input type="text" readOnly value={user?.role === 'orgao' ? 'Órgão Público / Prefeitura' : user?.role === 'admin' ? 'Administrador' : 'Parceiro / Empresa'}
                          className="w-full px-6 py-4 rounded-2xl border-none bg-slate-100 text-slate-500 font-bold cursor-not-allowed" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Segurança */}
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><Lock size={18} /></span>
                  Segurança da Conta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Nova Senha</label>
                    <div className="relative">
                      <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="Deixe em branco para manter"
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Confirmar Nova Senha</label>
                    <div className="relative">
                      <input type="password" value={confirmSenha} onChange={e => setConfirmSenha(e.target.value)} placeholder="Repita a nova senha"
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100">
                <button type="submit" className={`px-10 py-4 font-black text-sm uppercase tracking-widest rounded-full shadow-xl transition-all flex items-center gap-3 ${salvo ? 'bg-green-500 text-white shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:-translate-y-1'
                  }`}>
                  {salvo ? <><Check size={20} /> Salvo com sucesso!</> : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
