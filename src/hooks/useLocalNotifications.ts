// Hook de notificaciones locales: permisos, programación y cancelación.
import { useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface PendingNotification {
  id: number;
  title: string;
  body: string;
}

export function useLocalNotifications() {
  const [pending, setPending] = useState<PendingNotification[]>([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const requestPermission = async () => {
    setError('');
    try {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') {
        setError('No hay permiso para mostrar notificaciones.');
        return false;
      }
      setStatus('Permiso de notificaciones concedido.');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo pedir el permiso.');
      return false;
    }
  };

  const loadPending = async () => {
    setError('');
    try {
      const result = await LocalNotifications.getPending();
      setPending(
        result.notifications.map((notification) => ({
          id: notification.id,
          title: notification.title || 'Sin título',
          body: notification.body || '',
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron consultar las notificaciones pendientes.');
    }
  };

  const schedule = async () => {
    setStatus('');
    const granted = await requestPermission();
    if (!granted) return;
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Date.now() / 1000) % 100000,
            title: 'Recordatorio de sensores',
            body: 'Esta notificación se programó desde la app.',
            schedule: { at: new Date(Date.now() + 5000) },
          },
        ],
      });
      setStatus('Notificación programada para dentro de 5 segundos.');
      await loadPending();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo programar la notificación.');
    }
  };

  const cancelAll = async () => {
    setError('');
    try {
      await LocalNotifications.cancelAll();
      setStatus('Notificaciones pendientes canceladas.');
      await loadPending();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cancelar las notificaciones.');
    }
  };

  return { pending, status, error, requestPermission, schedule, loadPending, cancelAll };
}
