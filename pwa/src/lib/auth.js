import { readJSON, writeJSON, removeKey } from './store.js'

export const USERS_KEY = 'mediclinc_users'
export const SESSION_KEY = 'mediclinc_session'

// Usuario fijo tuyo (exigido por el parcial: "usuarios fijos proporcionados por ti mismo")
export const FIXED_USERS = [
  {
    username: 'Slucu_0310',
    email: 'samuelpatinolucumi@gmail.com',
    password: 'Patino032004', // sin backend se guarda plano en código, el parcial lo permite
    name: 'Samuel Patiño Lucumi',
    role: 'admin',
    fixed: true,
  },
]

export function getRegisteredUsers() {
  return readJSON(USERS_KEY, [])
}

function normalize(str) {
  return String(str || '').trim().toLowerCase()
}

// Busca por usuario O correo (opción C que elegiste)
export function findUserForLogin(identifier) {
  const id = normalize(identifier)
  const all = [...FIXED_USERS, ...getRegisteredUsers()]
  return all.find((u) => normalize(u.username) === id || normalize(u.email) === id)
}

export function login(identifier, password) {
  const user = findUserForLogin(identifier)
  if (!user || user.password !== String(password || '')) {
    return { ok: false, error: 'Credenciales incorrectas. Revisa tu usuario/correo y contraseña.' }
  }
  const session = {
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role || 'user',
    loginAt: new Date().toISOString(),
  }
  writeJSON(SESSION_KEY, session)
  return { ok: true, session }
}

export function registerUser({ name, username, email, password }) {
  const cleanUsername = String(username || '').trim()
  const cleanEmail = String(email || '').trim().toLowerCase()
  const cleanName = String(name || '').trim() || cleanUsername
  const cleanPass = String(password || '')

  if (!cleanUsername || !cleanEmail || !cleanPass) {
    return { ok: false, error: 'Completa usuario, correo y contraseña.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { ok: false, error: 'El correo no es válido.' }
  }
  if (cleanPass.length < 6) {
    return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  const all = [...FIXED_USERS, ...getRegisteredUsers()]
  if (all.some((u) => normalize(u.username) === normalize(cleanUsername))) {
    return { ok: false, error: 'Ese usuario ya existe.' }
  }
  if (all.some((u) => normalize(u.email) === normalize(cleanEmail))) {
    return { ok: false, error: 'Ese correo ya está registrado.' }
  }

  const users = getRegisteredUsers()
  users.push({ username: cleanUsername, email: cleanEmail, password: cleanPass, name: cleanName, role: 'user', fixed: false })
  writeJSON(USERS_KEY, users)
  return { ok: true }
}

export function getSession() {
  return readJSON(SESSION_KEY, null)
}

export function logout() {
  removeKey(SESSION_KEY)
}
