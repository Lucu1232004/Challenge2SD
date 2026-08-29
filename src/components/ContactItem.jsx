// tonos de rojo para el avatar, rotan según el id del contacto
const avatarColors = [
  ['#ff2b2b', '#ff6b6b'],
  ['#8b0000', '#dc143c'],
  ['#e63946', '#ff4d4d'],
  ['#b30000', '#ff6666'],
  ['#a4161a', '#e5383b'],
  ['#ff0000', '#ff9999'],
];

function ContactItem({ contact, onDelete }) {
  const colors = avatarColors[contact.id % avatarColors.length];
  const initial = contact.name.charAt(0).toUpperCase();

  return (
    <li className="contact-item">
      {/* encabezado de la tarjeta */}
      <div className="card-head">
        <div
          className="avatar"
          style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
        >
          {initial}
        </div>
        <span className="contact-name">{contact.name}</span>
        <button className="delete-btn" onClick={() => onDelete(contact.id)} title="Eliminar">
          ✕
        </button>
      </div>

      {/* datos de la tarjeta */}
      <div className="card-body">
        <div className="card-row">
          <span className="card-label">Número:{' '}</span>
          <span className="card-value">{contact.phone}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Edad:{' '}</span>
          <span className="card-value">{contact.age || '—'}</span>
        </div>
        <div className="card-row">
          <span className="card-label">Ciudad:{' '}</span>
          <span className="card-value">{contact.city || '—'}</span>
        </div>
      </div>
    </li>
  );
}

export default ContactItem;