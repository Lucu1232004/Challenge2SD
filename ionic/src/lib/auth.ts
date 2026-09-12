import { readJSON, writeJSON, removeKey } from './store';

export const USERS_KEY = 'mediclinc_ionic_users';
export const SESSION_KEY = 'mediclinc_ionic_session';

export interface User {
  username: string;
  email: string;
  password: string;
  name: string;
  role: string;
  fixed?: boolean;
}

// Mismo usuario fijo con tu toque (coherente con la PWA)
export const FIXED_USERS: User[] = [
  {
    username: 'Slucu_0310',
    email: 'samuelpatinolucumi@gmail.com',
    password: 'Patino032004',
    name: 'Samuel Patiño Lucumi',
    role: 'medico',
    fixed: true,
  },
];

export function getRegisteredUsers(): User[] {
  return readJSON<User[]>(USERS_KEY, []);
}

const norm = (s: unknown) => String(s || '').trim().toLowerCase();

export function findUserForLogin(identifier: string): User | undefined {
  const id = norm(identifier);
  const all = [...FIXED_USERS, ...getRegisteredUsers()];
  return all.find((u) => norm(u.username) === id || norm(u.email) === id);
}

export function login(identifier: string, password: string) {
  const user = findUserForLogin(identifier);
  if (!user || user.password !== String(password || '')) {
    return { ok: false as const, error: 'Credenciales incorrectas.' };
  }
  const session = {
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    loginAt: new Date().toISOString(),
  };
  writeJSON(SESSION_KEY, session);
  return { ok: true as const, session };
}

export function registerUser({ name, username, email, password }: { name: string; username: string; email: string; password: string }) {
  const cleanUsername = String(username || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanName = String(name || '').trim() || cleanUsername;
  const cleanPass = String(password || '');

  if (!cleanUsername || !cleanEmail || !cleanPass) return { ok: false as const, error: 'Completa usuario, correo y contraseña.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return { ok: false as const, error: 'El correo no es válido.' };
  if (cleanPass.length < 6) return { ok: false as const, error: 'La contraseña debe tener al menos 6 caracteres.' };

  const all = [...FIXED_USERS, ...getRegisteredUsers()];
  if (all.some((u) => norm(u.username) === norm(cleanUsername))) return { ok: false as const, error: 'Ese usuario ya existe.' };
  if (all.some((u) => norm(u.email) === norm(cleanEmail))) return { ok: false as const, error: 'Ese correo ya está registrado.' };

  const users = getRegisteredUsers();
  users.push({ username: cleanUsername, email: cleanEmail, password: cleanPass, name: cleanName, role: 'medico' });
  writeJSON(USERS_KEY, users);
  return { ok: true as const };
}

export function getSession() {
  return readJSON<any | null>(SESSION_KEY, null);
}

export function logout() {
  removeKey(SESSION_KEY);
}
