// Envoltorio común de las páginas del parcial.
import { IonContent, IonPage } from '@ionic/react';
import { ReactNode } from 'react';
import MissionHeader from './MissionHeader';

interface MissionPageProps {
  title: string;
  children: ReactNode;
}

const MissionPage: React.FC<MissionPageProps> = ({ title, children }) => (
  <IonPage>
    <MissionHeader title={title} />
    <IonContent className="ion-padding">
      <div className="mission-page">{children}</div>
    </IonContent>
  </IonPage>
);

export default MissionPage;
