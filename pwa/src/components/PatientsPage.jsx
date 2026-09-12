import { useMemo, useState } from 'react'
import { getPatients } from '../lib/patients.js'
import PatientForm from './PatientForm.jsx'
import PatientList from './PatientList.jsx'

// Padre: guarda el estado del buscador y envía la lista filtrada al hijo
export default function PatientsPage() {
  const [all, setAll] = useState(() => getPatients())
  const [query, setQuery] = useState('') // estado del buscador en el padre (exige el parcial)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.apellido.toLowerCase().includes(q) ||
        String(p.cc).toLowerCase().includes(q)
    )
  }, [all, query])

  return (
    <div className="patients">
      <div className="card search-card">
        <div className="input search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, apellido o CC…"
          />
          {query && (
            <button className="btn ghost small" onClick={() => setQuery('')}>
              Limpiar
            </button>
          )}
        </div>
        <span className="muted small">{filtered.length} de {all.length} pacientes</span>
      </div>

      <PatientForm onAdded={(list) => setAll(list)} />

      {/* Lista filtrada enviada al hijo */}
      <PatientList patients={filtered} />
    </div>
  )
}
