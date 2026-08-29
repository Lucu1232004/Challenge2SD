import { useState } from 'react';

function ContactForm({ onAdd }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onAdd({
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      age: age.trim(),
      city: city.trim(),
    });

    setName('');
    setPhone('');
    setAge('');
    setCity('');
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="number"
        placeholder="Edad"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ciudad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit">Agregar contacto</button>
    </form>
  );
}

export default ContactForm;