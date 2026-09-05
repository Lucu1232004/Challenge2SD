import { useState } from 'react';
import {
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonList,
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import './TaskForm.css';

interface TaskFormProps {
  onAdd: (title: string, description: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim());
    setTitle('');
    setDescription('');
  };

  return (
    <div className="task-form">
      <IonList>
        <IonItem>
          <IonLabel position="stacked">Titulo de la tarea *</IonLabel>
          <IonInput
            value={title}
            placeholder="Ej: Hacer la tarea de matematicas"
            onIonChange={(e) => setTitle(e.detail.value || '')}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Descripcion (opcional)</IonLabel>
          <IonInput
            value={description}
            placeholder="Ej: Paginas 45-50 del libro"
            onIonChange={(e) => setDescription(e.detail.value || '')}
          />
        </IonItem>
      </IonList>

      <IonButton
        expand="block"
        color="primary"
        className="ion-margin-top"
        onClick={handleSubmit}
        disabled={!title.trim()}
      >
        <IonIcon slot="start" icon={addOutline} />
        Agregar tarea
      </IonButton>
    </div>
  );
};

export default TaskForm;
