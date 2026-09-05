import { IonButton, IonIcon, IonCard, IonCardContent } from '@ionic/react';
import { trashOutline, chevronForwardOutline } from 'ionicons/icons';
import { Contact, avatarColors } from '../data/contacts';
import './ContactItem.css';

interface ContactItemProps {
  contact: Contact;
  onDelete: (id: number) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, onDelete }) => {
  const colors = avatarColors[contact.id % avatarColors.length];
  const initial = contact.name.charAt(0).toUpperCase();

  return (
    <IonCard
      className="contact-card"
      routerLink={`/contact/${contact.id}`}
      routerDirection="forward"
    >
      <IonCardContent className="contact-card-content">
        <div className="contact-header">
          <div
            className="contact-avatar"
            style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
          >
            {initial}
          </div>
          <div className="contact-info">
            <h3 className="contact-name">{contact.name}</h3>
            <p className="contact-detail">
              <strong>Tel:</strong> {contact.phone}
            </p>
            <p className="contact-detail">
              <strong>Edad:</strong> {contact.age || '—'}
            </p>
            <p className="contact-detail">
              <strong>Ciudad:</strong> {contact.city || '—'}
            </p>
          </div>
          <div className="contact-actions">
            <IonButton
              fill="clear"
              color="danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(contact.id);
              }}
              className="delete-button"
            >
              <IonIcon icon={trashOutline} />
            </IonButton>
            <IonIcon icon={chevronForwardOutline} color="medium" className="arrow-icon" />
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ContactItem;
