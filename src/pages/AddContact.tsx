import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonButtons,
} from '@ionic/react';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { Contact } from '../data/contacts';
import './AddContact.css';

const AddContact: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) return;

    const newContact: Contact = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      age: age.trim(),
      city: city.trim(),
    };

    // Enviar el contacto nuevo a la pagina de inicio usando state navigation
    navigate('/home', { state: { newContact } });
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger">
          <IonButtons slot="start">
            <IonButton onClick={handleCancel}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Agregar contacto</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={handleSave}
              disabled={!name.trim() || !phone.trim()}
            >
              <IonIcon icon={saveOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Nombre completo *</IonLabel>
            <IonInput
            value={name}
            placeholder="Ej: Kylian Mbappee"
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
            <IonLabel position="stacked">Edad (opcional)</IonLabel>
            <IonInput
            value={age}
            placeholder="Ej: 25 años"
              type="number"
              onIonChange={(e) => setAge(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Ciudad (opcional)</IonLabel>
            <IonInput
            value={city}
            placeholder="Ej: Cali, Bogotá, Medellín"
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
          Guardar en mi agenda
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddContact;
