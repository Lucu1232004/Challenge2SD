# Challenge 03 - Task Manager en Ionic

## Qué es esto?

Este es el **Challenge 03** de la materia Desarrollo de Software para Plataformas Móviles. Es una app nueva de **Gestor de Tareas** hecha en **Ionic + React + TypeScript**.

> **Nota de ramas:** por pedido del profesor cada challenge va en su rama sin mezclarse.
> * `challenge-03` = Practice 01 (migración de contactos a Ionic)
> * `challenge-03-taskmanager` = **esta rama**, Challenge 03 Task Manager

## Qué hace la app?

1. **Ver lista de tareas**: al abrir aparece `IonLoading` por 1.5s simulando carga, luego la lista.
2. **Agregar tareas**: formulario superior con título (obligatorio) y descripción (opcional). Al guardar se inserta al inicio con `id: Date.now()`.
3. **Marcar como completada**: `IonCheckbox` por tarea hace toggle de `completed`. Si está completada muestra `IonBadge` verde.
4. **Eliminar tareas**: botón basura pide confirmación con `IonAlert` nativo antes de borrar.
5. **Estadísticas**: Total / Pendientes / Completadas calculadas con `filter`.
6. **Estado vacío**: mensaje amigable si no hay tareas.

### Datos iniciales

`src/data/tasks.ts` con 3 tareas de ejemplo (`Task { id, title, description, completed, createdAt }`).

## Requisitos de clase vs implementación

| Requisito Clase 03 | Dónde está |
|--------------------|------------|
| States y effects si es necesario | `useState` para tasks, loading, alert + `useEffect` para carga inicial con cleanup |
| Padre + hijos, mínimo 3 componentes | `Home` (padre) + `TaskForm` (hijo, onAdd) + `TaskItem` (hijo, onToggle/onDelete) |
| Ver lista | `IonList` + `tasks.map` con `key={task.id}` |
| Agregar | `TaskForm` con `IonInput` + validación `disabled={!title.trim()}` |
| Marcar completada | `IonCheckbox checked + onIonChange` |
| Eliminar | `IonButton` + `IonAlert` confirm |

Cómo el hijo ejecuta algo del padre (ejemplo pedido en clase):

```tsx
// Padre
const handleToggleTask = (id: number) => {
  setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
};
<TaskItem task={task} onToggle={handleToggleTask} onDelete={handleDeleteClick} />

// Hijo
<IonCheckbox checked={task.completed} onIonChange={() => onToggle(task.id)} />
```

No se modifica el estado directo con `push`, siempre `setTasks(prev => [...])`.

## Tecnologías

* Ionic 9, React 19, TypeScript, Capacitor 8, Vite
* Componentes: IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonCheckbox, IonLabel, IonBadge, IonButton, IonInput, IonAlert, IonLoading, IonIcon

## Cómo correrlo

```bash
git clone https://github.com/Lucu1232004/Challenge2SD.git
cd Challenge2SD
git checkout challenge-03-taskmanager
npm install
ionic serve
# o
npm run dev
```

Build:

```bash
npm run build
```

Instalar en Android igual que Practice 01:

```bash
npm run build
npx cap copy android
npx cap sync android
npx cap open android
```

## Estructura

```
src/
  components/
    TaskForm.tsx + .css   # formulario agregar
    TaskItem.tsx + .css   # fila con checkbox + delete
  data/tasks.ts           # tipos + initialTasks
  pages/Home.tsx + .css   # lista + stats + loading + alert
  App.tsx                 # /home -> Home, / -> /home
```

## Qué aprendí

* `useEffect(() => {...}, [])` solo al montar para loaders, `useEffect(..., [dep])` cuando cambia algo, cleanup con `clearTimeout`.
* Por qué `key` es obligatorio en listas.
* Props de solo lectura y callbacks del padre al hijo.
* `IonCheckbox`, `IonAlert`, `IonLoading` nativos.

## Autor

**Samuel Patiño** - samuel.patino@uao.edu.co
Proyecto para Desarrollo de Software para Plataformas Móviles.
