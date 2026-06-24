import { useEffect, useState, useCallback } from 'react';
import { getTasks, getCompletedTasks} from '../api';
import type { Task } from '../api';
import Calendar from '../components/Calendar';
import TaskItem from '../components/TaskItem';

export default function Dashboard() {
  const [tasks,     setTasks]     = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);
  const [loading,   setLoading]   = useState(true);

  const load = useCallback(async () => {
    const [a, c] = await Promise.all([getTasks(), getCompletedTasks()]);
    setTasks(a.data);
    setCompleted(c.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // All Tasks (Pending + Completed) without duplicates
  const allTasks = [...tasks, ...completed].filter(
    (t, i, arr) => arr.findIndex(x => x.id === t.id) === i
  );

  const todayStr = (() => {
  const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  // Pending Tasks 
  const upcoming = tasks
  .filter(t => !t.dueDate || t.dueDate >= todayStr)
  .slice(0, 5);

  const overdue = tasks.filter(t => t.dueDate && t.dueDate < todayStr);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{tasks.length}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat-card">
          <span className="stat-number-completed">{completed.length}</span>
          <span className="stat-label">Completadas</span>
        </div>
        <div className="stat-card danger">
          <span className="stat-number">{overdue.length}</span>
          <span className="stat-label">Vencidas</span>
        </div>
      </div>

      <Calendar tasks={allTasks} />

      {upcoming.length > 0 && (
        <div className="dashboard-tasks">
          <h2>Próximas pendientes</h2>
          <ul className="task-list">
            {upcoming.map(t => (
              <TaskItem key={t.id} task={t} onRefresh={load} />
            ))}
          </ul>
        </div>
      )}

      {overdue.length > 0 && (
        <div className="dashboard-tasks">
          <h2 style={{ color: 'var(--danger)' }}>Vencidas</h2>
          <ul className="task-list">
            {overdue.map(t => (
              <TaskItem key={t.id} task={t} onRefresh={load} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}