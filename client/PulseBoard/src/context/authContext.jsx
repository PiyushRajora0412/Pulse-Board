import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  async function refresh() {
    const token = getToken();
    if (!token) {
      setUser(null);
      setReady(true);
      return;
    }
    try {
      const me = await api.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, refresh, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
