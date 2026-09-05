# Challenge 01 - App de Contactos con React

## Que es esto?

Esta es mi primera aplicacion con React, creada como parte de la materia **Desarrollo de Software para Plataformas Moviles**. Es una app sencilla pero funcional que permite gestionar una lista de contactos personales.

La idea era demostrar que ya manejo los conceptos basicos de React: componentes, estados, props, useEffect y eventos. Nada de frameworks complicados, solo React puro con Vite.

---

## Que hace la app?

### Funcionalidades principales

1. **Ver lista de contactos**: Al abrir la app, aparece un loader (pantalla de carga) por 1.5 segundos simulando que traemos datos de un servidor. Luego aparecen las tarjetas de contacto con nombre, telefono, edad y ciudad.

2. **Agregar contactos**: Hay un formulario donde puedes escribir el nombre, telefono, edad y ciudad de un nuevo contacto. Al darle "Agregar contacto", se anade a la lista inmediatamente.

3. **Eliminar contactos**: Cada tarjeta tiene una "X" en la esquina. Al tocarla, el contacto desaparece de la lista.

4. **Contador**: En el encabezado aparece cuantos contactos tienes en total.

### Datos iniciales

La app carga 4 contactos de ejemplo desde un archivo JSON local. Esto simula una API real.

### Estructura de componentes

- **App.jsx**: El componente principal. Maneja el estado global de los contactos y coordina todo.
- **ContactList.jsx**: Recibe la lista y la recorre, renderizando cada ContactItem.
- **ContactItem.jsx**: La tarjeta visual de cada contacto. Tiene el avatar con colores rojos, la info y el boton eliminar.
- **ContactForm.jsx**: El formulario para crear nuevos contactos.
- **Loader.jsx**: Un spinner animado que se muestra mientras "cargan" los datos.

---

## Tecnologias usadas

- **React 19**: Libreria principal para construir la interfaz.
- **Vite**: Herramienta de construccion rapida. Reemplaza a Create React App.
- **JavaScript (JSX)**: Todo esta escrito en JSX, no TypeScript todavia.
- **CSS puro**: Los estilos estan en un archivo `index.css` con clases personalizadas.
- **Fetch API**: Para simular la carga de datos desde `/api/contacts.json`.

---

## Como correrlo localmente

### Paso 1: Clonar el repo y entrar a la rama

```bash
git clone https://github.com/Lucu1232004/Challenge2SD.git
cd Challenge2SD
git checkout challenge-01
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Correr en modo desarrollo

```bash
npm run dev
```

Se abrira automaticamente en tu navegador en `http://localhost:5173`.

### Paso 4: Construir para produccion (opcional)

```bash
npm run build
```

Esto genera la carpeta `dist/` lista para subir a cualquier servidor.

---

## Que aprendi con este challenge?

- Como crear componentes reutilizables en React.
- Como usar `useState` para manejar datos que cambian en pantalla.
- Como pasar datos de padres a hijos con **props**.
- Como ejecutar funciones del padre desde el hijo (ej: eliminar un contacto).
- Como usar `useEffect` para ejecutar codigo al montar el componente.
- Como simular una API con `fetch` y un archivo JSON local.
- Por que NO hay que modificar el estado directamente (siempre usar el setter).

---

## Practica y Challenge asociados

| Tipo | Nombre | Descripcion |
|------|--------|-------------|
| Challenge 01 | App de Contactos React | Esta app. Listar, agregar y eliminar contactos con React puro. |

---

## Autor

Proyecto desarrollado para la clase de Desarrollo de Software para Plataformas Moviles.
