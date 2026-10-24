// Configuración de Firebase para la app del Challenge 06.
// Aquí se inicializan Authentication, Firestore y Realtime Database.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyC99WWRxlEdMnfdUEzTazoMbGZnahvx020',
  authDomain: 'dessarrollosft.firebaseapp.com',
  databaseURL: 'https://dessarrollosft-default-rtdb.firebaseio.com',
  projectId: 'dessarrollosft',
  storageBucket: 'dessarrollosft.firebasestorage.app',
  messagingSenderId: '886636940729',
  appId: '1:886636940729:web:02d16f96afdfc150ee7a68',
  measurementId: 'G-P12LVKFMZM',
};

const app = initializeApp(firebaseConfig);

// Authentication: usuarios reales con correo y contraseña
export const auth = getAuth(app);

// Firestore: contactos.
// Se fuerza el sondeo largo porque algunos proxies bloquean WebChannel.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Realtime Database: tareas en tiempo real
export const realtimeDb = getDatabase(app);
