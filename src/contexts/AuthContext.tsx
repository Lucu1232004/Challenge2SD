// Contexto de autenticación: comparte el estado del usuario y las funciones
// de login, registro y logout con todas las páginas de la app.
import { createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook para consumir el contexto desde cualquier componente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
