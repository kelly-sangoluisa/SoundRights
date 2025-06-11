const ChatRepository = require('../DataAccess/ChatRepository.js');
const MessageRepository = require('../DataAccess/MessageRepository.js'); // <-- ESTA LÍNEA ES OBLIGATORIA// <-- Importa el repositorio de mensajes
 
class ChatService {
  constructor() {
    this.chatRepo = new ChatRepository();
    this.messageRepo = new MessageRepository(); // <-- Instancia el repositorio de mensajes
  }
 
  // Buscar o crear chat
  async getOrCreateChat(songId, userA, userB) {
    let chat = await this.chatRepo.findByUsersAndSong(songId, userA, userB);
    if (!chat) {
      chat = await this.chatRepo.create(songId, userA, userB);
    }
    return chat;
  }
 
  // Obtener todos los chats de un usuario (bandeja)
  async getChatsForUser(userId) {
    return await this.chatRepo.getChatsForUser(userId);
  }
 
  // Obtener mensajes de un chat
  async getMessagesByChatId(idChat, limit = 50) {
    return await this.messageRepo.getByChatId(idChat, limit);
  }
 
  // Enviar mensaje en un chat
  async sendMessage(sender, receiver, idChat, content) {
    if (sender === receiver) throw new Error("No puedes enviarte mensajes a ti mismo.");
    console.log('Contenido recibido:', content);
    if (!content || content.trim() === '') throw new Error("El mensaje no puede estar vacío.");
    return await this.messageRepo.add(sender, receiver, idChat, content);
  }
 
  // Obtener info de un chat por id
  async getChatById(idChat) {
    return await this.chatRepo.getById(idChat);
  }
}
 
module.exports = ChatService;
 