// Contexto de tareas: mantiene la lista en memoria y la comparte entre la
// lista, el formulario y el detalle, sin pasar props por cada nivel.
import { createContext, useContext, useState, ReactNode } from 'react';
import { Task, initialTasks } from '../data/tasks';

interface TasksContextValue {
  tasks: Task[];
  addTask: (title: string, description: string) => void;
  updateTask: (id: number, title: string, description: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  getTaskById: (id: number) => Task | undefined;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: number, title: string, description: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title, description } : task))
    );
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const getTaskById = (id: number) => tasks.find((task) => task.id === id);

  const value: TasksContextValue = {
    tasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    getTaskById,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

// Hook para consumir el contexto desde cualquier componente
export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks debe usarse dentro de un TasksProvider');
  }
  return context;
}
