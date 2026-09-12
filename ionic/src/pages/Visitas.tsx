import { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonBadge } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { getVisits } from '../lib/data';

export default function Visitas() {
  const [visits] = useState(() => getVisits());
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Visitas del día</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <p style={{ color: '#9AB8AD', marginTop: 0 }}>Toca una visita para ver el detalle y cambiar el estado.</p>
        <div className="timeline">
          {visits.map((v) => (
            <div key={v.id} className="t-item" onClick={() => navigate(`/tabs/visitas/${v.id}`)} style={{ cursor: 'pointer' }}>
              <div className="t-hour">{v.hora}</div>
              <div className={`t-dot ${v.estado}`} />
              <IonCard className="med-card" style={{ margin: 0 }}>
                <IonCardContent>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div className="avatar-sl">{v.paciente.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800 }}>{v.paciente}</div>
                      <div style={{ color: '#9AB8AD', fontSize: 13 }}>{v.hora} · {v.motivo}</div>
                    </div>
                    <IonBadge className={`pill ${v.estado}`} style={{ background: 'transparent' }}>{v.estado.replace('_', ' ')}</IonBadge>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
}
