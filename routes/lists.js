const express = require('express');
const router = express.Router();
const List = require('../models/List');
const Board = require('../models/Board');
const ensureAuthenticated = require('../config/passport');

// Rotas para manipular listas
router.post('/:boardId/lists', ensureAuthenticated, async (req, res) => {
  const { title } = req.body;
  try {
    const board = await Board.findById(req.params.boardId);
    const newList = new List({ title, board: board._id });
    await newList.save();
    board.lists.push(newList);
    await board.save();
    res.status(201).json(newList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar a lista' });
  }
});

router.put('/:id', ensureAuthenticated, async (req, res) => {
  const { title } = req.body;
  try {
    const updatedList = await List.findByIdAndUpdate(req.params.id, { title }, { new: true });
    res.json(updatedList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao editar a lista' });
  }
});

router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Lista removida' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover a lista' });
  }
});

module.exports = router;
