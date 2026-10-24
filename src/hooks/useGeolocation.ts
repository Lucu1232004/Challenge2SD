// Hook de geolocalización: posición actual y seguimiento en tiempo real.
import { useState } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';

export function useGeolocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [watchId, setWatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCurrentPosition = async () => {
    setLoading(true);
    setError('');
    try {
      const permissions = await Geolocation.requestPermissions();
      if (permissions.location !== 'granted') {
        setError('No diste permiso para usar la ubicación.');
        return;
      }
      const current = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      setPosition(current);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo obtener la ubicación.');
    } finally {
      setLoading(false);
    }
  };

  const startWatch = async () => {
    if (watchId) return;
    setError('');
    try {
      const permissions = await Geolocation.requestPermissions();
      if (permissions.location !== 'granted') {
        setError('No diste permiso para usar la ubicación.');
        return;
      }
      const id = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (current, err) => {
          if (current) setPosition(current);
          if (err) setError(err.message || 'Error al seguir la ubicación.');
        }
      );
      setWatchId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar el seguimiento.');
    }
  };

  const stopWatch = async () => {
    if (!watchId) return;
    try {
      await Geolocation.clearWatch({ id: watchId });
    } finally {
      setWatchId(null);
    }
  };

  return {
    position,
    watchId,
    loading,
    error,
    getCurrentPosition,
    startWatch,
    stopWatch,
  };
}
