import { useEffect, useState } from 'react';
import { getTasks, getCompletedTasks, createTask, updateTask, deleteTask} from './api';
import type { Task } from './api';
import './App.css';

function App() {
  const [tasks, setTasks]         = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);
  const [input, setInput]         = useState('');
  const [dueDate, setDueDate]     = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText]   = useState('');
  const [editDate, setEditDate]   = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const loadTasks = async () => {
    const [active, done] = await Promise.all([getTasks(), getCompletedTasks()]);
    setTasks(active.data);
    setCompleted(done.data);
  };

  useEffect(() => { loadTasks(); }, []);

  const handleCreate = async () => {
    if (!input.trim()) return;
    await createTask(input.trim(), dueDate || undefined);
    setInput('');
    setDueDate('');
    loadTasks();
  };

  const handleToggleDone = async (task: Task) => {
    await updateTask(task.id, { done: !task.done });
    loadTasks();
  };

  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.title);
    setEditDate(task.dueDate ?? '');
  };

  const handleSaveEdit = async (id: number) => {
    await updateTask(id, { title: editText, dueDate: editDate || undefined });
    setEditingId(null);
    loadTasks();
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setConfirmId(null);
    loadTasks();
  };

  const renderTask = (task: Task) => {
    const isEditing   = editingId === task.id;
    const isConfirm   = confirmId === task.id;
    const isOverdue   = task.dueDate && !task.done && new Date(task.dueDate) < new Date();

    return (
      <li key={task.id} className={task.done ? 'done' : ''}>
        {isEditing ? (
          <div className="edit-row">
            <input value={editText} onChange={e => setEditText(e.target.value)} />
            <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
            <button onClick={() => handleSaveEdit(task.id)}>Guardar</button>
            <button onClick={() => setEditingId(null)}>Cancelar</button>
          </div>
        ) : isConfirm ? (
          <div className="confirm-row">
            <span>¿Eliminar "{task.title}"?</span>
            <button className="danger" onClick={() => handleDelete(task.id)}>Sí, eliminar</button>
            <button onClick={() => setConfirmId(null)}>Cancelar</button>
          </div>
        ) : (
          <div className="task-row">
            <span className="check" onClick={() => handleToggleDone(task)}>
              {task.done ? '✓' : '○'}
            </span>
            <span className="title" onClick={() => handleToggleDone(task)}>
              {task.title}
            </span>
            {task.dueDate && (
              <span className={`due ${isOverdue ? 'overdue' : ''}`}>
                {task.dueDate}
              </span>
            )}
            <button onClick={() => handleStartEdit(task)}>Editar</button>
            <button onClick={() => setConfirmId(task.id)}>✕</button>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <div className="input-row">
        <input
          type="text"
          placeholder="Nueva tarea..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <button onClick={handleCreate}>Agregar</button>
      </div>

      <ul>{tasks.map(renderTask)}</ul>

      <button className="toggle-completed" onClick={() => setShowCompleted(v => !v)}>
        {showCompleted ? 'Ocultar completadas' : `Ver completadas (${completed.length})`}
      </button>

      {showCompleted && (
        <>
          <h2>Completadas</h2>
          <ul>{completed.map(renderTask)}</ul>
        </>
      )}
    </div>
  );
}

export default App;