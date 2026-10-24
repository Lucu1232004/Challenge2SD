// Header compartido por las páginas de sensores.
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/react';

interface SensorHeaderProps {
  title: string;
  back?: boolean;
}

const SensorHeader: React.FC<SensorHeaderProps> = ({ title, back = true }) => (
  <IonHeader>
    <IonToolbar color="primary">
      {back && (
        <IonButtons slot="start">
          <IonBackButton defaultHref="/home" />
        </IonButtons>
      )}
      <IonTitle>{title}</IonTitle>
    </IonToolbar>
  </IonHeader>
);

export default SensorHeader;
