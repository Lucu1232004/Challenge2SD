// Tipos de las tareas del Challenge 08. Los datos ahora viven en Supabase.

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}
