// Hook de notificaciones push: registro, token y escucha de mensajes.
import { useEffect, useRef, useState } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import type { PluginListenerHandle } from '@capacitor/core';

export function usePushNotifications() {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const handles = useRef<PluginListenerHandle[]>([]);

  const register = async () => {
    setError('');
    setMessage('');
    try {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== 'granted') {
        setError('No hay permiso para recibir notificaciones push.');
        return;
      }
      await PushNotifications.register();
      setMessage('Registro solicitado. Esperando el token del dispositivo...');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Push notifications no está disponible en este entorno. En web requiere configuración adicional.'
      );
    }
  };

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      try {
        const listeners = await Promise.all([
          PushNotifications.addListener('registration', (newToken) => {
            if (!cancelled) {
              setToken(newToken.value);
              setMessage('Token recibido correctamente.');
            }
          }),
          PushNotifications.addListener('registrationError', (registrationError) => {
            if (!cancelled) setError(`Error de registro: ${registrationError.error}`);
          }),
          PushNotifications.addListener('pushNotificationReceived', (notification) => {
            if (!cancelled) setMessage(`Notificación recibida: ${notification.title || 'sin título'}`);
          }),
          PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
            if (!cancelled) setMessage(`Notificación abierta: ${action.notification.title || 'sin título'}`);
          }),
        ]);
        if (!cancelled) handles.current = listeners;
      } catch {
        // En web el plugin puede no estar disponible; se avisa al intentar registrar.
      }
    };

    void setup();

    return () => {
      cancelled = true;
      handles.current.forEach((handle) => {
        void handle.remove();
      });
      handles.current = [];
    };
  }, []);

  return { token, message, error, register };
}
