import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { translations } from '../../utils/translations';
import { nasaAPI } from '../../services/api';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import './GalleryPage.css';



export default function GalleryPage() {
  const { language } = useTheme();
  const t = translations[language].gallery;
  
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchMarsPhotos = async () => {
      try {
        setLoading(true);
        
        // Use different dates instead of sols
        const dates = ['2024-01-15', '2023-12-01', '2023-06-15', '2022-01-01'];
        let data;
        
        for (const date of dates) {
          try {
            data = await nasaAPI.getMarsPhotos('curiosity', date);
            if (data.photos && data.photos.length > 0) {
              console.log(`Found photos for date: ${date}`);
              break;
            }
          } catch (e) {
            console.log(`Date ${date} failed, trying next...`);
          }
        }
        
        if (data && data.photos && data.photos.length > 0) {
          setPhotos(data.photos.slice(0, 12));
          localStorage.setItem('marsPhotos', JSON.stringify(data.photos.slice(0, 12)));
        } else {
          setError('No photos found for any date');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Check local storage first
    const cachedPhotos = localStorage.getItem('marsPhotos');
    if (cachedPhotos) {
      setPhotos(JSON.parse(cachedPhotos));
      setLoading(false);
    } else {
      fetchMarsPhotos();
    }
  }, []);

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPhoto(null);
  };

  if (loading) {
    return <Loading text={t.loading || 'Loading...'} />;
  }

  if (error) {
    return (
      <div className="gallery-page">
        <div className="error-message">
          <h2>{t.error || 'Error'}</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-container">
        <h1 className="gallery-title">{t.title}</h1>
        <p className="gallery-subtitle">{t.subtitle}</p>
        
        {photos.length === 0 ? (
          <p className="no-photos">{t.noPhotos}</p>
        ) : (
          <div className="gallery-grid">
            {photos.map((photo) => (
              <Card 
                key={photo.id} 
                className="gallery-card"
                onClick={() => openModal(photo)}
              >
                <img 
                  src={photo.img_src} 
                  alt={`Mars ${photo.camera.full_name}`}
                  loading="lazy"
                />
                <div className="photo-info">
                  <p className="photo-camera">{photo.camera.name}</p>
                  <p className="photo-date">{photo.earth_date}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal 
          isOpen={modalOpen} 
          onClose={closeModal}
          title={selectedPhoto?.camera.full_name}
        >
          {selectedPhoto && (
            <>
              <img src={selectedPhoto.img_src} alt="Mars" />
              <div className="modal-info">
                <p><strong>{t.rover}:</strong> {selectedPhoto.rover.name}</p>
                <p><strong>{t.camera}:</strong> {selectedPhoto.camera.full_name}</p>
                <p><strong>{t.date}:</strong> {selectedPhoto.earth_date}</p>
                <p><strong>Sol:</strong> {selectedPhoto.sol}</p>
              </div>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};