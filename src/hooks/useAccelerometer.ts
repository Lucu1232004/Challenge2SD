// Hook del acelerómetro y la orientación del dispositivo.
import { useEffect, useRef, useState } from 'react';
import { Motion } from '@capacitor/motion';
import type { PluginListenerHandle } from '@capacitor/core';

export interface AccelData {
  x: number;
  y: number;
  z: number;
}

export interface OrientationData {
  alpha: number;
  beta: number;
  gamma: number;
}

export function useAccelerometer() {
  const [accel, setAccel] = useState<AccelData | null>(null);
  const [orientation, setOrientation] = useState<OrientationData | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');
  const accelHandle = useRef<PluginListenerHandle | null>(null);
  const orientationHandle = useRef<PluginListenerHandle | null>(null);

  const stop = async () => {
    await accelHandle.current?.remove();
    await orientationHandle.current?.remove();
    accelHandle.current = null;
    orientationHandle.current = null;
    setActive(false);
  };

  const start = async () => {
    if (active) return;
    setError('');
    try {
      accelHandle.current = await Motion.addListener('accel', (event) => {
        setAccel(event.accelerationIncludingGravity);
      });
      orientationHandle.current = await Motion.addListener('orientation', (event) => {
        setOrientation({
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma,
        });
      });
      setActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron leer los sensores de movimiento.');
    }
  };

  useEffect(() => {
    return () => {
      void accelHandle.current?.remove();
      void orientationHandle.current?.remove();
    };
  }, []);

  return { accel, orientation, active, error, start, stop };
}
