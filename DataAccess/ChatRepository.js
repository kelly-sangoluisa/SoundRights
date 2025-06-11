const { pool } = require('../database.js');
const Chat = require('../Entity/Chat.js');

class ChatRepository {
  // Buscar chat por canción y usuarios (sin importar el orden)
  async findByUsersAndSong(songId, userA, userB) {
    const result = await pool.query(
      `SELECT * FROM chat
       WHERE id_song = $1 AND (
         (id_user1 = $2 AND id_user2 = $3) OR
         (id_user1 = $3 AND id_user2 = $2)
       )`,
      [songId, userA, userB]
    );
    const row = result.rows[0];
    return row ? new Chat(row.id_chat, row.id_song, row.id_user1, row.id_user2, row.created_at) : null;
  }

  // Crear un nuevo chat
  async create(songId, user1, user2) {
    const result = await pool.query(
      `INSERT INTO chat (id_song, id_user1, id_user2)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [songId, user1, user2]
    );
    const row = result.rows[0];
    return new Chat(row.id_chat, row.id_song, row.id_user1, row.id_user2, row.created_at);
  }

  // Listar todos los chats de un usuario
  async getChatsForUser(userId) {
    const result = await pool.query(
      `SELECT c.*, s.title_song, u1.name_user AS user1_name, u2.name_user AS user2_name
       FROM chat c
       JOIN song s ON c.id_song = s.id_song
       JOIN app_user u1 ON c.id_user1 = u1.id_user
       JOIN app_user u2 ON c.id_user2 = u2.id_user
       WHERE c.id_user1 = $1 OR c.id_user2 = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );
    return result.rows.map(row =>
      ({
        id: row.id_chat,
        songId: row.id_song,
        songTitle: row.title_song,
        user1Id: row.id_user1,
        user2Id: row.id_user2,
        user1Name: row.user1_name,
        user2Name: row.user2_name,
        createdAt: row.created_at
      })
    );
  }
  
  async getById(idChat) {
    const result = await pool.query(
      `SELECT * FROM chat WHERE id_chat = $1`,
      [idChat]
    );
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id_chat,
      songId: row.id_song,
      user1Id: row.id_user1,
      user2Id: row.id_user2,
      createdAt: row.created_at
    };
  }


}

module.exports = ChatRepository;