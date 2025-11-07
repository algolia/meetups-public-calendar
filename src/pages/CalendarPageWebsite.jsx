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
    <>
      <h1 className="mb-8 text-center text-4xl font-bold">
        Algolia Meetups Calendar
      </h1>
      <div className="w-full max-w-7xl rounded-xl bg-slate-800 p-8 shadow-2xl">
        <Calendar displayMode="website" displayDate={displayDate} />
      </div>
    </>
  );
};

export default CalendarPageWebsite;
