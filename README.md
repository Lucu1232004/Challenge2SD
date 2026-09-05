# Challenge 04 - App de Contactos Ionic con Routing y Login

## Que es esto?

Este es el **Challenge 04** de la materia Desarrollo de Software para Plataformas Moviles. Es la version final de la app de contactos que incluye **navegacion entre paginas** (Practice 02) y **autenticacion con localStorage** (Challenge 04).

Partimos del Challenge 03 (Ionic basico) y le agregamos:
- Pagina de detalle de cada contacto
- Pagina separada para agregar contactos
- Sistema de login y registro con localStorage
- Proteccion de rutas privadas

---

## Funcionalidades

### Navegacion y Routing (Practice 02)

1. **Lista de contactos** (`/home`): Muestra solo el nombre de cada contacto en tarjetas clickeables.

2. **Detalle de contacto** (`/contact/:id`): Al tocar una tarjeta, se abre una pantalla con:
   - Avatar grande del contacto
   - Nombre completo
   - Telefono, edad y ciudad con iconos
   - Boton para volver a la lista
   - Boton de "Atras" nativo de Ionic

3. **Agregar contacto** (`/contact/new`): Pagina separada con formulario para crear contactos.
   - Header con boton de cerrar (X) y guardar (check)
   - Campos: nombre, telefono, edad, ciudad
   - Al guardar, vuelve a la lista y aparece el nuevo contacto

### Autenticacion (Challenge 04)

4. **Registro** (`/register`): Crea una cuenta nueva.
   - Correo electronico
   - Contrasena (minimo 4 caracteres)
   - Confirmar contrasena
   - Validacion de campos
   - Si el correo ya existe, muestra error
   - Al registrarse, inicia sesion automaticamente

5. **Login** (`/login`): Inicia sesion con cuenta existente.
   - Correo electronico
   - Contrasena
   - Validacion de credenciales
   - Enlace a "Registrate" si no tienes cuenta

6. **Sesion persistente**: Una vez logueado, la app recuerda tu sesion usando localStorage. Al cerrar y abrir la app, no pide login de nuevo.

7. **Logout**: Boton de cerrar sesion en el header de la lista de contactos. Al tocarlo, limpia la sesion y vuelve al login.

8. **Proteccion de rutas**: Las paginas de contactos (lista, detalle, agregar) estan protegidas. Si no estas logueado, te redirige al login automaticamente.

---

## Tecnologias usadas

- **Ionic 9**: Framework de UI para apps moviles
- **React 19**: Libreria para la interfaz
- **TypeScript**: Tipado estatico
- **Capacitor 8**: Compilacion a app nativa Android
- **React Router v6**: Navegacion entre paginas
- **localStorage**: Persistencia de sesion y usuarios
- **Componentes Ionic**: IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonButton, IonInput, IonItem, IonLabel, IonList, IonBadge, IonAlert, IonLoading, IonIcon, IonBackButton, IonFab, IonModal

---

## Estructura de rutas

| Ruta | Pagina | Protegida | Descripcion |
|------|--------|-----------|-------------|
| `/` | Redireccion | No | Si estas logueado va a `/home`, si no a `/login` |
| `/login` | Login | No | Iniciar sesion con cuenta existente |
| `/register` | Registro | No | Crear cuenta nueva |
| `/home` | Lista de contactos | Si | Ver contactos, eliminar, navegar a detalle |
| `/contact/:id` | Detalle | Si | Ver info completa de un contacto |
| `/contact/new` | Agregar contacto | Si | Formulario para crear contacto |

---

## Como funciona la autenticacion

### Registro
1. El usuario completa el formulario de registro
2. Se valida que el correo no exista ya
3. Se guarda el usuario en localStorage (clave `users`)
4. Se marca como logueado (clave `logged` = true)
5. Se redirige a la lista de contactos

### Login
1. El usuario ingresa correo y contrasena
2. Se busca en la lista de usuarios registrados
3. Si coincide, se marca como logueado
4. Se redirige a la lista de contactos

### Sesion persistente
- Al abrir la app, se verifica si existe `logged = true` en localStorage
- Si existe, se salta el login y va directo a la lista
- Si no existe, se muestra el login

### Logout
- Se elimina `logged` del localStorage
- Se redirige al login
- La proxima vez se pedira iniciar sesion de nuevo

---

## Como correrlo localmente

### Paso 1: Clonar y cambiar a la rama

```bash
git clone https://github.com/Lucu1232004/Challenge2SD.git
cd Challenge2SD
git checkout challenge-04
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Correr en navegador

```bash
ionic serve
```

O:

```bash
npm run dev
```

Se abre en `http://localhost:8100`.

