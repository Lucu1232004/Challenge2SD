// Pantalla de resultados: puntos, misiones completadas y ranking.
import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonProgressBar,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { podiumOutline, refreshOutline } from 'ionicons/icons';
import MissionHeader from '../components/MissionHeader';
import { useAuth } from '../contexts/AuthContext';
import { MISSIONS } from '../data/missions';
import { useProgress } from '../hooks/useProgress';
import { useRanking } from '../hooks/useRanking';
import './Missions.css';

const ResultsPage: React.FC = () => {
  const { user } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const { entries, loading: rankingLoading, error, load } = useRanking();

  const completed = progress?.missions.filter((mission) => mission.completed).length ?? 0;
  const total = MISSIONS.length;
  const points = progress?.points ?? 0;

  const generalState =
    completed === total
      ? 'Completaste todas las misiones.'
      : completed === 0
        ? 'Todavía no has completado misiones.'
        : completed === total - 1
          ? 'Te falta 1 misión para completar.'
          : 'Vas por buen camino. Sigue con las misiones pendientes.';

  return (
    <IonPage>
      <MissionHeader title="Resultados" />
      <IonContent className="ion-padding">
        <div className="mission-page">
          {progressLoading ? (
            <div className="mission-loading">
              <IonSpinner name="crescent" />
              <span>Cargando resultados...</span>
            </div>
          ) : (
            <>
              <div className="results-summary">
                <IonIcon icon={podiumOutline} className="results-icon" />
                <strong>{points}</strong>
                <span>puntos totales</span>
              </div>

              <div className="mission-panel">
                <div className="progress-label">
                  <span>Progreso general</span>
                  <span>
                    {completed}/{total} misiones
                  </span>
                </div>
                <IonProgressBar value={total > 0 ? completed / total : 0} />
                <p className="results-state">{generalState}</p>
              </div>

              <h2 className="results-title">Ranking</h2>
              <p className="mission-intro">
                Top 5 con cuatro usuarios demo y tu puntaje real.
              </p>

              {error && (
                <IonText color="danger">
                  <p className="mission-error">{error}</p>
                </IonText>
              )}

              {rankingLoading ? (
                <div className="mission-loading">
                  <IonSpinner name="crescent" />
                  <span>Cargando ranking...</span>
                </div>
              ) : (
                <IonList className="ranking-list">
                  {entries.map((entry, index) => (
                    <IonItem
                      key={entry.id}
                      className={entry.id === user?.uid ? 'ranking-current' : ''}
                    >
                      <IonLabel>
                        <h2>
                          {index + 1}. {entry.name}
                          {entry.id === user?.uid ? ' (tú)' : ''}
                        </h2>
                        <p>{entry.email}</p>
                      </IonLabel>
                      <IonBadge color={entry.id === user?.uid ? 'success' : 'primary'}>
                        {entry.points} pts
                      </IonBadge>
                    </IonItem>
                  ))}
                </IonList>
              )}

              <div className="mission-actions">
                <IonButton fill="outline" onClick={load} disabled={rankingLoading}>
                  <IonIcon slot="start" icon={refreshOutline} />
                  Actualizar ranking
                </IonButton>
                <IonButton href="/missions">Volver a las misiones</IonButton>
              </div>
            </>
          )}

          <IonNote className="mission-note">
            El ranking se guarda en Firestore. Los cuatro usuarios demo tienen puntajes fijos y tu
            puntaje se actualiza al completar misiones.
          </IonNote>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResultsPage;
