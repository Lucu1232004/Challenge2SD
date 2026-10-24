# Challenge 07 - Sensores

App móvil en Ionic y React con una pantalla principal y una página por cada sensor o función nativa del dispositivo. Usa los plugins de Capacitor para cámara, ubicación, movimiento, información del dispositivo, hápticos, archivos y notificaciones.

## Qué hace

- Home con ocho tarjetas, una por sensor.
- Geolocalización: posición actual y seguimiento continuo.
- Cámara: tomar una foto o elegir una de la galería.
- Movimiento: acelerómetro y orientación.
- Dispositivo: modelo, sistema operativo, batería e identificador.
- Hápticos: impactos, notificaciones táctiles y vibración.
- Archivos: guardar, leer y eliminar un archivo de texto.
- Notificaciones locales: permiso, programación y lista de pendientes.
- Notificaciones push: registro del dispositivo y token de Firebase Cloud Messaging.

## Requisitos del challenge

El enunciado de la clase 07 pide:

1. Crear una app vacía en Ionic.
2. Usar una Home con un botón por sensor.
3. Crear una página nueva por cada sensor y aplicar la API correspondiente.

Todo eso está implementado en esta rama.

## Tecnologías

- Ionic 9 con React 19 y TypeScript.
- Vite 8 para desarrollo y compilación.
- Capacitor 8 para empaquetar en Android.
- Plugins de Capacitor:
  - `@capacitor/geolocation`
  - `@capacitor/camera`
  - `@capacitor/motion`
  - `@capacitor/device`
  - `@capacitor/haptics`
  - `@capacitor/filesystem`
  - `@capacitor/local-notifications`
  - `@capacitor/push-notifications`
- Ionicons para los iconos.

## Estructura

```text
src/
  components/
    SensorHeader.tsx      Header con botón de volver
    SensorPage.tsx        Envoltorio común de las páginas
  hooks/
    useGeolocation.ts     Posición y seguimiento
    useCamera.ts          Foto o galería
    useAccelerometer.ts   Acelerómetro y orientación
    useDevice.ts          Información del dispositivo y batería
    useHaptics.ts         Impactos, notificaciones y vibración
    useFilesystem.ts      Guardar, leer y borrar archivos
    useLocalNotifications.ts  Permisos y programación
    usePushNotifications.ts   Registro y token de push
  pages/
    Home.tsx              Tarjetas de sensores
    GeolocationPage.tsx
    CameraPage.tsx
    MotionPage.tsx
    DevicePage.tsx
    HapticsPage.tsx
    FilesystemPage.tsx
    LocalNotificationsPage.tsx
    PushNotificationsPage.tsx
    Sensors.css          Estilos compartidos
  App.tsx                 Rutas de la app
  main.tsx                Punto de entrada
```

## Rutas

| Ruta | Pantalla |
|------|----------|
| `/home` | Inicio con las ocho tarjetas |
| `/sensors/geolocation` | Geolocalización |
| `/sensors/camera` | Cámara |
| `/sensors/motion` | Movimiento |
| `/sensors/device` | Dispositivo |
| `/sensors/haptics` | Hápticos |
| `/sensors/filesystem` | Archivos |
| `/sensors/notifications` | Notificaciones locales |
| `/sensors/push` | Notificaciones push |

La raíz `/` redirige a `/home`.

## Permisos de Android

El `AndroidManifest.xml` incluye:

- Cámara.
- Ubicación precisa y aproximada.
- Vibración.
- Notificaciones en Android 13 o superior.
- Lectura de imágenes de la galería.
- Lectura y escritura de almacenamiento para versiones antiguas de Android.

Los plugins se registraron con `npx cap sync android`. Esa sincronización también copia la carpeta `dist` dentro de `android/app/src/main/assets/public`.

## Cómo correrlo

Requisitos: Node 20 o superior y npm.

```bash
git clone https://github.com/Lucu1232004/Challenge2SD.git
cd Challenge2SD
git checkout challenge-07
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

Eso abre el proyecto en Android Studio. Desde ahí se compila y se instala en un emulador o en un teléfono con depuración USB activada.

## Prueba en el teléfono

Los sensores se prueban mejor en un dispositivo físico:

1. Activar opciones de desarrollador y depuración USB en el teléfono.
2. Conectar el teléfono por USB y aceptar la huella de la computadora.
3. Ejecutar `npx cap sync android` y abrir Android Studio con `npx cap open android`.
4. Elegir el teléfono como dispositivo y pulsar Run.
5. Aceptar los permisos de cámara, ubicación y notificaciones cuando la app los pida.

En el navegador funcionan la información del dispositivo, los archivos, las notificaciones locales y parte de los hápticos. Cámara, GPS, acelerómetro y vibración real necesitan el teléfono.

## Notificaciones push

Para que el registro push funcione en Android hace falta:

1. Registrar una app Android en el proyecto Firebase con el mismo `applicationId` del proyecto (`io.ionic.starter`).
2. Descargar `google-services.json`.
3. Copiarlo en `android/app/`.
4. Volver a ejecutar `npx cap sync android` y compilar.

Sin ese archivo, el plugin puede registrarse en el código pero Firebase Cloud Messaging no entrega el token. En el navegador las notificaciones push no están disponibles con este plugin.

## Notas

- El `appId` de Android se mantiene como `io.ionic.starter`. Todas las ramas Ionic comparten ese paquete, así que instalar una reemplaza a la otra en el teléfono. El código de cada rama queda intacto en Git.
- El nombre visible de la app es "Sensores" y el nombre interno del paquete es `sensores`.
- La app no tiene login ni base de datos. El objetivo del challenge es probar las APIs nativas.

## Rama

Esta entrega vive en la rama `challenge-07` del repositorio.
