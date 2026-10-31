// PÃ¡gina para crear o editar una tarea.
// Si la ruta trae un :id, carga la tarea existente y la edita;
// si no, crea una nueva. Al guardar vuelve a la lista.
import { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonList,
  IonText,
  IonBackButton,
  IonButtons,
  IonLoading,
  IonSpinner,
} from '@ionic/react';
import { saveOutline } from 'ionicons/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../contexts/TasksContext';
import { getDataErrorMessage } from '../lib/errors';
import './TaskFormPage.css';

const TaskFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTaskById, addTask, updateTask, loading } = useTasks();
  const navigate = useNavigate();

  const editingTask = id ? getTaskById(id) : undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [initializedId, setInitializedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTask && initializedId !== editingTask.id) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setInitializedId(editingTask.id);
    }
  }, [editingTask, initializedId]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setError('');
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, title.trim(), description.trim());
      } else {
        await addTask(title.trim(), description.trim());
      }
      navigate('/tasks', { replace: true });
    } catch (err) {
      setError(getDataErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const showLoading = Boolean(id) && loading && !editingTask;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" />
          </IonButtons>
          <IonTitle>{editingTask ? 'Editar tarea' : 'Nueva tarea'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {showLoading ? (
          <div className="empty-state">
            <IonSpinner name="crescent" />
            <IonText color="medium">
              <p>Cargando la tarea...</p>
            </IonText>
          </div>
        ) : id && !editingTask ? (
          <div className="empty-state">
            <IonText color="medium">
              <p>No encontramos esa tarea. Puede que ya haya sido eliminada.</p>
            </IonText>
            <IonButton onClick={() => navigate('/tasks')}>Volver a la lista</IonButton>
          </div>
        ) : (
          <div className="task-form">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">TÃ­tulo de la tarea *</IonLabel>
                <IonInput
                  value={title}
                  placeholder="Ej: Hacer la tarea de matemÃ¡ticas"
                  onIonInput={(e) => setTitle(e.detail.value || '')}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">DescripciÃ³n (opcional)</IonLabel>
                <IonTextarea
                  value={description}
                  placeholder="Ej: PÃ¡ginas 45-50 del libro"
                  autoGrow
                  rows={3}
                  onIonInput={(e) => setDescription(e.detail.value || '')}
                />
              </IonItem>
            </IonList>

            {error && (
              <IonText color="danger">
                <p className="task-form-error">{error}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              color="primary"
              className="ion-margin-top"
              onClick={handleSave}
              disabled={!title.trim() || saving}
            >
              <IonIcon slot="start" icon={saveOutline} />
              {editingTask ? 'Guardar cambios' : 'Agregar tarea'}
            </IonButton>
          </div>
        )}

        <IonLoading isOpen={saving} message="Guardando en Supabase..." />
      </IonContent>
    </IonPage>
  );
};

export default TaskFormPage;
