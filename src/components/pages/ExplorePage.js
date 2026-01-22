import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { translations } from '../../utils/translations';
import { nasaAPI } from '../../services/api';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import './ExplorePage.css';


export default function ExplorePage() {
  const { language } = useTheme();
  const t = translations[language].explore;
  
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        setLoading(true);
        const data = await nasaAPI.getAPOD();
        setApod(data);
        
        // Session Storage
        sessionStorage.setItem('lastAPOD', JSON.stringify(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Check session storage first
    const cachedAPOD = sessionStorage.getItem('lastAPOD');
    if (cachedAPOD) {
      setApod(JSON.parse(cachedAPOD));
      setLoading(false);
    } else {
      fetchAPOD();
    }
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  if (loading) {
    return <Loading text={t.loading} />;
  }

  if (error) {
    return (
      <div className="explore-page">
        <div className="error-message">
          <h2>{t.error}</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="explore-page">
      <div className="explore-container">
        <h1 className="explore-title">{t.title}</h1>
        
        {apod && (
          <div className="apod-section">
            <h2 className="apod-title">{t.apodTitle}</h2>
            <Card className="apod-card" onClick={openModal}>
              {apod.media_type === 'image' ? (
                <img src={apod.url} alt={apod.title} />
              ) : (
                <iframe
                  src={apod.url}
                  title={apod.title}
                  allowFullScreen
                  className="apod-video"
                />
              )}
              <h3>{apod.title}</h3>
              <p className="apod-date">{apod.date}</p>
              <button className="details-button">{t.showDetails}</button>
            </Card>
          </div>
        )}

        <Modal 
          isOpen={modalOpen} 
          onClose={closeModal}
          title={apod?.title}
        >
          {apod && (
            <>
              {apod.media_type === 'image' && (
                <img src={apod.hdurl || apod.url} alt={apod.title} />
              )}
              <h3>{apod.title}</h3>
              <p className="modal-date">{apod.date}</p>
              <p>{apod.explanation}</p>
              {apod.copyright && (
                <p className="copyright">© {apod.copyright}</p>
              )}
            </>
          )}
        </Modal>
      </div>
    </div>
  )
}
