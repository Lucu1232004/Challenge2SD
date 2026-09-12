import { useEffect, useState } from 'react'
import Login from './components/Login.jsx'
import Logo from './components/Logo.jsx'
import PatientsPage from './components/PatientsPage.jsx'
import { getSession, logout } from './lib/auth.js'

export default function App() {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  // Al recargar, recupera la sesión de localStorage (exige el parcial)
  useEffect(() => {
    setSession(getSession())
    setReady(true)
  }, [])

  if (!ready) return <p className="muted">Cargando MediClinic…</p>

  if (!session) {
    return <Login onLogged={(s) => setSession(s)} />
  }

  return (
    <div>
      <div className="topbar">
        <Logo size={54} />
        <div className="session">
          <span>Hola, <strong>{session.name || session.username}</strong></span>
          <button
            className="btn ghost small"
            onClick={() => {
              logout()
              setSession(null)
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 6px' }}>Pacientes</h2>
        <p className="muted" style={{ margin: 0 }}>
          Registra pacientes y búscalos por nombre, apellido o CC.
        </p>
      </div>

      <PatientsPage />
    </div>
  )
}
