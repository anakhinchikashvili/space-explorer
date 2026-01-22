import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { translations } from '../../utils/translations';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const t = translations[language].nav;

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsOpen(prev => !prev);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <NavLink to="/space-explorer/" className="navbar-logo">
          🚀 Space Explorer
        </NavLink>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <NavLink
            to="/space-explorer/"
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            {t.home}
          </NavLink>

          <NavLink
            to="/explore"
            className={`navbar-link ${isActive('/explore') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            {t.explore}
          </NavLink>

          <NavLink
            to="/gallery"
            className={`navbar-link ${isActive('/gallery') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            {t.gallery}
          </NavLink>
        </div>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            className="lang-toggle"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            {language === 'ka' ? 'EN' : 'ქარ'}
          </button>

          <button
            className="navbar-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

      </div>
    </nav>
  );
}
