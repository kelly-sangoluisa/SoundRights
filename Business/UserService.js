const UserRepository = require('../DataAccess/UserRepository');
const bcrypt = require('bcrypt');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  // Registro de usuario
  async registrarUsuario(userData) {
    const { name_user, email_user, password_user, security_question, security_answer } = userData;

    // Verifica si el correo ya existe
    const existingUser = await this.userRepository.buscarPorEmail(email_user);
    if (existingUser) {
      throw new Error('El correo ya está registrado.');
    }

    // Hashea contraseña y respuesta de seguridad
    const hashedPassword = await bcrypt.hash(password_user, 10);
    const hashedAnswer = await bcrypt.hash(security_answer, 10);

    const usuarioNuevo = {
      name_user,
      email_user,
      password_user: hashedPassword,
      security_question,
      security_answer: hashedAnswer
    };

    return await this.userRepository.crearUsuario(usuarioNuevo);
  }

  // Inicio de sesión
  async autenticarUsuario(email_user, password_user) {
    const user = await this.userRepository.buscarPorEmail(email_user);
    if (!user) throw new Error('Correo o contraseña incorrectos');

    const match = await bcrypt.compare(password_user, user.password_user);
    if (!match) throw new Error('Correo o contraseña incorrectos');

    return user;
  }

  // Devuelve la pregunta de seguridad (sin exponer la respuesta)
  async obtenerPreguntaSeguridad(email_user) {
    const user = await this.userRepository.buscarPorEmail(email_user);
    if (!user) throw new Error('Correo no registrado');
    return user.security_question;
  }

  // Verifica respuesta de seguridad para recuperación de contraseña
  async verificarRespuestaSeguridad(email_user, security_answer) {
    const user = await this.userRepository.buscarPorEmail(email_user);
    if (!user) throw new Error('Correo no registrado');

    const validAnswer = await bcrypt.compare(security_answer, user.security_answer);
    if (!validAnswer) throw new Error('Respuesta de seguridad incorrecta');

    return true;
  }

  // Cambia la contraseña (usado tras verificar la respuesta de seguridad)
  async cambiarContrasena(email_user, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 10);
    return await this.userRepository.actualizarContrasena(email_user, hashed);
  }
}

module.exports = UserService;