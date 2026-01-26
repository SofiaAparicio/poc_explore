import { useState, useEffect } from 'react';
import FeedView from './components/FeedView';
import MapView from './components/MapView';
import SwipeView from './components/SwipeView';
import SavedExperiences from './components/SavedExperiences';
import BottomNav from './components/BottomNav';
import { experiences } from './data/experiences';
import { restaurants } from './data/restaurants';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('feed'); // 'feed', 'map', 'swipe', 'saved'
  const [activeTab, setActiveTab] = useState('explore'); // 'explore', 'nearby', 'trips', 'review', 'account'
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [swipeCategory, setSwipeCategory] = useState('experiences'); // 'experiences' or 'restaurants'
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const handleShowMap = () => {
    setCurrentView('map');
    setShowSavedOnly(false);
  };

  const handleBackToFeed = () => {
    setCurrentView('feed');
    setShowSavedOnly(false);
  };

  const handleShowSaved = () => {
    // Go directly to map view showing only saved experiences
    setCurrentView('map');
    setShowSavedOnly(true);
    setShowSavedDrawer(false); // Don't open drawer, go straight to map
  };

  const handleCloseSaved = () => {
    setShowSavedDrawer(false);
    // Keep showSavedOnly true if we're still on the saved map view
    // Only reset if explicitly going back to feed
  };

  const handleExploreClick = () => {
    setCurrentView('swipe');
    setShowSavedOnly(false);
  };

  const handleExploreNearby = (category = 'experiences') => {
    setSwipeCategory(category);
    setCurrentView('swipe');
    setShowSavedOnly(false);
    // Keep activeTab as 'explore' since swipe is part of explore flow
  };

  const handleCloseSwipeView = () => {
    setCurrentView('feed');
    setShowSavedOnly(false);
    setActiveTab('explore');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Map navigation tabs to views
    if (tab === 'explore') {
      setCurrentView('feed');
      setShowSavedOnly(false);
    } else if (tab === 'nearby') {
      setCurrentView('map');
      setShowSavedOnly(false);
    } else if (tab === 'trips') {
      setCurrentView('map');
      setShowSavedOnly(true);
    }
    // 'review' and 'account' can be handled later - for now keep current view
  };

  // Sync activeTab with currentView
  useEffect(() => {
    if (currentView === 'feed' && activeTab !== 'explore') {
      setActiveTab('explore');
    } else if (currentView === 'map') {
      if (showSavedOnly && activeTab !== 'trips') {
        setActiveTab('trips');
      } else if (!showSavedOnly && activeTab !== 'nearby') {
        setActiveTab('nearby');
      }
    }
  }, [currentView, showSavedOnly]);

  return (
    <div className="app">
      {currentView === 'feed' && (
        <FeedView
          experiences={experiences}
          restaurants={restaurants}
          showSavedOnly={false}
          onShowMap={handleShowMap}
          onShowSaved={handleShowSaved}
          onExploreNearby={handleExploreNearby}
        />
      )}
      {currentView === 'map' && (
        <MapView 
          experiences={experiences}
          restaurants={restaurants}
          showSavedOnly={showSavedOnly}
          onExploreClick={handleExploreClick}
          onBackToFeed={handleBackToFeed}
        />
      )}
      {currentView === 'swipe' && (
        <SwipeView 
          experiences={swipeCategory === 'experiences' ? experiences : restaurants} 
          onClose={handleCloseSwipeView}
        />
      )}
      
      <SavedExperiences 
        isOpen={showSavedDrawer}
        onClose={handleCloseSaved}
        onShowOnMap={() => {
          setCurrentView('map');
          setShowSavedOnly(true);
        }}
      />
      
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
