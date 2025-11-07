import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Calendar from '../components/Calendar.jsx';
import useEscapeKey from '../hooks/useEscapeKey.js';
import useDateNavigation from '../hooks/useDateNavigation.js';
import { getDisplayDate } from '../helpers/dateHelpers.js';

/**
 * Calendar page in fullscreen mode - no header, no navigation buttons
 * Exit with Escape key or browser back button
 * @returns {JSX.Element} Fullscreen calendar page
 */
const CalendarPageFullscreen = () => {
  const { year, month } = useParams();
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const displayDate = getDisplayDate(year, month);
  const dateNavigation = useDateNavigation({ fullscreen: true });

  // Exit fullscreen
  const handleExitFullscreen = useCallback(() => {
    navigate(`/${displayDate.year}/${displayDate.month}`);
  }, [displayDate, navigate]);
  useEscapeKey(handleExitFullscreen);

  // Force square display
  const setSquare = useSetSquare(calendarRef);
  useResizeListeners(setSquare);

  // Called when calendar dates change (including first render)
  const onDateChange = useCallback(
    (dateInfo) => {
      dateNavigation(dateInfo);
      setSquare();
    },
    [dateNavigation, setSquare],
  );

  // Date as YYYY-MM-DD for FullCalendar initialDate
  const initialDate = dayjs(
    `${displayDate.year}-${displayDate.month}-01`,
  ).format('YYYY-MM-DD');

  return (
    <div className="fullscreen-wrapper h-screen bg-slate-800 p-8">
      {/* Exit fullscreen button - transparent by default, visible on hover */}
      <button
        onClick={handleExitFullscreen}
        className="absolute top-4 right-4 z-10 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white/20 p-4 text-3xl leading-none text-white opacity-0 transition-opacity hover:opacity-100"
        aria-label="Exit fullscreen mode"
      >
        ×
      </button>
      <div className="calendar-wrapper m-auto h-full">
        <Calendar
          ref={calendarRef}
          displayDate={displayDate}
          headerToolbar={{
            left: '',
            center: 'title',
            right: '',
          }}
          height="100%"
          initialDate={initialDate}
          datesSet={onDateChange}
        />
      </div>
    </div>
  );
};

/**
 * Custom hook to resize calendar to make cells square
 * @param {object} calendarRef - Ref to the FullCalendar component
 * @returns {Function} Function to resize calendar to square cells
 */
function useSetSquare(calendarRef) {
  return useCallback(() => {
    if (!calendarRef.current) return;
    const api = calendarRef.current.getApi();
    const day = api.el.querySelector('.fc-daygrid-day');

    // We get the height of one day, and we define the width as 5 * height
    const dayHeight = day.offsetHeight;
    const calendarWidth = 5 * dayHeight;
    const wrapper = document.querySelector('.calendar-wrapper');

    wrapper.style.width = `${calendarWidth}px`;
    api.render();
  }, [calendarRef]);
}

/**
 * Custom hook to listen to window resize and fullscreen change events
 * @param {Function} callback - Callback function to call on resize/fullscreen change
 */
function useResizeListeners(callback) {
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

export default CalendarPageFullscreen;
