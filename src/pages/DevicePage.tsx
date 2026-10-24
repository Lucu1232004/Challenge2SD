// Página de información del dispositivo y la batería.
import { IonButton, IonIcon, IonNote, IonSpinner, IonText } from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';
import SensorPage from '../components/SensorPage';
import { useDevice } from '../hooks/useDevice';
import './Sensors.css';

const DevicePage: React.FC = () => {
  const { data, loading, error, load } = useDevice();

  return (
    <SensorPage title="Dispositivo">
      <p className="sensor-intro">
        Información del modelo, el sistema operativo, la batería y el identificador que el dispositivo le da
        a la app.
      </p>

      <div className="sensor-actions">
        <IonButton onClick={load} disabled={loading}>
          <IonIcon slot="start" icon={refreshOutline} />
          Actualizar
        </IonButton>
        {loading && <IonSpinner name="dots" />}
      </div>

      {error && (
        <IonText color="danger">
          <p className="sensor-error">{error}</p>
        </IonText>
      )}

      {data ? (
        <div className="sensor-panel">
          <div className="sensor-row">
            <span>Modelo</span>
            <strong>{data.model || 'No disponible'}</strong>
          </div>
          <div className="sensor-row">
            <span>Fabricante</span>
            <strong>{data.manufacturer || 'No disponible'}</strong>
          </div>
          <div className="sensor-row">
            <span>Plataforma</span>
            <strong>{data.platform}</strong>
          </div>
          <div className="sensor-row">
            <span>Sistema operativo</span>
            <strong>
              {data.operatingSystem} {data.osVersion}
            </strong>
          </div>
          <div className="sensor-row">
            <span>WebView</span>
            <strong>{data.webViewVersion || 'No disponible'}</strong>
          </div>
          <div className="sensor-row">
            <span>¿Es virtual?</span>
            <strong>{data.isVirtual ? 'Sí' : 'No'}</strong>
          </div>
          <div className="sensor-row">
            <span>Batería</span>
            <strong>
              {data.batteryLevel !== null ? `${Math.round(data.batteryLevel * 100)}%` : 'No disponible'}
            </strong>
          </div>
          <div className="sensor-row">
            <span>¿Cargando?</span>
            <strong>{data.isCharging === null ? 'No disponible' : data.isCharging ? 'Sí' : 'No'}</strong>
          </div>
          <div className="sensor-row">
            <span>Identificador</span>
            <strong className="sensor-id">{data.identifier}</strong>
          </div>
        </div>
      ) : (
        !loading && <IonNote>No se pudo cargar la información del dispositivo.</IonNote>
      )}
    </SensorPage>
  );
};

export default DevicePage;
