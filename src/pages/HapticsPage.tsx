// Página de hápticos: impactos, notificaciones y vibración.
import { IonButton, IonIcon, IonNote, IonText } from '@ionic/react';
import { pulseOutline } from 'ionicons/icons';
import SensorPage from '../components/SensorPage';
import { useHaptics } from '../hooks/useHaptics';
import './Sensors.css';

const HapticsPage: React.FC = () => {
  const {
    message,
    error,
    impactLight,
    impactMedium,
    impactHeavy,
    notifySuccess,
    notifyWarning,
    notifyError,
    vibrate,
  } = useHaptics();

  return (
    <SensorPage title="Hápticos">
      <p className="sensor-intro">
        Envía vibraciones y respuestas táctiles. En el teléfono se sienten; en el navegador depende del
        dispositivo y del permiso del sistema.
      </p>

      <div className="sensor-panel">
        <h3>Impactos</h3>
        <div className="sensor-actions">
          <IonButton size="small" onClick={impactLight}>
            Ligero
          </IonButton>
          <IonButton size="small" onClick={impactMedium}>
            Medio
          </IonButton>
          <IonButton size="small" onClick={impactHeavy}>
            Fuerte
          </IonButton>
        </div>
      </div>

      <div className="sensor-panel">
        <h3>Notificaciones hápticas</h3>
        <div className="sensor-actions">
          <IonButton size="small" color="success" onClick={notifySuccess}>
            Éxito
          </IonButton>
          <IonButton size="small" color="warning" onClick={notifyWarning}>
            Advertencia
          </IonButton>
          <IonButton size="small" color="danger" onClick={notifyError}>
            Error
          </IonButton>
        </div>
      </div>

      <div className="sensor-panel">
        <h3>Vibración</h3>
        <IonButton expand="block" fill="outline" onClick={vibrate}>
          <IonIcon slot="start" icon={pulseOutline} />
          Vibrar durante 500 ms
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

      <IonNote className="sensor-note">
        Si el dispositivo no tiene motor de vibración, la llamada termina sin error y no se siente nada.
      </IonNote>
    </SensorPage>
  );
};

export default HapticsPage;
