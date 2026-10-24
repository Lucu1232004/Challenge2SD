// Hook del ranking: siembra cuatro usuarios demo y consulta el top 5.
import { useCallback, useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { RankingEntry } from '../types';

const DEMO_USERS = [
  { id: 'demo-ana', name: 'Ana Torres', email: 'ana@demo.com', points: 110 },
  { id: 'demo-carlos', name: 'Carlos Ruiz', email: 'carlos@demo.com', points: 90 },
  { id: 'demo-laura', name: 'Laura Gómez', email: 'laura@demo.com', points: 70 },
  { id: 'demo-diego', name: 'Diego Pérez', email: 'diego@demo.com', points: 50 },
];

export function useRanking() {
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const seedDemoUsers = useCallback(async () => {
    for (const demo of DEMO_USERS) {
      const reference = doc(db, 'ranking', demo.id);
      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) {
        await setDoc(reference, {
          name: demo.name,
          email: demo.email,
          points: demo.points,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await seedDemoUsers();
      const rankingQuery = query(
        collection(db, 'ranking'),
        orderBy('points', 'desc'),
        limit(5)
      );
      const snapshot = await getDocs(rankingQuery);
      setEntries(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...(document.data() as Omit<RankingEntry, 'id'>),
        }))
      );
    } catch {
      setError('No se pudo cargar el ranking desde Firebase.');
    } finally {
      setLoading(false);
    }
  }, [seedDemoUsers]);

  useEffect(() => {
    void load();
  }, [load]);

  return { entries, loading, error, load };
}
