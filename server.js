const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const session = require('express-session');
const ChatService = require('./Business/ChatService.js');
 
// Inicialización
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
 
// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
const songRoutes = require('./routes/song.routes.js');
const licenseRoutes = require('./routes/license.routes.js');
app.use(licenseRoutes); // ¡Sin prefijo!
 
app.use('/chat', chatRoutes);
app.use(licenseRoutes);
app.use('/', userRoutes);
app.use('/api', songRoutes);
 
// Ruta raíz
app.get('/', (req, res) => {
  res.redirect('/login');
});
 
// Ruta para chat.html (protegida)
app.get('/chat', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'views/chat.html'));
});
 
 
 
 
// --- CHAT SOCKET.IO ---
const chatService = new ChatService();
 
io.on('connection', (socket) => {
  console.log('Usuario conectado');
 
  socket.on('chat message', async (msg) => {
    try {
      console.log('Intentando guardar mensaje:', msg);
      const savedMsg = await chatService.sendMessage(
        msg.sender,
        msg.receiver,
        msg.id_chat,
        msg.content
      );
      console.log('Mensaje guardado:', savedMsg);
 
      // Convierte a objeto plano antes de emitir
      const plainMsg = {
        id: savedMsg.id,
        sender: savedMsg.sender,
        receiver: savedMsg.receiver,
        idChat: savedMsg.idChat,
        content: savedMsg.content,
        sentAt: savedMsg.sentAt
      };
 
      io.emit('chat message', plainMsg);
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
 
// Arranque del servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
 