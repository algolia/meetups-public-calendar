import { useCallback, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { getMeetups } from '../services/algolia';
import EventModal from './EventModal.jsx';

const Calendar = () => {
  const [monthEvents, setMonthEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const lastFetchedRange = useRef(null);

  const handleDatesSet = useCallback(async (dateInfo) => {
    const startTimestamp = Math.floor(dateInfo.start.getTime() / 1000);
    const endTimestamp = Math.floor(dateInfo.end.getTime() / 1000);
    const rangeKey = `${startTimestamp}-${endTimestamp}`;

    if (lastFetchedRange.current === rangeKey) {
      return;
    }

    lastFetchedRange.current = rangeKey;

    const meetups = await getMeetups(startTimestamp, endTimestamp);

    const formattedEvents = meetups.map((meetup) => {
      // Convert Unix timestamp to date (YYYY-MM-DD only, no time)
      const eventStartDate = new Date(meetup.startDate * 1000)
        .toISOString()
        .split('T')[0];

      return {
        id: meetup.objectID,
        title: meetup.name,
        start: eventStartDate,
        extendedProps: meetup,
      };
    });

    setMonthEvents(formattedEvents);
  }, []);

  const handleEventClick = useCallback((info) => {
    setSelectedEvent(info.event);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const renderEventContent = useCallback((eventInfo) => {
    const imageUrl = eventInfo.event.extendedProps.pictureMain?.url;

    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={eventInfo.event.title}
          className="h-full w-full object-contain"
        />
      );
    }

    return <div>{eventInfo.event.title}</div>;
  }, []);

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        firstDay={1}
        hiddenDays={[0, 6]}
        headerToolbar={{
          left: 'today',
          center: 'title',
          right: 'prev,next',
        }}
        fixedWeekCount={false}
        height="auto"
        contentHeight="auto"
        eventDisplay="block"
        events={monthEvents}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        datesSet={handleDatesSet}
      />
      <EventModal event={selectedEvent} onClose={handleCloseModal} />
    </>
  );
};

export default Calendar;
