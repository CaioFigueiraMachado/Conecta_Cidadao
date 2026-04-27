import { createContext, useContext, useState, useEffect } from 'react';
import { findUserByEmail, registerUser, subscribeToUser } from '../services/storage';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('@conecta-cidadao:session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Realtime: atualiza pontos automaticamente quando o banco muda
  useEffect(() => {
    if (!user?.id) return;
    const unsub = subscribeToUser(user.id, (payload) => {
      if (payload.new) {
        const updated = { ...user, ...payload.new };
        setUser(updated);
        localStorage.setItem('@conecta-cidadao:session', JSON.stringify(updated));
      }
    });
    return unsub;
  }, [user?.id]);

  const login = async (email, password) => {
    const dbUser = await findUserByEmail(email);
    if (!dbUser) {
      Swal.fire({ icon: 'warning', title: 'Usuário não encontrado', text: 'Por favor, crie uma conta primeiro.', confirmButtonColor: '#2563eb' });
      return null;
    }
    if (dbUser.password !== password) {
      Swal.fire({ icon: 'error', title: 'Acesso Negado', text: 'E-mail ou senha incorretos.', confirmButtonColor: '#2563eb' });
      return null;
    }
    setUser(dbUser);
    localStorage.setItem('@conecta-cidadao:session', JSON.stringify(dbUser));
    return dbUser;
  };

  const registerAndLogin = async (nome, email, password) => {
    try {
      const newUser = await registerUser({ name: nome, email, password, role: 'cidadao' });
      setUser(newUser);
      localStorage.setItem('@conecta-cidadao:session', JSON.stringify(newUser));
      return newUser;
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Erro no Cadastro', text: e.message, confirmButtonColor: '#2563eb' });
      return null;
    }
  };

  const updateUserSession = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('@conecta-cidadao:session', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@conecta-cidadao:session');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerAndLogin, logout, updateUserSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
