const express = require('express');
const router = express.Router();
const passport = require('passport');
const Board = require('../models/Board');

// Middleware de autenticação
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Rotas para manipular quadros
router.post('/', ensureAuthenticated, async (req, res) => {
  const { title, backgroundColor, textColor } = req.body;
  try {
    const createdBy = req.user._id;
    const newBoard = new Board({ title, backgroundColor, textColor, createdBy });
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar o quadro' });
  }
});

router.put('/:id', ensureAuthenticated, async (req, res) => {
  const { title, backgroundColor, textColor } = req.body;
  try {
    const updatedBoard = await Board.findByIdAndUpdate(req.params.id, { title, backgroundColor, textColor }, { new: true });
    res.json(updatedBoard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao editar o quadro' });
  }
});

router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Board.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Quadro removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover o quadro' });
  }
});

// Nova rota para marcar um quadro como favorito
router.put('/:id/favorite', ensureAuthenticated, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    board.favorite = !board.favorite; // Alterna o estado de favorito
    await board.save();
    res.json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao marcar o quadro como favorito' });
  }
});

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const boards = await Board.find({ createdBy: req.user._id });
    res.json(boards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar quadros' });
  }
});

module.exports = router;
