import { forwardRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayjs from 'dayjs';
import { getMeetups } from '../services/algolia';
import EventModal from './EventModal.jsx';
import Image from './Image.jsx';

/**
 * Calendar component that displays Algolia meetups
 * @param {object} props - Component props
 * @param {{year: number, month: number}} props.displayDate - Current date to display
 * @param {object} props...rest - All other props are passed directly to FullCalendar
 * @param {object} ref - Ref forwarded to FullCalendar component
 * @returns {JSX.Element} Calendar element
 */
const Calendar = forwardRef(({ displayDate, ...props }, ref) => {
  const meetups = useMeetups(displayDate);
  const { focusedEvent, onEventClick, onModalClose } = useEventModal();

  if (!displayDate) {
    return null;
  }

  return (
    <>
      <FullCalendar
        ref={ref}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        firstDay={1}
        hiddenDays={[0, 6]}
        fixedWeekCount={false}
        events={meetups}
        eventClick={onEventClick}
        eventContent={renderEventContent}
        {...props}
      />
      <EventModal event={focusedEvent} onClose={onModalClose} />
    </>
  );
});

Calendar.displayName = 'Calendar';

/**
 * Custom hook to fetch meetups from Algolia based on displayDate
 * Automatically re-fetches when displayDate changes
 * @param {{year: number, month: number}} displayDate - Current display date
 * @returns {Array} Formatted events for FullCalendar
 */
function useMeetups(displayDate) {
  const [returnedMeetups, setReturnedMeetups] = useState([]);

  // Fetch meetups only when displayDate changes and update events accordingly
  useEffect(() => {
    (async () => {
      const start = dayjs(
        `${displayDate.year}-${displayDate.month}-01`,
      ).startOf('month');
      const end = start.endOf('month');

      // Fetch meetups from Algolia
      const meetups = await getMeetups(start.unix(), end.unix());

      // Format meetups for FullCalendar
      const formattedEvents = meetups.map((meetup) => {
        const eventStartDate = dayjs
          .unix(meetup.startDate)
          .format('YYYY-MM-DD');

        return {
          id: meetup.objectID,
          title: meetup.name,
          start: eventStartDate,
          extendedProps: meetup,
        };
      });

      setReturnedMeetups(formattedEvents);
    })();
  }, [displayDate.year, displayDate.month]);

  return returnedMeetups;
}

/**
 * Custom hook to manage event modal state
 * @returns {object} Modal state and handlers
 */
function useEventModal() {
  const [focusedEvent, setFocusedEvent] = useState(null);

  return {
    focusedEvent,
    onEventClick(info) {
      setFocusedEvent(info.event);
    },
    onModalClose() {
      setFocusedEvent(null);
    },
  };
}

/**
 * Render custom content for calendar events (image or title)
 * @param {object} eventInfo - FullCalendar event info
 * @returns {JSX.Element} Event content to display
 */
function renderEventContent(eventInfo) {
  const pictureMain = eventInfo.event.extendedProps.pictureMain;
  const imageUrl = pictureMain?.url;
  const lqipUrl = pictureMain?.lqip;

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        lqip={lqipUrl}
        alt={eventInfo.event.title}
        className="h-full w-full object-cover"
      />
    );
  }

  return <div>{eventInfo.event.title}</div>;
}

export default Calendar;
