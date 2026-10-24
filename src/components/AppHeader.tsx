// Header compartido por las tres secciones: título, estado de red y logout.
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge,
} from '@ionic/react';
import { logOutOutline, wifiOutline, cloudOfflineOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNetworkStatus } from '../contexts/NetworkContext';

interface AppHeaderProps {
  title: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const { logout } = useAuth();
  const { connected } = useNetworkStatus();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          <IonBadge color={connected ? 'success' : 'warning'} className="network-badge">
            <IonIcon icon={connected ? wifiOutline : cloudOfflineOutline} />
            {connected ? 'En línea' : 'Sin red'}
          </IonBadge>
          <IonButton fill="clear" color="light" onClick={handleLogout} aria-label="Cerrar sesión">
            <IonIcon slot="icon-only" icon={logOutOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;
