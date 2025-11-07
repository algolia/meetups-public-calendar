import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook to navigate to new URL when calendar date changes
 * @param {object} options - Configuration options
 * @param {boolean} options.fullscreen - Whether to navigate to fullscreen mode
 * @returns {Function} Handler that updates the URL
 */
function useDateNavigation({ fullscreen = false } = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (dateInfo) => {
      const year = dateInfo.view.currentStart.getFullYear();
      const month = dateInfo.view.currentStart.getMonth() + 1;
      const suffix = fullscreen ? '/fullscreen' : '';
      const newUrl = `/${year}/${month}${suffix}`;

      // Only navigate if URL actually changes
      if (location.pathname == newUrl) {
        return;
      }
      navigate(newUrl);
    },
    [fullscreen, navigate, location],
  );
}

export default useDateNavigation;
