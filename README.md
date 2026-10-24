# Parcial 2 - Misiones

App móvil en Ionic y React donde usuarios reales se registran, completan misiones con sensores del dispositivo y ganan puntos. El progreso se guarda en el teléfono y en Firebase, y el ranking muestra el puntaje del usuario frente a otros cuatro participantes.

## Qué hace

- Registro e inicio de sesión con Firebase Authentication.
- Tres misiones con puntos: foto, movimiento y permanencia.
- Total acumulado de puntos y barra de progreso.
- Desbloqueo de la tercera misión después de recorrer 50 metros.
- Ranking con los cinco mejores puntajes.
- Pantalla de resultados con puntos, misiones completadas y estado general.
- Persistencia local con `localStorage` y remota en Firestore.
- Notificaciones locales al completar una misión y cuando falta una.

## Requisitos del parcial

| Requisito | Implementación |
|-----------|----------------|
| Usuarios reales con login y registro | Firebase Authentication con correo y contraseña |
| Ver misiones disponibles | Pantalla principal con las tres misiones |
| Completar acciones | Cámara, geolocalización y acelerómetro |
| Ganar puntos | 30, 40 y 50 puntos según la misión |
| Ver progreso y ranking | Barra de progreso y top 5 en Firestore |
| Cámara | Misión 1 con `@capacitor/camera` |
| Geolocalización | Misión 2 con `@capacitor/geolocation` |
| Vibrador | Misión 3 con `@capacitor/haptics` |
| Notificaciones locales | `@capacitor/local-notifications` |
| Acelerómetro | Misión 3 con `@capacitor/motion` |
| Hooks y manejo de estado | Hooks propios y estado de React |
| Firebase y almacenamiento local | Firestore y `localStorage` |

## Reglas de las misiones

**Misión 1 - Evidencia fotográfica (30 puntos)**

El usuario toma una foto con la cámara. La misión se completa cuando pulsa "Guardar evidencia". La imagen queda guardada localmente en el dispositivo.

**Misión 2 - Movimiento real (40 puntos)**

Se guarda la posición inicial y se mide la distancia con la fórmula de Haversine. La misión se completa al superar los 30 metros. El seguimiento continúa hasta los 50 metros para desbloquear la misión 3.

**Misión 3 - Permanencia activa (50 puntos)**

Se habilita después de recorrer 50 metros. El usuario debe quedarse quieto durante 10 segundos. El acelerómetro detecta movimiento y reinicia el contador si la magnitud se aleja demasiado de la gravedad. Al terminar, el teléfono vibra y la misión se completa.

El enunciado menciona "moverse 50 metros" y "condición distancia > 30 m". La app usa 30 metros para completar la misión 2 y 50 metros para desbloquear la misión 3, de modo que se cumplen las dos condiciones.

## Tecnologías

- Ionic 9 con React 19 y TypeScript.
- Vite 8 para desarrollo y compilación.
- Capacitor 8 para empaquetar en Android.
- `@capacitor/camera`.
- `@capacitor/geolocation`.
- `@capacitor/motion`.
- `@capacitor/haptics`.
- `@capacitor/local-notifications`.
- Firebase 12: Authentication y Firestore.
- `localStorage` para el progreso local.

## Estructura

```text
src/
  components/
    MissionHeader.tsx       Header con botón de volver y logout
    MissionPage.tsx         Envoltorio común de las páginas
  contexts/
    AuthContext.tsx         Usuario y acciones de autenticación
  data/
    missions.ts             Definición de las tres misiones y sus puntos
  firebase/
    config.ts               Inicialización de Firebase y Firestore
    errors.ts               Errores de Firebase en español
  hooks/
    useFirebaseAuth.ts      Login, registro, logout y sesión
    useProgress.ts          Progreso local y remoto, puntos y notificaciones
    useRanking.ts           Top 5 y siembra de usuarios demo
    useDistanceMission.ts   Geolocalización y distancia recorrida
  pages/
    Login.tsx
    Register.tsx
    MissionsPage.tsx        Lista de misiones y resumen
    PhotoMissionPage.tsx    Misión 1
    MovementMissionPage.tsx Misión 2
    StillnessMissionPage.tsx Misión 3
    ResultsPage.tsx         Puntos, estado y ranking
    Missions.css
    Auth.css
  types.ts                  Tipos Mission, Progress y RankingEntry
  App.tsx                   Rutas y protección de sesión
  main.tsx                  Punto de entrada
```

