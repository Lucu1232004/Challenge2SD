// Hook para manejar una colección de Firestore con las operaciones básicas:
// getAll, add, update y remove. También acepta filtros para las consultas.
import { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  query,
  QueryConstraint,
  updateDoc,
  where,
  WhereFilterOp,
  WithFieldValue,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export type CollectionFilter = [string, WhereFilterOp, unknown];

export function useCollection<T extends object>(
  collectionName: string,
  filters: CollectionFilter[] = []
) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Se usa la versión en texto para que el efecto no se dispare en cada render
  const filtersKey = JSON.stringify(filters);

  const getAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const constraints = filters.map(
        ([field, operator, value]) => where(field, operator, value) as QueryConstraint
      );
      const snapshot = await getDocs(query(collection(db, collectionName), ...constraints));
      const items = snapshot.docs.map((document) => ({
        id: document.id,
        ...(document.data() as unknown as T),
      }));
      setData(items);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [collectionName, filtersKey]);

  useEffect(() => {
    getAll();
  }, [getAll]);

  const add = async (item: Omit<T, 'id'>) => {
    await addDoc(collection(db, collectionName), item as WithFieldValue<DocumentData>);
    await getAll();
  };

  const update = async (id: string, changes: Partial<T>) => {
    await updateDoc(doc(db, collectionName, id), changes as DocumentData);
    await getAll();
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, collectionName, id));
    await getAll();
  };

  return { data, loading, error, getAll, add, update, remove };
}
