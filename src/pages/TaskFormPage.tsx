// Página para crear o editar una tarea.
// Si la ruta trae un :id, carga la tarea existente y la edita;
// si no, crea una nueva. Al guardar vuelve a la lista.
import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonText,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import { saveOutline } from 'ionicons/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../contexts/TasksContext';
import './TaskFormPage.css';

const TaskFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTaskById, addTask, updateTask } = useTasks();
  const navigate = useNavigate();

  const editingTask = id ? getTaskById(Number(id)) : undefined;

  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');

  const handleSave = () => {
    if (!title.trim()) return;
    if (editingTask) {
      updateTask(editingTask.id, title.trim(), description.trim());
    } else {
      addTask(title.trim(), description.trim());
    }
    navigate('/tasks', { replace: true });
  };

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
        {id && !editingTask ? (
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
                <IonLabel position="stacked">Título de la tarea *</IonLabel>
                <IonInput
                  value={title}
                  placeholder="Ej: Hacer la tarea de matemáticas"
                  onIonChange={(e) => setTitle(e.detail.value || '')}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Descripción (opcional)</IonLabel>
                <IonInput
                  value={description}
                  placeholder="Ej: Páginas 45-50 del libro"
                  onIonChange={(e) => setDescription(e.detail.value || '')}
                />
              </IonItem>
            </IonList>

            <IonButton
              expand="block"
              color="primary"
              className="ion-margin-top"
              onClick={handleSave}
              disabled={!title.trim()}
            >
              <IonIcon slot="start" icon={saveOutline} />
              {editingTask ? 'Guardar cambios' : 'Agregar tarea'}
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TaskFormPage;
