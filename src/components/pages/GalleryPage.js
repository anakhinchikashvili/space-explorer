
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
    const fetchNASAImages = async () => {
      try {
        setLoading(true);
        
        // Search for space images
        const searchTerms = ['mars rover', 'mars', 'space', 'galaxy'];
        let items = [];
        
        for (const term of searchTerms) {
          try {
            const data = await nasaAPI.searchImages(term, 'image');
            if (data.collection && data.collection.items && data.collection.items.length > 0) {
              items = data.collection.items;
              console.log(`Found images for: ${term}`);
              break;
            }
          } catch (e) {
            console.log(`Search term "${term}" failed, trying next...`);
          }
        }
        
        if (items.length > 0) {
          // Transform data to match our display format
          const formattedPhotos = items.slice(0, 12).map((item, index) => ({
            id: item.data[0].nasa_id || index,
            img_src: item.links?.[0]?.href || '',
            title: item.data[0].title || 'NASA Image',
            description: item.data[0].description || '',
            date: item.data[0].date_created || '',
            photographer: item.data[0].photographer || item.data[0].center || 'NASA'
          }));
          
          setPhotos(formattedPhotos);
          localStorage.setItem('nasaImages', JSON.stringify(formattedPhotos));
        } else {
          setError('No images found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Check local storage first
    const cachedPhotos = localStorage.getItem('nasaImages');
    if (cachedPhotos) {
      setPhotos(JSON.parse(cachedPhotos));
      setLoading(false);
    } else {
      fetchNASAImages();
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
                  alt={photo.title}
                  loading="lazy"
                />
                <div className="photo-info">
                  <p className="photo-camera">{photo.title}</p>
                  <p className="photo-date">{photo.date?.split('T')[0]}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal 
          isOpen={modalOpen} 
          onClose={closeModal}
          title={selectedPhoto?.title}
        >
          {selectedPhoto && (
            <>
              <img src={selectedPhoto.img_src} alt={selectedPhoto.title} />
              <div className="modal-info">
                <p><strong>{t.date}:</strong> {selectedPhoto.date?.split('T')[0]}</p>
                <p><strong>Photographer:</strong> {selectedPhoto.photographer}</p>
                {selectedPhoto.description && (
                  <p className="description">{selectedPhoto.description.substring(0, 300)}...</p>
                )}
              </div>
            </>
          )}
        </Modal>
      </div>
    </div>
  )
}