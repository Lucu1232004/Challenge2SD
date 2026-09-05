# Challenge 02 - App de Contactos como PWA

## Que es esto?

Este es el **Challenge 02** de la materia Desarrollo de Software para Plataformas Moviles. Parti de la app de contactos que hice en el Challenge 01 (React puro) y la converti en una **PWA** (Progressive Web App).

Una PWA es una pagina web que se puede instalar en el celular como si fuera una app nativa. Se abre en pantalla completa, tiene su propio icono en el menu de apps y puede funcionar **sin internet** despues de la primera visita.

---

## Que le agregue al Challenge 01?

Todo el codigo del Challenge 01 sigue aqui (lista, agregar, eliminar contactos, loader, avatares rojos). Lo nuevo es:

### 1. Imagen en el encabezado
Agregue una imagen de banner en el componente principal (App.jsx) para darle mas vida a la app.

### 2. Manifest PWA (`manifest.webmanifest`)
Es un archivo JSON que le dice al navegador como debe comportarse la app cuando se instala:
- Nombre: "Mis Contactos"
- Nombre corto: "Contactos"
- Color del tema: rojo (`#ff2b2b`)
- Color de fondo: negro
- Modo de apertura: `standalone` (pantalla completa, sin barra del navegador)
- Iconos en multiples tamaños: 192px, 512px, maskable

### 3. Iconos personalizados
En la carpeta `public/icons/` tengo varios iconos generados a partir de la imagen del proyecto:
- Favicon 16x16 y 32x32 para el navegador
- Apple touch icon 180x180 para iPhone/iPad
- Iconos 192x192 y 512x512 para Android
- Icono maskable 512x512 (se adapta a cualquier forma de icono)

### 4. Service Worker con estrategia hibrida
El archivo `service-worker.js` es el corazon de la PWA. Es un script que corre en segundo plano y decide como manejar cada peticion de red.

**Mi estrategia hibrida funciona asi:**

| Recurso | Estrategia | Por que? |
|---------|-----------|----------|
| HTML (paginas) | Network First | Para no mostrar versiones viejas cuando actualizo la app |
| JS / CSS | Cache First | Los archivos tienen hash en el nombre, asi que la version cacheada siempre es valida |
| Imagenes | Cache First + Stale While Revalidate | Cargo rapido desde cache, pero actualizo en segundo plano por si cambiaron |
| APIs (`/api/`) | Network First | Los datos de contactos deben estar actualizados |

**Que significa cada estrategia?**
- **Network First**: Intento traer de internet primero. Si no hay conexion, uso lo guardado en cache.
- **Cache First**: Miro si ya tengo el archivo guardado. Si esta, lo muestro de una. Si no, lo pido a internet y lo guardo.
- **Stale While Revalidate**: Muestro lo que tengo en cache de inmediato (super rapido), pero en segundo plano voy a internet a ver si hay algo nuevo para la proxima vez.

### 5. Registro del Service Worker
En `main.jsx` registre el Service Worker para que el navegador lo active cuando la app carga.

### 6. Despliegue en Netlify
La app esta publicada en Netlify con HTTPS (obligatorio para PWAs). Puedes acceder desde cualquier navegador e instalarla en tu celular.

---

## Link de la PWA desplegada

**https://mis-contactos-pwa.netlify.app**

---

## Como correrlo localmente

### Paso 1: Clonar y cambiar a la rama

```bash
git clone https://github.com/Lucu1232004/Challenge2SD.git
cd Challenge2SD
git checkout challenge-02
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Modo desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

### Paso 4: Build de produccion

```bash
npm run build
```

Esto genera la carpeta `dist/` optimizada para produccion.

### Paso 5: Previsualizar el build

```bash
npm run preview
```

Sirve la carpeta `dist/` localmente para probar que todo funciona como en produccion.

---

## Como instalar la app en tu celular

### Android (con Chrome)

1. Abre el link de la PWA en **Chrome** del celular.
2. Toca el menu de tres puntos **⋮** arriba a la derecha.
3. Selecciona **"Instalar aplicacion"** o **"Agregar a pantalla de inicio"**.
4. Confirma.
5. Listo. La app aparecera en tu menu de apps con su icono rojo. Se abre en pantalla completa y funciona sin internet.

### iPhone / iPad (con Safari)

1. Abre el link en **Safari**.
2. Toca el boton **Compartir** (cuadrado con flecha arriba).
3. Selecciona **"Anadir a pantalla de inicio"**.
4. Toca **"Anadir"**.
5. La app aparecera en tu pantalla de inicio.

---

## Como desplegar en Netlify

### Opcion A: Netlify Drop (la mas facil)

1. Corre `npm run build` para generar la carpeta `dist/`.
2. Ve a https://app.netlify.com/drop
3. Arrastra la carpeta `dist/` a la pagina.
4. Listo. Te dan un link instantaneo.

### Opcion B: Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Opcion C: Conectar con GitHub

1. En Netlify, crea un nuevo sitio desde Git.
2. Conecta tu repo de GitHub.
3. Configura:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Cada vez que hagas push a la rama principal, Netlify actualiza la app automaticamente.

---

## Estructura del proyecto

```
Challenge2SD/
├── public/
│   ├── api/contacts.json          # Datos iniciales de contactos
│   ├── icons/                     # Iconos para la PWA
│   ├── manifest.webmanifest       # Manifest de la PWA
│   └── service-worker.js          # Service Worker con estrategia hibrida
├── scripts/
│   └── generar_iconos.py          # Script Python para generar iconos desde una imagen
├── src/
│   ├── api/contacts.js            # Funcion fetchContacts con fallback
│   ├── assets/RealMadrid.jpg      # Imagen del banner
│   ├── components/                # Componentes React
│   │   ├── ContactForm.jsx
│   │   ├── ContactItem.jsx
│   │   ├── ContactList.jsx
│   │   └── Loader.jsx
│   ├── App.jsx                    # Componente principal
│   ├── index.css                  # Estilos globales
│   └── main.jsx                   # Punto de entrada + registro del Service Worker
├── docs/
│   └── PWA_NOTAS_TECNICAS.md      # Notas tecnicas sobre PWAs
├── index.html                     # HTML principal (conecta el manifest)
├── package.json
├── vite.config.js
└── README.md                      # Este archivo
```

---

## Que aprendi con este challenge?

- Que es una PWA y por que es util (instalable, offline, sin tiendas de apps).
- Como crear un `manifest.webmanifest` y conectarlo al HTML.
- Como funciona un Service Worker y como intercepta peticiones de red.
- Las diferentes estrategias de cache y cuando usar cada una.
- Como registrar un Service Worker en React.
- Como generar iconos para PWAs en multiples tamaños.
- Como desplegar una app estatica en Netlify.
- Que las PWAs necesitan HTTPS para funcionar.

---

## Practicas y Challenges completados

| Tipo | Nombre | Descripcion |
|------|--------|-------------|
| Challenge 01 | App de Contactos React | React puro con Vite. Listar, agregar, eliminar contactos. |
| Challenge 02 | PWA | Transformar la app anterior en PWA instalable con Service Worker hibrido. |

---

## Autor

Proyecto desarrollado para la clase de Desarrollo de Software para Plataformas Moviles.
