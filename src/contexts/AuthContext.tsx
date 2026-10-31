// Contexto de autenticación: comparte el usuario, la sesión y el perfil
// con todas las páginas de la app.
import { createContext, useContext, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useProfile } from '../hooks/useProfile';
import type { Profile } from '../hooks/useProfile';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  logout: () => Promise<void>;
  updateAvatar: (file: Blob) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, session, loading, login, register, logout } = useSupabaseAuth();
  const { profile, loading: profileLoading, updateAvatar, refreshProfile } = useProfile(user);

  const value: AuthContextValue = {
    user,
    session,
    profile,
    loading,
    profileLoading,
    login,
    register,
    logout,
    updateAvatar,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para consumir el contexto desde cualquier componente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
