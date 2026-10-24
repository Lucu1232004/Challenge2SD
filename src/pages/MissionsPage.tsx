// Pantalla principal: puntos, progreso y lista de misiones.
import {
  IonBadge,
  IonButton,
  IonCard,
  IonContent,
  IonIcon,
  IonNote,
  IonPage,
  IonProgressBar,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import {
  cameraOutline,
  checkmarkCircleOutline,
  chevronForwardOutline,
  lockClosedOutline,
  pauseCircleOutline,
  podiumOutline,
  walkOutline,
} from 'ionicons/icons';
import MissionHeader from '../components/MissionHeader';
import { useAuth } from '../contexts/AuthContext';
import { MISSIONS } from '../data/missions';
import { useProgress } from '../hooks/useProgress';
import './Missions.css';

const missionMeta: Record<number, { icon: string; path: string }> = {
  1: { icon: cameraOutline, path: '/missions/photo' },
  2: { icon: walkOutline, path: '/missions/movement' },
  3: { icon: pauseCircleOutline, path: '/missions/stillness' },
};

const MissionsPage: React.FC = () => {
  const { user } = useAuth();
  const { progress, loading, error } = useProgress();
  const navigate = useNavigate();

  const completed = progress?.missions.filter((mission) => mission.completed).length ?? 0;
  const total = MISSIONS.length;
  const points = progress?.points ?? 0;
  const maxDistance = progress?.maxDistance ?? 0;

  return (
    <IonPage>
      <MissionHeader title="Misiones" back={false} logout />
      <IonContent className="ion-padding">
        <div className="mission-page">
          <p className="mission-intro">
            Hola, {user?.email?.split('@')[0] || 'jugador'}. Completa las misiones para ganar puntos.
          </p>

          {error && (
            <IonText color="danger">
              <p className="mission-error">{error}</p>
            </IonText>
          )}

          {loading ? (
            <div className="mission-loading">
              <IonSpinner name="crescent" />
              <span>Cargando tu progreso...</span>
            </div>
          ) : (
            <>
              <IonCard className="summary-card">
                <div className="summary-top">
                  <div>
                    <span className="summary-label">Puntos acumulados</span>
                    <strong className="summary-points">{points}</strong>
                  </div>
                  <div className="summary-right">
                    <span className="summary-label">Misiones</span>
                    <strong className="summary-count">
                      {completed}/{total}
                    </strong>
                  </div>
                </div>
                <IonProgressBar value={total > 0 ? completed / total : 0} />
                <span className="summary-percent">
                  {Math.round((completed / total) * 100)}% completado
                </span>
              </IonCard>

              <div className="mission-list">
                {MISSIONS.map((mission) => {
                  const state = progress?.missions.find((item) => item.id === mission.id);
                  const isCompleted = Boolean(state?.completed);
                  const isLocked = mission.id === 3 && maxDistance < 50 && !isCompleted;
                  const meta = missionMeta[mission.id];

                  return (
                    <IonCard
                      key={mission.id}
                      button={!isLocked}
                      className={`mission-card ${isLocked ? 'mission-card-locked' : ''}`}
                      onClick={() => {
                        if (!isLocked) navigate(meta.path);
                      }}
                    >
                      <IonIcon
                        icon={meta.icon}
                        className="mission-card-icon"
                        color={isCompleted ? 'success' : isLocked ? 'medium' : 'primary'}
                      />
                      <div className="mission-card-text">
                        <h2>{mission.title}</h2>
                        <p>{mission.description}</p>
                        <div className="mission-card-meta">
                          <IonBadge color={isCompleted ? 'success' : 'primary'}>
                            {mission.points} pts
                          </IonBadge>
                          {isCompleted && (
                            <IonBadge color="success">
                              <IonIcon icon={checkmarkCircleOutline} /> Completada
                            </IonBadge>
                          )}
                          {isLocked && (
                            <IonBadge color="medium">
                              <IonIcon icon={lockClosedOutline} /> Bloqueada
                            </IonBadge>
                          )}
                        </div>
                        {isLocked && (
                          <IonNote className="mission-locked-note">
                            Recorre 50 m en la misión de movimiento para desbloquearla.
                          </IonNote>
                        )}
                      </div>
                      {!isLocked && (
                        <IonIcon icon={chevronForwardOutline} className="mission-card-arrow" />
                      )}
                    </IonCard>
                  );
                })}
              </div>

              <IonButton expand="block" fill="outline" onClick={() => navigate('/results')}>
                <IonIcon slot="start" icon={podiumOutline} />
                Ver resultados y ranking
              </IonButton>
            </>
          )}

          <IonNote className="mission-note">
            Misión 3 disponible después de recorrer 50 metros. Las misiones de cámara y ubicación
            necesitan permisos del dispositivo.
          </IonNote>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MissionsPage;
