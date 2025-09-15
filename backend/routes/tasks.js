const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// Get tasks (with optional category filter)
router.get('/', protect, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { userId: req.user.id };
    if (category) filter.category = category;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks.map(t => ({ id: t._id, title: t.title, description: t.description, category: t.category, isDone: t.isDone })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create task
router.post('/', protect, async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const task = new Task({ userId: req.user.id, title, description, category });
    await task.save();
    res.status(201).json({ id: task._id, title, description, category, isDone: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task (mark done)
router.patch('/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { isDone } = req.body;
  try {
    const task = await Task.findOneAndUpdate({ _id: id, userId: req.user.id }, { isDone }, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ id: task._id, title: task.title, category: task.category, isDone: task.isDone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task
router.delete('/:id', protect, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;