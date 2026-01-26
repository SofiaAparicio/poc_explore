import { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { getSavedExperiences, removeSavedExperience } from '../utils/storage';
import { calculateDistance, formatDistance, USER_LOCATION } from '../utils/distance';
import './SavedCardsOverlay.css';

const SavedCardsOverlay = ({ isOpen, onClose, onShowOnMap }) => {
  const [savedExperiences, setSavedExperiences] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const saved = getSavedExperiences();
      setSavedExperiences(saved);
    }
  }, [isOpen]);

  const handleRemove = (experienceId) => {
    removeSavedExperience(experienceId);
    const updated = getSavedExperiences();
    setSavedExperiences(updated);
    if (updated.length === 0) {
      onClose();
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star empty" />);
    }
    return stars;
  };

  const getDistance = (experience) => {
    const distance = calculateDistance(
      USER_LOCATION.lat,
      USER_LOCATION.lng,
      experience.location.lat,
      experience.location.lng
    );
    return formatDistance(distance);
  };

  if (!isOpen || savedExperiences.length === 0) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="saved-cards-backdrop" onClick={onClose} />
      
      {/* Cards Container */}
      <div className="saved-cards-container">
        {/* Close button */}
        <button className="saved-cards-close" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Card Counter */}
        <div className="saved-cards-counter">
          {savedExperiences.length} {savedExperiences.length === 1 ? 'saved' : 'saved'}
          {savedExperiences.length > 0 && onShowOnMap && (
            <button 
              className="show-on-map-button-overlay"
              onClick={() => {
                onShowOnMap();
                onClose();
              }}
            >
              🗺️ Show on Map
            </button>
          )}
        </div>

        {/* Horizontal Cards Slider */}
        <div className="saved-cards-slider">
          {savedExperiences.map((experience) => (
            <div key={experience.id} className="saved-card">
              <div className="saved-card-image">
                <img src={experience.image} alt={experience.title} />
                <button
                  className="saved-card-remove"
                  onClick={() => handleRemove(experience.id)}
                  aria-label="Remove from saved"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="saved-card-content">
                <div className="saved-card-header">
                  <h3 className="saved-card-title">{experience.title}</h3>
                  <div className="saved-card-rating-badge">
                    {experience.rating}
                  </div>
                </div>
                
                <div className="saved-card-meta">
                  <div className="saved-card-distance">
                    <FaMapMarkerAlt /> {getDistance(experience)} · London
                  </div>
                  <div className="saved-card-category-price">
                    {experience.category}
                    {experience.priceRange && ` · ${experience.priceRange}`}
                  </div>
                </div>
                
                <div className="saved-card-stars">
                  {renderStars(experience.rating)}
                  <span className="saved-card-review-count">
                    ({experience.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                
                <p className="saved-card-description">{experience.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SavedCardsOverlay;

