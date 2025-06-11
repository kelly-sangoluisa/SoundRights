const { pool } = require('../database');
const Song = require('../Entity/Song');

class SongRepository {
  // Obtener todas las canciones
  static async getAll() {
    const result = await pool.query(`
      SELECT s.id_song, s.id_user, s.title_song, s.file_url_song, u.name_user AS artist_name
      FROM song s
      JOIN app_user u ON s.id_user = u.id_user
    `);
    return result.rows.map(row => new Song(row));
  }

  // Obtener una canción por ID
  static async getById(id_song) {
    const result = await pool.query(
      'SELECT id_song, id_user, title_song, file_url_song FROM song WHERE id_song = $1',
      [id_song]
    );
    if (result.rows.length === 0) return null;
    return new Song(result.rows[0]);
  }

  // Crear una nueva canción
  static async create({ id_user, title_song, file_url_song }) {
    const result = await pool.query(
      'INSERT INTO song (id_user, title_song, file_url_song) VALUES ($1, $2, $3) RETURNING id_song, id_user, title_song, file_url_song',
      [id_user, title_song, file_url_song]
    );
    return new Song(result.rows[0]);
  }

  // Actualizar una canción existente
  static async update(id_song, { id_user, title_song, file_url_song }) {
    const result = await pool.query(
      `UPDATE song SET id_user = $1, title_song = $2, file_url_song = $3
       WHERE id_song = $4
       RETURNING id_song, id_user, title_song, file_url_song`,
      [id_user, title_song, file_url_song, id_song]
    );
    if (result.rows.length === 0) return null;
    return new Song(result.rows[0]);
  }

  // Eliminar una canción
  static async delete(id_song) {
    await pool.query('DELETE FROM song WHERE id_song = $1', [id_song]);
    return true;
  }
}

module.exports = SongRepository;