import { useState } from 'react';
import type { Task } from '../api';

interface Props {
  tasks: Task[];
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function Calendar({ tasks }: Props) {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year  = current.getFullYear();
  const month = current.getMonth();

  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  const tasksByDate: Record<string, Task[]> = {};
  tasks.forEach(task => {
    if (task.dueDate) {
      if (!tasksByDate[task.dueDate]) tasksByDate[task.dueDate] = [];
      tasksByDate[task.dueDate].push(task);
    }
  });

  const pad = (n: number) => String(n).padStart(2, '0');

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prev}>‹</button>
        <span>{MONTHS[month]} {year}</span>
        <button onClick={next}>›</button>
      </div>

      <div className="calendar-grid">
        {DAYS.map(d => (
          <div key={d} className="calendar-day-name">{d}</div>
        ))}

        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="calendar-cell empty" />;

          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
          const dayTasks = tasksByDate[dateStr] || [];
          const isToday  =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div key={dateStr} className={`calendar-cell ${isToday ? 'today' : ''}`}>
              <span className="day-number">{day}</span>
              {dayTasks.slice(0, 2).map(t => (
                <div key={t.id} className={`cal-task ${t.done ? 'done' : ''}`}>
                  {t.title}
                </div>
              ))}
              {dayTasks.length > 2 && (
                <div className="cal-more">+{dayTasks.length - 2} más</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}