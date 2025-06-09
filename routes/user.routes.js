const express = require('express');
const path = require('path');
const router = express.Router();
const UserService = require('../Business/UserService');
const userService = new UserService();

// Página de registro
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
});

// Página de recuperación de contraseña
router.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/reset.html'));
});

// Página de login
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

// Página principal (main) - requiere login
router.get('/main', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '../views/main.html'));
});

// POST: registro de usuario
router.post('/register', async (req, res) => {
  try {
    await userService.registrarUsuario(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST: login
router.post('/login', async (req, res) => {
  const { email_user, password_user } = req.body;
  console.log('--- Intento de login ---');
  console.log('Email recibido:', email_user);
  try {
    const user = await userService.autenticarUsuario(email_user, password_user);
    req.session.user = {
      id_user: user.id_user,
      name_user: user.name_user,
      email_user: user.email_user
    };
    console.log('Login exitoso. Usuario guardado en sesión:', req.session.user);
    res.json({ success: true, user: req.session.user, redirect: '/main' });
  } catch (error) {
    console.log('Login fallido:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET: obtener pregunta de seguridad
router.get('/forgot-password/question', async (req, res) => {
  const email = req.query.email_user;
  try {
    const user = await userService.userRepository.buscarPorEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Correo no encontrado' });
    }
    res.json({ success: true, question: user.security_question });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// POST: verificar y cambiar contraseña
router.post('/reset-password', async (req, res) => {
  const { email_user, security_answer, new_password } = req.body;
  try {
    await userService.verificarRespuestaSeguridad(email_user, security_answer);
    await userService.cambiarContrasena(email_user, new_password);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;