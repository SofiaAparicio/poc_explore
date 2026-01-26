import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Ensure app-like behavior - prevent browser UI from showing
(function() {
  // Prevent context menu for app-like feel
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  
  // Prevent pull-to-refresh
  let lastTouchY = 0;
  document.addEventListener('touchstart', (e) => {
    lastTouchY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchDeltaY = touchY - lastTouchY;
    
    // Prevent pull-to-refresh when scrolling up from top
    if (window.scrollY === 0 && touchDeltaY > 0) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Prevent zoom on double tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd < 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
  
  // Hide address bar on mobile by scrolling
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
  });
  
  // Prevent scrolling beyond bounds
  document.body.addEventListener('touchmove', (e) => {
    const target = e.target;
    const scrollable = target.closest('[data-scrollable]');
    
    if (!scrollable) {
      // Prevent default scrolling on body
      if (window.scrollY === 0 && e.touches[0].clientY > lastTouchY) {
        e.preventDefault();
      }
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight && 
          e.touches[0].clientY < lastTouchY) {
        e.preventDefault();
      }
    }
  }, { passive: false });
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
