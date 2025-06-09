const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const session = require('express-session');
const ChatService = require('./Business/ChatService.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware para parsear formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de sesión (¡importante para login!)
app.use(session({
  secret: 'soundrights-secret', // Cambia esto en producción
  resave: false,
  saveUninitialized: false
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const chatRoutes = require('./routes/chat.routes.js');
const userRoutes = require('./routes/user.routes.js');

app.use('/chat', chatRoutes);
app.use('/', userRoutes);

// Ruta raíz (puedes cambiar a main o login si prefieres)
app.get('/', (req, res) => {
  res.redirect('/login');
});

// --- CHAT SOCKET.IO (NO TOCAR) ---
const chatService = new ChatService();

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('chat message', async (msg) => {
        try {
            console.log('Intentando guardar mensaje:', msg);
            const savedMsg = await chatService.sendMessage(msg.sender, msg.receiver, msg.content);
            console.log('Mensaje guardado:', savedMsg);
            io.emit('chat message', savedMsg);
        } catch (err) {
            console.error('Error al guardar mensaje:', err);
            socket.emit('chat error', err.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// --- FIN CHAT SOCKET.IO ---

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});