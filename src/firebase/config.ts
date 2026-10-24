// Configuración de Firebase para el Parcial 2.
// Se usan Authentication y Firestore. Firestore fuerza sondeo largo
// para evitar bloqueos de WebChannel en algunas redes.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC99WWRxlEdMnfdUEzTazoMbGZnahvx020',
  authDomain: 'dessarrollosft.firebaseapp.com',
  projectId: 'dessarrollosft',
  storageBucket: 'dessarrollosft.firebasestorage.app',
  messagingSenderId: '886636940729',
  appId: '1:886636940729:web:02d16f96afdfc150ee7a68',
  measurementId: 'G-P12LVKFMZM',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
