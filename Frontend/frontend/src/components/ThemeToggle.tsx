import { useTheme } from '../context/ThemeContext';
import darkModeIcon from '../assets/icon_dark_mode.png';
import lightModeIcon from '../assets/icon_light_mode.png';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();


  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? <img src={darkModeIcon} alt="Dark Mode" width="30" height="30" /> : <img src={lightModeIcon} alt="Light Mode" width="30" height="30" />}
    </button>
  );
}