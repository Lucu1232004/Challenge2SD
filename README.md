# Challenge 09 - Mapas, rastreo y sensores

App móvil hecha con Ionic y React que evoluciona la app de Sensores del Challenge 07. Agrega un mapa con Leaflet, rastreo GPS, historial en JSON, foto con ubicación y sitios cercanos usando OpenStreetMap.

## Qué incluye

- Mapa interactivo con Leaflet y mosaicos de OpenStreetMap.
- Ubicación actual con precisión y dirección aproximada.
- Rastreo con `watchPosition`: puntos, distancia y duración.
- Guardado de cada recorrido en `Documents/rastreos.json`.
- Historial para ver un rastreo en el mapa o eliminarlo.
- Foto con marca de agua: dirección, coordenadas y fecha.
- Sitios cercanos: restaurantes, cafés, farmacias y supermercados.
- Indicadores de red, batería y movimiento.
- Vibración al iniciar el rastreo.
- Avisos de batería baja, sin movimiento y sin conexión.
- Se reutilizan las páginas de sensores del Challenge 07.

## Requisitos del challenge

La clase 10 pide completar la app de mapas usando diferentes sensores. Los ejemplos eran:

- a. Usar la red para obtener la dirección y mostrar el mapa.
- b. Detectar movimiento para iniciar o detener el rastreo.
- c. Guardar el rastreo en JSON y crear una página de historial.
- d. Tomar una foto y ponerle la ubicación como marca de agua.
- e. Vibrar al iniciar el rastreo.
- f. Detener el rastreo cuando la batería esté baja.
- g. Notificaciones inteligentes.
- h. Mostrar sitios cercanos.

En esta rama están implementados a, b (inicio automático), c, d, e, f, g y h.

## Tecnologías

- Ionic 9 con React 19 y TypeScript.
- Vite 8 para desarrollo y compilación.
- Capacitor 8 para Android.
- Leaflet 1.9 y react-leaflet 5 para el mapa.
- Axios para las consultas a OpenStreetMap.
- Nominatim para direcciones y sitios cercanos. No necesita API key.
- Plugins de Capacitor: geolocation, camera, device, filesystem, haptics, motion, network y local-notifications.

## Estructura

```text
src/
  components/
    MapView.tsx           Mapa, marcador, precisión y recorrido
  hooks/
    useGeolocation.ts     Posición y seguimiento GPS
    useTrackStore.ts      Lectura y escritura de rastreos.json
    useNetwork.ts         Estado de la conexión
    useCamera.ts          Cámara o galería
    useAccelerometer.ts   Movimiento del dispositivo
    useDevice.ts          Batería e información del equipo
    useHaptics.ts         Vibraciones
    useLocalNotifications.ts
  lib/
    geo.ts                Haversine, distancias y duraciones
    geocoding.ts          Nominatim: direcciones y sitios cercanos
    notifications.ts      Avisos locales
  pages/
    MapPage.tsx           Mapa, rastreo y sitios cercanos
    TrackHistoryPage.tsx  Historial de recorridos
    LocationPhotoPage.tsx Foto con marca de agua
    Home.tsx              Tarjetas de mapas y sensores
    ...                   Páginas de sensores del Challenge 07
  types/
    track.ts              Tipos Track y TrackPoint
```

## Rutas

| Ruta | Pantalla |
|------|----------|
| `/` | Redirige a `/home` |
| `/home` | Inicio con mapas y sensores |
| `/map` | Mapa, rastreo y sitios cercanos |
| `/map/history` | Historial de rastreos |
| `/map/photo` | Foto con ubicación |
| `/sensors/geolocation` | Geolocalización |
| `/sensors/camera` | Cámara |
| `/sensors/motion` | Movimiento |
| `/sensors/device` | Dispositivo |
| `/sensors/haptics` | Hápticos |
| `/sensors/filesystem` | Archivos |
| `/sensors/notifications` | Notificaciones locales |
| `/sensors/push` | Notificaciones push |

## Cómo correrlo

Requisitos: Node 20 o superior y npm.

```bash
git clone https://github.com/Lucu1232004/Challenge2SD.git
cd Challenge2SD
git checkout challenge-09
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

## Datos y permisos

- Los rastreos se guardan en `Documents/rastreos.json` en Android y en el almacenamiento local del navegador en web.
- Las fotos con marca de agua se guardan como JPEG en `Documents`.
- La app pide permisos de ubicación, cámara y notificaciones.
- En web, la cámara se reemplaza por el selector de archivos.
- Nominatim permite una petición por segundo. La app espera entre consultas para respetar el límite.

## Deploy

`public/_redirects` ya tiene la regla para Netlify:

```text
/* /index.html 200
```

Después de `npm run build`, se publica la carpeta `dist`.

## Notas

- No se necesita API key: se usa OpenStreetMap con Nominatim.
- El `appId` de Android se mantiene como `io.ionic.starter`.
- El nombre visible de la app es "Mapas y Sensores".
- Los sitios cercanos se consultan en un radio de 500 metros.

## Rama

Esta entrega vive en la rama `challenge-09` del repositorio.
