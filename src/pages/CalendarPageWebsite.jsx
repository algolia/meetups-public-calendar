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
  const displayDate = getDisplayDate(year, month);
  const dateNavigation = useDateNavigation();

  // Date as YYYY-MM-DD for FullCalendar initialDate
  const initialDate = dayjs(
    `${displayDate.year}-${displayDate.month}-01`,
  ).format('YYYY-MM-DD');

  // Calculate current month URL
  const now = dayjs();
  const currentMonthUrl = `/${now.year()}/${now.month() + 1}`;

  return (
    <div className="website-wrapper flex h-screen flex-col items-center p-1 md:p-4">
      <Link
        to={currentMonthUrl}
        className="mb-1 text-center text-2xl font-bold text-white transition-colors hover:text-blue-400 md:mb-2 md:text-4xl"
      >
        <h1>Algolia Meetups Calendar</h1>
      </Link>
      <div className="calendar-container w-full flex-1 rounded-xl bg-slate-800 p-1 md:p-4">
        <div className="calendar-wrapper m-auto h-full">
          <Calendar
            key={`${displayDate.year}-${displayDate.month}`}
            displayDate={displayDate}
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'next',
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

export default CalendarPageWebsite;
