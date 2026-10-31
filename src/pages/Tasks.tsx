// Página principal: lista las tareas del usuario con sus estadísticas.
// Los datos vienen de Supabase y se actualizan en vivo con Realtime.
import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonText,
  IonIcon,
  IonBadge,
  IonAlert,
  IonFab,
  IonFabButton,
  IonButtons,
  IonButton,
  IonAvatar,
  IonImg,
  IonSpinner,
} from '@ionic/react';
import {
  listOutline,
  checkmarkCircleOutline,
  timeOutline,
  addOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import TaskItem from '../components/TaskItem';
import { useTasks } from '../contexts/TasksContext';
import { useAuth } from '../contexts/AuthContext';
import { getDataErrorMessage } from '../lib/errors';
import './Tasks.css';

const Tasks: React.FC = () => {
  const { tasks, toggleTask, deleteTask, loading, error, realtime } = useTasks();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const initials = (profile?.email || user?.email || '?').slice(0, 2).toUpperCase();

  const handleDeleteClick = (id: string) => {
    setTaskToDelete(id);
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete);
      } catch (err) {
        setActionError(getDataErrorMessage(err));
      }
      setTaskToDelete(null);
    }
    setShowAlert(false);
  };

  const handleToggle = async (id: string) => {
    setActionError('');
    try {
      await toggleTask(id);
    } catch (err) {
      setActionError(getDataErrorMessage(err));
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mis tareas</IonTitle>
          <IonButtons slot="end">
            <IonButton
              fill="clear"
              color="light"
              onClick={() => navigate('/profile')}
              aria-label="Abrir perfil"
            >
              <IonAvatar className="toolbar-avatar">
                {profile?.avatar_url ? (
                  <IonImg src={profile.avatar_url} alt="Foto de perfil" />
                ) : (
                  <span>{initials}</span>
                )}
              </IonAvatar>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="sync-status">
          <IonBadge color={realtime ? 'success' : 'medium'}>
            {realtime ? 'En vivo' : 'Conectando'}
          </IonBadge>
          <span>Supabase mantiene la lista sincronizada.</span>
        </div>

        {/* Estadísticas */}
        <div className="stats-container">
          <div className="stat-box">
            <IonIcon icon={listOutline} color="primary" />
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-box">
            <IonIcon icon={timeOutline} color="warning" />
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pendientes</span>
          </div>
          <div className="stat-box">
            <IonIcon icon={checkmarkCircleOutline} color="success" />
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completadas</span>
          </div>
        </div>

        {(error || actionError) && (
          <IonText color="danger">
            <p className="list-error">{error || actionError}</p>
          </IonText>
        )}

        {/* Lista de tareas */}
        {loading ? (
          <div className="empty-state">
            <IonSpinner name="crescent" />
            <IonText color="medium">
              <p>Cargando tareas...</p>
            </IonText>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={listOutline} size="large" color="medium" />
            <IonText color="medium">
              <p>No tienes tareas todavía.</p>
              <p>Toca el botón + para agregar tu primera tarea.</p>
            </IonText>
          </div>
        ) : (
          <IonList className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDeleteClick}
                onOpen={(id) => navigate(`/tasks/${id}`)}
              />
            ))}
          </IonList>
        )}

        {/* Botón flotante para crear tarea */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => navigate('/tasks/new')}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Alerta de confirmación */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Eliminar tarea"
          message="¿Seguro que quieres eliminar esta tarea?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => setShowAlert(false),
            },
            {
              text: 'Eliminar',
              role: 'confirm',
              handler: confirmDelete,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tasks;
