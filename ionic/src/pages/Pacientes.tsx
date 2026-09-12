import { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonAvatar } from '@ionic/react';
import { getPatients } from '../lib/data';

export default function Pacientes() {
  const [patients] = useState(() => getPatients());
  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Pacientes</IonTitle></IonToolbar></IonHeader>
      <IonContent>
        <IonList>
          {patients.map((p) => (
            <IonItem key={p.id}>
              <IonAvatar slot="start" className="avatar-sl" style={{ width: 42, height: 42 }}>
                {`${p.nombre[0]}${p.apellido[0]}`}
              </IonAvatar>
              <IonLabel>
                <h2>{p.nombre} {p.apellido}</h2>
                <p>CC {p.cc} · Tel {p.telefono}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
