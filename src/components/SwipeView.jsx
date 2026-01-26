import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ExperienceCard from './ExperienceCard';
import { saveExperience, getSavedExperiences, isExperienceSaved } from '../utils/storage';
import './SwipeView.css';

const SwipeView = ({ experiences, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingExperiences, setRemainingExperiences] = useState(experiences);
  const [savedCount, setSavedCount] = useState(0);
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    // Load saved count and IDs from localStorage
    const saved = getSavedExperiences();
    setSavedCount(saved.length);
    setSavedIds(new Set(saved.map(e => e.id)));
  }, []);

  // Update saved count whenever we save an experience
  useEffect(() => {
    const saved = getSavedExperiences();
    setSavedCount(saved.length);
    setSavedIds(new Set(saved.map(e => e.id)));
  }, [currentIndex]);

  const handleSwipeLeft = () => {
    if (currentIndex < remainingExperiences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All cards swiped
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  const handleSwipeRight = () => {
    const currentExperience = remainingExperiences[currentIndex];
    
    // Save to localStorage (persists even when going back)
    saveExperience(currentExperience);
    
    // Update saved count from localStorage to ensure accuracy
    const saved = getSavedExperiences();
    setSavedCount(saved.length);
    setSavedIds(new Set(saved.map(e => e.id)));

    // Move to next card
    if (currentIndex < remainingExperiences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All cards swiped
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  const visibleCards = remainingExperiences.slice(currentIndex, currentIndex + 3);

  if (remainingExperiences.length === 0 || currentIndex >= remainingExperiences.length) {
    return (
      <div className="swipe-view">
        <div className="swipe-header">
          <button onClick={onClose} className="back-button">
            ← Back
          </button>
        </div>
        <div className="swipe-complete">
          <h2>All done! 🎉</h2>
          <p>You've explored all available experiences.</p>
          <p className="saved-count">Saved: {savedCount} experiences</p>
          <button onClick={onClose} className="close-button">Back to Feed</button>
        </div>
      </div>
    );
  }

  return (
    <div className="swipe-view">
      <div className="swipe-header">
        <button onClick={onClose} className="back-button">
          ← Back
        </button>
        <div className="progress-info">
          <span className="progress-text">
            {currentIndex + 1} / {remainingExperiences.length}
          </span>
          {savedCount > 0 && (
            <span className="saved-badge" title={`${savedCount} experiences saved`}>
              💾 {savedCount}
            </span>
          )}
        </div>
      </div>

      <div className="swipe-content">
        <h2 className="swipe-section-title">Travel mode</h2>
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

      <div className="swipe-actions">
        <button 
          className="action-button skip-button"
          onClick={handleSwipeLeft}
          aria-label="Skip"
        >
          <span>✕</span>
          <span>Skip</span>
        </button>
        <button 
          className="action-button save-button"
          onClick={handleSwipeRight}
          aria-label="Save"
        >
          <span>💾</span>
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default SwipeView;

