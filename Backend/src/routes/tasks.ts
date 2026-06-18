import { Router} from 'express';
import type { Request, Response } from 'express';
import Task from '../models/Task.js';

const router = Router();

router.get('/',           async (_req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

router.post('/',          async (req, res) => {
  const task = await Task.create({ title: req.body.title });
  res.status(201).json(task);
});

router.put('/:id',        async (req, res) => {
  await Task.update(req.body, { where: { id: req.params.id } });
  res.json({ message: 'updated' });
});

router.delete('/:id',     async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.json({ message: 'deleted' });
});

export default router;