import { Router} from 'express';
// import type { Request, Response } from 'express';
import Task from '../models/Task.js';

const router = Router();

// GET /api/tasks - Listar tareas activas
// POST /api/tasks - Crear tarea
// PUT /api/tasks/:id - Actualizar tarea
// DELETE /api/tasks/:id - Eliminar tarea
router.get('/',           async (_req, res) => {
  const tasks = await Task.findAll({ where: { deletedAt: null } });
  res.json(tasks);
});

router.post('/',          async (req, res) => {
  const { title, dueDate } = req.body;
  const task = await Task.create({ title, dueDate });
  res.status(201).json(task);
});

router.put('/:id',        async (req, res) => {
  const { title, done, dueDate } = req.body;
  await Task.update({ title, done, dueDate }, { where: { id: req.params.id } });
  const updatedTask = await Task.findByPk(req.params.id);
  res.json(updatedTask);
});

router.delete('/:id',     async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.json({ message: 'deleted' });
});

// Get /api/tasks/completed - Listar tareas completadas
router.get('/completed',  async (_req, res) => {
  const tasks = await Task.findAll({ where: { done: true } });
  res.json(tasks);
});


export default router;