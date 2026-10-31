// Notificaciones locales para avisar el inicio, el fin o los avisos del rastreo.
import { LocalNotifications } from '@capacitor/local-notifications';

export async function notify(title: string, body: string): Promise<void> {
  try {
    const permission = await LocalNotifications.checkPermissions();
    if (permission.display !== 'granted') {
      const requested = await LocalNotifications.requestPermissions();
      if (requested.display !== 'granted') return;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: Math.floor(Math.random() * 2147483647),
          title,
          body,
          schedule: { at: new Date(Date.now() + 1000) },
        },
      ],
    });
  } catch (err) {
    console.warn('No se pudo mostrar la notificación:', err);
  }
}
