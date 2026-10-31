// Página de detalle: muestra la información completa de una tarea
// y permite ir a editarla o volver a la lista.
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonIcon,
  IonButton,
  IonBadge,
  IonBackButton,
  IonButtons,
  IonSpinner,
} from '@ionic/react';
import { createOutline, checkmarkCircleOutline, timeOutline } from 'ionicons/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../contexts/TasksContext';
import { formatDate } from '../lib/format';
import './TaskDetail.css';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTaskById, loading } = useTasks();
  const navigate = useNavigate();

  const task = id ? getTaskById(id) : undefined;

  if (loading && !task) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tasks" />
            </IonButtons>
            <IonTitle>Detalle</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="empty-state">
            <IonSpinner name="crescent" />
            <IonText color="medium">
              <p>Cargando la tarea...</p>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!task) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tasks" />
            </IonButtons>
            <IonTitle>Detalle</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="empty-state">
            <IonText color="medium">
              <p>No encontramos esa tarea. Puede que ya haya sido eliminada.</p>
            </IonText>
            <IonButton onClick={() => navigate('/tasks')}>Volver a la lista</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" />
          </IonButtons>
          <IonTitle>Detalle de la tarea</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="detail-card">
          <div className="detail-head">
            <h2 className="detail-title">{task.title}</h2>
            {task.completed ? (
              <IonBadge color="success">
                <IonIcon icon={checkmarkCircleOutline} /> Completada
              </IonBadge>
            ) : (
              <IonBadge color="warning">
                <IonIcon icon={timeOutline} /> Pendiente
              </IonBadge>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Descripción</span>
            <p className="detail-value">{task.description || 'Sin descripción.'}</p>
          </div>

          <div className="detail-row">
            <span className="detail-label">Fecha de creación</span>
            <p className="detail-value">{formatDate(task.createdAt)}</p>
          </div>

          <IonButton
            expand="block"
            color="primary"
            className="ion-margin-top"
            onClick={() => navigate(`/tasks/edit/${task.id}`)}
          >
            <IonIcon slot="start" icon={createOutline} />
            Editar tarea
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TaskDetail;
