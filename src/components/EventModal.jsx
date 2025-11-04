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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8"
      onClick={handleBackdropClick}
    >
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-slate-800 shadow-2xl">
        <button
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-3xl leading-none text-white transition-colors hover:bg-white/30"
          onClick={onClose}
        >
          ×
        </button>

        <div className="grid gap-0 md:grid-cols-[350px_1fr]">
          {event.extendedProps.pictureMain?.url && (
            <div className="flex min-h-[200px] items-center justify-center overflow-hidden bg-slate-950 md:col-start-1 md:row-start-1 md:min-h-0">
              <img
                src={event.extendedProps.pictureMain.url}
                alt={event.title}
                className="h-full w-full object-contain"
              />
            </div>
          )}

          <div className="flex flex-col p-8 md:col-start-2 md:row-start-1">
            <h2 className="mb-4 text-4xl leading-tight font-bold">
              {event.title}
            </h2>

            <div className="mb-4 text-lg text-slate-400">
              {formatDateTime()}
            </div>

            {event.extendedProps.url && (
              <a
                href={event.extendedProps.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg break-all text-blue-400 transition-colors hover:text-blue-300 hover:underline"
              >
                {event.extendedProps.url}
              </a>
            )}
          </div>

          {event.extendedProps.description && (
            <div className="p-8 pt-0 md:col-span-2 md:row-start-2">
              <div className="relative rounded-lg bg-white/5 p-6 leading-relaxed whitespace-pre-wrap text-slate-400">
                <div
                  className={`relative transition-all ${
                    isExpanded
                      ? 'max-h-[300px] overflow-y-auto'
                      : 'max-h-[120px] overflow-hidden'
                  }`}
                >
                  <p className="m-0">{event.extendedProps.description}</p>
                </div>
                {event.extendedProps.description.length > 300 && (
                  <button
                    className="sticky bottom-4 z-10 mx-auto mt-4 block rounded border border-blue-400 bg-slate-800/98 px-4 py-2 text-blue-400 transition-all hover:bg-blue-400 hover:text-white"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? '↑ Show less ↑' : '↓ Show more ↓'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
