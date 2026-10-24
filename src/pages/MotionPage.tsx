// Página de movimiento: acelerómetro y orientación.
import { IonBadge, IonButton, IonIcon, IonNote, IonText } from '@ionic/react';
import { playOutline, stopOutline } from 'ionicons/icons';
import SensorPage from '../components/SensorPage';
import { useAccelerometer } from '../hooks/useAccelerometer';
import './Sensors.css';

const MotionPage: React.FC = () => {
  const { accel, orientation, active, error, start, stop } = useAccelerometer();

  return (
    <SensorPage title="Movimiento">
      <p className="sensor-intro">
        Lee el acelerómetro y la orientación del dispositivo. Mueve el teléfono para ver cómo cambian los
        valores.
      </p>

      <div className="sensor-actions">
        <IonButton onClick={start} disabled={active}>
          <IonIcon slot="start" icon={playOutline} />
          Iniciar lectura
        </IonButton>
        <IonButton fill="outline" color="danger" onClick={stop} disabled={!active}>
          <IonIcon slot="start" icon={stopOutline} />
          Detener
        </IonButton>
        <IonBadge color={active ? 'success' : 'medium'}>{active ? 'Activo' : 'Detenido'}</IonBadge>
      </div>

      {error && (
        <IonText color="danger">
          <p className="sensor-error">{error}</p>
        </IonText>
      )}

      <div className="sensor-panel">
        <h3>Aceleración con gravedad (m/s²)</h3>
        {accel ? (
          <div className="axis-grid">
            <div>
              <span>X</span>
              <strong>{accel.x.toFixed(2)}</strong>
            </div>
            <div>
              <span>Y</span>
              <strong>{accel.y.toFixed(2)}</strong>
            </div>
            <div>
              <span>Z</span>
              <strong>{accel.z.toFixed(2)}</strong>
            </div>
          </div>
        ) : (
          <IonNote>Sin datos. Pulsa "Iniciar lectura".</IonNote>
        )}
      </div>

      <div className="sensor-panel">
        <h3>Orientación (grados/s)</h3>
        {orientation ? (
          <div className="axis-grid">
            <div>
              <span>Alpha</span>
              <strong>{orientation.alpha.toFixed(1)}</strong>
            </div>
            <div>
              <span>Beta</span>
              <strong>{orientation.beta.toFixed(1)}</strong>
            </div>
            <div>
              <span>Gamma</span>
              <strong>{orientation.gamma.toFixed(1)}</strong>
            </div>
          </div>
        ) : (
          <IonNote>Sin datos de orientación.</IonNote>
        )}
      </div>

      <IonNote className="sensor-note">
        En el navegador este sensor puede no existir o pedir permiso. En el teléfono funciona con el
        acelerómetro real.
      </IonNote>
    </SensorPage>
  );
};

export default MotionPage;
