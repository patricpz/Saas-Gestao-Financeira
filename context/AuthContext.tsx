  import { api } from '@/lib/services/api';
  import { createContext, useContext, useState, useEffect } from 'react';
  import type { ReactNode } from 'react';

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  }

  interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Recuperar autenticação ao carregar a página
    useEffect(() => {
      const savedToken = localStorage.getItem('gestao:token');
      const savedUser = localStorage.getItem('gestao:user');
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
      try {
        setIsLoading(true);

        const response = await api.post('/auth/login', { email, password }, { timeout: 5000 });

        const data = response.data;
        setToken(data.token);
        setUser(data.user);
        
        localStorage.setItem('gestao:token', data.token);
        localStorage.setItem('gestao:user', JSON.stringify(data.user));
      } catch (error) {
        setUser(null);
        setToken(null);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    const logout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('gestao:token');
      localStorage.removeItem('gestao:user');
    };

    return (
      <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
    return context;
  }