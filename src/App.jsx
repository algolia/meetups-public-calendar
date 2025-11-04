import Calendar from './components/Calendar.jsx';

const App = () => {
  return (
    <>
      <h1 className="mb-8 text-center text-4xl font-bold">
        Algolia Meetups Calendar
      </h1>
      <div className="w-full max-w-7xl rounded-xl bg-slate-800 p-8 shadow-2xl">
        <Calendar />
      </div>
    </>
  );
};

export default App;
