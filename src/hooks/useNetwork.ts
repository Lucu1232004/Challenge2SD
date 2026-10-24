// Hook que detecta si el dispositivo tiene conexión a internet.
// Usa el plugin de red de Capacitor y escucha los cambios de estado.
import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';
import type { PluginListenerHandle } from '@capacitor/core';

export function useNetwork() {
  const [connected, setConnected] = useState(true);
  const [networkType, setNetworkType] = useState('unknown');

  useEffect(() => {
    let listener: PluginListenerHandle | undefined;

    const start = async () => {
      const status = await Network.getStatus();
      setConnected(status.connected);
      setNetworkType(status.connectionType);

      listener = await Network.addListener('networkStatusChange', (newStatus) => {
        setConnected(newStatus.connected);
        setNetworkType(newStatus.connectionType);
      });
    };

    start();

    return () => {
      listener?.remove();
    };
  }, []);

  return { connected, networkType };
}