### Paso 4: Compilar para Android

```bash
npm run build
npx cap copy android
npx cap sync android
```

### Paso 5: Abrir en Android Studio

```bash
npx cap open android
```

O abre Android Studio manualmente y selecciona la carpeta `android/`.

### Paso 6: Ejecutar en celular

1. Conecta tu celular con USB (modo desarrollador activado)
2. En Android Studio, selecciona tu dispositivo
3. Toca el boton verde **Run**
4. Espera a que compile e instale

---

## Estructura del proyecto

```
contactos/
├── android/                       # Proyecto Android nativo
├── src/
│   ├── components/
│   │   ├── ContactItem.tsx        # Tarjeta de contacto en lista
│   │   └── ContactItem.css
│   ├── data/
│   │   ├── contacts.ts            # Datos iniciales y tipos
│   │   └── auth.ts                # Servicio de autenticacion
│   ├── pages/
│   │   ├── Home.tsx               # Lista de contactos
│   │   ├── Home.css
│   │   ├── ContactDetail.tsx      # Detalle de contacto
│   │   ├── ContactDetail.css
│   │   ├── AddContact.tsx         # Formulario agregar contacto
│   │   ├── AddContact.css
│   │   ├── Login.tsx              # Pagina de login
│   │   ├── Login.css
│   │   ├── Register.tsx           # Pagina de registro
│   │   └── Register.css
│   ├── App.tsx                    # Router con proteccion de rutas
│   ├── main.tsx                   # Punto de entrada
│   └── theme/
│       └── variables.css
├── capacitor.config.ts
├── ionic.config.json
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Componentes Ionic usados

| Componente | Uso |
|------------|-----|
| `IonPage` | Estructura base de cada pantalla |
| `IonHeader` + `IonToolbar` | Barra superior con titulo y botones |
| `IonTitle` | Titulo en el header |
| `IonContent` | Area de contenido con scroll |
| `IonCard` | Tarjetas de contacto |
| `IonButton` | Botones de accion |
| `IonInput` | Campos de texto (formularios) |
| `IonLabel` | Etiquetas para inputs |
| `IonItem` | Filas de formulario |
| `IonList` | Listas de items |
| `IonBadge` | Contador de contactos |
| `IonAlert` | Alertas de confirmacion y error |
| `IonLoading` | Pantalla de carga |
| `IonIcon` | Iconos vectoriales |
| `IonBackButton` | Boton de retroceso nativo |
| `IonFab` + `IonFabButton` | Boton flotante para agregar |
| `IonButtons` | Grupo de botones en header |

---

## Hooks de React usados

| Hook | Para que sirve |
|------|----------------|
| `useState` | Manejar estado de componentes (contactos, formularios, alertas) |
| `useEffect` | Ejecutar codigo al montar componente (cargar datos, recibir state) |
| `useParams` | Obtener parametros de URL (id del contacto) |
| `useNavigate` | Navegar programaticamente entre paginas |
| `useLocation` | Acceder al state de navegacion (pasar datos entre paginas) |

---

## Que aprendi con este challenge?

- Como crear rutas dinamicas con React Router (`/contact/:id`)
- Como pasar datos entre paginas con state navigation
- Como usar `routerLink` y `routerDirection` en componentes Ionic
- Como proteger rutas con componentes de orden superior
- Como usar localStorage para persistencia de datos
- Como crear un sistema completo de autenticacion (registro, login, logout)
- Como validar formularios antes de enviar
- Como manejar errores y mostrar alertas al usuario
- La diferencia entre navegacion con `routerLink` y programatica con `useNavigate`

---

## Practicas y Challenges completados

| Tipo | Nombre | Descripcion |
|------|--------|-------------|
| Challenge 01 | App de Contactos React | React puro con Vite. Listar, agregar, eliminar contactos. |
| Challenge 02 | PWA | Transformar la app en PWA instalable con Service Worker hibrido. |
| Practice 01 | Migracion a Ionic | Misma app con componentes Ionic, compilada para Android. |
| Practice 02 | Routing | Agregar pagina de detalle, pagina para crear contactos, navegacion entre pantallas. |
| Challenge 04 | Login con localStorage | Sistema completo de autenticacion: registro, login, logout, proteccion de rutas. |

---

## Autor

**Samuel Patino** - samuel.patino@uao.edu.co

Proyecto desarrollado para la clase de Desarrollo de Software para Plataformas Moviles.
