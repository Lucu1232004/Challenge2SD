import { useState } from 'react'
import { addPatient } from '../lib/patients.js'

export default function PatientForm({ onAdded }) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [cc, setCc] = useState('')
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setOk('')
    const res = addPatient({ nombre, apellido, cc, telefono })
    if (!res.ok) {
      setError(res.error)
      return
    }
    setNombre('')
    setApellido('')
    setCc('')
    setTelefono('')
    setOk(`Paciente ${res.patient.nombre} ${res.patient.apellido} agregado.`)
    onAdded?.(res.list)
  }

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      <h3>Agregar paciente</h3>
      <div className="grid2">
        <label>
          Nombre*
          <div className="input"><input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="" /></div>
        </label>
        <label>
          Apellido*
          <div className="input"><input value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="" /></div>
        </label>
        <label>
          CC*
          <div className="input"><input value={cc} onChange={(e) => setCc(e.target.value)} placeholder="" inputMode="numeric" /></div>
        </label>
        <label>
          Teléfono
          <div className="input"><input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="" inputMode="tel" /></div>
        </label>
      </div>
      {error && <div className="alert error">{error}</div>}
      {ok && <div className="alert ok">{ok}</div>}
      <button className="btn primary" type="submit">Guardar paciente</button>
    </form>
  )
}
