// Envoltorio común para las páginas de sensores.
import { IonContent, IonPage } from '@ionic/react';
import { ReactNode } from 'react';
import SensorHeader from './SensorHeader';

interface SensorPageProps {
  title: string;
  children: ReactNode;
}

const SensorPage: React.FC<SensorPageProps> = ({ title, children }) => (
  <IonPage>
    <SensorHeader title={title} />
    <IonContent className="ion-padding">
      <div className="sensor-page">{children}</div>
    </IonContent>
  </IonPage>
);

export default SensorPage;
