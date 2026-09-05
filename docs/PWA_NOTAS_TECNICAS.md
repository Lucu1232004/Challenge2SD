# PWA — Notas Técnicas (Challenge 02)

Guía de referencia para futuras mejoras de la PWA "Mis Contactos".

## Datos clave

| Dato | Valor |
|---|---|
| Repo GitHub | https://github.com/Lucu1232004/Challenge2SD |
| Sitio Netlify (producción) | https://mis-contactos-pwa.netlify.app |
| Admin Netlify | https://app.netlify.com/projects/mis-contactos-pwa |
| Site ID Netlify | `b70755fe-77c5-4a52-b3c9-b6973796f472` (guardado en `.netlify/state.json`) |
| Build | `npm run build` → carpeta `dist/` |

## Arquitectura de archivos PWA

```
public/
├── manifest.webmanifest     # nombre, iconos, colores, display standalone
├── service-worker.js        # estrategia híbrida de caché
├── icons/                   # iconos generados (512, 192, 180, maskable, favicons, apple)
└── api/contacts.json        # "API" de contactos (network first en el SW)

index.html                   # <link rel="manifest">, theme-color, apple-touch-icon, favicons
src/main.jsx                 # registro del service worker al cargar la página
src/App.jsx                  # componente padre (contiene la imagen hero)
```

## Service Worker — estrategia híbrida (public/service-worker.js)

| Recurso | Estrategia | Caché |
|---|---|---|
| HTML / navegaciones (`mode === 'navigate'`) | **Network First** (fallback app shell) | `-shell` |
| JS / CSS (`/assets/*.js|.css`) | **Cache First** (hash del build) | `-assets` |
| Imágenes (`.png/.jpg/.svg/...`) | **Cache First + Stale While Revalidate** | `-images` |
| APIs (`/api/*`) | **Network First** (fallback caché) | `-api` |
| Otros (Google Fonts, etc.) | Cache First con fallback a red | `-assets` |

### Cómo actualizar la app (¡IMPORTANTE!)

Cada vez que cambies código y despliegues, **incrementa la versión** en la primera línea
del service worker para invalidar las cachés viejas de los usuarios:

```js
const CACHE_VERSION = 'mis-contactos-v1';  // → 'mis-contactos-v2', etc.
```

El `activate` borra automáticamente cualquier caché que no empiece con `mis-contactos-vX`.

### Cómo cambiar una estrategia

Cada bloque de `self.addEventListener('fetch', ...)` maneja un tipo de recurso.
Ejemplos de cambios frecuentes:

- **Forzar siempre red para el HTML** → ya es Network First (no cambiar).
- **Imágenes sin caché** → eliminar el bloque de imágenes del fetch.
- **API con caché larga** → cambiar el bloque `/api/` de Network First a Cache First.

## Íconos — regenerarlos (scripts/generar_iconos.py)

Si cambias la imagen de la app, regenera todos los íconos con:

```bash
python scripts/generar_iconos.py "ruta/a/imagen.jpg"
```

Genera en `public/icons/`: icon-512, icon-192, icon-180, maskable-512, favicons 16/32 y
apple-touch-icon (180, sin transparencia para iOS). Requiere: `pip install pillow`.

## Deploy en Netlify

El proyecto ya está linkeado (`.netlify/`). Para redesplegar:

```bash
npm run build
netlify deploy --prod --dir=dist
```

Opciones sin CLI: arrastrar `dist/` en https://app.netlify.com/drop, o conectar el repo
de GitHub en Netlify (build: `npm run build`, publish: `dist`).

### Recordatorios de la cuenta Netlify

- La cuenta está con SSO de la UAO (`samuel.patino@uao.edu.co`).
- **Los sitios nuevos nacen en modo PRIVATE** → al crear un sitio, ir a
  *Site configuration → General → Visitor access → Edit visibility* y poner
  **Production y Deploy Preview en Public** (si no, todo responde 401).

## Pruebas rápidas

```bash
npm run dev       # desarrollo local (localhost:5173)
npm run preview   # sirve el build local (localhost:4173)
```

Verificación del deploy (todas deben responder 200):

```
https://mis-contactos-pwa.netlify.app/
https://mis-contactos-pwa.netlify.app/manifest.webmanifest
https://mis-contactos-pwa.netlify.app/service-worker.js
https://mis-contactos-pwa.netlify.app/api/contacts.json
https://mis-contactos-pwa.netlify.app/icons/icon-192.png
```

## Instalación en el celular

- **Android (Chrome):** abrir el link → ⋮ → "Instalar aplicación".
- **iPhone/iPad (Safari):** abrir el link → Compartir → "Añadir a pantalla de inicio".
- Tras la primera visita online, la app funciona **offline** (app shell precacheado +
  datos de contactos en caché de red).