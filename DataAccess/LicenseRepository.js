const { pool } = require('../database');
const License = require('../Entity/License');
 
class LicenseRepository {
  // Obtener todas las licencias
  static async getAll() {
    const result = await pool.query('SELECT * FROM license_request');
    return result.rows.map(row => new License(row));
  }
 
  // Obtener una licencia por ID
  static async getById(id_license_request) {
    const result = await pool.query('SELECT * FROM license_request WHERE id_license_request = $1', [id_license_request]);
    if (result.rows.length === 0) return null;
    return new License(result.rows[0]);
  }
 
  // Crear una nueva licencia
  
  static async create({ id_song, id_requester_user, status_license }) {
    const result = await pool.query(
      `INSERT INTO license_request (id_song, id_requester_user, status_license)
       VALUES ($1, $2, $3)
       RETURNING *;`,
      [id_song, id_requester_user, status_license]
    );
    const row = result.rows[0];
    return new License(row);
  }


  // Actualizar una licencia existente
  static async update(id_license_request, { id_song, id_requester_user, status_license, date_start_license, date_end_license }) {
    const result = await pool.query(
      `UPDATE license_request SET
        id_song = $1,
        id_requester_user = $2,
        status_license = $3,
        date_start_license = $4,
        date_end_license = $5
       WHERE id_license_request = $6
       RETURNING id_license_request, id_song, id_requester_user, status_license, date_start_license, date_end_license`,
      [id_song, id_requester_user, status_license, date_start_license, date_end_license, id_license_request]
    );
    if (result.rows.length === 0) return null;
    return new License(result.rows[0]);
  }
 
  // Eliminar una licencia
  static async delete(id_license_request) {
    await pool.query('DELETE FROM license_request WHERE id_license_request = $1', [id_license_request]);
    return true;
  }
 
  // Obtener licencias por usuario solicitante
  static async getByRequesterUserId(id_requester_user) {
    const result = await pool.query(
      `SELECT l.*, s.title_song AS song_title, u.name_user AS artist_name
      FROM license_request l
      JOIN song s ON l.id_song = s.id_song
      JOIN app_user u ON s.id_user = u.id_user
      WHERE l.id_requester_user = $1`,
      [id_requester_user]
    );
    return result.rows; // Puedes mapear a License si quieres
  }
 
  // Obtener licencias por canción
  static async getBySong(id_song) {
    const result = await pool.query(
      'SELECT * FROM license_request WHERE id_song = $1',
      [id_song]
    );
    return result.rows.map(row => new License(row));
  }

  static async findByUserAndSong(id_requester_user, id_song) {
    const result = await pool.query(
      `SELECT * FROM license_request WHERE id_requester_user = $1 AND id_song = $2`,
      [id_requester_user, id_song]
    );
    return result.rows.map(row => new License(row));
  }

}
 
module.exports = LicenseRepository;