## Persistencia

**Local**

La clave `misiones-progress-{uid}` guarda:

```json
{
  "points": 120,
  "missions": [
    { "id": 1, "completed": true },
    { "id": 2, "completed": true },
    { "id": 3, "completed": true }
  ],
  "maxDistance": 60,
  "photo": "data:image/jpeg;base64,..."
}
```

La foto se guarda solo en local para no llenar el documento de Firestore.

**Firestore**

- `progress/{uid}`: puntos, misiones completadas, distancia máxima y fecha de actualización.
- `ranking/{uid}`: nombre, correo y puntos del usuario.

Al iniciar sesión se mezclan el progreso local y el remoto: una misión queda completada si aparece en cualquiera de los dos, y la distancia máxima es la mayor. Los puntos se recalculan a partir de las misiones completadas.

## Ranking

El ranking se guarda en la colección `ranking`. Si faltan, la app crea cuatro usuarios demo:

- Ana Torres: 110 puntos.
- Carlos Ruiz: 90 puntos.
- Laura Gómez: 70 puntos.
- Diego Pérez: 50 puntos.

El usuario real se agrega con su puntaje. La consulta ordena por puntos de mayor a menor y muestra los primeros cinco. El usuario ve resaltada su propia fila.

## Notificaciones locales

Al completar una misión se programa una notificación con el nombre y los puntos ganados. Si queda una sola misión pendiente, se programa otra con el mensaje "Te falta 1 misión para completar".

En Android 13 o superior hay que aceptar el permiso de notificaciones. En el navegador el comportamiento depende del sistema y del permiso del sitio.

## Rutas

| Ruta | Acceso | Pantalla |
|------|--------|----------|
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro |
| `/missions` | Privado | Lista de misiones |
| `/missions/photo` | Privado | Misión 1 |
| `/missions/movement` | Privado | Misión 2 |
| `/missions/stillness` | Privado | Misión 3 |
| `/results` | Privado | Resultados y ranking |

La raíz `/` redirige a `/missions` o `/login` según la sesión.

## Cómo correrlo

Requisitos: Node 20 o superior y npm.

```bash
git clone https://github.com/Lucu1232004/Challenge2SD.git
cd Challenge2SD
git checkout parcial-2
npm install
npm run dev
```

La app queda en `http://localhost:5173`.

Para compilar:

```bash
npm run build
npx cap sync android
npx cap open android
```

Desde Android Studio se instala en un emulador o en un teléfono con depuración USB.

## Prueba en el teléfono

1. Activar opciones de desarrollador y depuración USB.
2. Conectar el teléfono y aceptar la huella de la computadora.
3. Ejecutar `npx cap sync android` y abrir Android Studio.
4. Elegir el teléfono y pulsar Run.
5. Aceptar permisos de cámara, ubicación y notificaciones.

Recomendaciones:

- La misión de movimiento funciona mejor al aire libre, con el GPS activo.
- Para la misión de permanencia, deja el teléfono sobre una superficie firme y no cambies de aplicación.
- Si el contador se reinicia con demasiada facilidad, se puede subir el umbral `STILLNESS_THRESHOLD` en `StillnessMissionPage.tsx`.

## Firebase

- Proyecto: `dessarrollosft`.
- Authentication con correo y contraseña habilitado.
- Firestore con reglas de prueba para desarrollar.
- Firestore usa `experimentalForceLongPolling` para evitar bloqueos de WebChannel en algunas redes.

Antes de una entrega definitiva conviene cambiar las reglas de Firestore para que solo los usuarios autenticados puedan leer y escribir sus propios documentos.

## Notas

- El `appId` de Android se mantiene como `io.ionic.starter`. Todas las ramas Ionic comparten ese paquete, así que instalar una reemplaza a la otra en el teléfono.
- El nombre visible de la app es "Misiones" y el nombre interno del paquete es `misiones`.
- Las cuentas y los datos de prueba usados durante el desarrollo fueron eliminados.

## Rama

Esta entrega vive en la rama `parcial-2` del repositorio.
