// Lista de respaldo: se usa solo si la red falla y no hay caché disponible
const fallbackContacts = [
  { id: 1, name: 'Ana García', phone: '315 555 0101', age: '25', city: 'Cali' },
  { id: 2, name: 'Luis Pérez', phone: '312 555 0202', age: '30', city: 'Medellín' },
  { id: 3, name: 'María López', phone: '300 555 0303', age: '28', city: 'Bogotá' },
  { id: 4, name: 'Carlos Ruiz', phone: '311 555 0404', age: '35', city: 'Palmira' },
];

// Simula la respuesta del servidor con un pequeño retardo,
// igual que en el Challenge 01
export function fetchContacts() {
  return new Promise((resolve) => {
    fetch('/api/contacts.json')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('API no disponible'))))
      .then((data) => {
        // pequeño retardo para que se aprecie el loader
        setTimeout(() => resolve(data), 1500);
      })
      .catch(() => {
        // fallback: sin red ni caché, se usan los datos locales
        setTimeout(() => resolve(fallbackContacts), 1500);
      });
  });
}