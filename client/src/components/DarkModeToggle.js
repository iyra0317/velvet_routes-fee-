import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button 
      className="dark-mode-toggle" 
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
    >
      {darkMode ? <FaSun className="icon" /> : <FaMoon className="icon" />}
    </button>
  );
};

export default DarkModeToggle;
