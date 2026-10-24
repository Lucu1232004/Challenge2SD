// Header compartido por las pantallas del parcial.
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface MissionHeaderProps {
  title: string;
  back?: boolean;
  logout?: boolean;
}

const MissionHeader: React.FC<MissionHeaderProps> = ({
  title,
  back = true,
  logout = false,
}) => {
  const { logout: signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <IonHeader>
      <IonToolbar color="primary">
        {back && (
          <IonButtons slot="start">
            <IonBackButton defaultHref="/missions" />
          </IonButtons>
        )}
        <IonTitle>{title}</IonTitle>
        {logout && (
          <IonButtons slot="end">
            <IonButton onClick={handleLogout} aria-label="Cerrar sesión">
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default MissionHeader;
