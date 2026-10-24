// Página de geolocalización: posición actual y seguimiento.
import { IonButton, IonIcon, IonNote, IonSpinner, IonText } from '@ionic/react';
import { locateOutline, mapOutline, playOutline, stopOutline } from 'ionicons/icons';
import SensorPage from '../components/SensorPage';
import { useGeolocation } from '../hooks/useGeolocation';
import './Sensors.css';

const GeolocationPage: React.FC = () => {
  const { position, watchId, loading, error, getCurrentPosition, startWatch, stopWatch } =
    useGeolocation();

  return (
    <SensorPage title="Geolocalización">
      <p className="sensor-intro">
        Pide permiso de ubicación, obtén una posición puntual o inicia un seguimiento continuo.
      </p>

      <div className="sensor-actions">
        <IonButton onClick={getCurrentPosition} disabled={loading}>
          {loading ? (
            <IonSpinner name="dots" />
          ) : (
            <>
              <IonIcon slot="start" icon={locateOutline} />
              Obtener ubicación
            </>
          )}
        </IonButton>
        <IonButton fill="outline" onClick={startWatch} disabled={!!watchId || loading}>
          <IonIcon slot="start" icon={playOutline} />
          Iniciar seguimiento
        </IonButton>
        <IonButton fill="outline" color="danger" onClick={stopWatch} disabled={!watchId}>
          <IonIcon slot="start" icon={stopOutline} />
          Detener
        </IonButton>
      </div>

      {error && (
        <IonText color="danger">
          <p className="sensor-error">{error}</p>
        </IonText>
      )}

      {position ? (
        <>
          <div className="sensor-panel">
            <h3>Posición actual</h3>
            <div className="sensor-row">
              <span>Latitud</span>
              <strong>{position.coords.latitude.toFixed(6)}</strong>
            </div>
            <div className="sensor-row">
              <span>Longitud</span>
              <strong>{position.coords.longitude.toFixed(6)}</strong>
            </div>
            <div className="sensor-row">
              <span>Precisión</span>
              <strong>{position.coords.accuracy.toFixed(1)} m</strong>
            </div>
            <div className="sensor-row">
              <span>Altitud</span>
              <strong>
                {position.coords.altitude !== null
                  ? `${position.coords.altitude.toFixed(1)} m`
                  : 'No disponible'}
              </strong>
            </div>
            <div className="sensor-row">
              <span>Última lectura</span>
              <strong>{new Date(position.timestamp).toLocaleTimeString('es-CO')}</strong>
            </div>
          </div>

          <IonButton
            fill="clear"
            href={`https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            <IonIcon slot="start" icon={mapOutline} />
            Abrir en Google Maps
          </IonButton>
        </>
      ) : (
        <IonNote> Todavía no hay una posición. Pulsa "Obtener ubicación" para empezar.</IonNote>
      )}

      {watchId && (
        <IonNote className="sensor-note">
          El seguimiento está activo. La posición se actualiza cuando el dispositivo se mueve.
        </IonNote>
      )}
    </SensorPage>
  );
};

export default GeolocationPage;
