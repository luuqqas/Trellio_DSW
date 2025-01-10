const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const List = require('../models/List');
const ensureAuthenticated = require('../config/passport');

// Rotas para manipular cartões
router.post('/:listId/cards', ensureAuthenticated, async (req, res) => {
    const { content } = req.body;
    try {
        const list = await List.findById(req.params.listId);
        const newCard = new Card({ content, list: list._id, createdAt: new Date(), updatedAt: new Date() });
        await newCard.save();
        list.cards.push(newCard);
        await list.save();
        res.status(201).json(newCard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao adicionar o cartão' });
    }
});

router.put('/:id', ensureAuthenticated, async (req, res) => {
    const { content } = req.body;
    try {
        const updatedCard = await Card.findByIdAndUpdate(req.params.id, { content, updatedAt: new Date() }, { new: true });
        res.json(updatedCard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao editar o cartão' });
    }
});

router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Card.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Cartão removido' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao remover o cartão' });
    }
});

router.post('/:id/move', ensureAuthenticated, async (req, res) => {
    const { newListId } = req.body;
    try {
        const card = await Card.findById(req.params.id);
        const currentList = await List.findOne({ cards: card._id });
        const newList = await List.findById(newListId);

        if (currentList && newList) {
            currentList.cards.pull(card);
            await currentList.save();

            newList.cards.push(card);
            await newList.save();

            card.updatedAt = new Date();
            await card.save();

            res.json({ message: 'Cartão movido com sucesso' });
        } else {
            res.status(404).json({ error: 'Lista não encontrada' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao mover o cartão' });
    }
});

module.exports = router;
