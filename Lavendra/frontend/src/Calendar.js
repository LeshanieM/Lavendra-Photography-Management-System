import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import { getMonth } from './utils';
import CalendarHeader from './components/CalendarHeader';
import Sidebar from './components/CalendarSidebar';
import Month from './components/Month';
import GlobalContext from './context/GlobalContext';
import EventModal from './components/EventModal';

function CalendarApp() {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <React.Fragment>
      {showEventModal && <EventModal />}
      
      <div className="d-flex flex-column h-100">
        {/* Calendar Header */}
        <CalendarHeader />

        <div className="d-flex flex-grow-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Month Grid */}
          <Month month={currenMonth} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default CalendarApp;
