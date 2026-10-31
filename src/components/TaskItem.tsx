import { IonItem, IonCheckbox, IonLabel, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import type { Task } from '../data/tasks';
import { formatDate } from '../lib/format';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onOpen }) => {
  return (
    <IonItem
      className={`task-item ${task.completed ? 'task-completed' : ''}`}
      onClick={() => onOpen(task.id)}
    >
      <IonCheckbox
        slot="start"
        checked={task.completed}
        onClick={(event) => event.stopPropagation()}
        onIonChange={() => onToggle(task.id)}
      />
      <IonLabel>
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description || 'Sin descripción'}</p>
        <p className="task-date">Creada: {formatDate(task.createdAt)}</p>
      </IonLabel>
      {task.completed && (
        <IonBadge slot="end" color="success">
          Completada
        </IonBadge>
      )}
      <IonButton
        slot="end"
        fill="clear"
        color="danger"
        aria-label="Eliminar tarea"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(task.id);
        }}
      >
        <IonIcon icon={trashOutline} />
      </IonButton>
    </IonItem>
  );
};

export default TaskItem;
