import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonButton } from '@ionic/react';
import { getSession, logout } from '../lib/auth';
import { getVisits } from '../lib/data';

export default function Perfil({ onLogout }: { onLogout: () => void }) {
  const session = getSession();
  const visits = getVisits();
  const pendientes = visits.filter((v) => v.estado === 'pendiente').length;
  const encamino = visits.filter((v) => v.estado === 'en_camino').length;
  const finalizadas = visits.filter((v) => v.estado === 'finalizada').length;

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Perfil</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonCard className="med-card">
          <IonCardContent style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="avatar-sl" style={{ width: 58, height: 58, fontSize: 20 }}>SL</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{session?.name || session?.username || 'Médico'}</div>
              <div style={{ color: '#9AB8AD' }}>{session?.email}</div>
              <div style={{ color: '#00D68F', fontSize: 13 }}>MediClinic · by Samuel Patiño Lucumi</div>
            </div>
          </IonCardContent>
        </IonCard>

        <div className="stat-grid" style={{ marginTop: 12 }}>
          <IonCard className="med-card stat"><b>{visits.length}</b><span>Visitas hoy</span></IonCard>
          <IonCard className="med-card stat"><b>{pendientes + encamino}</b><span>Activas</span></IonCard>
          <IonCard className="med-card stat"><b>{finalizadas}</b><span>Finalizadas</span></IonCard>
        </div>

        <IonButton expand="block" fill="outline" color="medium" style={{ marginTop: 16 }} onClick={() => { logout(); onLogout(); }}>
          Cerrar sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
