import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import { translations } from '../../utils/translations'
import './Footer.css';

export default function Footer() {
  const { language } = useTheme();
  const t = translations[language].footer;

  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} Space Explorer. {t.rights}
        </p>
        <p className="footer-powered">
          {t.poweredBy}
        </p>
      </div>
    </footer>
  );
}
