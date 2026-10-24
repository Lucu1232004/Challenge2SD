// Página principal: lista las tareas del usuario con sus estadísticas.
// Los datos vienen del TasksContext y la sesión del AuthContext.
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
  IonButton,
} from '@ionic/react';
import {
  listOutline,
  checkmarkCircleOutline,
  timeOutline,
  addOutline,
  logOutOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import TaskItem from '../components/TaskItem';
import { useTasks } from '../contexts/TasksContext';
import { useAuth } from '../contexts/AuthContext';
import './Tasks.css';

const Tasks: React.FC = () => {
  const { tasks, toggleTask, deleteTask } = useTasks();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setTaskToDelete(id);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (taskToDelete !== null) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
    setShowAlert(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mi Gestor de Tareas</IonTitle>
          <IonButton slot="end" fill="clear" color="light" onClick={handleLogout}>
            <IonIcon slot="start" icon={logOutOutline} />
            Salir
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
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

        {/* Lista de tareas */}
        {tasks.length === 0 ? (
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
                onToggle={toggleTask}
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
