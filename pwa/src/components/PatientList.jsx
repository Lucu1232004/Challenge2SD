// Hijo: solo muestra la lista que le envía el padre (ya filtrada)
export default function PatientList({ patients }) {
  if (!patients.length) {
    return <div className="card empty">No hay pacientes para esa búsqueda.</div>
  }
  return (
    <div className="plist">
      {patients.map((p) => (
        <article key={p.id} className="card patient">
          <div className="avatar">{`${p.nombre[0] || ''}${p.apellido[0] || ''}`.toUpperCase()}</div>
          <div className="pinfo">
            <strong>{p.nombre} {p.apellido}</strong>
            <span className="muted">CC: {p.cc}{p.telefono ? ` · Tel: ${p.telefono}` : ''}</span>
          </div>
          <span className="badge">CC {p.cc.slice(-4).padStart(4, '•')}</span>
        </article>
      ))}
    </div>
  )
}
