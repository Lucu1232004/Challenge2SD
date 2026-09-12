import { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonButton, IonButtons, IonBackButton } from '@ionic/react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVisitById, nextStatus, updateVisitStatus, VisitStatus } from '../lib/data';

const ORDER: VisitStatus[] = ['pendiente', 'en_camino', 'finalizada'];

export default function VisitaDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visit, setVisit] = useState(() => getVisitById(id ?? ''));

  if (!visit) {
    return (
      <IonPage>
        <IonHeader><IonToolbar><IonButtons slot="start"><IonBackButton defaultHref="/tabs/visitas" /></IonButtons><IonTitle>Detalle</IonTitle></IonToolbar></IonHeader>
        <IonContent className="ion-padding"><p>No se encontró la visita.</p></IonContent>
      </IonPage>
    );
  }

  const idx = ORDER.indexOf(visit.estado);
  const next = nextStatus(visit.estado);

  function avanzar() {
    if (!next || !visit) return;
    const updated = updateVisitStatus(visit.id, next);
    const v = updated.find((x) => x.id === visit.id);
    if (v) setVisit(v);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/tabs/visitas" /></IonButtons>
          <IonTitle>Detalle visita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard className="med-card">
          <IonCardContent>
            <h2 style={{ margin: '0 0 4px' }}>{visit.paciente}</h2>
            <p style={{ color: '#9AB8AD', margin: '0 0 10px' }}>CC {visit.cc} · {visit.hora} · {visit.motivo}</p>
            <span className={`pill ${visit.estado}`}>{visit.estado.replace('_', ' ')}</span>

            <div className="stepper">
              {ORDER.map((s, i) => (
                <div key={s} className={`step ${i < idx ? 'done' : ''} ${i === idx ? (s === 'finalizada' ? 'done' : 'now') : ''}`}>
                  <div className="bar" />
                  {s.replace('_', ' ')}
                </div>
              ))}
            </div>

            {next ? (
              <IonButton expand="block" onClick={avanzar}>
                Marcar como {next.replace('_', ' ')}
              </IonButton>
            ) : (
              <IonButton expand="block" disabled color="success">
                Visita finalizada
              </IonButton>
            )}
            <IonButton expand="block" fill="clear" onClick={() => navigate('/tabs/visitas')}>
              Volver a visitas
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}
