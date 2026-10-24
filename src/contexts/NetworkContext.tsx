// Contexto de red: comparte el estado de conexión con todas las páginas
// para no crear un listener nuevo en cada una.
import { createContext, useContext, ReactNode } from 'react';
import { useNetwork } from '../hooks/useNetwork';

interface NetworkContextValue {
  connected: boolean;
  networkType: string;
}

const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const network = useNetwork();

  return <NetworkContext.Provider value={network}>{children}</NetworkContext.Provider>;
}

export function useNetworkStatus() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetworkStatus debe usarse dentro de NetworkProvider');
  }
  return context;
}
