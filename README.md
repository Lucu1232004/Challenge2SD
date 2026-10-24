# Challenge 05 - Gestor de Tareas con Firebase

App móvil hecha con Ionic y React que toma el gestor de tareas del Challenge 03 y le agrega autenticación real con Firebase, contextos y rutas protegidas.

## Qué hace

- Registro con correo y contraseña.
- Inicio y cierre de sesión contra Firebase Authentication.
- Sesión persistente: si el usuario ya entró, la app lo recuerda al abrirla.
- Lista de tareas con estadísticas de total, pendientes y completadas.
- Crear, editar, ver el detalle, completar y eliminar tareas.
- Rutas privadas: sin sesión no se puede entrar a las tareas.

Las tareas viven en memoria durante la sesión. Al recargar la página vuelven las tareas de ejemplo. La persistencia en base de datos llega en el Challenge 06.

## Requisitos del challenge

El enunciado de la clase 05 pide:

- Login, registro y logout con Firebase.
- Rutas para login, registro, lista de tareas, agregar o editar y detalle.
- Un contexto para manejar los datos de las tareas entre páginas.
- Otro contexto para manejar el estado de autenticación.
- Custom hooks para encapsular la lógica de Firebase.

Todo eso está implementado en esta rama.

## Tecnologías

- Ionic 9 con React 19 y TypeScript.
- Vite 8 para desarrollo y compilación.
- Capacitor 8 para empaquetar la app en Android.
- Firebase 12, solo Authentication.
- React Router 6 para las rutas.
- Ionicons para los iconos.

## Estructura

```text
src/
  components/
    TaskItem.tsx          Tarjeta de una tarea con checkbox y botón eliminar
  contexts/
    AuthContext.tsx       Expone usuario, carga y acciones de autenticación
    TasksContext.tsx      Comparte la lista de tareas entre páginas
  data/
    tasks.ts              Tipo Task y tareas de ejemplo
  firebase/
    config.ts             Inicialización de Firebase y exportación de auth
    errors.ts             Traducción de errores de Firebase al español
  hooks/
    useFirebaseAuth.ts    Login, registro, logout y restauración de sesión
  pages/
    Login.tsx             Formulario de inicio de sesión
    Register.tsx          Formulario de registro
    Tasks.tsx             Lista, estadísticas y logout
    TaskFormPage.tsx      Crear o editar una tarea
    TaskDetail.tsx        Detalle de una tarea
  App.tsx                 Rutas, providers y protección de sesión
  main.tsx                Punto de entrada de React
```

## Rutas

| Ruta | Acceso | Pantalla |
|------|--------|----------|
| `/` | Público | Redirige a `/tasks` o `/login` según la sesión |
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro |
| `/tasks` | Privado | Lista de tareas |
| `/tasks/new` | Privado | Crear tarea |
| `/tasks/edit/:id` | Privado | Editar tarea |
| `/tasks/:id` | Privado | Detalle de la tarea |

`ProtectedRoute` revisa el estado de `AuthContext`. Mientras Firebase restaura la sesión muestra un loader. Si no hay usuario, redirige a `/login`.

## Autenticación

`useFirebaseAuth` es el hook que habla con Firebase. Se suscribe a `onAuthStateChanged` para mantener el usuario actualizado y expone tres acciones: `login`, `register` y `logout`. `AuthContext` envuelve ese hook y lo comparte con toda la app mediante `useAuth`.

Los errores de Firebase se traducen en `src/firebase/errors.ts` para que el usuario vea mensajes claros en vez de códigos técnicos.

## Configuración de Firebase

1. Crear un proyecto en la consola de Firebase.
2. Habilitar el proveedor de correo y contraseña en Authentication.
3. Registrar una app web y copiar el objeto de configuración.
4. Pegar esos valores en `src/firebase/config.ts`.
5. Crear usuarios desde la pantalla de registro de la app o desde la consola.

La configuración actual apunta al proyecto `dessarrollosft`. La API key es pública, como corresponde a una app web de Firebase. Para un proyecto real conviene moverla a variables de entorno.

## Cómo correrlo

Requisitos: Node 20 o superior y npm.

```bash
git clone https://github.com/Lucu1232004/Challenge2SD.git
cd Challenge2SD
git checkout challenge-05
npm install
npm run dev
```

La app queda en `http://localhost:5173`.

Para compilar:

```bash
npm run build
```

Para probar en Android:

```bash
npx cap sync android
npx cap open android
```

Eso abre el proyecto en Android Studio. Desde ahí se compila y se instala en un emulador o en un teléfono con depuración USB activada.

## Notas

- No hay cuentas de prueba hardcodeadas. Crea una desde la pantalla de registro.
- El `appId` de Android se mantiene como `io.ionic.starter` para no romper el proyecto existente.
- El nombre visible de la app es "Gestor de Tareas" y el nombre interno del paquete es `gestor-tareas`.

## Rama

Esta entrega vive en la rama `challenge-05` del repositorio.
