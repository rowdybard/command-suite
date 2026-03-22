import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, UserPlus, Plus, Download } from 'lucide-react';
import EventCard from './components/EventCard';
import AddStaffModal from './components/AddStaffModal';
import QuickEditModal from './components/QuickEditModal';
import Analytics from './components/Analytics';
import NewEventModal from './components/NewEventModal';
import FilterBar from './components/FilterBar';
import ExportModal from './components/ExportModal';
import NotificationBanner from './components/NotificationBanner';
import MonthlyHeatmap from './components/MonthlyHeatmap';
import { findConflicts } from './utils/conflictEngine';
import { useDispatchStore } from './hooks/useDispatchStore';
import { useDragScroll } from './hooks/useDragScroll';

function App() {
  const {
    brands,
    staff: staffDb,
    vehicles: vehiclesDb,
    events,
    setBrands,
    setStaff: setStaffDb,
    setVehicles: setVehiclesDb,
    setEvents
  } = useDispatchStore();

  useDragScroll();

  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [quickEditEvent, setQuickEditEvent] = useState(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);

  const conflicts = findConflicts(events, staffDb, vehiclesDb);

  let todaysEvents = events
    .filter(event => event.date === currentDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (searchQuery) {
    todaysEvents = todaysEvents.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedBrands.length > 0) {
    todaysEvents = todaysEvents.filter(event => selectedBrands.includes(event.brandId));
  }

  if (showUnassignedOnly) {
    todaysEvents = todaysEvents.filter(event => 
      (event.assignedStaffIds || []).length === 0 && 
      (event.assignedVehicleIds || []).length === 0
    );
  }

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
    const vehicleId = e.dataTransfer.getData('vehicleId');
    const sourceEventId = e.dataTransfer.getData('sourceEventId');

    if (!staffId && !vehicleId) return;

    setEvents(prevEvents => {
      let updatedEvents = [...prevEvents];

      if (staffId) {
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
      }

      if (vehicleId) {
        if (sourceEventId) {
          updatedEvents = updatedEvents.map(event => {
            if (event.id === sourceEventId) {
              return {
                ...event,
                assignedVehicleIds: (event.assignedVehicleIds || []).filter(id => id !== vehicleId)
              };
            }
            return event;
          });
        }

        updatedEvents = updatedEvents.map(event => {
          if (event.id === targetEventId) {
            const currentVehicles = event.assignedVehicleIds || [];
            if (!currentVehicles.includes(vehicleId)) {
              return {
                ...event,
                assignedVehicleIds: [...currentVehicles, vehicleId]
              };
            }
          }
          return event;
        });
      }

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

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === editingEvent.id ? { ...eventData, id: event.id } : event
        )
      );
      setEditingEvent(null);
    } else {
      const newEvent = {
        ...eventData,
        id: `event-${Date.now()}`,
        assignedStaffIds: eventData.assignedStaffIds || [],
        assignedVehicleIds: eventData.assignedVehicleIds || []
      };
      setEvents([...events, newEvent]);
    }
    setIsEventFormOpen(false);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
    }
  };

  const handleBrandToggle = (brandId) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
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
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <div className="flex-shrink-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dispatch Hub</h1>
              <p className="text-xs text-gray-600 hidden md:block">Cross-Brand Resource Allocation</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => changeDate(-1)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  className="px-3 py-1.5 border-2 border-gray-300 rounded-lg font-semibold text-sm text-center focus:outline-none focus:border-blue-500"
                />
                <span className="text-sm font-bold text-gray-900 hidden lg:inline">
                  {formatDisplayDate(currentDate)}
                </span>
              </div>

              <button
                onClick={() => changeDate(1)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                title="Export Data"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Export</span>
              </button>
              <button
                onClick={() => setIsAddStaffModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                title="Add Temp Worker"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden md:inline">Staff</span>
              </button>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setIsEventFormOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Event</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        <Analytics
          events={events}
          staffDb={staffDb}
          conflicts={conflicts}
          currentDate={currentDate}
        />

        {showNotificationBanner && conflicts.size > 0 && (
          <NotificationBanner
            conflicts={conflicts}
            events={events}
            staffDb={staffDb}
            onDismiss={() => setShowNotificationBanner(false)}
          />
        )}

        <MonthlyHeatmap
          currentDate={currentDate}
          onDateSelect={setCurrentDate}
          events={events}
          brands={brands}
          conflicts={conflicts}
        />

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedBrands={selectedBrands}
          onBrandToggle={handleBrandToggle}
          brands={brands}
          showUnassignedOnly={showUnassignedOnly}
          onToggleUnassigned={() => setShowUnassignedOnly(!showUnassignedOnly)}
        />

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
                (event.assignedStaffIds || []).includes(staff.id)
              );
              const assignedVehicles = vehiclesDb.filter(vehicle =>
                (event.assignedVehicleIds || []).includes(vehicle.id)
              );
              const conflictedIds = conflicts.get(event.id) || new Set();
              const conflictedStaffIds = new Set([...conflictedIds].filter(id => id.startsWith('staff-')));
              const conflictedVehicleIds = new Set([...conflictedIds].filter(id => id.startsWith('vehicle-')));

              return (
                <EventCard
                  key={event.id}
                  event={event}
                  brand={brand}
                  assignedStaff={assignedStaff}
                  assignedVehicles={assignedVehicles}
                  conflictedStaffIds={conflictedStaffIds}
                  conflictedVehicleIds={conflictedVehicleIds}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onOpenQuickEdit={setQuickEditEvent}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
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

      <NewEventModal
        isOpen={isEventFormOpen}
        onClose={() => {
          setIsEventFormOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        event={editingEvent}
        brands={brands}
        allStaff={staffDb}
        allVehicles={vehiclesDb}
        allEvents={events}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        events={events}
        staffDb={staffDb}
        brands={brands}
        currentDate={currentDate}
      />
    </div>
  );
}

export default App;
