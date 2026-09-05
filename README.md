# Challenge 03 - App de Contactos en Ionic (Practice 01)

## Que es esto?

Este es el **Challenge 03** de la materia Desarrollo de Software para Plataformas Moviles. Es la migracion de mi app de contactos (hecha en React puro para los Challenges 01 y 02) a **Ionic**, un framework que me permite crear apps moviles usando tecnologias web como HTML, CSS y JavaScript/TypeScript.

La gran diferencia con la PWA del Challenge 02 es que esta app se compila como una **app nativa de Android** usando **Capacitor**. Eso significa que se instala directamente en el celular como cualquier otra app de la Play Store, con su propio icono, acceso nativo al hardware y mejor rendimiento.

---

## Por que Ionic?

En las clases anteriores tenia una app web (Challenge 01) que luego converti en PWA (Challenge 02). La PWA funciona bien, pero tiene limitaciones:
- No puede acceder a todas las funciones del celular (camara, bluetooth, sensores, etc.)
- En iOS tiene restricciones (Safari no permite PWAs tan abiertamente)
- No se siente 100% como una app nativa

**Ionic resuelve eso**:
- Usa componentes visuales que parecen nativos (botones, listas, tarjetas, modales)
- Con Capacitor, se compila a codigo nativo de Android e iOS
- Puedo usar el mismo codigo web (React) y empaquetarlo como app movil
- Tiene animaciones de transicion propias de apps moviles
- Soporta gestos como deslizar para atras (back gesture)

---

## Que hace la app?

Las funcionalidades son las mismas del Challenge 01, pero ahora con interfaz movil nativa:

1. **Ver lista de contactos**: Abres la app y aparece un loader. Luego se muestran las tarjetas con los contactos en formato movil.

2. **Agregar contactos**: Tocas el boton flotante rojo con el signo **+** en la esquina inferior derecha. Se abre un **modal** (ventana emergente tipo app movil) donde escribes los datos. Al guardar, el contacto aparece en la lista.

3. **Eliminar contactos**: Tocas el icono de la basura en cada tarjeta. Aparece una **alerta nativa** de Ionic que te pregunta si estas seguro. Al confirmar, se elimina.

4. **Contador**: En el header rojo aparece un numero que indica cuantos contactos tienes.

5. **Estado vacio**: Si borras todos los contactos, aparece un mensaje amigable con un icono grande.

### Contactos iniciales

La app carga 4 contactos reales:

| Nombre | Telefono | Edad | Ciudad |
|--------|----------|------|--------|
| Samuel Patino | 3175550971 | 21 | Cali |
| Luisa Maria Holguin | 3162549803 | 20 | Cali |
| Gabriel Eduardo Martinez | 3226244468 | 23 | Cali |
| Sandra Lucumi | 3113368313 | 46 | Cali |

---

## Tecnologias usadas

- **Ionic 9**: Framework de UI para apps moviles hibridas.
- **React 19**: Libreria para construir la interfaz (Ionic funciona con React, Angular o Vue).
- **TypeScript**: JavaScript con tipos. Ayuda a evitar errores y autocompletar codigo.
- **Capacitor 8**: Empaqueta el codigo web en una app nativa de Android/iOS.
- **Vite**: Herramienta de construccion rapida.
- **Componentes Ionic**: IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonModal, IonFab, IonButton, IonInput, IonItem, IonLabel, IonList, IonBadge, IonAlert, IonLoading, IonIcon.

---

## Diferencias con el Challenge 01/02

| Aspecto | Challenge 01/02 (React puro) | Challenge 03 (Ionic) |
|---------|------------------------------|----------------------|
| Framework | React + Vite | Ionic + React + TypeScript |
| Archivos | `.jsx` | `.tsx` (TypeScript) |
| Componentes UI | HTML + CSS manual | Componentes Ionic (`IonCard`, `IonModal`, etc.) |
| Tipografia | Fuente del sistema | Poppins (fuentes de Google) |
| Boton agregar | Boton normal | `IonFab` (boton flotante nativo) |
| Formulario | Form HTML en la misma pagina | `IonModal` (ventana emergente tipo app) |
| Confirmacion eliminar | `window.confirm()` | `IonAlert` (alerta nativa de Ionic) |
| Loader | Componente CSS personalizado | `IonLoading` (spinner nativo) |
| Tarjetas | `div` con CSS | `IonCard` (tarjeta nativa con sombras y bordes) |
| App movil | Solo PWA (navegador) | App nativa Android via Capacitor |

---

## Como correrlo localmente

### Paso 1: Clonar y cambiar a la rama

```bash
git clone https://github.com/Lucu1232004/Challenge2SD.git
cd Challenge2SD
git checkout challenge-03
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Correr en el navegador (modo desarrollo)

```bash
ionic serve
```

O tambien:

```bash
npm run dev
```

Se abrira en `http://localhost:8100`. Se vera como un celular en tu navegador.

### Paso 4: Construir para produccion

```bash
npm run build
```

Esto genera la carpeta `dist/` con todo optimizado.

---

## Como instalarlo en tu celular Android

### Requisitos previos

1. **Android Studio** instalado y configurado.
2. **Java 17** instalado (puede ser necesario dependiendo de la version de Gradle).
3. Tu celular con **modo desarrollador activado**:
   - Ve a Ajustes > Acerca del telefono
   - Toca "Numero de compilacion" 7 veces
   - Ve a Opciones de desarrollador y activa "Depuracion USB"
4. Conecta tu celular al PC por USB y acepta el permiso de depuracion.

### Paso 1: Compilar la app web

