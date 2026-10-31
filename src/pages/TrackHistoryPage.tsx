// Historial de rastreos guardados en rastreos.json dentro de Documents.
import { useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonNote,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { mapOutline, timeOutline, trashOutline, walkOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import SensorPage from '../components/SensorPage';
import { useTrackStore } from '../hooks/useTrackStore';
import { formatDistance, formatDuration } from '../lib/geo';
import './Maps.css';

const TrackHistoryPage: React.FC = () => {
  const { tracks, loading, error, deleteTrack } = useTrackStore();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const handleDelete = async (id: string) => {
    setDeleting(id);
    setActionError('');
    try {
      await deleteTrack(id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'No se pudo eliminar el rastreo.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <SensorPage title="Historial de rastreos">
      <p className="sensor-intro">
        Los recorridos se guardan como JSON en <strong>Documents/rastreos.json</strong>. Desde aquí
        puedes verlos en el mapa o eliminarlos.
      </p>

      <div className="sensor-actions">
        <IonButton onClick={() => navigate('/map')}>
          <IonIcon slot="start" icon={mapOutline} />
          Ir al mapa
        </IonButton>
      </div>

      {loading ? (
        <div className="sensor-loading">
          <IonSpinner name="crescent" />
          <span>Cargando historial...</span>
        </div>
      ) : tracks.length === 0 ? (
        <div className="track-empty">
          <IonIcon icon={mapOutline} color="medium" />
          <IonText color="medium">
            <p>Todavía no hay rastreos guardados.</p>
          </IonText>
        </div>
      ) : (
        <div className="track-list">
          {tracks.map((track) => (
            <div className="track-card" key={track.id}>
              <div className="track-card-head">
                <h3>{track.name}</h3>
                <IonNote>{new Date(track.startedAt).toLocaleString('es-CO')}</IonNote>
              </div>

              <div className="track-stats">
                <span>
                  <IonIcon icon={walkOutline} /> {formatDistance(track.distance)}
                </span>
                <span>
                  <IonIcon icon={timeOutline} /> {formatDuration(track.duration)}
                </span>
                <span>{track.points.length} puntos</span>
              </div>

              <div className="track-actions">
                <IonButton
                  size="small"
                  fill="outline"
                  onClick={() => navigate('/map', { state: { track } })}
                >
                  <IonIcon slot="start" icon={mapOutline} />
                  Ver en mapa
                </IonButton>
                <IonButton
                  size="small"
                  color="danger"
                  fill="clear"
                  disabled={deleting === track.id}
                  onClick={() => void handleDelete(track.id)}
                >
                  <IonIcon slot="start" icon={trashOutline} />
                  Eliminar
                </IonButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {(error || actionError) && (
        <IonText color="danger">
          <p className="sensor-error">{error || actionError}</p>
        </IonText>
      )}

      <IonNote className="sensor-note">
        En el navegador, el archivo se guarda en el almacenamiento local del navegador. En Android
        queda en la carpeta Documents.
      </IonNote>
    </SensorPage>
  );
};

export default TrackHistoryPage;
