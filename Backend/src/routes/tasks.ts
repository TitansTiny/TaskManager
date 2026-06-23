import { Router } from 'express';
import { Op } from 'sequelize';
import Task from '../models/Task.js';

const router = Router();

// Get all tasks (pending, not deleted)
router.get('/', async (_req, res) => {
  const tasks = await Task.findAll({
    where: { done: false },
    order: [['createdAt', 'DESC']],
  });
  res.json(tasks);
});

// Get completed tasks (not deleted — paranoid already excludes deletedAt)
router.get('/completed', async (_req, res) => {
  const tasks = await Task.findAll({
    where: { done: true },
    order: [['updatedAt', 'DESC']],
  });
  res.json(tasks);
});

// Create a new task
router.post('/', async (req, res) => {
  const { title, dueDate } = req.body;
  const task = await Task.create({ title, dueDate: dueDate || null });
  res.status(201).json(task);
});

// Update a task (title, done, dueDate)
router.put('/:id', async (req, res) => {
  const fields: Record<string, any> = {};
  if (req.body.title   !== undefined) fields.title   = req.body.title;
  if (req.body.done    !== undefined) fields.done    = req.body.done;
  if (req.body.dueDate !== undefined) fields.dueDate = req.body.dueDate || null;

  await Task.update(fields, { where: { id: req.params.id } });
  const updated = await Task.findByPk(req.params.id);
  res.json(updated);
});

// Soft delete a task (paranoid mode)
router.delete('/:id', async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.json({ message: 'deleted' });
});

export default router;