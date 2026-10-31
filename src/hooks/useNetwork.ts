// Hook del estado de la red: conectado, tipo de conexión y cambios.
import { useEffect, useState } from 'react';
import type { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';

export function useNetwork() {
  const [connected, setConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    let active = true;
    let handle: PluginListenerHandle | null = null;

    void Network.getStatus().then((status) => {
      if (!active) return;
      setConnected(status.connected);
      setConnectionType(status.connectionType);
    });

    void Network.addListener('networkStatusChange', (status) => {
      setConnected(status.connected);
      setConnectionType(status.connectionType);
    }).then((listener) => {
      if (active) handle = listener;
      else void listener.remove();
    });

    return () => {
      active = false;
      void handle?.remove();
    };
  }, []);

  return { connected, connectionType };
}
