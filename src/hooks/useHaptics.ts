// Hook de hápticos: impactos, notificaciones y vibración.
import { useState } from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export function useHaptics() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const run = async (label: string, action: () => Promise<void>) => {
    setError('');
    setMessage('');
    try {
      await action();
      setMessage(label);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'El dispositivo no pudo ejecutar la vibración.');
    }
  };

  return {
    message,
    error,
    impactLight: () => run('Impacto ligero ejecutado.', () => Haptics.impact({ style: ImpactStyle.Light })),
    impactMedium: () => run('Impacto medio ejecutado.', () => Haptics.impact({ style: ImpactStyle.Medium })),
    impactHeavy: () => run('Impacto fuerte ejecutado.', () => Haptics.impact({ style: ImpactStyle.Heavy })),
    notifySuccess: () =>
      run('Notificación de éxito ejecutada.', () => Haptics.notification({ type: NotificationType.Success })),
    notifyWarning: () =>
      run('Notificación de advertencia ejecutada.', () => Haptics.notification({ type: NotificationType.Warning })),
    notifyError: () =>
      run('Notificación de error ejecutada.', () => Haptics.notification({ type: NotificationType.Error })),
    vibrate: () => run('Vibración de 500 ms ejecutada.', () => Haptics.vibrate({ duration: 500 })),
  };
}
