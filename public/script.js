const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let sender = null;
const receiver = window.receiverId;

console.log('Valor inicial de receiver:', receiver);

// Obtiene el usuario logueado y luego carga el historial
async function getSender() {
  console.log('Llamando a /me para obtener el usuario logueado...');
  const res = await fetch('/me', { credentials: 'include' });
  const data = await res.json();
  console.log('Datos recibidos de /me:', data);
  if (data.success) {
    sender = data.user.id_user;
    console.log('Sender obtenido:', sender);
    loadHistory(); // solo carga historial cuando ya tienes el sender
  } else {
    alert('No se pudo obtener el usuario logueado.');
    window.location.href = '/login';
  }
}

// Cargar historial entre sender y receiver
async function loadHistory() {
  if (sender && receiver) {
    console.log(`Cargando historial entre sender=${sender} y receiver=${receiver}`);
    const res = await fetch(`/chat/history/${sender}/${receiver}`);
    const history = await res.json();
    console.log('Historial recibido:', history);
    messages.innerHTML = '';
    history.forEach(msg => {
      const item = document.createElement('li');
      item.textContent = msg.content;

      // Si el mensaje fue enviado por mí, agregamos la clase 'self'
      if (msg.sender == sender) {
        item.classList.add('self');
      }

      messages.appendChild(item);
    });

    window.scrollTo(0, document.body.scrollHeight);
  }
}

// Solo ejecuta getSender al cargar la página
window.addEventListener('DOMContentLoaded', getSender);

// Enviar mensaje por socket
form.addEventListener('submit', function (e) {
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


// Recibir mensaje en tiempo real
socket.on('chat message', function (msg) {
  // Solo muestra el mensaje si es entre estos dos usuarios
  if (
    (msg.sender == sender && msg.receiver == receiver) ||
    (msg.sender == receiver && msg.receiver == sender)
  ) {
    const item = document.createElement('li');

    // Agrega el contenido del mensaje
    item.textContent = msg.content;

    // Si el mensaje fue enviado por mí, alinearlo a la derecha
    if (msg.sender === sender) {
      item.classList.add('self');
    }

    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
});


const li = document.createElement("li");
li.textContent = msg.content;
if (msg.senderId === myUserId) {
  li.classList.add("self");
}
messages.appendChild(li);

