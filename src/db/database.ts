// Base de datos local con Dexie para las frutas.
// Vive en el navegador o en el WebView del teléfono, sin depender de internet.
import Dexie, { Table } from 'dexie';
import { Fruit } from '../types';

class AppDatabase extends Dexie {
  fruits!: Table<Fruit, number>;

  constructor() {
    super('mi-espacio');
    this.version(1).stores({
      fruits: '++id, name',
    });
  }
}

export const localDb = new AppDatabase();
