import { createContext, useContext, useState, useEffect } from 'react';
import { findUserByEmail, registerUser } from '../services/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Restaurar sessão
    const savedUser = localStorage.getItem('@conecta-cidadao:session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password, role) => {
    // 1. Verifica se já existe um usuário com esse e-mail no LocalStorage
    let dbUser = findUserByEmail(email);

    if (dbUser) {
      // Se existir, checa a senha
      if (dbUser.password === password && dbUser.role === role) {
        setUser(dbUser);
        localStorage.setItem('@conecta-cidadao:session', JSON.stringify(dbUser));
        return true;
      } else {
        alert("E-mail, senha ou tipo de conta incorretos.");
        return false;
      }
    } else {
      alert("Conta não encontrada. Por favor, crie uma conta primeiro.");
      return false;
    }
  };

  const registerAndLogin = (nome, email, password, role) => {
    try {
      const newUser = registerUser({ name: nome, email, password, role });
      setUser(newUser);
      localStorage.setItem('@conecta-cidadao:session', JSON.stringify(newUser));
      return true;
    } catch (e) {
      alert(e.message);
      return false;
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
    <AuthContext.Provider value={{ user, login, registerAndLogin, logout, updateUserSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
