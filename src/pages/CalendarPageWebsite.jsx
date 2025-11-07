import { useParams } from 'react-router-dom';
import Calendar from '../components/Calendar.jsx';
import { getDisplayDate } from '../helpers/dateHelpers.js';

/**
 * Calendar page in website mode - includes header title and wrapper
 * @returns {JSX.Element} Website calendar page
 */
const CalendarPageWebsite = () => {
  const { year, month } = useParams();
  const displayDate = getDisplayDate(year, month);

  return (
    <div className="website-wrapper flex h-screen flex-col items-center p-8">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Algolia Meetups Calendar
      </h1>
      <div className="w-full rounded-xl bg-red-600 bg-slate-800 p-8">
        <Calendar displayMode="website" displayDate={displayDate} />
      </div>
    </div>
  );
};

export default CalendarPageWebsite;
