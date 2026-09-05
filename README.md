# Mis Contactos — PWA (Challenge 02)

Aplicación de contactos construida en **React + Vite** para el **Challenge 01** y transformada en **PWA** con **estrategia híbrida de caché** para el **Challenge 02** del curso *Desarrollo de Software para Plataformas Móviles*.

## Demo (Netlify)

**Link de la PWA desplegada:** https://mis-contactos-pwa.netlify.app

## ¿Qué incluye el Challenge 02?

- ✅ Imagen agregada al componente padre (`App.jsx`)
- ✅ Manifest PWA (`public/manifest.webmanifest`) conectado en `index.html`
- ✅ Ícono personalizado (`public/icons/`) generado a partir de la imagen del proyecto
- ✅ Service Worker (`public/service-worker.js`) con **estrategia híbrida**
- ✅ Service Worker registrado en `main.jsx`
- ✅ Publicada en **Netlify** (HTTPS)

### Estrategia híbrida del Service Worker

| Recurso        | Estrategia                          |
| -------------- | ----------------------------------- |
| HTML (páginas) | Network First                       |
| JS / CSS       | Cache First (por el hash del build) |
| Imágenes       | Cache First + Stale While Revalidate|
| APIs (`/api/`) | Network First                       |

## Cómo correr el proyecto localmente

```bash
npm install
npm run dev      # desarrollo
npm run build    # build de producción (carpeta dist)
npm run preview  # previsualizar el build
```

## Cómo instalar la app en el celular

La PWA se instala desde el navegador del celular (debe estar publicada en HTTPS, como la de Netlify):

### Android (Chrome)
1. Abre el link de la PWA en **Chrome**.
2. Toca el menú **⋮ (tres puntos)** en la esquina superior derecha.
3. Selecciona **"Instalar aplicación"** (o **"Agregar a pantalla de inicio"**).
4. Confirma y la app quedará instalada como una aplicación nativa, con su ícono en el menú de aplicaciones.
5. Ábrela desde el ícono: funcionará en pantalla completa (standalone) y **funcionará sin conexión** gracias al Service Worker.

### iPhone / iPad (Safari)
1. Abre el link de la PWA en **Safari**.
2. Toca el botón **Compartir** (cuadrado con flecha hacia arriba).
3. Selecciona **"Añadir a pantalla de inicio"**.
4. Toca **"Añadir"** (arriba a la derecha).
5. La app aparecerá en la pantalla de inicio con su ícono personalizado.

> **Nota:** en iOS el Service Worker también permite el funcionamiento offline después de la primera visita.

## Deploy en Netlify

La carpeta de publicación es **`dist`** (generada con `npm run build`).

Opciones:
- **Netlify CLI:** `netlify deploy --prod --dir=dist`
- **Netlify Drop:** arrastrar la carpeta `dist` en https://app.netlify.com/drop
- **Git:** conectar el repositorio de GitHub en Netlify (build command: `npm run build`, publish directory: `dist`)

## Autor

**Samuel Patiño** — samuel.patino@uao.edu.co