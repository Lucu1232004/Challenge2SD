import { readJSON, writeJSON } from './store';

export const PATIENTS_KEY = 'mediclinc_ionic_patients';
export const VISITS_KEY = 'mediclinc_ionic_visits';

export type VisitStatus = 'pendiente' | 'en_camino' | 'finalizada';

export interface Patient {
  id: string;
  nombre: string;
  apellido: string;
  cc: string;
  telefono: string;
}

export interface Visit {
  id: string;
  patientId: string;
  paciente: string;
  cc: string;
  hora: string;
  estado: VisitStatus;
  motivo: string;
}

// 5 pacientes coherentes (3 mismos de la PWA + 2 familiares con tu toque)
const SEED_PATIENTS: Patient[] = [
  { id: 'p-luisa', nombre: 'Luisa Maria', apellido: 'Holguin', cc: '1112041577', telefono: '3426789543' },
  { id: 'p-sandra', nombre: 'Sandra Milena', apellido: 'Lucumi', cc: '66987530', telefono: '3113378964' },
  { id: 'p-carlos', nombre: 'Carlos Andres', apellido: 'Patiño', cc: '1144156789', telefono: '3205671234' },
  { id: 'p-diego', nombre: 'Diego Fernando', apellido: 'Lucumi', cc: '1112048890', telefono: '3124567890' },
  { id: 'p-laura', nombre: 'Laura Camila', apellido: 'Holguin', cc: '1112049901', telefono: '3431230987' },
];

// 5 visitas del día, una por paciente, con los 3 estados para mostrar al profe
const SEED_VISITS: Visit[] = [
  { id: 'v1', patientId: 'p-luisa', paciente: 'Luisa Maria Holguin', cc: '1112041577', hora: '08:00', estado: 'pendiente', motivo: 'Control general' },
  { id: 'v2', patientId: 'p-sandra', paciente: 'Sandra Milena Lucumi', cc: '66987530', hora: '10:30', estado: 'en_camino', motivo: 'Seguimiento' },
  { id: 'v3', patientId: 'p-carlos', paciente: 'Carlos Andres Patiño', cc: '1144156789', hora: '14:00', estado: 'finalizada', motivo: 'Chequeo' },
  { id: 'v4', patientId: 'p-diego', paciente: 'Diego Fernando Lucumi', cc: '1112048890', hora: '16:00', estado: 'pendiente', motivo: 'Consulta' },
  { id: 'v5', patientId: 'p-laura', paciente: 'Laura Camila Holguin', cc: '1112049901', hora: '17:30', estado: 'pendiente', motivo: 'Control' },
];

export function getPatients(): Patient[] {
  const list = readJSON<Patient[] | null>(PATIENTS_KEY, null);
  if (!list) {
    writeJSON(PATIENTS_KEY, SEED_PATIENTS);
    return [...SEED_PATIENTS];
  }
  return list;
}

export function getVisits(): Visit[] {
  const list = readJSON<Visit[] | null>(VISITS_KEY, null);
  if (!list) {
    writeJSON(VISITS_KEY, SEED_VISITS);
    return [...SEED_VISITS];
  }
  return list;
}

export function getVisitById(id: string): Visit | undefined {
  return getVisits().find((v) => v.id === id);
}

// Flujo permitido: pendiente -> en_camino -> finalizada
export function nextStatus(s: VisitStatus): VisitStatus | null {
  if (s === 'pendiente') return 'en_camino';
  if (s === 'en_camino') return 'finalizada';
  return null;
}

export function updateVisitStatus(id: string, estado: VisitStatus) {
  const list = getVisits();
  const updated = list.map((v) => (v.id === id ? { ...v, estado } : v));
  writeJSON(VISITS_KEY, updated);
  return updated;
}
