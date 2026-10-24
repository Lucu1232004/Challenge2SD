// Sección de contactos: Firestore y acciones bloqueadas sin conexión.
import { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  IonText,
  IonSpinner,
  IonAlert,
  IonNote,
} from '@ionic/react';
import { addOutline, createOutline, trashOutline, peopleOutline } from 'ionicons/icons';
import AppHeader from '../components/AppHeader';
import AppTabBar from '../components/AppTabBar';
import { useAuth } from '../contexts/AuthContext';
import { useNetworkStatus } from '../contexts/NetworkContext';
import { useCollection } from '../hooks/useCollection';
import { Contact } from '../types';
import './DataPages.css';

const emptyForm = { name: '', phone: '', age: '', city: '' };

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const Contacts: React.FC = () => {
  const { user } = useAuth();
  const { connected } = useNetworkStatus();
  const ownerId = user?.uid || 'sin-usuario';
  const { data: contacts, loading, error, add, update, remove } = useCollection<Contact>(
    'contacts',
    [['ownerId', '==', ownerId]]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (contact: Contact) => {
    setEditing(contact);
    setForm({
      name: contact.name,
      phone: contact.phone,
      age: String(contact.age),
      city: contact.city,
    });
    setIsModalOpen(true);
  };

  const askDelete = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteAlert(true);
  };

  const handleSave = async () => {
    if (!connected || !form.name.trim() || !form.phone.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        age: Number(form.age) || 0,
        city: form.city.trim(),
      };

      if (editing?.id) {
        await update(editing.id, payload);
      } else {
        await add({
          ...payload,
          ownerId,
          createdAt: new Date().toISOString(),
        });
      }

      setIsModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (contactToDelete?.id) {
      try {
        await remove(contactToDelete.id);
      } catch (err) {
        console.error(err);
      }
    }
    setContactToDelete(null);
  };

  return (
    <IonPage>
      <AppHeader title="Contactos" />
      <IonContent>
        {!connected && (
          <IonNote color="warning" className="network-note">
            Sin conexión: no puedes crear, editar ni eliminar contactos.
          </IonNote>
        )}

        {error && (
          <IonText color="danger">
            <p className="page-error">{error}</p>
          </IonText>
        )}

        {loading ? (
          <div className="page-loading">
            <IonSpinner name="crescent" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={peopleOutline} size="large" color="medium" />
            <h2>No tienes contactos</h2>
            <p>Toca el botón + para agregar el primero.</p>
          </div>
        ) : (
          <IonList className="data-list">
            {contacts.map((contact) => (
              <IonItem key={contact.id} className="data-item">
                <IonAvatar slot="start" className="data-avatar">
                  <span>{initialsOf(contact.name)}</span>
                </IonAvatar>
                <IonLabel>
                  <h2>{contact.name}</h2>
                  <p>{contact.phone}</p>
                  <p>
                    {contact.age} años · {contact.city}
                  </p>
                </IonLabel>
                <IonButton
                  fill="clear"
                  disabled={!connected}
                  onClick={() => openEdit(contact)}
                  aria-label="Editar contacto"
                >
                  <IonIcon slot="icon-only" icon={createOutline} />
                </IonButton>
                <IonButton
                  fill="clear"
                  color="danger"
                  disabled={!connected}
                  onClick={() => askDelete(contact)}
                  aria-label="Eliminar contacto"
                >
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={openCreate} disabled={!connected} aria-label="Agregar contacto">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        <IonModal id="contact-modal" isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editing ? 'Editar contacto' : 'Nuevo contacto'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsModalOpen(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Nombre *</IonLabel>
                <IonInput
                  value={form.name}
                  placeholder="Nombre completo"
                  onIonInput={(e) => setForm({ ...form, name: e.detail.value || '' })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Teléfono *</IonLabel>
                <IonInput
                  type="tel"
                  value={form.phone}
                  placeholder="300 000 0000"
                  onIonInput={(e) => setForm({ ...form, phone: e.detail.value || '' })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Edad</IonLabel>
                <IonInput
                  type="number"
                  value={form.age}
                  placeholder="18"
                  onIonInput={(e) => setForm({ ...form, age: e.detail.value || '' })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Ciudad</IonLabel>
                <IonInput
                  value={form.city}
                  placeholder="Cali"
                  onIonInput={(e) => setForm({ ...form, city: e.detail.value || '' })}
                />
              </IonItem>
            </IonList>

            <IonButton
              expand="block"
              className="ion-margin-top"
              onClick={handleSave}
              disabled={!connected || saving || !form.name.trim() || !form.phone.trim()}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </IonButton>
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Eliminar contacto"
          message={`¿Seguro que quieres eliminar a ${contactToDelete?.name || 'este contacto'}?`}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: () => {
                void confirmDelete();
              },
            },
          ]}
        />
      </IonContent>
      <AppTabBar active="contacts" />
    </IonPage>
  );
};

export default Contacts;
