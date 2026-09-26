// Servicio de autenticación - maneja registro, login y sesión
// Usado en Challenge 04

const SESSION_KEY = 'logged';
const USERS_KEY = 'users';

export interface User {
  email: string;
  password: string;
}

// Usuario demo exigido por el Challenge 04 (Clase 04, pag 13)
export const DEMO_USER: User = {
  email: 'user@mail.com',
  password: '123',
};

// Obtener usuarios registrados
const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

// Guardar usuarios
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Verificar si hay sesion activa
export const isLoggedIn = (): boolean => {
  return localStorage.getItem(SESSION_KEY) === 'true';
};

// Iniciar sesion
// 1. Valida usuario demo del Challenge 04: user@mail.com / 123
// 2. Si no es demo, busca en usuarios registrados
export const login = (email: string, password: string): boolean => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (cleanEmail === DEMO_USER.email && cleanPass === DEMO_USER.password) {
    localStorage.setItem(SESSION_KEY, 'true');
    return true;
  }

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPass);
  if (user) {
    localStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
};

// Registrar nuevo usuario
export const register = (email: string, password: string): { success: boolean; message: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const users = getUsers();

  // El demo ya existe, usar login
  if (cleanEmail === DEMO_USER.email) {
    return { success: false, message: 'Este correo ya está registrado (usuario demo). Usa login con password 123.' };
  }

  // Validar que no exista
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, message: 'Este correo ya está registrado. Prueba con otro o inicia sesión.' };
  }

  // Guardar nuevo usuario
  users.push({ email: cleanEmail, password });
  saveUsers(users);

  // Iniciar sesion automaticamente
  localStorage.setItem(SESSION_KEY, 'true');

  return { success: true, message: '¡Registro exitoso!' };
};

// Cerrar sesion
export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};
