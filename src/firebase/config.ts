// Configuración de Firebase para la app de tareas (Challenge 05).
// Los datos salen de la consola de Firebase: Configuración del proyecto > Tus apps.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC99WWRxlEdMnfdUEzTazoMbGZnahvx020',
  authDomain: 'dessarrollosft.firebaseapp.com',
  projectId: 'dessarrollosft',
  storageBucket: 'dessarrollosft.firebasestorage.app',
  messagingSenderId: '886636940729',
  appId: '1:886636940729:web:02d16f96afdfc150ee7a68',
  measurementId: 'G-P12LVKFMZM',
};

// Se inicializa Firebase una sola vez y se exporta la instancia de auth
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
