# Challenge 06 - Mi Espacio

App móvil en Ionic y React que reúne tres formas de guardar datos: contactos en Firestore, tareas en Realtime Database y frutas en una base local con Dexie. Incluye autenticación real con Firebase y bloquea las acciones que necesitan internet cuando el dispositivo está sin conexión.

## Qué hace

- Registro, inicio y cierre de sesión con correo y contraseña.
- Sesión persistente: si el usuario ya entró, la app lo recuerda.
- Contactos en Firestore: crear, listar, editar y eliminar.
- Tareas en Firebase Realtime Database: crear, listar, completar, editar y eliminar.
- Frutas en Dexie: crear, listar, editar y eliminar sin depender de internet.
- Barra inferior para cambiar entre Contactos, Tareas y Frutas.
- Indicador de red en el header: "En línea" o "Sin red".
- Con el dispositivo sin conexión, los botones de contactos y tareas se deshabilitan. La sección de frutas sigue funcionando porque usa la base local.

## Requisitos del challenge

El enunciado de la clase 06 pide:

1. Una app nueva en Ionic con login real y rutas.
2. Contactos en Firebase.
3. Tareas en Firebase Realtime Database.
4. Frutas en Dexie como función nueva.
5. Validar la conexión de red y habilitar o deshabilitar las acciones de contactos y tareas según el estado.

Todo eso está implementado en esta rama.

## Tecnologías

- Ionic 9 con React 19 y TypeScript.
- Vite 8 para desarrollo y compilación.
- Capacitor 8 para empaquetar en Android.
- Firebase 12: Authentication, Firestore y Realtime Database.
- Dexie 4 y dexie-react-hooks para la base local.
- @capacitor/network para detectar el estado de la conexión.
- React Router 6 para las rutas.
- Ionicons para los iconos.

## Estructura

```text
src/
  components/
    AppHeader.tsx        Header con el título, estado de red y logout
    AppTabBar.tsx        Barra inferior de navegación
  contexts/
    AuthContext.tsx      Usuario y acciones de autenticación
    NetworkContext.tsx   Estado de conexión compartido
  db/
    database.ts          Base Dexie con la tabla de frutas
  hooks/
    useFirebaseAuth.ts   Login, registro, logout y restauración de sesión
    useCollection.ts     CRUD de Firestore con filtros
    useRealTimeCollection.ts  CRUD y escucha en Realtime Database
    useDexie.ts          CRUD de frutas con useLiveQuery
    useNetwork.ts        Estado de red con Capacitor
  pages/
    Login.tsx            Inicio de sesión
    Register.tsx         Registro
    Contacts.tsx         Contactos en Firestore
    Tasks.tsx            Tareas en Realtime Database
    Fruits.tsx           Frutas en Dexie
  firebase/
    config.ts            Inicialización de Firebase
    errors.ts            Errores de Firebase traducidos al español
  types.ts               Tipos Contact, Task y Fruit
  App.tsx                Rutas y providers
  main.tsx               Punto de entrada
```

## Rutas

| Ruta | Acceso | Pantalla |
|------|--------|----------|
| `/` | Público | Redirige a `/app/contacts` o `/login` según la sesión |
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro |
| `/app/contacts` | Privado | Contactos |
| `/app/tasks` | Privado | Tareas |
| `/app/fruits` | Privado | Frutas |

`ProtectedRoute` revisa el estado de `AuthContext`. Mientras Firebase restaura la sesión muestra un loader. Si no hay usuario, redirige a `/login`.

## Modelo de datos

**Contactos** en la colección `contacts` de Firestore:

```text
{
  name: string,
  phone: string,
  age: number,
  city: string,
  ownerId: string,
  createdAt: string
}
```

Cada contacto se filtra por `ownerId` para que cada usuario vea solo los suyos.

**Tareas** en Realtime Database, dentro de `tasks/{uid}`:

```text
{
  title: string,
  description: string,
  completed: boolean,
  createdAt: string
}
```

**Frutas** en la tabla `fruits` de Dexie:

```text
{
  id?: number,
  name: string,
  price: number,
  stock: number
}
```

## Cómo funcionan los hooks

`useCollection` consulta una colección de Firestore con `getDocs`, acepta filtros como `[["ownerId", "==", uid]]` y expone `getAll`, `add`, `update` y `remove`.

`useRealTimeCollection` escucha una ruta de Realtime Database con `onValue`, así que la lista se actualiza sola cuando cambia en el servidor. Expone `add`, `update` y `remove`.

`useDexie` usa `useLiveQuery` para que la lista de frutas se refresque automáticamente cuando cambia la base local.

`useNetwork` consulta `Network.getStatus()` y escucha `networkStatusChange`. `NetworkContext` comparte ese estado con todas las páginas para no crear un listener por pantalla.

## Configuración de Firebase

El proyecto usa el proyecto `dessarrollosft`.

1. Authentication con correo y contraseña habilitado.
2. Firestore Database creado en modo nativo.
3. Realtime Database creado. La URL está en `src/firebase/config.ts`:

```text
https://dessarrollosft-default-rtdb.firebaseio.com
```

4. Las reglas quedaron en modo de prueba para desarrollar. Antes de la entrega hay que cambiarlas para que solo los usuarios autenticados puedan leer y escribir sus propios datos.

En `src/firebase/config.ts` también se fuerza el sondeo largo de Firestore:

```ts
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
```

Eso evita que la app se quede en modo offline en redes donde el canal WebChannel está bloqueado.

La API key es pública, como corresponde a una app web de Firebase. Para un proyecto real conviene moverla a variables de entorno.

## Cómo correrlo

Requisitos: Node 20 o superior y npm.

```bash
git clone https://github.com/Lucu1232004/Challenge2SD.git
cd Challenge2SD
git checkout challenge-06
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
- El `appId` de Android se mantiene como `io.ionic.starter`. Todas las ramas Ionic comparten ese paquete, así que instalar una reemplaza a la otra en el teléfono. El código de cada rama queda intacto en Git.
- El nombre visible de la app es "Mi Espacio" y el nombre interno del paquete es `mi-espacio`.
- La sección de frutas funciona sin internet porque Dexie guarda los datos en el dispositivo.

## Rama

Esta entrega vive en la rama `challenge-06` del repositorio.
