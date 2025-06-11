class Message {
  constructor(id, sender, receiver, idChat, content) {
    this.id = id;
    this.sender = sender;
    this.receiver = receiver;
    this.idChat = idChat;
    this.content = content;
  }
}

module.exports = Message;