```bash
npm run build
```

### Paso 2: Copiar archivos a Android

```bash
npx cap copy android
```

Esto copia la carpeta `dist/` al proyecto de Android.

### Paso 3: Sincronizar plugins de Capacitor

```bash
npx cap sync android
```

Esto actualiza los plugins nativos que necesita la app.

### Paso 4: Abrir en Android Studio

```bash
npx cap open android
```

O abre Android Studio manualmente y selecciona la carpeta `android/` dentro del proyecto.

### Paso 5: Ejecutar en el celular

1. En Android Studio, asegurate de que tu celular aparece seleccionado en la barra superior.
2. Toca el boton verde de **Run** (triangulo).
3. Espera a que compile e instale.
4. La app "contactos" aparecera en tu celular.

### Si Android Studio abre otro proyecto

A veces Android Studio abre una app de ejemplo en vez de la tuya. Para arreglarlo:

1. Cierra Android Studio.
2. Vuelve a abrirlo.
3. Selecciona **Open** (NO "New Project").
4. Navega a `C:\Users\Hogar\Desktop\Clase3DS\contactos\android` (o la ruta donde tengas el proyecto).
5. Espera a que sincronice Gradle.
6. Dale Run.

---

## Estructura del proyecto

```
contactos/
├── android/                       # Proyecto Android nativo (generado por Capacitor)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/public/     # Archivos web compilados (HTML, JS, CSS)
│   │   │   ├── java/              # Codigo Java nativo
│   │   │   └── res/               # Recursos (iconos, splash screens, layouts)
│   │   └── build.gradle           # Configuracion de build de Android
│   └── ...
├── src/
│   ├── components/
│   │   ├── ContactItem.tsx        # Tarjeta de contacto con avatar rojo
│   │   └── ContactItem.css        # Estilos del componente
│   ├── data/
│   │   └── contacts.ts            # Datos iniciales + tipos + colores de avatares
│   ├── pages/
│   │   ├── Home.tsx               # Pagina principal con lista, modal, alertas
│   │   └── Home.css               # Estilos de la pagina
│   ├── App.tsx                    # Router y estructura base de la app
│   ├── main.tsx                   # Punto de entrada
│   ├── theme/
│   │   └── variables.css          # Variables de tema de Ionic
│   └── ...
├── capacitor.config.ts            # Configuracion de Capacitor
├── ionic.config.json              # Configuracion de Ionic
├── index.html                     # HTML principal
├── package.json
├── tsconfig.json                  # Configuracion de TypeScript
├── vite.config.ts                 # Configuracion de Vite
└── README.md                      # Este archivo
```

---

## Componentes Ionic usados

Estos son los componentes de Ionic que reemplazan el HTML/CSS manual del Challenge 01:

| Componente Ionic | Que reemplaza | Para que sirve |
|------------------|---------------|----------------|
| `IonPage` | `div` contenedor | Estructura base de toda pantalla en Ionic |
| `IonHeader` + `IonToolbar` | `header` manual | Barra superior estilo app movil |
| `IonTitle` | `h1` manual | Titulo en el header |
| `IonContent` | `main` o `div` | Area de contenido con scroll nativo |
| `IonCard` + `IonCardContent` | `div` con borde | Tarjeta visual con sombra y bordes redondeados |
| `IonModal` | Formulario inline | Ventana emergente tipo app movil |
| `IonFab` + `IonFabButton` | Boton normal | Boton flotante circular en la esquina |
| `IonButton` | `button` HTML | Boton con estilos nativos de Ionic |
| `IonInput` | `input` HTML | Campo de texto con estilos moviles |
| `IonLabel` | `label` HTML | Etiqueta para inputs |
| `IonItem` | `div` contenedor | Fila estandar para listas y formularios |
| `IonList` | `ul` HTML | Lista con estilos nativos |
| `IonBadge` | `span` con CSS | Burbuja de numero (usado para el contador) |
| `IonAlert` | `window.confirm()` | Alerta nativa con botones personalizados |
| `IonLoading` | Spinner CSS manual | Pantalla de carga con spinner nativo |
| `IonIcon` | `img` o `svg` | Iconos vectoriales (agregar, eliminar, cerrar, etc.) |

---

## Que aprendi con este challenge?

- Que es Ionic y como se diferencia de una web normal o una PWA.
- Como crear un proyecto Ionic con React y TypeScript.
- La anatomia basica de una app Ionic: `IonApp`, `IonPage`, `IonHeader`, `IonContent`.
- Como usar componentes Ionic en vez de HTML/CSS manual.
- La diferencia entre JSX (React puro) y TSX (React + TypeScript).
- Como funciona Capacitor para empaquetar apps web como apps nativas.
- Como conectar Android Studio con un proyecto Ionic.
- Como compilar, copiar y sincronizar archivos para Android.
- Como activar modo desarrollador en un celular Android.
- Que las apps Ionic se sienten nativas gracias a las animaciones y gestos de Ionic.

---

## Practicas y Challenges completados

| Tipo | Nombre | Descripcion |
|------|--------|-------------|
| Challenge 01 | App de Contactos React | React puro con Vite. Listar, agregar, eliminar contactos. |
| Challenge 02 | PWA | Transformar la app en PWA instalable con Service Worker hibrido. |
| Practice 01 | Migracion a Ionic | Misma app pero usando componentes Ionic y compilada para Android con Capacitor. |

---

## Autor

**Samuel Patiño** - samuel.patino@uao.edu.co

Proyecto desarrollado para la clase de Desarrollo de Software para Plataformas Moviles.
