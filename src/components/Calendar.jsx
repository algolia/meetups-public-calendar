import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { getMeetups } from '../services/algolia';
import EventModal from './EventModal';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchMeetups = async (startDate, endDate) => {
    try {
      setLoading(true);
      const startTimestamp = Math.floor(startDate.getTime() / 1000);
      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      const meetups = await getMeetups(startTimestamp, endTimestamp);

      const formattedEvents = meetups
        .filter((meetup) => {
          if (!meetup.startDate) {
            return false;
          }
          return true;
        })
        .map((meetup) => {
          // Convert Unix timestamp to date (YYYY-MM-DD only, no time)
          const eventStartDate = new Date(meetup.startDate * 1000)
            .toISOString()
            .split('T')[0];

          return {
            id: meetup.objectID,
            title: meetup.name || 'Meetup',
            start: eventStartDate,
            url: meetup.url,
            extendedProps: {
              imageUrl: meetup.pictureMain?.url || '',
              location: meetup.location || '',
              description: meetup.description || '',
              startTime: meetup.startDate,
              endTime: meetup.endDate,
            },
          };
        });

      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      console.error('Error loading meetups:', err);
      setError('Failed to load meetups. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDatesSet = (dateInfo) => {
    fetchMeetups(dateInfo.start, dateInfo.end);
  };

  const handleEventClick = (info) => {
    info.jsEvent.preventDefault();
    setSelectedEvent(info.event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const renderEventContent = (eventInfo) => {
    const { imageUrl } = eventInfo.event.extendedProps;

    if (imageUrl) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <img
            src={imageUrl}
            alt={eventInfo.event.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '4px',
            }}
          />
        </div>
      );
    }

    return <div>{eventInfo.event.title}</div>;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#8b92b8' }}>
        Loading meetups...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
        {error}
      </div>
    );
  }

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        datesSet={handleDatesSet}
        headerToolbar={{
          left: 'today',
          center: 'title',
          right: 'prev,next',
        }}
        firstDay={1}
        hiddenDays={[0, 6]}
        fixedWeekCount={false}
        height="auto"
        contentHeight="auto"
        eventDisplay="block"
      />
      <EventModal event={selectedEvent} onClose={handleCloseModal} />
    </>
  );
};

export default Calendar;
