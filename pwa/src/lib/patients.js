import { readJSON, writeJSON } from './store.js'

export const PATIENTS_KEY = 'mediclinc_patients'

// Tus 3 pacientes precargados (primera vez)
const SEED = [
  { id: 'p-luisa', nombre: 'Luisa Maria', apellido: 'Holguin', cc: '1112041577', telefono: '3426789543' },
  { id: 'p-sandra', nombre: 'Sandra Milena', apellido: 'Lucumi', cc: '66987530', telefono: '3113378964' },
  { id: 'p-carlos', nombre: 'Carlos Andres', apellido: 'Patiño', cc: '1144156789', telefono: '3205671234' },
]

export function getPatients() {
  const list = readJSON(PATIENTS_KEY, null)
  if (!list) {
    writeJSON(PATIENTS_KEY, SEED)
    return [...SEED]
  }
  return list
}

export function savePatients(list) {
  writeJSON(PATIENTS_KEY, list)
}

export function validatePatient({ nombre, apellido, cc }, existing = []) {
  const n = String(nombre || '').trim()
  const a = String(apellido || '').trim()
  const c = String(cc || '').trim()

  if (n.length < 2) return 'El nombre es obligatorio (mínimo 2 letras).'
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(n)) return 'El nombre solo debe tener letras.'
  if (a.length < 2) return 'El apellido es obligatorio (mínimo 2 letras).'
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(a)) return 'El apellido solo debe tener letras.'
  if (!c) return 'La CC es obligatoria.'
  if (!/^\d{5,12}$/.test(c)) return 'La CC debe tener solo números (5 a 12 dígitos).'
  if (existing.some((p) => String(p.cc).trim() === c)) return 'Ya existe un paciente con esa CC.'
  return null
}

export function addPatient({ nombre, apellido, cc, telefono }) {
  const list = getPatients()
  const error = validatePatient({ nombre, apellido, cc }, list)
  if (error) return { ok: false, error }

  const nuevo = {
    id: `p-${Date.now()}`,
    nombre: String(nombre).trim(),
    apellido: String(apellido).trim(),
    cc: String(cc).trim(),
    telefono: String(telefono || '').trim(),
  }
  list.unshift(nuevo) // el nuevo arriba
  savePatients(list)
  return { ok: true, patient: nuevo, list }
}
