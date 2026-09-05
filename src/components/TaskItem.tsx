import { IonItem, IonCheckbox, IonLabel, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { Task } from '../data/tasks';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <IonItem className={`task-item ${task.completed ? 'task-completed' : ''}`}>
      <IonCheckbox
        slot="start"
        checked={task.completed}
        onIonChange={() => onToggle(task.id)}
      />
      <IonLabel>
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description}</p>
        <p className="task-date">Creada: {task.createdAt}</p>
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
        onClick={() => onDelete(task.id)}
      >
        <IonIcon icon={trashOutline} />
      </IonButton>
    </IonItem>
  );
};

export default TaskItem;
