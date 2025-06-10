const { pool } = require('../database');
const License = require('../Entity/License');

class LicenseRepository {
  // Obtener todas las licencias
  static async getAll() {
    const result = await pool.query('SELECT * FROM license_request');
    return result.rows.map(row => new License(row));
  }

  // Obtener una licencia por ID
  static async getById(id_license) {
    const result = await pool.query('SELECT * FROM license_request WHERE id_license = $1', [id_license]);
    if (result.rows.length === 0) return null;
    return new License(result.rows[0]);
  }

  // Crear una nueva licencia
  static async create({ id_song, id_requester_user, status_license, date_start_license, date_end_license }) {
    const result = await pool.query(
      `INSERT INTO license_request (id_song, id_requester_user, status_license, date_start_license, date_end_license)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_license, id_song, id_requester_user, status_license, date_start_license, date_end_license`,
      [id_song, id_requester_user, status_license, date_start_license, date_end_license]
    );
    return new License(result.rows[0]);
  }

  // Actualizar una licencia existente
  static async update(id_license, { id_song, id_requester_user, status_license, date_start_license, date_end_license }) {
    const result = await pool.query(
      `UPDATE license_request SET
        id_song = $1,
        id_requester_user = $2,
        status_license = $3,
        date_start_license = $4,
        date_end_license = $5
       WHERE id_license = $6
       RETURNING id_license, id_song, id_requester_user, status_license, date_start_license, date_end_license`,
      [id_song, id_requester_user, status_license, date_start_license, date_end_license, id_license]
    );
    if (result.rows.length === 0) return null;
    return new License(result.rows[0]);
  }

  // Eliminar una licencia
  static async delete(id_license) {
    await pool.query('DELETE FROM license_request WHERE id_license = $1', [id_license]);
    return true;
  }

  // Obtener licencias por usuario solicitante
  static async getByRequesterUserId(id_requester_user) {
    const result = await pool.query(
      'SELECT * FROM license_request WHERE id_requester_user = $1',
      [id_requester_user]
    );
    return result.rows.map(row => new License(row));
  }

  // Obtener licencias por canción
  static async getBySong(id_song) {
    const result = await pool.query(
      'SELECT * FROM license_request WHERE id_song = $1',
      [id_song]
    );
    return result.rows.map(row => new License(row));
  }
}

module.exports = LicenseRepository;