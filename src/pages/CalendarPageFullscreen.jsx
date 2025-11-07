import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Calendar from '../components/Calendar.jsx';
import useEscapeKey from '../hooks/useEscapeKey.js';
import { getDisplayDate } from '../helpers/dateHelpers.js';

/**
 * Calendar page in fullscreen mode - no header, no navigation buttons
 * Exit with Escape key or browser back button
 * @returns {JSX.Element} Fullscreen calendar page
 */
const CalendarPageFullscreen = () => {
  const { year, month } = useParams();
  const navigate = useNavigate();
  const displayDate = getDisplayDate(year, month);

  /**
   * Handle exiting fullscreen mode - navigates back to website mode
   */
  const handleExitFullscreen = useCallback(() => {
    navigate(`/${displayDate.year}/${displayDate.month}`);
  }, [displayDate, navigate]);

  // Listen for Escape key to exit fullscreen
  useEscapeKey(handleExitFullscreen);

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
      <Calendar displayMode="fullscreen" displayDate={displayDate} />
    </div>
  );
};

export default CalendarPageFullscreen;
