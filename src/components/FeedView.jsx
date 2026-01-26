import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ExperienceCard from './ExperienceCard';
import { getSavedExperiences, saveExperience, isExperienceSaved } from '../utils/storage';
import { calculateDistance, formatDistance, USER_LOCATION } from '../utils/distance';
import './FeedView.css';

const FeedView = ({ experiences, restaurants, onShowMap, onShowSaved, onExploreNearby }) => {
  const [savedExperiences, setSavedExperiences] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [savedIds, setSavedIds] = useState(new Set());
  const [contentTab, setContentTab] = useState('experiences');

  useEffect(() => {
    const saved = getSavedExperiences();
    setSavedExperiences(saved);
    setSavedIds(new Set(saved.map(e => e.id)));
  }, []);

  const currentExperiences = contentTab === 'experiences' ? experiences : restaurants;
  const visibleCards = currentExperiences.slice(currentCardIndex, currentCardIndex + 3);

  const handleSwipeLeft = () => {
    if (currentCardIndex < currentExperiences.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    // Save the current experience
    const currentExperience = currentExperiences[currentCardIndex];
    if (currentExperience) {
      saveExperience(currentExperience);
    }
    
    // Move to next card
    if (currentCardIndex < currentExperiences.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
    
    // Refresh saved list
    const saved = getSavedExperiences();
    setSavedExperiences(saved);
    setSavedIds(new Set(saved.map(e => e.id)));
  };

  const handleExploreNearbyClick = () => {
    onShowMap(); // Go to regular map view with experiences/restaurants tabs
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
    <div className="feed-view">
      {/* Header */}
      <div className="feed-header-new">
        <div className="header-top">
          <h1 className="header-title">Where to?</h1>
          <button className="header-icon-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div className="search-bar">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input 
            type="text" 
            placeholder="Places to go, things to do, hotels..." 
            className="search-input"
          />
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="feed-content">
        {/* Explore nearby section */}
        <div className="explore-nearby-section" onClick={handleExploreNearbyClick}>
          <div className="explore-nearby-content">
            <div className="map-icon-small">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#1a5f3f"/>
              </svg>
            </div>
            <div className="explore-nearby-text">
              <span className="explore-nearby-label">London, UK</span>
            </div>
            <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Travel mode section */}
        <div className="travel-mode-section">
          <h2 className="section-title">Travel mode</h2>
          <div className="card-stack-container">
            <div className="card-stack">
              <AnimatePresence>
                {visibleCards.map((experience, index) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                    index={index}
                    total={visibleCards.length}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    isSaved={savedIds.has(experience.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
          
        {/* Recently viewed / Saved experiences section */}
        {savedExperiences.length > 0 && (
          <div className="recently-viewed-section">
            <h2 className="section-title">Saved Items</h2>
            <div className="saved-list">
              {savedExperiences.slice(0, 5).map((experience) => (
                <div key={experience.id} className="saved-list-item">
                  <img 
                    src={experience.image} 
                    alt={experience.title}
                    className="saved-list-image"
                  />
                  <div className="saved-list-content">
                    <h3 className="saved-list-title">{experience.title}</h3>
                    <p className="saved-list-category">{experience.category}</p>
                    <div className="saved-list-meta">
                      <span className="saved-list-rating">⭐ {experience.rating}</span>
                      <span className="saved-list-distance">📍 {getDistance(experience)}</span>
                    </div>
              </div>
                </div>
          ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedView;
