// Hook para manejar una colección de Firebase Realtime Database.
// onValue mantiene los datos sincronizados sin tener que volver a consultar.
import { useEffect, useState } from 'react';
import {
  onValue,
  push,
  ref,
  remove as removeAt,
  set,
  update as updateAt,
} from 'firebase/database';
import { realtimeDb } from '../firebase/config';

export function useRealTimeCollection<T extends object>(path: string) {
  const [data, setData] = useState<Record<string, T>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const collectionRef = ref(realtimeDb, path);

    const unsubscribe = onValue(
      collectionRef,
      (snapshot) => {
        setData((snapshot.val() as Record<string, T>) || {});
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError('No se pudieron cargar las tareas.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path]);

  const add = async (item: T) => {
    const newRef = push(ref(realtimeDb, path));
    await set(newRef, item);
  };

  const update = async (id: string, changes: Partial<T>) => {
    await updateAt(ref(realtimeDb, `${path}/${id}`), changes);
  };

  const remove = async (id: string) => {
    await removeAt(ref(realtimeDb, `${path}/${id}`));
  };

  return { data, loading, error, add, update, remove };
}
