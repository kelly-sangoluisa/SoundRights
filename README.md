# SoundRights

SoundRights es una plataforma web para la gestión de derechos de canciones, licencias y mensajería entre usuarios y artistas. Permite a los usuarios escuchar canciones, solicitar derechos de uso, gestionar licencias y comunicarse mediante chat en tiempo real.

---

## 🚀 Descripción

SoundRights facilita la interacción entre creadores y usuarios de música, permitiendo:
- Registro y autenticación de usuarios.
- Subida y gestión de canciones.
- Solicitud y otorgamiento de licencias de uso.
- Chat en tiempo real entre usuarios y artistas.
- Visualización de licencias adquiridas y canciones disponibles.

---

## 🛠️ Tecnologías utilizadas

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" alt="Socket.io" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width="40" height="40"/>
</p>


---

## ⚙️ Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/kelly-sangoluisa/SoundRights.git
cd SoundRights
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura la base de datos

- Crea una base de datos PostgreSQL llamada `SoundsRights` (o el nombre que prefieras).
- Crea las tablas usando los scripts SQL proporcionados en la documentación o en los archivos del proyecto.
- Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno requeridas:
```
PORT
DB_USER
DB_HOST
DB_NAME
DB_PASSWORD
DB_PORT
```

### 4. Ejecuta el servidor

```bash
npm start
```
---

## 📁 Estructura principal del proyecto

```
SoundRights/
├── Business/           # Lógica de negocio (servicios)
├── DataAccess/         # Acceso a datos (repositorios)
├── Entity/             # Modelos de datos
├── public/             # Archivos estáticos (JS, CSS, imágenes)
├── routes/             # Rutas de la API y vistas
├── views/              # Vistas HTML
├── database.js         # Configuración de la base de datos
├── server.js           # Servidor principal
├── .env                # Variables de entorno
└── package.json        # Dependencias y scripts
```

---

## 💡 Notas

- Asegúrate de tener **Node.js** y **PostgreSQL** instalados.
- Los archivos de audio deben estar en la carpeta `public/songs/` y las rutas en la base de datos deben ser relativas a esa carpeta.
- Puedes personalizar los estilos en `public/dashboard.css`, `public/chat.css`, etc.

---

## 📞 Contacto

Desarrollado por:  
- [Kelly Sangoluisa](https://github.com/kelly-sangoluisa)
- [Dorian Tituaña](https://github.com/DorianTitu)  
- [Alexander Vera](https://github.com/alexanderv10)


---

¡Contribuciones y sugerencias son bienvenidas! 