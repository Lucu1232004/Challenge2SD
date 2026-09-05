// Servicio de autenticación - maneja registro, login y sesión
// Usado en Challenge 04

const SESSION_KEY = 'logged';
const USERS_KEY = 'users';

export interface User {
  email: string;
  password: string;
}

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
export const login = (email: string, password: string): boolean => {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
};

// Registrar nuevo usuario
export const register = (email: string, password: string): { success: boolean; message: string } => {
  const users = getUsers();

  // Validar que no exista
  if (users.some((u) => u.email === email)) {
    return { success: false, message: 'Este correo ya está registrado. Prueba con otro o inicia sesión.' };
  }

  // Guardar nuevo usuario
  users.push({ email, password });
  saveUsers(users);

  // Iniciar sesion automaticamente
  localStorage.setItem(SESSION_KEY, 'true');

  return { success: true, message: '¡Registro exitoso!' };
};

// Cerrar sesion
export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};
