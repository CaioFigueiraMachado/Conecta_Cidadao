import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, User, Landmark, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('cidadao');
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, registerAndLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let success = false;

    if (isLogin) {
      success = login(email, password, role);
    } else {
      if (!nome.trim()) { setError('Por favor, informe seu nome.'); setLoading(false); return; }
      success = registerAndLogin(nome, email, password, role);
    }

    setLoading(false);

    if (success) {
      if (role === 'admin') navigate('/dashboard/admin');
      else if (role === 'orgao') navigate('/dashboard/orgao');
      else navigate('/dashboard/cidadao');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Conecta Cidadão" className="w-12 h-12 object-contain" />
          <span className="font-bold text-2xl text-slate-800">
            Conecta <span className="font-normal text-slate-600">Cidadão</span>
          </span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? 'Ou ' : 'Já tem uma conta? '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-medium text-blue-600 hover:text-blue-500">
            {isLogin ? ' cadastre-se agora' : 'faça login aqui'}
          </button>
        </p>
        {!isLogin && (
          <p className="mt-2 text-center text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
            🔑 Conta de <strong>Admin</strong> para testes: <strong>admin@conectacidadao.com</strong> / senha: <strong>123</strong>
          </p>
        )}
        {isLogin && (
          <p className="mt-2 text-center text-xs text-blue-700 bg-blue-50 p-2 rounded-lg">
            🔑 Admin padrão: <strong>admin@conectacidadao.com</strong> / <strong>123</strong>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-100">

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              {isLogin ? 'Como você quer entrar?' : 'Que tipo de conta deseja criar?'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={() => setRole('cidadao')}
                className={`flex flex-col items-center p-3 rounded-xl border ${role === 'cidadao' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                <User size={20} className="mb-1" /><span className="text-xs font-medium">Cidadão</span>
              </button>
              <button type="button" onClick={() => setRole('orgao')}
                className={`flex flex-col items-center p-3 rounded-xl border ${role === 'orgao' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                <Landmark size={20} className="mb-1" /><span className="text-xs font-medium">Órgão/Pref</span>
              </button>
              <button type="button" onClick={() => setRole('admin')}
                className={`flex flex-col items-center p-3 rounded-xl border ${role === 'admin' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                <Shield size={20} className="mb-1" /><span className="text-xs font-medium">Admin</span>
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}
                  placeholder="João da Silva" required
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900"> Manter Login</label>
                </div>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Esqueceu a senha?</a>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {loading ? 'Aguarde...' : isLogin ? `Entrar como ${role === 'cidadao' ? 'Cidadão' : role === 'orgao' ? 'Órgão' : 'Admin'}` : 'Criar Conta e Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
              <ArrowLeft size={16} /> Voltar para o Início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
