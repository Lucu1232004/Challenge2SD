// Datos iniciales de contactos (mismo formato que Challenge 01)
export interface Contact {
  id: number;
  name: string;
  phone: string;
  age: string;
  city: string;
}

export const initialContacts: Contact[] = [
  { id: 1, name: 'Samuel Patino', phone: '3175550971', age: '21', city: 'Cali' },
  { id: 2, name: 'Luisa Maria Holguin', phone: '3162549803', age: '20', city: 'Cali' },
  { id: 3, name: 'Gabriel Eduardo Martinez', phone: '3226244468', age: '23', city: 'Cali' },
  { id: 4, name: 'Sandra Lucumi', phone: '3113368313', age: '46', city: 'Cali' },
];

// Colores para los avatares (mismo array del Challenge 01)
export const avatarColors = [
  ['#ff2b2b', '#ff6b6b'],
  ['#8b0000', '#dc143c'],
  ['#e63946', '#ff4d4d'],
  ['#b30000', '#ff6666'],
  ['#a4161a', '#e5383b'],
  ['#ff0000', '#ff9999'],
];
