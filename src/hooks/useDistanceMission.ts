// Hook de la misión de movimiento: mide la distancia desde el punto inicial.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';

const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function distanceInMeters(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
) {
  const deltaLatitude = toRadians(to.latitude - from.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);
  const latitude1 = toRadians(from.latitude);
  const latitude2 = toRadians(to.latitude);

  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(deltaLongitude / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

export function useDistanceMission(onDistance: (distance: number) => void) {
  const [distance, setDistance] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');
  const startPosition = useRef<{ latitude: number; longitude: number } | null>(null);
  const watchId = useRef<string | null>(null);

  const stop = useCallback(async () => {
    if (watchId.current) {
      await Geolocation.clearWatch({ id: watchId.current });
      watchId.current = null;
    }
    setActive(false);
  }, []);

  const start = useCallback(async () => {
    setError('');
    try {
      try {
        const permission = await Geolocation.requestPermissions();
        if (permission.location !== 'granted') {
          setError('No diste permiso para usar la ubicación.');
          return;
        }
      } catch {
        // En web requestPermissions no está implementado; el navegador pide el permiso
        // directamente al llamar a getCurrentPosition.
      }

      const current = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      startPosition.current = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };
      setPosition(current);
      setDistance(0);

      watchId.current = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (nextPosition, watchError) => {
          if (watchError) {
            setError(watchError.message || 'Error al seguir la ubicación.');
            return;
          }
          if (!nextPosition || !startPosition.current) return;

          const nextDistance = distanceInMeters(startPosition.current, {
            latitude: nextPosition.coords.latitude,
            longitude: nextPosition.coords.longitude,
          });
          setPosition(nextPosition);
          setDistance(nextDistance);
          onDistance(nextDistance);
        }
      );
      setActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar la medición.');
    }
  }, [onDistance]);

  useEffect(() => {
    return () => {
      if (watchId.current) {
        void Geolocation.clearWatch({ id: watchId.current });
      }
    };
  }, []);

  return { distance, position, active, error, start, stop };
}
