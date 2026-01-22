import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { translations } from '../../utils/translations';
import Card from '../common/Card';
import './HomePage.css';


export default function HomePage() {
  const navigate = useNavigate();
  const { language } = useTheme();
  const t = translations[language].home;

  const features = [
    {
      icon: '🌌',
      title: t.feature1Title,
      description: t.feature1Desc
    },
    {
      icon: '🔴',
      title: t.feature2Title,
      description: t.feature2Desc
    },
    {
      icon: '📡',
      title: t.feature3Title,
      description: t.feature3Desc
    }
  ];

  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{t.title}</h1>
          <p className="hero-subtitle">{t.subtitle}</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/explore')}
          >
            {t.cta}
          </button>
        </div>
        <div className="hero-animation">
          <div className="planet"></div>
          <div className="stars"></div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="features-title">{t.featuresTitle}</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
