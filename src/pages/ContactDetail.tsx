import { useParams, useNavigate } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import { callOutline, calendarOutline, locationOutline, trashOutline } from 'ionicons/icons';
import { initialContacts, avatarColors } from '../data/contacts';
import './ContactDetail.css';

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const contactId = id ? parseInt(id, 10) : NaN;
  const contact = initialContacts.find((c) => c.id === contactId);

  if (!contact) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="danger">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>Contacto no encontrado</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>El contacto que buscas no existe.</p>
          <IonButton expand="block" color="danger" onClick={() => navigate('/home')}>
          Volver al inicio
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  const colors = avatarColors[contact.id % avatarColors.length];
  const initial = contact.name.charAt(0).toUpperCase();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Detalle del Contacto</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="detail-header">
          <div
            className="detail-avatar"
            style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
          >
            {initial}
          </div>
          <h1 className="detail-name">{contact.name}</h1>
        </div>

        <IonCard>
          <IonCardContent>
            <div className="detail-item">
              <IonIcon icon={callOutline} color="danger" />
              <div className="detail-text">
                <p className="detail-label">Telefono</p>
                <p className="detail-value">{contact.phone}</p>
              </div>
            </div>

            <div className="detail-item">
              <IonIcon icon={calendarOutline} color="danger" />
              <div className="detail-text">
                <p className="detail-label">Edad</p>
                <p className="detail-value">{contact.age || 'No especificada'}</p>
              </div>
            </div>

            <div className="detail-item">
              <IonIcon icon={locationOutline} color="danger" />
              <div className="detail-text">
                <p className="detail-label">Ciudad</p>
                <p className="detail-value">{contact.city || 'No especificada'}</p>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        <IonButton
        expand="block"
        color="danger"
        fill="outline"
        className="ion-margin-top"
        onClick={() => navigate('/home')}
        >
        Volver a la lista
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ContactDetail;
