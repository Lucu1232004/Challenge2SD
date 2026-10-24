// Página de notificaciones locales: permisos, programación y pendientes.
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonNote, IonText } from '@ionic/react';
import { notificationsOutline, timeOutline, trashOutline } from 'ionicons/icons';
import SensorPage from '../components/SensorPage';
import { useLocalNotifications } from '../hooks/useLocalNotifications';
import './Sensors.css';

const LocalNotificationsPage: React.FC = () => {
  const { pending, status, error, requestPermission, schedule, loadPending, cancelAll } =
    useLocalNotifications();

  return (
    <SensorPage title="Notificaciones locales">
      <p className="sensor-intro">
        Pide permiso, programa un recordatorio para dentro de cinco segundos y revisa las notificaciones
        pendientes.
      </p>

      <div className="sensor-actions">
        <IonButton fill="outline" onClick={requestPermission}>
          <IonIcon slot="start" icon={notificationsOutline} />
          Pedir permiso
        </IonButton>
        <IonButton onClick={schedule}>
          <IonIcon slot="start" icon={timeOutline} />
          Programar en 5 segundos
        </IonButton>
        <IonButton fill="outline" onClick={loadPending}>
          Ver pendientes
        </IonButton>
        <IonButton fill="outline" color="danger" onClick={cancelAll}>
          <IonIcon slot="start" icon={trashOutline} />
          Cancelar todas
        </IonButton>
      </div>

      {status && (
        <IonText color="success">
          <p>{status}</p>
        </IonText>
      )}
      {error && (
        <IonText color="danger">
          <p className="sensor-error">{error}</p>
        </IonText>
      )}

      <div className="sensor-panel">
        <h3>Notificaciones pendientes</h3>
        {pending.length === 0 ? (
          <IonNote>No hay notificaciones pendientes.</IonNote>
        ) : (
          <IonList>
            {pending.map((notification) => (
              <IonItem key={notification.id}>
                <IonLabel>
                  <h2>{notification.title}</h2>
                  <p>{notification.body}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </div>

      <IonNote className="sensor-note">
        En Android 13 o superior hay que conceder el permiso de notificaciones. En el navegador el
        comportamiento depende del sistema y del permiso del sitio.
      </IonNote>
    </SensorPage>
  );
};

export default LocalNotificationsPage;
