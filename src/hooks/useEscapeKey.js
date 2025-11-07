import { useEffect } from 'react';

/**
 * Hook that listens for the Escape key press and calls the provided callback
 * @param {Function} callback - Function to call when Escape is pressed
 */
const useEscapeKey = (callback) => {
  useEffect(() => {
    /**
     * Handle keydown event and trigger callback on Escape
     * @param {KeyboardEvent} event - Keyboard event
     */
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback]);
};

export default useEscapeKey;
