// Sección de tareas: Firebase Realtime Database y acciones bloqueadas sin conexión.
import { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  IonText,
  IonSpinner,
  IonAlert,
  IonNote,
  IonBadge,
} from '@ionic/react';
import {
  addOutline,
  createOutline,
  trashOutline,
  checkboxOutline,
  timeOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import AppHeader from '../components/AppHeader';
import AppTabBar from '../components/AppTabBar';
import { useAuth } from '../contexts/AuthContext';
import { useNetworkStatus } from '../contexts/NetworkContext';
import { useRealTimeCollection } from '../hooks/useRealTimeCollection';
import { Task } from '../types';
import './DataPages.css';

const emptyForm = { title: '', description: '' };

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const { connected } = useNetworkStatus();
  const path = user ? `tasks/${user.uid}` : 'tasks/sin-usuario';
  const { data, loading, error, add, update, remove } = useRealTimeCollection<Task>(path);

  const tasks = Object.entries(data)
    .map(([id, task]) => ({ ...task, id }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setForm({ title: task.title, description: task.description });
    setIsModalOpen(true);
  };

  const askDelete = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteAlert(true);
  };

  const handleSave = async () => {
    if (!connected || !form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
      };

      if (editing?.id) {
        await update(editing.id, payload);
      } else {
        await add({
          ...payload,
          completed: false,
          createdAt: new Date().toISOString(),
        });
      }

      setIsModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (task: Task) => {
    if (!connected || !task.id) return;
    try {
      await update(task.id, { completed: !task.completed });
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    if (taskToDelete?.id) {
      try {
        await remove(taskToDelete.id);
      } catch (err) {
        console.error(err);
      }
    }
    setTaskToDelete(null);
  };

  return (
    <IonPage>
      <AppHeader title="Tareas" />
      <IonContent>
        {!connected && (
          <IonNote color="warning" className="network-note">
            Sin conexión: no puedes crear, editar, completar ni eliminar tareas.
          </IonNote>
        )}

        {error && (
          <IonText color="danger">
            <p className="page-error">{error}</p>
          </IonText>
        )}

        <div className="stats-row">
          <div className="stat-card">
            <IonIcon icon={checkboxOutline} color="primary" />
            <span className="stat-value">{total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <IonIcon icon={timeOutline} color="warning" />
            <span className="stat-value">{pending}</span>
            <span className="stat-label">Pendientes</span>
          </div>
          <div className="stat-card">
            <IonIcon icon={checkmarkCircleOutline} color="success" />
            <span className="stat-value">{completed}</span>
            <span className="stat-label">Completadas</span>
          </div>
        </div>

        {loading ? (
          <div className="page-loading">
            <IonSpinner name="crescent" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={checkboxOutline} size="large" color="medium" />
            <h2>No tienes tareas</h2>
            <p>Toca el botón + para crear la primera.</p>
          </div>
        ) : (
          <IonList className="data-list">
            {tasks.map((task) => (
              <IonItem key={task.id} className="data-item">
                <IonCheckbox
                  slot="start"
                  checked={task.completed}
                  disabled={!connected}
                  onIonChange={() => toggleTask(task)}
                />
                <IonLabel className={task.completed ? 'task-done' : ''}>
                  <h2>{task.title}</h2>
                  <p>{task.description || 'Sin descripción.'}</p>
                  <p>{new Date(task.createdAt).toLocaleDateString('es-CO')}</p>
                </IonLabel>
                {task.completed && (
                  <IonBadge slot="end" color="success">
                    Completada
                  </IonBadge>
                )}
                <IonButton
                  fill="clear"
                  disabled={!connected}
                  onClick={() => openEdit(task)}
                  aria-label="Editar tarea"
                >
                  <IonIcon slot="icon-only" icon={createOutline} />
                </IonButton>
                <IonButton
                  fill="clear"
                  color="danger"
                  disabled={!connected}
                  onClick={() => askDelete(task)}
                  aria-label="Eliminar tarea"
                >
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={openCreate} disabled={!connected} aria-label="Agregar tarea">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        <IonModal id="task-modal" isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editing ? 'Editar tarea' : 'Nueva tarea'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsModalOpen(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Título *</IonLabel>
                <IonInput
                  value={form.title}
                  placeholder="Ej: Terminar el challenge 06"
                  onIonInput={(e) => setForm({ ...form, title: e.detail.value || '' })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonInput
                  value={form.description}
                  placeholder="Detalles opcionales"
                  onIonInput={(e) => setForm({ ...form, description: e.detail.value || '' })}
                />
              </IonItem>
            </IonList>

            <IonButton
              expand="block"
              className="ion-margin-top"
              onClick={handleSave}
              disabled={!connected || saving || !form.title.trim()}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </IonButton>
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Eliminar tarea"
          message={`¿Seguro que quieres eliminar "${taskToDelete?.title || 'esta tarea'}"?`}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: () => {
                void confirmDelete();
              },
            },
          ]}
        />
      </IonContent>
      <AppTabBar active="tasks" />
    </IonPage>
  );
};

export default Tasks;
