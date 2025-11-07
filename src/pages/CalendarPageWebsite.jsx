import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const displayDate = getDisplayDate(year, month);
  const dateNavigation = useDateNavigation();

  // Navigate to fullscreen mode
  const goFullscreen = useCallback(() => {
    navigate(`/${displayDate.year}/${displayDate.month}/fullscreen`);
  }, [displayDate, navigate]);

  // Date as YYYY-MM-DD for FullCalendar initialDate
  const initialDate = dayjs(
    `${displayDate.year}-${displayDate.month}-01`,
  ).format('YYYY-MM-DD');

  return (
    <div className="website-wrapper flex h-screen flex-col items-center p-8">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Algolia Meetups Calendar
      </h1>
      <div className="w-full rounded-xl bg-red-600 bg-slate-800 p-8">
        <Calendar
          displayDate={displayDate}
          headerToolbar={{
            left: 'today',
            center: 'title',
            right: 'prev,next fullscreenButton',
          }}
          customButtons={{
            fullscreenButton: {
              text: '⛶',
              hint: 'Fullscreen Display Mode',
              click: goFullscreen,
            },
          }}
          aspectRatio={16 / 9}
          initialDate={initialDate}
          datesSet={dateNavigation}
        />
      </div>
    </div>
  );
};

export default CalendarPageWebsite;
