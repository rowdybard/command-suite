import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, UserPlus, Users } from 'lucide-react';
import EventCard from './components/EventCard';
import AddStaffModal from './components/AddStaffModal';
import QuickEditModal from './components/QuickEditModal';
import { findConflicts } from './utils/conflictEngine';
import {
  getInitialBrands,
  getInitialStaff,
  getInitialEvents,
  saveBrands,
  saveStaff,
  saveEvents
} from './utils/storage';

function App() {
  const [brands, setBrands] = useState(getInitialBrands());
  const [staffDb, setStaffDb] = useState(getInitialStaff());
  const [events, setEvents] = useState(getInitialEvents());
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [quickEditEvent, setQuickEditEvent] = useState(null);

  useEffect(() => {
    saveBrands(brands);
  }, [brands]);

  useEffect(() => {
    saveStaff(staffDb);
  }, [staffDb]);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const conflicts = findConflicts(events, staffDb);

  const todaysEvents = events
    .filter(event => event.date === currentDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleAddStaff = (name) => {
    const newStaff = {
      id: `staff-${Date.now()}`,
      name
    };
    setStaffDb([...staffDb, newStaff]);
  };

  const handleDrop = (e, targetEventId) => {
    e.preventDefault();
    const staffId = e.dataTransfer.getData('staffId');
    const sourceEventId = e.dataTransfer.getData('sourceEventId');

    if (!staffId) return;

    setEvents(prevEvents => {
      let updatedEvents = [...prevEvents];

      if (sourceEventId) {
        updatedEvents = updatedEvents.map(event => {
          if (event.id === sourceEventId) {
            return {
              ...event,
              assignedStaffIds: event.assignedStaffIds.filter(id => id !== staffId)
            };
          }
          return event;
        });
      }

      updatedEvents = updatedEvents.map(event => {
        if (event.id === targetEventId) {
          if (!event.assignedStaffIds.includes(staffId)) {
            return {
              ...event,
              assignedStaffIds: [...event.assignedStaffIds, staffId]
            };
          }
        }
        return event;
      });

      return updatedEvents;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleToggleStaff = (eventId, staffId) => {
    setEvents(prevEvents =>
      prevEvents.map(event => {
        if (event.id === eventId) {
          const isAssigned = event.assignedStaffIds.includes(staffId);
          return {
            ...event,
            assignedStaffIds: isAssigned
              ? event.assignedStaffIds.filter(id => id !== staffId)
              : [...event.assignedStaffIds, staffId]
          };
        }
        return event;
      })
    );
  };

  const changeDate = (days) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';

    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dispatch Hub</h1>
              <p className="text-sm text-gray-600">Cross-Brand Resource Allocation</p>
            </div>
            <button
              onClick={() => setIsAddStaffModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Temp Worker</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex-1 flex items-center justify-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-center focus:outline-none focus:border-blue-500"
              />
              <span className="text-lg font-bold text-gray-900 hidden md:inline">
                {formatDisplayDate(currentDate)}
              </span>
            </div>

            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 bg-white rounded-lg border-2 border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Available Staff ({staffDb.length})</h2>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Desktop: Drag staff to event cards • Mobile: Use Quick Edit button on cards
          </div>
        </div>

        {todaysEvents.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Events Scheduled</h3>
            <p className="text-gray-500">No events found for {formatDisplayDate(currentDate)}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wide">
              Daily Agenda ({todaysEvents.length} Events)
            </h2>
            {todaysEvents.map(event => {
              const brand = brands.find(b => b.id === event.brandId);
              const assignedStaff = staffDb.filter(staff => 
                event.assignedStaffIds.includes(staff.id)
              );
              const conflictedStaffIds = conflicts.get(event.id) || new Set();

              return (
                <EventCard
                  key={event.id}
                  event={event}
                  brand={brand}
                  assignedStaff={assignedStaff}
                  conflictedStaffIds={conflictedStaffIds}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onOpenQuickEdit={setQuickEditEvent}
                />
              );
            })}
          </div>
        )}
      </main>

      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onAddStaff={handleAddStaff}
      />

      {quickEditEvent && (
        <QuickEditModal
          isOpen={!!quickEditEvent}
          onClose={() => setQuickEditEvent(null)}
          event={quickEditEvent}
          brand={brands.find(b => b.id === quickEditEvent.brandId)}
          allStaff={staffDb}
          onToggleStaff={handleToggleStaff}
          conflictedStaffIds={conflicts.get(quickEditEvent.id) || new Set()}
        />
      )}
    </div>
  );
}

export default App;
