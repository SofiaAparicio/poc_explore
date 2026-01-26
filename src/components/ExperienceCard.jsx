import { motion } from 'framer-motion';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useSwipeable } from '../hooks/useSwipeable';
import { calculateDistance, formatDistance, USER_LOCATION } from '../utils/distance';
import './ExperienceCard.css';

const ExperienceCard = ({ experience, onSwipeLeft, onSwipeRight, index, total, isSaved = false }) => {
  const { isDragging, dragOffset, handlers } = useSwipeable(onSwipeLeft, onSwipeRight);

  // Calculate distance from user location
  const distance = calculateDistance(
    USER_LOCATION.lat,
    USER_LOCATION.lng,
    experience.location.lat,
    experience.location.lng
  );
  const distanceText = formatDistance(distance);

  const rotation = dragOffset.x * 0.1; // Reduced rotation for subtler effect
  const opacity = 1 - Math.abs(dragOffset.x) / 500;
  
  // Calculate card offset for overlapping effect
  const cardOffset = index * 8; // Overlap cards by 8px
  
  // Visual feedback colors based on swipe direction
  const getCardStyle = () => {
    if (dragOffset.x > 50) {
      // Swiping right (save) - green tint
      return {
        borderColor: 'rgba(76, 175, 80, 0.3)',
        boxShadow: '0 4px 16px rgba(76, 175, 80, 0.2)',
      };
    } else if (dragOffset.x < -50) {
      // Swiping left (skip) - red tint
      return {
        borderColor: 'rgba(244, 67, 54, 0.3)',
        boxShadow: '0 4px 16px rgba(244, 67, 54, 0.2)',
      };
    }
    return {};
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

  // Extract location name - default to London for now
  const locationName = 'London';

  return (
    <motion.div
      className="experience-card"
      animate={{
        x: dragOffset.x + cardOffset,
        y: dragOffset.y,
        rotate: rotation,
        opacity: isDragging ? opacity : 1,
        scale: 1 - (index * 0.05), // Slightly scale down cards behind
      }}
      style={{
        zIndex: total - index,
        ...getCardStyle(),
      }}
      initial={{ scale: 0.95 - (index * 0.05), opacity: 0, x: cardOffset, y: 0 }}
      exit={{ 
        scale: 0.8, 
        opacity: 0, 
        x: dragOffset.x > 0 ? 500 : -500,
        rotate: dragOffset.x > 0 ? 20 : -20,
      }}
      transition={isDragging ? { type: 'tween', duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
      {...handlers}
    >
      <div className="card-image-container">
        <img src={experience.image} alt={experience.title} className="card-image" />
        {isSaved && (
          <div className="card-heart-overlay">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#4caf50" stroke="#ffffff" strokeWidth="2"/>
            </svg>
          </div>
        )}
        <div className="card-overlay-top">
          <span className="card-location">{locationName}</span>
        </div>
        <div className="card-overlay-bottom">
          <div className="card-info">
            <h3 className="card-title">{experience.title}</h3>
            <div className="card-meta">
              <div className="card-rating">
                <div className="stars">
                  {renderStars(experience.rating)}
                </div>
                <span className="rating-value">{experience.rating}</span>
                <span className="review-count">({experience.reviewCount.toLocaleString()})</span>
              </div>
              <div className="card-details">
                {experience.priceRange !== 'Free' && (
                  <span className="card-price">{experience.priceRange}</span>
                )}
                <span className="card-category">{experience.category}</span>
                <span className="card-distance">📍 {distanceText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExperienceCard;

