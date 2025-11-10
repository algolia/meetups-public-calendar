import { useCallback, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Calendar from '../components/Calendar.jsx';
import { getDisplayDate } from '../helpers/dateHelpers.js';
import useDateNavigation from '../hooks/useDateNavigation.js';

/**
 * Calendar page in website mode - includes header title and wrapper
 * @returns {JSX.Element} Website calendar page
 */
const CalendarPageWebsite = () => {
  const { year, month } = useParams();
  const calendarRef = useRef(null);
  const displayDate = getDisplayDate(year, month);
  const dateNavigation = useDateNavigation();

  // Force square display
  const setSquare = useSetSquare(calendarRef);
  // useResizeListeners(setSquare);

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

  // Calculate current month URL
  const now = dayjs();
  const currentMonthUrl = `/${now.year()}/${now.month() + 1}`;

  return (
    <div className="website-wrapper flex h-screen flex-col items-center p-2 md:p-8">
      <Link
        to={currentMonthUrl}
        className="mb-2 text-center text-2xl font-bold text-white transition-colors hover:text-blue-400 md:mb-8 md:text-4xl"
      >
        <h1>Algolia Meetups Calendar</h1>
      </Link>
      <div className="calendar-container w-full flex-1 rounded-xl bg-slate-800 p-2 md:p-8">
        <div className="calendar-wrapper debug m-auto h-full">
          <Calendar
            ref={calendarRef}
            key={`${displayDate.year}-${displayDate.month}`}
            displayDate={displayDate}
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'next',
            }}
            height="100%"
            initialDate={initialDate}
            datesSet={onDateChange}
          />
        </div>
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
    console.log({
      dayHeight,
      idealWidth,
      maxAvailableWidth,
      actualWidth,
      harness,
    });

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

export default CalendarPageWebsite;
