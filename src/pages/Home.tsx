import { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonText,
  IonIcon,
  IonBadge,
  IonAlert,
  IonLoading,
} from '@ionic/react';
import { listOutline, checkmarkCircleOutline, timeOutline } from 'ionicons/icons';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import { Task, initialTasks } from '../data/tasks';
import './Home.css';

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showAlert, setShowAlert] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Simular carga inicial
  useState(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  });

  const handleAddTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteClick = (id: number) => {
    setTaskToDelete(id);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (taskToDelete !== null) {
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete));
      setTaskToDelete(null);
    }
    setShowAlert(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Mi Gestor de Tareas</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonLoading isOpen={true} message="Cargando tus tareas..." />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mi Gestor de Tareas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Estadisticas */}
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

        {/* Formulario para agregar */}
        <TaskForm onAdd={handleAddTask} />

        {/* Lista de tareas */}
        {tasks.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={listOutline} size="large" color="medium" />
            <IonText color="medium">
              <p>No tienes tareas todavia.</p>
              <p>¡Agrega tu primera tarea arriba!</p>
            </IonText>
          </div>
        ) : (
          <IonList className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteClick}
              />
            ))}
          </IonList>
        )}

        {/* Alerta de confirmacion */}
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

export default Home;
