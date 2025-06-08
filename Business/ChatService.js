const Message = require('../Entity/Message.js');
const MessageRepository = require('../DataAccess/MessageRepository.js');

class ChatService {
  constructor() {
    this.messageRepo = new MessageRepository();
  }

  async sendMessage(sender, receiver, content) {
    if (sender === receiver) {
      throw new Error("No puedes enviarte mensajes a ti mismo.");
    }
    const validationMsg = this.#validateMessageContent(content);
    if (validationMsg) {
      throw new Error(validationMsg);
    }
    return await this.messageRepo.add(sender, receiver, content);
  }

  async getMessagesBetweenUsers(userA, userB, limit = 50) {
    return await this.messageRepo.getChatBetweenUsers(userA, userB, limit);
  }

  async getAllMessages() {
    return await this.messageRepo.getAll();
  }

  async getMessageById(id) {
    return await this.messageRepo.getById(id);
  }

  async updateMessage(id, updatedFields) {
    return await this.messageRepo.update(id, updatedFields);
  }

  async deleteMessage(id) {
    return await this.messageRepo.delete(id);
  }

  // Método privado para validación de mensajes
  #validateMessageContent(content) {
    if (!content || content.trim() === '') {
      return "El mensaje no puede estar vacío.";
    }
    return "";
  }
}

module.exports = ChatService;