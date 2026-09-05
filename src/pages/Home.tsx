import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  IonButton,
  IonButtons,
} from '@ionic/react';
import { add, peopleOutline, logOutOutline } from 'ionicons/icons';
import { clearAuth } from '../data/storage';
import ContactItem from '../components/ContactItem';
import { Contact, initialContacts } from '../data/contacts';
import './Home.css';

const Home: React.FC = () => {
  const [contacts, setContacts] = useState([] as Contact[]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Simular carga de datos (igual que en Challenge 01)
  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts(initialContacts);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Recibir contacto nuevo desde la pagina AddContact via state navigation
  useEffect(() => {
    if (location.state?.newContact) {
      setContacts((prev) => [...prev, location.state.newContact]);
      // Limpiar el state para no agregarlo de nuevo al volver
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleDelete = (id: number) => {
    setContactToDelete(id);
    setShowAlert(true);
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  const confirmDelete = () => {
    if (contactToDelete !== null) {
      setContacts((prev) => prev.filter((c) => c.id !== contactToDelete));
      setContactToDelete(null);
    }
    setShowAlert(false);
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
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
            </IonButton>
          </IonButtons>
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

        {/* Boton flotante para agregar contacto - navega a pagina nueva */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton color="danger" routerLink="/contact/new" routerDirection="forward">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

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
