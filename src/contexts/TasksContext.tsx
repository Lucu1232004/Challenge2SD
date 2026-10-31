// Contexto de tareas: habla con la tabla tasks de Supabase, mantiene la lista
// sincronizada con Realtime y comparte las operaciones CRUD con las páginas.
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { getDataErrorMessage } from '../lib/errors';
import { useAuth } from './AuthContext';
import type { Task } from '../data/tasks';

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
}

interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  error: string;
  realtime: boolean;
  addTask: (title: string, description: string) => Promise<void>;
  updateTask: (id: string, title: string, description: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  refresh: () => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

function mapRow(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    completed: row.completed,
    createdAt: row.created_at,
  };
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [realtime, setRealtime] = useState(false);

  const loadTasks = useCallback(
    async (silent = false) => {
      if (!userId) {
        setTasks([]);
        return;
      }

      if (!silent) setLoading(true);

      const { data, error: queryError } = await supabase
        .from('tasks')
        .select('id, title, description, completed, created_at')
        .order('created_at', { ascending: false });

      if (queryError) {
        setError(getDataErrorMessage(queryError));
      } else {
        setTasks(((data ?? []) as TaskRow[]).map(mapRow));
        setError('');
      }

      if (!silent) setLoading(false);
    },
    [userId]
  );

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  // Escucha los cambios de la tabla para que la lista se actualice en vivo.
  useEffect(() => {
    if (!userId) {
      setRealtime(false);
      return;
    }

    const channel = supabase
      .channel(`tasks-user-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void loadTasks(true);
        }
      )
      .subscribe((status) => {
        setRealtime(status === 'SUBSCRIBED');
      });

    return () => {
      setRealtime(false);
      void supabase.removeChannel(channel);
    };
  }, [userId, loadTasks]);

  const addTask = async (title: string, description: string) => {
    if (!userId) throw new Error('No hay una sesión activa.');

    const { data, error: insertError } = await supabase
      .from('tasks')
      .insert({ title, description, user_id: userId })
      .select('id, title, description, completed, created_at')
      .single();

    if (insertError) throw insertError;
    if (data) setTasks((prev) => [mapRow(data as TaskRow), ...prev]);
  };

  const updateTask = async (id: string, title: string, description: string) => {
    const { data, error: updateError } = await supabase
      .from('tasks')
      .update({ title, description })
      .eq('id', id)
      .select('id, title, description, completed, created_at')
      .single();

    if (updateError) throw updateError;
    if (data) {
      setTasks((prev) => prev.map((task) => (task.id === id ? mapRow(data as TaskRow) : task)));
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    const { data, error: toggleError } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', id)
      .select('id, title, description, completed, created_at')
      .single();

    if (toggleError) throw toggleError;
    if (data) {
      setTasks((prev) => prev.map((item) => (item.id === id ? mapRow(data as TaskRow) : item)));
    }
  };

  const deleteTask = async (id: string) => {
    const { error: deleteError } = await supabase.from('tasks').delete().eq('id', id);
    if (deleteError) throw deleteError;
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const getTaskById = (id: string) => tasks.find((task) => task.id === id);

  const value: TasksContextValue = {
    tasks,
    loading,
    error,
    realtime,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    getTaskById,
    refresh: () => loadTasks(),
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
