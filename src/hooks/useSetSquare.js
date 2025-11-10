import { useCallback, useEffect } from 'react';

/**
 * Custom hook to resize calendar to make cells square
 * @param {object} calendarRef - Ref to the FullCalendar component
 * @returns {Function} Function to resize calendar to square cells
 */
export function useSetSquare(calendarRef) {
  return useCallback(() => {
    if (!calendarRef.current) return;
    const api = calendarRef.current.getApi();
    const day = api.el.querySelector('.fc-daygrid-day');

    // Container width (the max available width)
    const container = document.querySelector('.calendar-container');
    const computedStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const paddingRight = parseFloat(computedStyle.paddingRight);
    const maxAvailableWidth =
      container.clientWidth - paddingLeft - paddingRight;

    // Ideal width: The calendar width to have the biggest square days
    const dayHeight = day.offsetHeight;
    const idealWidth = 5 * dayHeight;

    // Actual width: The biggest width we can afford
    const actualWidth = Math.min(idealWidth, maxAvailableWidth);

    // We resize the harness to that width
    const harness = api.el.querySelector('.fc-view-harness');
    harness.style.width = `${actualWidth}px`;

    api.render();
  }, [calendarRef]);
}

/**
 * Custom hook to listen to window resize and fullscreen change events
 * @param {Function} callback - Callback function to call on resize/fullscreen change
 */
export function useResizeListeners(callback) {
  useEffect(() => {
    // Debounced callback to avoid too many calls
    let timeoutId;
    const debouncedCallback = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback();
      }, 100);
    };

    // Listen to all possible fullscreen events (browser compatibility)
    const fullscreenEvents = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange',
    ];

    window.addEventListener('resize', debouncedCallback);
    fullscreenEvents.forEach((event) => {
      document.addEventListener(event, debouncedCallback);
    });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedCallback);
      fullscreenEvents.forEach((event) => {
        document.removeEventListener(event, debouncedCallback);
      });
    };
  }, [callback]);
}
