import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import QRCode from 'react-qr-code';
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
  const displayDate = getDisplayDate(year, month);
  const dateNavigation = useDateNavigation({ fullscreen: true });

  // Exit fullscreen
  const handleExitFullscreen = useCallback(() => {
    navigate(`/${displayDate.year}/${displayDate.month}`);
  }, [displayDate, navigate]);
  useEscapeKey(handleExitFullscreen);

  // Date as YYYY-MM-DD for FullCalendar initialDate
  const initialDate = dayjs(
    `${displayDate.year}-${displayDate.month}-01`,
  ).format('YYYY-MM-DD');

  // Get URL for QR code (points to website version, not fullscreen)
  const qrCodeUrl = `https://algolia-meetups-calendar.netlify.app/${displayDate.year}/${displayDate.month}`;

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

      {/* QR Code in bottom right corner */}
      <div className="fixed bottom-4 right-4 z-10 rounded-lg bg-white p-3 shadow-lg">
        <QRCode value={qrCodeUrl} size={128} />
      </div>

      <div className="calendar-container h-full p-0">
        <div className="calendar-wrapper m-auto h-full">
          <Calendar
            displayDate={displayDate}
            headerToolbar={{
              left: '',
              center: 'title',
              right: '',
            }}
            height="100%"
            initialDate={initialDate}
            datesSet={dateNavigation}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPageFullscreen;
