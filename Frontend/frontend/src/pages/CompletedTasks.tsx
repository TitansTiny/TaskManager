import { useEffect, useState } from 'react';
import { getCompletedTasks } from '../api';
import type { Task } from '../api';
import TaskItem from '../components/TaskItem';

export default function Completed() {
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await getCompletedTasks();
    setTasks(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="page">
      <h1>Completadas</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : tasks.length === 0 ? (
        <p className="empty-state">Nada completado todavía.</p>
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