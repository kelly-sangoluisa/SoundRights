const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

const sender = window.userId;
const receiver = window.receiverId;

// Cargar historial al iniciar
async function loadHistory() {
  if (sender && receiver) {
    const res = await fetch(`/chat/history/${sender}/${receiver}`);
    const history = await res.json();
    messages.innerHTML = '';
    history.forEach(msg => {
      const item = document.createElement('li');
      item.textContent = `[${msg.sender} → ${msg.receiver}]: ${msg.content}`;
      messages.appendChild(item);
    });
    window.scrollTo(0, document.body.scrollHeight);
  }
}

window.addEventListener('DOMContentLoaded', loadHistory);

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value && sender && receiver) {
    socket.emit('chat message', {
      sender: Number(sender),
      receiver: Number(receiver),
      content: input.value
    });
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  // Solo muestra el mensaje si es entre estos dos usuarios
  if (
    (msg.sender == sender && msg.receiver == receiver) ||
    (msg.sender == receiver && msg.receiver == sender)
  ) {
    const item = document.createElement('li');
    item.textContent = `[${msg.sender} → ${msg.receiver}]: ${msg.content}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
});