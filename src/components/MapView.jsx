import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import SavedExperiences from './SavedExperiences';
import { getSavedExperiences } from '../utils/storage';
import { USER_LOCATION } from '../utils/distance';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Custom marker icon with better styling
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [32, 45],
  iconAnchor: [16, 45],
  popupAnchor: [0, -45],
  shadowSize: [45, 45],
  className: 'custom-marker-icon'
});

// Restaurant icon (red marker)
const RestaurantIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FF6B6B" d="M12.5 0C5.596 0 0 5.596 0 12.5c0 8.5 12.5 28.5 12.5 28.5S25 21 25 12.5C25 5.596 19.404 0 12.5 0z"/>
      <circle fill="white" cx="12.5" cy="12.5" r="5"/>
    </svg>
  `),
  iconSize: [32, 45],
  iconAnchor: [16, 45],
  popupAnchor: [0, -45],
  shadowUrl: iconShadow,
  shadowSize: [45, 45],
  className: 'restaurant-marker-icon'
});

// User location icon (red circle)
const UserLocationIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#f44336" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
  className: 'user-location-icon'
});

const MapView = ({ experiences, restaurants = [], showSavedOnly = false, onExploreClick, onBackToFeed }) => {
  const londonCenter = [USER_LOCATION.lat, USER_LOCATION.lng];
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [activeTab, setActiveTab] = useState('experiences');
  const [selectedRestaurantFilters, setSelectedRestaurantFilters] = useState([]);

  // Get saved experiences from storage
  const savedExperiences = useMemo(() => {
    return getSavedExperiences();
  }, [showSavedDrawer]);

  // Filter markers based on showSavedOnly flag and active tab
  const displayedExperiences = useMemo(() => {
    if (showSavedOnly) {
      const savedIds = new Set(savedExperiences.map(exp => exp.id));
      return experiences.filter(exp => savedIds.has(exp.id));
    }
    return activeTab === 'experiences' ? experiences : [];
  }, [experiences, showSavedOnly, savedExperiences, activeTab]);

  const displayedRestaurants = useMemo(() => {
    if (showSavedOnly) {
      const savedIds = new Set(savedExperiences.map(exp => exp.id));
      return restaurants.filter(rest => savedIds.has(rest.id));
    }
    if (activeTab !== 'restaurants') return [];

    // Filter by selected categories if any are selected
    if (selectedRestaurantFilters.length > 0) {
      return restaurants.filter(rest =>
        selectedRestaurantFilters.includes(rest.category)
      );
    }

    return restaurants;
  }, [restaurants, showSavedOnly, savedExperiences, activeTab, selectedRestaurantFilters]);

  useEffect(() => {
    // Update saved count when component mounts or drawer closes
    const saved = getSavedExperiences();
    setSavedCount(saved.length);
  }, [showSavedDrawer]);

  // Reset restaurant filters when switching tabs
  useEffect(() => {
    if (activeTab !== 'restaurants') {
      setSelectedRestaurantFilters([]);
    }
  }, [activeTab]);

  const handleShowSaved = () => {
    // Refresh saved count before opening
    const saved = getSavedExperiences();
    setSavedCount(saved.length);
    setShowSavedDrawer(true);
  };

  const handleCloseSaved = () => {
    setShowSavedDrawer(false);
    // Refresh saved count after closing
    const saved = getSavedExperiences();
    setSavedCount(saved.length);
  };

  const handleRestaurantFilterClick = (category) => {
    setSelectedRestaurantFilters(prev => {
      if (prev.includes(category)) {
        // Remove category if already selected
        return prev.filter(cat => cat !== category);
      } else {
        // Add category if not selected
        return [...prev, category];
      }
    });
  };

  return (
    <div className="map-container">
      <MapContainer
        center={londonCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {/* User location marker */}
        <Marker
          position={[USER_LOCATION.lat, USER_LOCATION.lng]}
          icon={UserLocationIcon}
        >
          <Popup>
            <div className="popup-content">
              <h3>Your Location</h3>
            </div>
          </Popup>
        </Marker>
        
        {/* Experience markers */}
        {displayedExperiences.map((experience) => (
          <Marker
            key={experience.id}
            position={[experience.location.lat, experience.location.lng]}
            icon={DefaultIcon}
          >
            <Popup>
              <div className="popup-content">
                <h3>{experience.title}</h3>
                <p className="popup-category">{experience.category}</p>
                <p className="popup-rating">⭐ {experience.rating}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Restaurant markers */}
        {displayedRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[restaurant.location.lat, restaurant.location.lng]}
            icon={RestaurantIcon}
          >
            <Popup>
              <div className="popup-content">
                <h3>{restaurant.title}</h3>
                <p className="popup-category">{restaurant.category}</p>
                <p className="popup-rating">⭐ {restaurant.rating}</p>
                {restaurant.priceRange && (
                  <p className="popup-price">{restaurant.priceRange}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="map-overlay">
        <div className="map-header">
          {!showSavedOnly && (
            <div className="map-tabs">
              <button
                className={`map-tab ${activeTab === 'experiences' ? 'active' : ''}`}
                onClick={() => setActiveTab('experiences')}
              >
                Experiences
              </button>
              <button
                className={`map-tab ${activeTab === 'restaurants' ? 'active' : ''}`}
                onClick={() => setActiveTab('restaurants')}
              >
                Restaurants
              </button>
            </div>
          )}
          {showSavedOnly && (
            <>
              {onBackToFeed && (
                <button 
                  onClick={() => {
                    onBackToFeed();
                  }} 
                  className="back-to-feed-button"
                >
                  ← Back
                </button>
              )}
              <h1>My Saved Experiences</h1>
              <p>{`Showing ${displayedExperiences.length + displayedRestaurants.length} saved ${displayedExperiences.length + displayedRestaurants.length === 1 ? 'experience' : 'experiences'}`}</p>
            </>
          )}
        </div>
      </div>
      
      {/* Restaurant Filter Bar */}
      {!showSavedOnly && activeTab === 'restaurants' && (
        <div className="restaurant-filter-bar">
          <div
            className={`filter-item ${selectedRestaurantFilters.includes('Local Food') ? 'active' : ''}`}
            onClick={() => handleRestaurantFilterClick('Local Food')}
          >
            <span className="filter-label">Local Food</span>
          </div>
          <div
            className={`filter-item ${selectedRestaurantFilters.includes('Italian') ? 'active' : ''}`}
            onClick={() => handleRestaurantFilterClick('Italian')}
          >
            <span className="filter-label">Italian</span>
          </div>
          <div
            className={`filter-item ${selectedRestaurantFilters.includes('Mexican') ? 'active' : ''}`}
            onClick={() => handleRestaurantFilterClick('Mexican')}
          >
            <span className="filter-label">Mexican</span>
          </div>
          <div
            className={`filter-item ${selectedRestaurantFilters.includes('Chinese') ? 'active' : ''}`}
            onClick={() => handleRestaurantFilterClick('Chinese')}
          >
            <span className="filter-label">Chinese</span>
          </div>
          <div
            className={`filter-item ${selectedRestaurantFilters.includes('Indian') ? 'active' : ''}`}
            onClick={() => handleRestaurantFilterClick('Indian')}
          >
            <span className="filter-label">Indian</span>
          </div>
          <div
            className={`filter-item ${selectedRestaurantFilters.includes('Japanese') ? 'active' : ''}`}
            onClick={() => handleRestaurantFilterClick('Japanese')}
          >
            <span className="filter-label">Japanese</span>
          </div>
          <div
            className={`filter-item ${selectedRestaurantFilters.includes('Mediterranean') ? 'active' : ''}`}
            onClick={() => handleRestaurantFilterClick('Mediterranean')}
          >
            <span className="filter-label">Mediterranean</span>
          </div>
          <div
            className={`filter-item ${selectedRestaurantFilters.includes('American') ? 'active' : ''}`}
            onClick={() => handleRestaurantFilterClick('American')}
          >
            <span className="filter-label">American</span>
          </div>
          <div
            className={`filter-item ${selectedRestaurantFilters.includes('wine bar') ? 'active' : ''}`}
            onClick={() => handleRestaurantFilterClick('wine bar')}
          >
            <span className="filter-label">wine bar</span>
          </div>
        </div>
      )}
      
      <SavedExperiences 
        isOpen={showSavedDrawer}
        onClose={handleCloseSaved}
      />
    </div>
  );
};

export default MapView;

