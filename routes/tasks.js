const express = require('express');
const router = express.Router();
const server = require('../server');

// GET all tasks
router.get('/', (req, res) => {
  res.json(server.tasks);
});

// GET single task by ID
router.get('/:id', (req, res) => {
  const task = server.tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST create new task
router.post('/', (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: server.getNextId(),
    title,
    description: description || '',
    completed: false
  };

  server.tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update task
router.put('/:id', (req, res) => {
  const task = server.tasks.find(t => t.id === parseInt(req.params.id));

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, completed } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// DELETE task
router.delete('/:id', (req, res) => {
  const index = server.tasks.findIndex(t => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = server.tasks.splice(index, 1)[0];
  res.json(deletedTask);
});

module.exports = router;
