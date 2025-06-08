const { pool } = require('../database.js');
const Message = require('../Entity/Message.js');

class MessageRepository {
  async getAll() {
    const result = await pool.query('SELECT id_message, id_sender_user, id_receiver_user, content_message FROM message');
    return result.rows.map(
      row => new Message(row.id_message, row.id_sender_user, row.id_receiver_user, row.content_message)
    );
  }

  async getById(id) {
    const result = await pool.query(
      'SELECT id_message, id_sender_user, id_receiver_user, content_message FROM message WHERE id_message = $1',
      [id]
    );
    const row = result.rows[0];
    return row ? new Message(row.id_message, row.id_sender_user, row.id_receiver_user, row.content_message) : null;
  }

  async getChatBetweenUsers(userA, userB, limit = 50) {
    const result = await pool.query(
      `SELECT id_message, id_sender_user, id_receiver_user, content_message
       FROM message
       WHERE (id_sender_user = $1 AND id_receiver_user = $2)
          OR (id_sender_user = $2 AND id_receiver_user = $1)
       ORDER BY id_message DESC
       LIMIT $3`,
      [userA, userB, limit]
    );
    return result.rows
      .map(row => new Message(row.id_message, row.id_sender_user, row.id_receiver_user, row.content_message))
      .reverse();
  }

  async add(sender, receiver, content) {
    const result = await pool.query(
      `INSERT INTO message (id_sender_user, id_receiver_user, content_message)
       VALUES ($1, $2, $3)
       RETURNING id_message, id_sender_user, id_receiver_user, content_message`,
      [sender, receiver, content]
    );
    const row = result.rows[0];
    return new Message(row.id_message, row.id_sender_user, row.id_receiver_user, row.content_message);
  }

  async update(id, updatedFields) {
    if (!updatedFields.content) return null;
    const result = await pool.query(
      `UPDATE message SET content_message = $1
       WHERE id_message = $2
       RETURNING id_message, id_sender_user, id_receiver_user, content_message`,
      [updatedFields.content, id]
    );
    const row = result.rows[0];
    return row ? new Message(row.id_message, row.id_sender_user, row.id_receiver_user, row.content_message) : null;
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM message WHERE id_message = $1',
      [id]
    );
    return result.rowCount > 0;
  }
}

module.exports = MessageRepository;