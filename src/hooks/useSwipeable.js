import { useState, useRef, useCallback, useEffect } from 'react';

export const useSwipeable = (onSwipeLeft, onSwipeRight) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const handleStart = useCallback((clientX, clientY) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
    dragOffsetRef.current = { x: 0, y: 0 };
    setDragStart({ x: clientX, y: clientY });
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleMove = useCallback((clientX, clientY) => {
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    dragOffsetRef.current = { x: deltaX, y: deltaY };
    setDragOffset({ x: deltaX, y: deltaY });
  }, []);

  const handleEnd = useCallback(() => {
    const threshold = 80; // Reduced threshold for easier swiping
    const currentOffset = dragOffsetRef.current;
    
    if (Math.abs(currentOffset.x) > threshold) {
      if (currentOffset.x > 0) {
        // Swipe right = Save
        setIsDragging(false);
        onSwipeRight();
      } else {
        // Swipe left = Skip
        setIsDragging(false);
        onSwipeLeft();
      }
    } else {
      // If not enough distance, reset position smoothly
      setIsDragging(false);
      // Reset offset smoothly
      dragOffsetRef.current = { x: 0, y: 0 };
      setDragOffset({ x: 0, y: 0 });
    }
  }, [onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
      handleEnd();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  return {
    cardRef,
    isDragging,
    dragOffset,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    },
  };
};

