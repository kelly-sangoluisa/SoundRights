const socket = io();
 
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
 
let sender = null;
let receiver = null;
let chatId = null;
let dataChat = null;

// Inicializa el chat al cargar la página
window.addEventListener('DOMContentLoaded', initChat);

async function initChat() {
  // 1. Usuario logueado
  const resMe = await fetch('/me', { credentials: 'include' });
  const dataMe = await resMe.json();
  if (!dataMe.success) {
    alert('No se pudo obtener el usuario logueado.');
    window.location.href = '/login';
    return;
  }
  sender = dataMe.user.id_user;
  // 2. id_chat de la URL
  const params = new URLSearchParams(window.location.search);
  chatId = params.get('id_chat');
  if (!chatId) {
    alert('No se encontró el chat.');
    window.location.href = '/main';
    return;
  }
  // 3. Info del chat
  const resChat = await fetch(`/chat/info/${chatId}`);
  const chatData = await resChat.json();
  if (!chatData.success || !chatData.chat) {
    alert('No se encontró el chat.');
    window.location.href = '/main';
    return;
  }
  dataChat = chatData;
  // 4. Determina receptor
  if (Number(chatData.chat.user1Id) === Number(sender)) {
    receiver = chatData.chat.user2Id;
  } else if (Number(chatData.chat.user2Id) === Number(sender)) {
    receiver = chatData.chat.user1Id;
  } else {
    alert('No tienes acceso a este chat.');
    window.location.href = '/main';
    return;
  }
  // 5. Mostrar botón solo al dueño de la canción
  const songId = chatData.chat.songId || chatData.chat.songid || chatData.chat.id_song;
  const resSong = await fetch(`/api/songs/${songId}`);
  const dataSong = await resSong.json();
  if (!dataSong.success || !dataSong.song) {
    alert('No se pudo obtener la información de la canción.');
    return;
  }
  const ownerId = dataSong.song.id_user;
   const licenseBanner = document.getElementById('license-granted-banner');
  const grantBtn = document.getElementById('grant-license-btn');
  
  if (Number(sender) === Number(ownerId)) {
    // Verifica si ya existe una licencia aprobada para este requester y canción
    const checkRes = await fetch(`/licenses?requester=${receiver}&song=${songId}`);
    const checkData = await checkRes.json();
    const yaTieneLicencia = checkData.success && checkData.licenses.some(l => l.status_license === 'approved');
    if (yaTieneLicencia) {
      grantBtn.style.display = 'none';
      licenseBanner.style.display = 'block';
    } else {
      grantBtn.style.display = 'inline-block';
      licenseBanner.style.display = 'none';
    }
  } else {
    grantBtn.style.display = 'none';
    licenseBanner.style.display = 'none';
  }

  // 6. Carga historial
  loadHistory();
}

// Cargar historial de mensajes
async function loadHistory() {
  if (chatId) {
    const res = await fetch(`/chat/${chatId}/messages`);
    const data = await res.json();
    if (data.success) {
      messages.innerHTML = '';
      data.messages.forEach(msg => {
        const item = document.createElement('li');
        item.textContent = msg.content_message || msg.content;
        if (msg.id_sender_user == sender || msg.sender == sender) item.classList.add('self');
        messages.appendChild(item);
      });
      scrollToBottom();
    }
  }
}
// Enviar mensaje por socket
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const messageText = input.value.trim();
  if (messageText && sender && receiver && chatId) {
    const msgObj = {
      sender: Number(sender),
      receiver: Number(receiver),
      id_chat: Number(chatId),
      content: messageText
    };
    socket.emit('chat message', msgObj);
    input.value = '';
  }
});
 
// Recibir mensaje en tiempo real
socket.on('chat message', function (msg) {
  if (msg.idChat == chatId || msg.id_chat == chatId) {
    const item = document.createElement('li');
    item.textContent = msg.content_message || msg.content;
    if (msg.id_sender_user == sender || msg.sender == sender) item.classList.add('self');
    messages.appendChild(item);
    scrollToBottom();
  }
});

// Modal para otorgar licencia
document.getElementById('grant-license-btn').onclick = () => {
  document.getElementById('grantLicenseModal').style.display = 'flex';
};
document.getElementById('cancelGrantBtn').onclick = () => {
  document.getElementById('grantLicenseModal').style.display = 'none';
};
document.getElementById('confirmGrantBtn').onclick = async () => {
  try {
    const requester = (dataChat.chat.user1Id === sender) ? dataChat.chat.user2Id : dataChat.chat.user1Id;
    const songId = dataChat.chat.songId || dataChat.chat.songid || dataChat.chat.id_song;

    console.log('Enviando solicitud de licencia:', {
      id_song: songId,
      id_requester_user: requester,
      status_license: 'approved'
    });

    const res = await fetch('/licenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_song: songId,
        id_requester_user: requester,
        status_license: 'approved'
      })
    });

    const text = await res.text();
    console.log('Respuesta de /chat/licenses:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      alert('Error inesperado en el servidor');
      return;
    }

    if (data.success) {
      document.getElementById('grantLicenseModal').style.display = 'none';
      document.getElementById('grant-license-btn').disabled = true;
      showSuccessAlert('Licencia otorgada exitosamente');
      setTimeout(() => {
        window.location.href = '/main';
      }, 1500);
    } else {
      alert('Error al otorgar la licencia: ' + (data.message || ''));
    }
  } catch (err) {
    console.error('Error en confirmGrantBtn:', err);
    alert('Error inesperado al otorgar la licencia');
  }
};

// Scroll automático al final
function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}
function showSuccessAlert(msg) {
  const alertDiv = document.getElementById('alert-success');
  alertDiv.textContent = msg;
  alertDiv.style.display = 'block';
  setTimeout(() => {
    alertDiv.style.display = 'none';
  }, 2500);
}
