// Misión 2: detectar movimiento real y medir la distancia recorrida.
import { useCallback, useEffect } from 'react';
import {
  IonBadge,
  IonButton,
  IonIcon,
  IonNote,
  IonProgressBar,
  IonText,
} from '@ionic/react';
import {
  checkmarkCircleOutline,
  lockClosedOutline,
  playOutline,
  stopOutline,
  walkOutline,
} from 'ionicons/icons';
import MissionPage from '../components/MissionPage';
import { useDistanceMission } from '../hooks/useDistanceMission';
import { useProgress } from '../hooks/useProgress';
import './Missions.css';

const MovementMissionPage: React.FC = () => {
  const { progress, updateMaxDistance, completeMission } = useProgress();

  const handleDistance = useCallback(
    (distance: number) => {
      updateMaxDistance(distance);
    },
    [updateMaxDistance]
  );

  const { distance, position, active, error, start, stop } = useDistanceMission(handleDistance);
  const missionCompleted = Boolean(
    progress?.missions.find((mission) => mission.id === 2)?.completed
  );
  const maxDistance = Math.max(progress?.maxDistance ?? 0, distance);
  const mission3Unlocked = maxDistance >= 50;

  useEffect(() => {
    if (distance >= 30 && !missionCompleted) {
      void completeMission(2);
    }
  }, [distance, missionCompleted, completeMission]);

  return (
    <MissionPage title="Movimiento real">
      <p className="mission-intro">
        Camina al menos 30 metros desde tu posición inicial. El GPS mide la distancia y la misión se
        completa al superar el umbral.
      </p>

      <div className="mission-actions">
        <IonButton onClick={start} disabled={active}>
          <IonIcon slot="start" icon={playOutline} />
          Iniciar medición
        </IonButton>
        <IonButton fill="outline" color="danger" onClick={stop} disabled={!active}>
          <IonIcon slot="start" icon={stopOutline} />
          Detener
        </IonButton>
        <IonBadge color={active ? 'success' : 'medium'}>
          {active ? 'Midiendo' : 'Detenido'}
        </IonBadge>
      </div>

      {error && (
        <IonText color="danger">
          <p className="mission-error">{error}</p>
        </IonText>
      )}

      <div className="distance-card">
        <IonIcon icon={walkOutline} className="distance-icon" />
        <strong>{distance.toFixed(1)} m</strong>
        <span>recorridos desde el punto inicial</span>
      </div>

      <div className="mission-panel">
        <div className="progress-label">
          <span>Misión 2: 30 m</span>
          <span>{Math.min(Math.round((distance / 30) * 100), 100)}%</span>
        </div>
        <IonProgressBar value={Math.min(distance / 30, 1)} />
      </div>

      <div className="mission-panel">
        <div className="progress-label">
          <span>Desbloqueo de la misión 3: 50 m</span>
          <span>{Math.min(Math.round((maxDistance / 50) * 100), 100)}%</span>
        </div>
        <IonProgressBar value={Math.min(maxDistance / 50, 1)} color="success" />
      </div>

      {missionCompleted && (
        <div className="mission-success">
          <IonIcon icon={checkmarkCircleOutline} />
          <span>Misión 2 completada. Ganaste 40 puntos.</span>
        </div>
      )}

      {mission3Unlocked ? (
        <IonButton expand="block" fill="outline" href="/missions/stillness">
          Ir a Permanencia activa
        </IonButton>
      ) : (
        <IonNote className="mission-note">
          <IonIcon icon={lockClosedOutline} /> Sigue caminando hasta 50 m para desbloquear la misión 3.
        </IonNote>
      )}

      {position && (
        <IonNote className="mission-note">
          Posición actual: {position.coords.latitude.toFixed(5)}, {position.coords.longitude.toFixed(5)}
        </IonNote>
      )}

      <IonNote className="mission-note">
        Usa el GPS al aire libre para que la distancia sea más precisa. Si la señal es débil, la
        medición puede tardar en actualizarse.
      </IonNote>
    </MissionPage>
  );
};

export default MovementMissionPage;
