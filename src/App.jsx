import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CalendarPageWebsite from './pages/CalendarPageWebsite.jsx';
import CalendarPageFullscreen from './pages/CalendarPageFullscreen.jsx';

/**
 * Main app component with React Router setup
 * Routes:
 * - / : Current month, website mode
 * - /:year/:month : Specific month, website mode
 * - /:year/:month/fullscreen : Specific month, fullscreen mode
 * @returns {JSX.Element} App with router
 */
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CalendarPageWebsite />} />
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
