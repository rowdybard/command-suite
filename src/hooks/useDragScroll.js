import { useEffect, useRef } from 'react';

export const useDragScroll = () => {
  const scrollIntervalRef = useRef(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleDragStart = () => {
      isDraggingRef.current = true;
    };

    const handleDragEnd = () => {
      isDraggingRef.current = false;
      if (scrollIntervalRef.current) {
        cancelAnimationFrame(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    const handleDragOver = (e) => {
      if (!isDraggingRef.current) return;

      const scrollThreshold = 100;
      const scrollSpeed = 10;
      const viewportHeight = window.innerHeight;
      const mouseY = e.clientY;

      if (scrollIntervalRef.current) {
        cancelAnimationFrame(scrollIntervalRef.current);
      }

      const scroll = () => {
        if (!isDraggingRef.current) return;

        if (mouseY < scrollThreshold) {
          window.scrollBy(0, -scrollSpeed);
          scrollIntervalRef.current = requestAnimationFrame(scroll);
        } else if (mouseY > viewportHeight - scrollThreshold) {
          window.scrollBy(0, scrollSpeed);
          scrollIntervalRef.current = requestAnimationFrame(scroll);
        }
      };

      if (mouseY < scrollThreshold || mouseY > viewportHeight - scrollThreshold) {
        scroll();
      }
    };

    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('dragover', handleDragOver);

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
      document.removeEventListener('dragover', handleDragOver);
      if (scrollIntervalRef.current) {
        cancelAnimationFrame(scrollIntervalRef.current);
      }
    };
  }, []);
};
