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

  const login = (email, password) => {
    let dbUser = findUserByEmail(email);

    if (dbUser) {
      if (dbUser.password === password) {
        setUser(dbUser);
        localStorage.setItem('@conecta-cidadao:session', JSON.stringify(dbUser));
        return dbUser;
      } else {
        alert("E-mail ou senha incorretos.");
        return null;
      }
    } else {
      alert("Conta não encontrada. Por favor, crie uma conta primeiro.");
      return null;
    }
  };

  const registerAndLogin = (nome, email, password) => {
    try {
      const newUser = registerUser({ name: nome, email, password, role: 'cidadao' });
      setUser(newUser);
      localStorage.setItem('@conecta-cidadao:session', JSON.stringify(newUser));
      return newUser;
    } catch (e) {
      alert(e.message);
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
    <AuthContext.Provider value={{ user, login, registerAndLogin, logout, updateUserSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
