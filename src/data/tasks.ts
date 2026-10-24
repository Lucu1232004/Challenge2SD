// Datos y tipos para el gestor de tareas (Challenge 05)

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Estudiar para el examen',
    description: 'Repasar los apuntes de la clase 4',
    completed: false,
    createdAt: '2026-09-01',
  },
  {
    id: 2,
    title: 'Hacer ejercicio',
    description: 'Correr 30 minutos en el parque',
    completed: true,
    createdAt: '2026-09-02',
  },
  {
    id: 3,
    title: 'Hacer mercado',
    description: 'Leche, pan, huevos y frutas',
    completed: false,
    createdAt: '2026-09-03',
  },
];
