// Página de notificaciones push: registro del dispositivo y token.
import { IonButton, IonIcon, IonNote, IonText } from '@ionic/react';
import { cloudUploadOutline, copyOutline } from 'ionicons/icons';
import SensorPage from '../components/SensorPage';
import { usePushNotifications } from '../hooks/usePushNotifications';
import './Sensors.css';

const PushNotificationsPage: React.FC = () => {
  const { token, message, error, register } = usePushNotifications();

  const copyToken = async () => {
    if (token) {
      await navigator.clipboard.writeText(token);
    }
  };

  return (
    <SensorPage title="Notificaciones push">
      <p className="sensor-intro">
        Registra el dispositivo para recibir notificaciones enviadas desde Firebase Cloud Messaging.
      </p>

      <div className="sensor-actions">
        <IonButton onClick={register}>
          <IonIcon slot="start" icon={cloudUploadOutline} />
          Registrar dispositivo
        </IonButton>
        <IonButton fill="outline" onClick={copyToken} disabled={!token}>
          <IonIcon slot="start" icon={copyOutline} />
          Copiar token
        </IonButton>
      </div>

      {message && (
        <IonText color="success">
          <p>{message}</p>
        </IonText>
      )}
      {error && (
        <IonText color="danger">
          <p className="sensor-error">{error}</p>
        </IonText>
      )}

      <div className="sensor-panel">
        <h3>Token del dispositivo</h3>
        {token ? (
          <p className="push-token">{token}</p>
        ) : (
          <IonNote>Todavía no hay token. Pulsa "Registrar dispositivo".</IonNote>
        )}
      </div>

      <IonNote className="sensor-note">
        En Android hace falta descargar el archivo google-services.json del proyecto Firebase y volver a
        sincronizar. En el navegador este plugin no está disponible.
      </IonNote>
    </SensorPage>
  );
};

export default PushNotificationsPage;
