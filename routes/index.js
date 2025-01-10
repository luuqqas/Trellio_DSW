const express = require('express');
const router = express.Router();
const passport = require('passport');
const path = require('path');
const crypto = require('crypto');
const User = require('../models/User');
const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');

// Middleware de autenticação
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Registrar
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.redirect('/register?error=Email já está em uso');
    }
    const newUser = new User({ email, password });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/register?error=Erro ao registrar o usuário');
  }
});

// Login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login?error=Email ou senha incorretos',
  failureFlash: true
}));

// Exibir página de login
router.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/login.html'));
});

// Exibir página de registro
router.get('/register', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/register.html'));
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Página inicial autenticada
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/dashboard.html'));
});

// Página inicial (index.html)
router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// Página de recuperação de senha
router.get('/forgot-password', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/forgot-password.html'));
});

// Solicitar redefinição de senha (gera e salva um token)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.redirect('/forgot-password?error=Usuário não encontrado');
    }

    // Gera um token de redefinição de senha
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // Mostra o token ao usuário (simulação de envio por e-mail)
    res.redirect(`/reset-password/${token}`);
  } catch (err) {
    console.error(err);
    res.redirect('/forgot-password?error=Erro ao processar o pedido');
  }
});

// Página de redefinição de senha
router.get('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    }).exec();

    if (!user) {
      return res.redirect('/forgot-password?error=Token inválido ou expirado');
    }

    res.sendFile(path.resolve(__dirname, '../public/reset-password.html'));
  } catch (err) {
    console.error(err);
    res.redirect('/forgot-password?error=Erro ao processar o pedido');
  }
});

// Redefine a senha
router.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    }).exec();

    if (!user) {
      return res.redirect('/forgot-password?error=Token inválido ou expirado');
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.redirect('/login?success=Senha redefinida com sucesso');
  } catch (err) {
    console.error(err);
    res.redirect('/forgot-password?error=Erro ao redefinir a senha');
  }
});

module.exports = router;
