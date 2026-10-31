# Challenge 08 - Gestor de Tareas con Supabase

App móvil hecha con Ionic y React que evoluciona el gestor de tareas del Challenge 05. Cambia Firebase por Supabase y agrega persistencia real, lista en vivo, perfiles con avatar y políticas RLS.

## Qué incluye

- Registro, inicio y cierre de sesión con Supabase Auth.
- Sesión persistente: al abrir la app se restaura el usuario.
- Rutas protegidas: sin sesión no se entra a las tareas.
- CRUD completo de tareas en la tabla `tasks`.
- Lista sincronizada en vivo con Supabase Realtime.
- Perfil con avatar guardado en el bucket `avatars`.
- Captura de foto con `@capacitor/camera` y opción de subir un archivo.
- RLS: cada usuario solo ve y modifica sus propias tareas y su perfil.
- Componentes Ionic: `IonPage`, `IonList`, `IonItem`, `IonInput`, `IonTextarea`, `IonButton`, `IonFab`, `IonAlert`, `IonAvatar`, `IonBadge`, entre otros.

## Requisitos del challenge

La clase 09 pide:

1. Crear el proyecto, la tabla de tareas con RLS y el bucket de avatares.
2. Registro, login, CRUD y lista en vivo.
3. Usar componentes Ionic y captura de foto con la cámara.

Todo eso está implementado en esta rama.

## Tecnologías

- Ionic 9 con React 19 y TypeScript.
- Vite 8 para desarrollo y compilación.
- Capacitor 8 para empaquetar en Android.
- Supabase para Auth, Postgres, Realtime y Storage.
- React Router 6 para las rutas.
- Ionicons para los iconos.

## Estructura

```text
src/
  components/
    TaskItem.tsx          Tarjeta de una tarea
  contexts/
    AuthContext.tsx       Usuario, sesión, perfil y acciones de auth
    TasksContext.tsx      CRUD y suscripción Realtime a tasks
  hooks/
    useSupabaseAuth.ts    Login, registro, logout y restauración de sesión
    useProfile.ts         Perfil, avatar y subida al bucket
  lib/
    supabase.ts           Cliente único de Supabase
    camera.ts             Captura de foto con Capacitor
    errors.ts             Errores de Supabase traducidos al español
    format.ts             Formato de fechas
  pages/
    Login.tsx             Inicio de sesión
    Register.tsx          Registro
    Tasks.tsx             Lista, estadísticas y estado de Realtime
    TaskFormPage.tsx      Crear o editar una tarea
    TaskDetail.tsx        Detalle de una tarea
    Profile.tsx           Perfil, avatar y logout
  App.tsx                 Rutas, providers y protección de sesión
supabase/
  schema.sql              Tablas, RLS, Realtime y bucket de avatares
```

## Base de datos

El archivo `supabase/schema.sql` crea:

- `tasks`: tareas con `user_id`, título, descripción, estado y fecha.
- `profiles`: correo y URL del avatar de cada usuario.
- Trigger `handle_new_user` para crear el perfil al registrarse.
- Políticas RLS para que cada usuario solo acceda a sus datos.
- Publicación de `tasks` en `supabase_realtime`.
- Bucket público `avatars` con políticas para subir, reemplazar y borrar solo la foto propia.

## Configuración de Supabase

1. Crear un proyecto en supabase.com.
2. Abrir el SQL Editor y ejecutar completo `supabase/schema.sql`.
3. En Authentication, Sign In / Providers, habilitar Email. Para desarrollo se puede desactivar "Confirm email".
4. Crear `.env.local` en la raíz con:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

5. Instalar y correr:

```bash
npm install
npm run dev
```

La app queda en `http://localhost:5173`.

Para compilar:

```bash
npm run build
```

Para Android:

```bash
npx cap sync android
npx cap open android
```

No uses la `service_role` ni la secret key en el frontend. La publishable key es la única que debe ir en `.env.local`.

## Deploy

El archivo `public/_redirects` ya tiene la regla para que las rutas internas funcionen en Netlify:

```text
/* /index.html 200
```

Después de `npm run build`, se publica la carpeta `dist`.

## Notas

- El `appId` de Android se mantiene como `io.ionic.starter`.
- Las tareas y los perfiles viven en Supabase, no en memoria.
- Las cuentas de prueba se eliminan desde Authentication, Users.
- La app usa la cámara en Android y el selector de archivos en el navegador.

## Rama

Esta entrega vive en la rama `challenge-08` del repositorio.
