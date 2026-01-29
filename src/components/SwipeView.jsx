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
  const [showSwipeHint, setShowSwipeHint] = useState(true);

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
    if (showSwipeHint) {
      setShowSwipeHint(false);
    }
    if (remainingExperiences.length <= 1) {
      setRemainingExperiences([]);
      setTimeout(() => {
        onClose();
      }, 500);
      return;
    }

    setRemainingExperiences(prev => prev.filter((_, idx) => idx !== currentIndex));
    setCurrentIndex(prevIndex => Math.min(prevIndex, remainingExperiences.length - 2));
  };

  const handleSwipeRight = () => {
    if (showSwipeHint) {
      setShowSwipeHint(false);
    }
    const currentExperience = remainingExperiences[currentIndex];
    
    // Save to localStorage (persists even when going back)
    saveExperience(currentExperience);
    
    // Update saved count from localStorage to ensure accuracy
    const saved = getSavedExperiences();
    setSavedCount(saved.length);
    setSavedIds(new Set(saved.map(e => e.id)));

    if (remainingExperiences.length <= 1) {
      setRemainingExperiences([]);
      setTimeout(() => {
        onClose();
      }, 500);
      return;
    }

    setRemainingExperiences(prev => prev.filter((_, idx) => idx !== currentIndex));
    setCurrentIndex(prevIndex => Math.min(prevIndex, remainingExperiences.length - 2));
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
        <h2 className="swipe-section-title">What to do</h2>
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
                showHeartOverlay={false}
                showSwipeHint={showSwipeHint && index === 0}
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

