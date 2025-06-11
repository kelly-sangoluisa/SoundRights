const { pool } = require('../database.js');
const Message = require('../Entity/Message.js');
 
class MessageRepository {
  // Obtener mensajes de un chat
  async getByChatId(idChat, limit = 50) {
    const result = await pool.query(
      `SELECT * FROM message WHERE id_chat = $1 ORDER BY sent_at ASC LIMIT $2`,
      [idChat, limit]
    );
    return result.rows.map(
      row => new Message(row.id_message, row.id_sender_user, row.id_receiver_user, row.id_chat, row.content_message, row.sent_at)
    );
  }
  // Agregar mensaje a un chat
  async add(sender, receiver, idChat, content) {
    const result = await pool.query(
      `INSERT INTO message (id_sender_user, id_receiver_user, id_chat, content_message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [sender, receiver, idChat, content]
    );
    const row = result.rows[0];
    return new Message(row.id_message, row.id_sender_user, row.id_receiver_user, row.id_chat, row.content_message, row.sent_at);
  }
}
 
module.exports = MessageRepository;
 