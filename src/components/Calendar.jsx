import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayjs from 'dayjs';
import { getMeetups } from '../services/algolia';
import EventModal from './EventModal.jsx';
import Image from './Image.jsx';

/**
 * Calendar component that displays Algolia meetups
 * @param {object} props - Component props
 * @param {string} props.displayMode - "website" or "fullscreen"
 * @param {{year: number, month: number}} props.displayDate - Initial date to display
 * @returns {JSX.Element} Calendar element
 */
const Calendar = ({ displayMode = 'website', displayDate }) => {
  const calendarRef = useRef(null);
  const config = useCalendarConfig(displayMode, displayDate, calendarRef);
  const meetups = useMeetups(displayDate);
  const onDateChange = useDateChange(displayMode);
  const { focusedEvent, onEventClick, onModalClose } = useEventModal();

  if (!displayDate) {
    return null;
  }

  return (
    <div className="calendar-wrapper m-auto h-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        firstDay={1}
        hiddenDays={[0, 6]}
        fixedWeekCount={false}
        events={meetups}
        eventClick={onEventClick}
        eventContent={renderEventContent}
        datesSet={onDateChange}
        {...config}
      />
      <EventModal event={focusedEvent} onClose={onModalClose} />
    </div>
  );
};

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
 * Custom hook to navigate to new URL when calendar date changes
 * @param {string} displayMode - "website" or "fullscreen"
 * @returns {Function} Handler that updates the URL
 */
function useDateChange(displayMode) {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (dateInfo) => {
      const year = dateInfo.view.currentStart.getFullYear();
      const month = dateInfo.view.currentStart.getMonth() + 1;
      const suffix = displayMode === 'fullscreen' ? '/fullscreen' : '';
      const newUrl = `/${year}/${month}${suffix}`;

      // Only navigate if URL actually changes
      if (location.pathname == newUrl) {
        return;
      }
      navigate(newUrl);
    },
    [displayMode, navigate, location],
  );
}

/**
 *
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
 * Custom hook to resize calendar to make cells square
 * @param {object} calendarRef - Ref to the FullCalendar component
 * @returns {Function} Function to resize calendar to square cells
 */
function useSquareResize(calendarRef) {
  return useCallback(() => {
    if (!calendarRef.current) return;

    const api = calendarRef.current.getApi();
    const day = api.el.querySelector('.fc-daygrid-day');
    if (!day) return;

    const dayHeight = day.offsetHeight;
    const calendarWidth = 5 * dayHeight;
    const wrapper = document.querySelector('.calendar-wrapper');
    if (!wrapper) return;

    wrapper.style.width = `${calendarWidth}px`;
    api.render();
  }, [calendarRef]);
}

/**
 * Custom hook to generate FullCalendar configuration based on display mode
 * @param {string} displayMode - "website" or "fullscreen"
 * @param {{year: number, month: number}} displayDate - Current display date
 * @param {object} calendarRef - Ref to the FullCalendar component
 * @returns {{headerToolbar: object, customButtons: object}} FullCalendar config
 */
function useCalendarConfig(displayMode, displayDate, calendarRef) {
  const navigate = useNavigate();

  const fullscreenButtonClick = useCallback(() => {
    navigate(`/${displayDate.year}/${displayDate.month}/fullscreen`);
  }, [displayDate, navigate]);

  const setSquare = useSquareResize(calendarRef);

  // Date as YYYY-MM-DD for FullCalendar initialDate
  const initialDate = dayjs(
    `${displayDate.year}-${displayDate.month}-01`,
  ).format('YYYY-MM-DD');

  const config = {
    website: {
      headerToolbar: {
        left: 'today',
        center: 'title',
        right: 'prev,next fullscreenButton',
      },
      customButtons: {
        fullscreenButton: {
          text: '⛶',
          hint: 'Fullscreen Display Mode',
          click: fullscreenButtonClick,
        },
      },
      aspectRatio: 16 / 9,
      initialDate,
    },
    fullscreen: {
      headerToolbar: {
        left: '',
        center: 'title',
        right: '',
      },
      customButtons: {},
      height: '100%',
      initialDate,
      windowResize: setSquare,
    },
  };

  return config[displayMode];
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
