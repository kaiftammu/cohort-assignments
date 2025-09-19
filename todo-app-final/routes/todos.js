const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// get all todos for user
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// create todo
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const todo = await Todo.create({ title, description, user: req.user.id });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// update todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Not found' });
    if (todo.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const { title, description, completed } = req.body;
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (typeof completed === 'boolean') todo.completed = completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Not found' });
    if (todo.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await todo.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// toggle completed
router.patch('/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Not found' });
    if (todo.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
