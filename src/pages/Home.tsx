import { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLoading,
  IonAlert,
  IonBadge,
  IonText,
  IonModal,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonButtons,
} from '@ionic/react';
import { add, peopleOutline, closeOutline, saveOutline } from 'ionicons/icons';
import ContactItem from '../components/ContactItem';
import { Contact, initialContacts } from '../data/contacts';
import './Home.css';

const Home: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulario
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');

  // Simular carga de datos (igual que en Challenge 01)
  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts(initialContacts);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id: number) => {
    setContactToDelete(id);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (contactToDelete !== null) {
      setContacts((prev) => prev.filter((c) => c.id !== contactToDelete));
      setContactToDelete(null);
    }
    setShowAlert(false);
  };

  const openModal = () => {
    setName('');
    setPhone('');
    setAge('');
    setCity('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) return;

    const newContact: Contact = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      age: age.trim(),
      city: city.trim(),
    };

    setContacts((prev) => [...prev, newContact]);
    closeModal();
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="danger">
            <IonTitle>Mis Contactos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonLoading isOpen={true} message="Cargando contactos..." />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger">
          <IonTitle>Mis Contactos</IonTitle>
          <IonBadge slot="end" color="light" className="contact-badge">
            {contacts.length}
          </IonBadge>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {contacts.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={peopleOutline} size="large" color="medium" />
            <IonText color="medium">
              <p>No tienes contactos todavía.</p>
            </IonText>
          </div>
        ) : (
          <div className="contact-list">
            {contacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Botón flotante para agregar contacto */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton color="danger" onClick={openModal}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Modal para agregar contacto */}
        <IonModal isOpen={isModalOpen} onDidDismiss={closeModal}>
          <IonHeader>
            <IonToolbar color="danger">
              <IonTitle>Nuevo Contacto</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={closeModal}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Nombre *</IonLabel>
                <IonInput
                  value={name}
                  placeholder="Ej: Ana García"
                  onIonChange={(e) => setName(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Teléfono *</IonLabel>
                <IonInput
                  value={phone}
                  placeholder="Ej: 315 555 0101"
                  onIonChange={(e) => setPhone(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Edad</IonLabel>
                <IonInput
                  value={age}
                  placeholder="Ej: 25"
                  type="number"
                  onIonChange={(e) => setAge(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Ciudad</IonLabel>
                <IonInput
                  value={city}
                  placeholder="Ej: Cali"
                  onIonChange={(e) => setCity(e.detail.value!)}
                />
              </IonItem>
            </IonList>

            <IonButton
              expand="block"
              color="danger"
              className="ion-margin-top"
              onClick={handleSave}
              disabled={!name.trim() || !phone.trim()}
            >
              <IonIcon slot="start" icon={saveOutline} />
              Guardar Contacto
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Alerta de confirmación para eliminar */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Eliminar contacto"
          message="¿Estás seguro de que quieres eliminar este contacto?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => setShowAlert(false),
            },
            {
              text: 'Eliminar',
              role: 'confirm',
              handler: confirmDelete,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
