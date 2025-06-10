const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const ChatService = require('./Business/ChatService.js');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const chatService = new ChatService();
const chatRoutes = require('./routes/chat.routes.js');
app.use('/chat', chatRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'chat.html'));
});

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});
app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/main.html'));
});
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/chat.html'));
});