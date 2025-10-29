import { useEffect, useState } from 'react';

const EventModal = ({ event, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset expanded state when event changes (modal reopens)
  useEffect(() => {
    setIsExpanded(false);
  }, [event]);

  if (!event) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const formatDateTime = () => {
    if (!event.extendedProps.startDate) return '';

    // Timestamp is already in Paris time, treat as UTC and display directly
    const startDate = new Date(event.extendedProps.startDate * 1000);
    const endDate = event.extendedProps.endDate
      ? new Date(event.extendedProps.endDate * 1000)
      : null;

    // Format date using UTC methods (to avoid timezone conversion)
    const month = startDate.toLocaleDateString('en-US', {
      month: 'long',
      timeZone: 'UTC',
    });

    const day = startDate.getUTCDate();
    const year = startDate.getUTCFullYear();

    // Format start time using UTC methods
    const startTime = startDate
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
      })
      .toLowerCase();

    let dateTimeString = `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;

    if (endDate) {
      const endTime = endDate
        .toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: 'UTC',
        })
        .toLowerCase();
      dateTimeString += `, from ${startTime} to ${endTime}`;
    } else {
      dateTimeString += `, at ${startTime}`;
    }

    return dateTimeString;
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-layout">
          {event.extendedProps.pictureMain?.url && (
            <div className="modal-image">
              <img
                src={event.extendedProps.pictureMain.url}
                alt={event.title}
              />
            </div>
          )}

          <div className="modal-metadata">
            <h2>{event.title}</h2>

            {event.extendedProps.startDate && (
              <div className="modal-datetime">{formatDateTime()}</div>
            )}

            {event.extendedProps.url && (
              <a
                href={event.extendedProps.url}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-link"
              >
                {event.extendedProps.url}
              </a>
            )}
          </div>

          {event.extendedProps.description && (
            <div className="modal-description">
              <div
                className={`modal-description-text ${
                  isExpanded ? '' : 'collapsed'
                }`}
              >
                <p>{event.extendedProps.description}</p>
              </div>
              {event.extendedProps.description.length > 300 && (
                <button
                  className="modal-read-more"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? '↑ Show less ↑' : '↓ Show more ↓'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
