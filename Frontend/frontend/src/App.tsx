import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import './App.css';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

function App() {
  const [tasks, setTasks]   = useState<Task[]>([]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasks()
      .then(res => setTasks(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!input.trim()) return;
    const res = await createTask(input.trim());
    setTasks(prev => [...prev, res.data]);
    setInput('');
  };

  const handleToggle = async (task: Task) => {
    await updateTask(task.id, !task.done);
    setTasks(prev =>
      prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t)
    );
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
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
        <button onClick={handleCreate}>Agregar</button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : tasks.length === 0 ? (
        <p>No hay tareas todavía.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id} className={task.done ? 'done' : ''}>
              <span onClick={() => handleToggle(task)}>{task.title}</span>
              <button onClick={() => handleDelete(task.id)}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;