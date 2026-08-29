import { useState, useEffect } from 'react';
import { fetchContacts } from './api/contacts.js';
import Loader from './components/Loader.jsx';
import ContactForm from './components/ContactForm.jsx';
import ContactList from './components/ContactList.jsx';

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // cargar los contactos al montar el componente
  useEffect(() => {
    fetchContacts().then((data) => {
      setContacts(data);
      setLoading(false);
    });
  }, []);

  const addContact = (contact) => {
    setContacts((prev) => [...prev, contact]);
  };

  const deleteContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) return <Loader />;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mis Contactos</h1>
        <span className="badge">{contacts.length} contactos</span>
      </header>

      <ContactForm onAdd={addContact} />

      {contacts.length > 0 ? (
        <ContactList contacts={contacts} onDelete={deleteContact} />
      ) : (
        <p className="empty-state">No tienes contactos todavía. ¡Agrega el primero!</p>
      )}
    </div>
  );
}

export default App;