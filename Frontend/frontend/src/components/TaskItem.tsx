import { useState } from 'react';
import { updateTask, deleteTask } from '../api';
import type { Task } from '../api';

interface Props {
  task: Task;
  onRefresh: () => void;
}

export default function TaskItem({ task, onRefresh }: Props) {
  const [editing,   setEditing]   = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [editText,  setEditText]  = useState(task.title);
  const [editDate,  setEditDate]  = useState(task.dueDate ?? '');

const isOverdue = (() => {
    if (!task.dueDate || task.done) return false;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return task.dueDate < todayStr; // Check if the task's due date is before today
})();

  const handleSave = async () => {
    await updateTask(task.id, { title: editText, dueDate: editDate || undefined });
    setEditing(false);
    onRefresh();
  };

  const handleToggle = async () => {
    await updateTask(task.id, { done: !task.done });
    onRefresh();
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    onRefresh();
  };

  if (editing) return (
    <li className="task-item editing">
      <input
        className="edit-input"
        value={editText}
        onChange={e => setEditText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSave()}
        autoFocus
      />
      <input
        className="edit-date"
        type="date"
        value={editDate}
        onChange={e => setEditDate(e.target.value)}
      />
      <div className="task-actions">
        <button className="btn-save"   onClick={handleSave}>Guardar</button>
        <button className="btn-cancel" onClick={() => setEditing(false)}>Cancelar</button>
      </div>
    </li>
  );

  if (confirming) return (
    <li className="task-item confirming">
      <span className="confirm-text">¿Eliminar "{task.title}"?</span>
      <div className="task-actions">
        <button className="btn-danger"  onClick={handleDelete}>Sí, eliminar</button>
        <button className="btn-cancel"  onClick={() => setConfirming(false)}>Cancelar</button>
      </div>
    </li>
  );

  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      <button className="check-btn" onClick={handleToggle}>
        {task.done ? '✓' : '○'}
      </button>
      <span className="task-title">{task.title}</span>
      {task.dueDate && (
        <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
          {task.dueDate}
        </span>
      )}
      <div className="task-actions">
        <button className="btn-edit"   onClick={() => setEditing(true)}>Editar</button>
        <button className="btn-delete" onClick={() => setConfirming(true)}>✕</button>
      </div>
    </li>
  );
}