import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Task Manager</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>
          Tareas
        </NavLink>
        <NavLink to="/completed" className={({ isActive }) => isActive ? 'active' : ''}>
          Completadas
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle />
      </div>
    </aside>
  );
}