// Hook de progreso: mezcla localStorage con Firestore y actualiza el ranking.
import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { getMission, getMissionPoints, MISSIONS } from '../data/missions';
import { MissionState, Progress } from '../types';

const localKey = (uid: string) => `misiones-progress-${uid}`;

function normalizeMissions(raw: unknown): MissionState[] {
  const list = Array.isArray(raw) ? (raw as MissionState[]) : [];
  return MISSIONS.map((mission) => ({
    id: mission.id,
    completed: Boolean(list.find((item) => item && item.id === mission.id)?.completed),
  }));
}

function calcPoints(missions: MissionState[]): number {
  return missions.reduce(
    (sum, mission) => sum + (mission.completed ? getMissionPoints(mission.id) : 0),
    0
  );
}

function readLocal(uid: string): Progress | null {
  try {
    const raw = localStorage.getItem(localKey(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      points: typeof parsed.points === 'number' ? parsed.points : 0,
      missions: normalizeMissions(parsed.missions),
      maxDistance: typeof parsed.maxDistance === 'number' ? parsed.maxDistance : 0,
      photo: typeof parsed.photo === 'string' ? parsed.photo : undefined,
    };
  } catch {
    return null;
  }
}

function saveLocal(uid: string, progress: Progress) {
  try {
    localStorage.setItem(localKey(uid), JSON.stringify(progress));
  } catch {
    // Si el almacenamiento está lleno o bloqueado, la app sigue con el estado en memoria.
  }
}

async function saveRemote(uid: string, progress: Progress) {
  await setDoc(
    doc(db, 'progress', uid),
    {
      points: progress.points,
      missions: progress.missions,
      maxDistance: progress.maxDistance,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

async function saveRanking(uid: string, name: string, email: string, points: number) {
  await setDoc(
    doc(db, 'ranking', uid),
    {
      name,
      email,
      points,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

async function notifyMission(title: string, points: number, remaining: number) {
  try {
    const permission = await LocalNotifications.checkPermissions();
    if (permission.display !== 'granted') {
      const requested = await LocalNotifications.requestPermissions();
      if (requested.display !== 'granted') return;
    }

    const notifications = [
      {
        id: (Date.now() % 100000) + 1,
        title: 'Misión completada',
        body: `Has completado "${title}" y ganaste ${points} puntos.`,
        schedule: { at: new Date(Date.now() + 500) },
      },
    ];

    if (remaining === 1) {
      notifications.push({
        id: (Date.now() % 100000) + 2,
        title: 'Casi terminas',
        body: 'Te falta 1 misión para completar.',
        schedule: { at: new Date(Date.now() + 1500) },
      });
    }

    await LocalNotifications.schedule({ notifications });
  } catch {
    // En web o sin permisos la notificación no se muestra, pero la misión sí se guarda.
  }
}

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const remoteTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!user) {
      setProgress(null);
      setLoading(false);
      return;
    }

    const userId = user.uid;
    const userName = user.displayName || user.email?.split('@')[0] || 'Usuario';
    const userEmail = user.email || '';
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      const local = readLocal(userId);
      let remote: Progress | null = null;

      try {
        const snapshot = await getDoc(doc(db, 'progress', userId));
        if (snapshot.exists()) {
          const data = snapshot.data();
          remote = {
            points: typeof data.points === 'number' ? data.points : 0,
            missions: normalizeMissions(data.missions),
            maxDistance: typeof data.maxDistance === 'number' ? data.maxDistance : 0,
          };
        }
      } catch {
        if (!cancelled) {
          setError('No se pudo leer el progreso remoto. Se usa el progreso local.');
        }
      }

      if (cancelled) return;

      const missions = MISSIONS.map((mission) => ({
        id: mission.id,
        completed: Boolean(
          local?.missions.find((item) => item.id === mission.id)?.completed ||
            remote?.missions.find((item) => item.id === mission.id)?.completed
        ),
      }));

      const merged: Progress = {
        points: calcPoints(missions),
        missions,
        maxDistance: Math.max(local?.maxDistance || 0, remote?.maxDistance || 0),
        photo: local?.photo,
        updatedAt: new Date().toISOString(),
      };

      setProgress(merged);
      saveLocal(userId, merged);

      try {
        await saveRemote(userId, merged);
        await saveRanking(userId, userName, userEmail, merged.points);
      } catch {
        if (!cancelled) {
          setError('El progreso se guardó localmente, pero no se pudo enviar a Firebase.');
        }
      }

      if (!cancelled) setLoading(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  useEffect(() => {
    return () => {
      if (remoteTimer.current) window.clearTimeout(remoteTimer.current);
    };
  }, []);

  const completeMission = useCallback(
    async (missionId: number) => {
      if (!user || !progress) return;
      if (progress.missions.find((mission) => mission.id === missionId)?.completed) return;

      const missions = progress.missions.map((mission) =>
        mission.id === missionId ? { ...mission, completed: true } : mission
      );
      const points = calcPoints(missions);
      const next: Progress = {
        ...progress,
        missions,
        points,
        updatedAt: new Date().toISOString(),
      };

      setProgress(next);
      saveLocal(user.uid, next);

      try {
        await saveRemote(user.uid, next);
        await saveRanking(
          user.uid,
          user.displayName || user.email?.split('@')[0] || 'Usuario',
          user.email || '',
          points
        );
      } catch {
        setError('La misión se guardó localmente, pero no se pudo enviar a Firebase.');
      }

      const mission = getMission(missionId);
      if (mission) {
        const remaining = missions.filter((item) => !item.completed).length;
        await notifyMission(mission.title, mission.points, remaining);
      }
    },
    [user, progress]
  );

  const updateMaxDistance = useCallback(
    (distance: number) => {
      if (!user) return;

      setProgress((previous) => {
        if (!previous || distance <= previous.maxDistance) return previous;
        const next = { ...previous, maxDistance: distance };
        saveLocal(user.uid, next);

        if (remoteTimer.current) window.clearTimeout(remoteTimer.current);
        remoteTimer.current = window.setTimeout(() => {
          void saveRemote(user.uid, next).catch(() => {
            setError('No se pudo guardar la distancia en Firebase.');
          });
        }, 1200);

        return next;
      });
    },
    [user]
  );

  const savePhoto = useCallback(
    (dataUrl: string) => {
      if (!user) return;
      setProgress((previous) => {
        if (!previous) return previous;
        const next = { ...previous, photo: dataUrl };
        saveLocal(user.uid, next);
        return next;
      });
    },
    [user]
  );

  return { progress, loading, error, completeMission, updateMaxDistance, savePhoto };
}
