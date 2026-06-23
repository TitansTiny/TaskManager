import { useEffect, useState } from 'react';
import { getTasks, createTask } from '../api';
import type { Task } from '../api';
import TaskItem from '../components/TaskItem';

export default function Tasks() {
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [input,   setInput]   = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await getTasks();
    setTasks(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!input.trim()) return;
    await createTask(input.trim(), dueDate || undefined);
    setInput('');
    setDueDate('');
    load();
  };

  return (
    <div className="page">
      <h1>Tareas</h1>

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
        <button className="btn-primary" onClick={handleCreate}>Agregar</button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : tasks.length === 0 ? (
        <p className="empty-state">No hay tareas pendientes.</p>
      ) : (
        <ul className="task-list">
          {tasks.map(t => (
            <TaskItem key={t.id} task={t} onRefresh={load} />
          ))}
        </ul>
      )}
    </div>
  );
}