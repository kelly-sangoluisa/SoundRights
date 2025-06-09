const { pool } = require('../database.js');
const User = require('../Entity/User.js');

class UserRepository {
  async crearUsuario(user) {
    const { name_user, email_user, password_user, security_question, security_answer } = user;
    const result = await pool.query(
      `INSERT INTO app_user (name_user, email_user, password_user, security_question, security_answer)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_user, name_user, email_user, password_user, security_question, security_answer`,
      [name_user, email_user, password_user, security_question, security_answer]
    );
    const row = result.rows[0];
    return row
      ? new User(row.id_user, row.name_user, row.email_user, row.password_user, row.security_question, row.security_answer)
      : null;
  }

  async buscarPorEmail(email) {
    const result = await pool.query(
      `SELECT id_user, name_user, email_user, password_user, security_question, security_answer
       FROM app_user WHERE email_user = $1`,
      [email]
    );
    const row = result.rows[0];
    return row
      ? new User(row.id_user, row.name_user, row.email_user, row.password_user, row.security_question, row.security_answer)
      : null;
  }

  async actualizarContrasena(email, newPassword) {
    const result = await pool.query(
      `UPDATE app_user SET password_user = $1
       WHERE email_user = $2
       RETURNING id_user, name_user, email_user, password_user, security_question, security_answer`,
      [newPassword, email]
    );
    const row = result.rows[0];
    return row
      ? new User(row.id_user, row.name_user, row.email_user, row.password_user, row.security_question, row.security_answer)
      : null;
  }
}

module.exports = UserRepository;