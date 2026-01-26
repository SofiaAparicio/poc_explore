import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaRegStar, FaTimes } from 'react-icons/fa';
import { getSavedExperiences, removeSavedExperience } from '../utils/storage';
import { calculateDistance, formatDistance, USER_LOCATION } from '../utils/distance';
import './SavedExperiences.css';

const SavedExperiences = ({ isOpen, onClose, onShowOnMap }) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="shelf-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Bottom Drawer */}
          <motion.div
            className="saved-experiences-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Handle bar */}
            <div className="drawer-handle" onClick={onClose}>
              <div className="handle-bar" />
            </div>

            <div className="saved-header">
              <div className="header-content">
                <h1>My Saved Experiences</h1>
                <p className="saved-count">
                  {savedExperiences.length} {savedExperiences.length === 1 ? 'experience' : 'experiences'} saved
                </p>
                {savedExperiences.length > 0 && onShowOnMap && (
                  <button 
                    className="show-on-map-button"
                    onClick={() => {
                      onShowOnMap();
                      onClose();
                    }}
                  >
                    🗺️ Show on Map
                  </button>
                )}
              </div>
            </div>

            {savedExperiences.length === 0 ? (
              <div className="empty-shelf">
                <div className="empty-icon">📚</div>
                <h2>Your shelf is empty</h2>
                <p>Start exploring and swipe right to save experiences you love!</p>
              </div>
            ) : (
              <div className="shelf-container">
                <div className="shelf-grid">
                  {savedExperiences.map((experience) => (
                    <div key={experience.id} className="shelf-card">
                      <div className="shelf-card-image-container">
                        <img 
                          src={experience.image} 
                          alt={experience.title} 
                          className="shelf-card-image"
                        />
                        <button
                          className="remove-button"
                          onClick={() => handleRemove(experience.id)}
                          aria-label="Remove from saved"
                        >
                          <FaTimes />
                        </button>
                        <div className="shelf-card-overlay">
                          <span className="shelf-card-category">{experience.category}</span>
                          {experience.priceRange !== 'Free' && (
                            <span className="shelf-card-price">{experience.priceRange}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="shelf-card-content">
                        <h3 className="shelf-card-title">{experience.title}</h3>
                        
                        <div className="shelf-card-rating">
                          <div className="shelf-stars">
                            {renderStars(experience.rating)}
                          </div>
                          <span className="shelf-rating-value">{experience.rating}</span>
                          <span className="shelf-review-count">
                            ({experience.reviewCount.toLocaleString()})
                          </span>
                        </div>
                        
                        <div className="shelf-card-distance">
                          📍 {getDistance(experience)} away
                        </div>
                        
                        <p className="shelf-card-description">{experience.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SavedExperiences;

