// Misión 3: permanecer quieto 10 segundos y vibrar al terminar.
import { useEffect, useRef, useState } from 'react';
import { IonBadge, IonButton, IonIcon, IonNote, IonText } from '@ionic/react';
import {
  checkmarkCircleOutline,
  lockClosedOutline,
  pauseCircleOutline,
  playOutline,
  stopOutline,
} from 'ionicons/icons';
import { Motion } from '@capacitor/motion';
import { Haptics } from '@capacitor/haptics';
import type { PluginListenerHandle } from '@capacitor/core';
import MissionPage from '../components/MissionPage';
import { useProgress } from '../hooks/useProgress';
import './Missions.css';

const STILLNESS_THRESHOLD = 3;
const STILLNESS_SECONDS = 10;

const StillnessMissionPage: React.FC = () => {
  const { progress, completeMission } = useProgress();

  const [secondsLeft, setSecondsLeft] = useState(STILLNESS_SECONDS);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [magnitude, setMagnitude] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);
  const motionHandle = useRef<PluginListenerHandle | null>(null);
  const runningRef = useRef(false);

  const missionCompleted = Boolean(
    progress?.missions.find((mission) => mission.id === 3)?.completed
  );
  const unlocked = (progress?.maxDistance ?? 0) >= 50 || missionCompleted;

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const finish = async () => {
    clearTimer();
    runningRef.current = false;
    setRunning(false);
    if (motionHandle.current) {
      await motionHandle.current.remove();
      motionHandle.current = null;
    }
    try {
      await Haptics.vibrate({ duration: 800 });
    } catch {
      // La vibración puede no existir en el navegador; la misión se completa igual.
    }
    await completeMission(3);
    setFinished(true);
    setMessage('¡Misión completada! El teléfono vibró.');
  };

  const startCountdown = () => {
    clearTimer();
    setSecondsLeft(STILLNESS_SECONDS);
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          clearTimer();
          void finish();
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
  };

  const start = async () => {
    setError('');
    setFinished(false);
    setMessage('Mantente quieto. El contador se reinicia si te mueves.');
    setSecondsLeft(STILLNESS_SECONDS);

    try {
      motionHandle.current = await Motion.addListener('accel', (event) => {
        const { x, y, z } = event.accelerationIncludingGravity;
        const currentMagnitude = Math.sqrt(x * x + y * y + z * z);
        setMagnitude(currentMagnitude);

        if (!runningRef.current) return;
        if (Math.abs(currentMagnitude - 9.81) > STILLNESS_THRESHOLD) {
          setMessage('Te moviste. Reiniciando los 10 segundos...');
          startCountdown();
        }
      });
      runningRef.current = true;
      setRunning(true);
      startCountdown();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo leer el acelerómetro.');
    }
  };

  const stop = async () => {
    clearTimer();
    runningRef.current = false;
    setRunning(false);
    if (motionHandle.current) {
      await motionHandle.current.remove();
      motionHandle.current = null;
    }
    setMessage('Lectura detenida.');
  };

  useEffect(() => {
    return () => {
      clearTimer();
      if (motionHandle.current) {
        void motionHandle.current.remove();
      }
    };
  }, []);

  if (!unlocked) {
    return (
      <MissionPage title="Permanencia activa">
        <div className="locked-panel">
          <IonIcon icon={lockClosedOutline} className="locked-icon" />
          <h2>Misión bloqueada</h2>
          <p>Primero recorre 50 metros en la misión de movimiento.</p>
          <IonButton href="/missions/movement">Ir a Movimiento real</IonButton>
        </div>
      </MissionPage>
    );
  }

  return (
    <MissionPage title="Permanencia activa">
      <p className="mission-intro">
        Ya recorriste los 50 metros. Ahora mantente quieto durante 10 segundos. Al terminar, el
        teléfono vibrará y la misión se completará.
      </p>

      {missionCompleted || finished ? (
        <div className="mission-success">
          <IonIcon icon={checkmarkCircleOutline} />
          <span>Misión 3 completada. Ganaste 50 puntos.</span>
        </div>
      ) : (
        <>
          <div className="countdown-card">
            <IonIcon icon={pauseCircleOutline} className="countdown-icon" />
            <strong>{secondsLeft}</strong>
            <span>segundos</span>
          </div>

          <div className="mission-actions">
            <IonButton onClick={start} disabled={running}>
              <IonIcon slot="start" icon={playOutline} />
              Empezar a contar
            </IonButton>
            <IonButton fill="outline" color="danger" onClick={stop} disabled={!running}>
              <IonIcon slot="start" icon={stopOutline} />
              Cancelar
            </IonButton>
            <IonBadge color={running ? 'success' : 'medium'}>
              {running ? 'Contando' : 'Detenido'}
            </IonBadge>
          </div>

          {message && (
            <IonText color={running ? 'primary' : 'medium'}>
              <p>{message}</p>
            </IonText>
          )}

          {magnitude !== null && (
            <IonNote className="mission-note">
              Magnitud del acelerómetro: {magnitude.toFixed(2)} m/s²
            </IonNote>
          )}
        </>
      )}

      {error && (
        <IonText color="danger">
          <p className="mission-error">{error}</p>
        </IonText>
      )}

      <IonNote className="mission-note">
        Mantén la pantalla encendida y la app abierta. Si cambias de aplicación o te mueves, el
        contador se reinicia.
      </IonNote>
    </MissionPage>
  );
};

export default StillnessMissionPage;
