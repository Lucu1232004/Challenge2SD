// Hook para manejar la tabla de frutas en Dexie.
// useLiveQuery actualiza la lista sola cuando cambia la base local.
import { useLiveQuery } from 'dexie-react-hooks';
import { localDb } from '../db/database';
import { Fruit } from '../types';

export function useDexie() {
  const fruits = useLiveQuery(() => localDb.fruits.toArray(), [], []);

  const addFruit = async (fruit: Omit<Fruit, 'id'>) => {
    await localDb.fruits.add(fruit);
  };

  const updateFruit = async (id: number, changes: Partial<Fruit>) => {
    await localDb.fruits.update(id, changes);
  };

  const removeFruit = async (id: number) => {
    await localDb.fruits.delete(id);
  };

  return { fruits, addFruit, updateFruit, removeFruit };
}
