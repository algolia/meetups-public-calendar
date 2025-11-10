import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import dayjs from 'dayjs';
import CalendarPageWebsite from './pages/CalendarPageWebsite.jsx';
import CalendarPageFullscreen from './pages/CalendarPageFullscreen.jsx';

/**
 * Main app component with React Router setup
 * Routes:
 * - / : Current month, website mode
 * - /:year/:month : Specific month, website mode
 * - /fullscreen : Current month, fullscreen mode (redirects)
 * - /:year/:month/fullscreen : Specific month, fullscreen mode
 * @returns {JSX.Element} App with router
 */
const App = () => {
  const now = dayjs();
  const currentMonthPath = `${now.year()}/${now.month() + 1}`;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CalendarPageWebsite />} />
        <Route
          path="/fullscreen"
          element={<Navigate to={`/${currentMonthPath}/fullscreen`} replace />}
        />
        <Route path="/:year/:month" element={<CalendarPageWebsite />} />
        <Route
          path="/:year/:month/fullscreen"
          element={<CalendarPageFullscreen />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
