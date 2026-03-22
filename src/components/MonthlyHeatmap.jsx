import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function MonthlyHeatmap({ 
  currentDate, 
  onDateSelect, 
  events, 
  brands,
  conflicts 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    setViewDate(new Date(currentDate));
  }, [currentDate]);
  
  const [viewDate, setViewDate] = useState(new Date(currentDate));

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeekDays = () => {
    const current = new Date(currentDate);
    const dayOfWeek = current.getDay();
    const startOfWeek = new Date(current);
    startOfWeek.setDate(current.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getMonthDays = () => {
    const current = new Date(currentDate);
    const year = current.getFullYear();
    const month = current.getMonth();
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);

    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = formatDateString(date);
    return events.filter(event => event.date === dateString);
  };

  const hasConflictOnDate = (date) => {
    if (!date) return false;
    const dateString = formatDateString(date);
    const dateEvents = events.filter(event => event.date === dateString);
    return dateEvents.some(event => conflicts.has(event.id));
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    if (!date) return false;
    const selected = new Date(currentDate);
    return date.getDate() === selected.getDate() &&
           date.getMonth() === selected.getMonth() &&
           date.getFullYear() === selected.getFullYear();
  };


  const renderDay = (date) => {
    if (!date) {
      return <div key={Math.random()} className="aspect-square" />;
    }

    const dayEvents = getEventsForDate(date);
    const hasConflict = hasConflictOnDate(date);
    const selected = isSelected(date);
    const today = isToday(date);

    const eventDots = dayEvents.slice(0, 3).map((event, idx) => {
      const brand = brands.find(b => b.id === event.brandId);
      const colorClass = brand?.color.split(' ')[0] || 'bg-gray-500';
      return (
        <div
          key={idx}
          className={`w-1.5 h-1.5 rounded-full ${colorClass}`}
        />
      );
    });

    return (
      <button
        key={date.toISOString()}
        onClick={() => onDateSelect(formatDateString(date))}
        className={`
          aspect-square p-1 border-2 rounded-lg transition-all relative
          ${selected 
            ? 'bg-blue-600 text-white border-blue-700 font-bold shadow-lg scale-105' 
            : today
              ? 'bg-blue-50 border-blue-300 font-semibold'
              : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
          }
          ${hasConflict ? 'ring-2 ring-red-400 ring-offset-1' : ''}
        `}
      >
        <div className="text-xs sm:text-sm font-semibold">
          {date.getDate()}
        </div>
        {dayEvents.length > 0 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            {eventDots}
            {dayEvents.length > 3 && (
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            )}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 mb-4">
      <div className="p-3">
        <div className="flex items-center justify-end mb-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Week</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Month</span>
              </>
            )}
          </button>
        </div>

        {!isExpanded ? (
          <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <div key={idx} className="text-center text-xs font-bold text-gray-500 mb-1">
                {day}
              </div>
            ))}
            {getWeekDays().map(date => renderDay(date))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
              <div key={idx} className="text-center text-xs font-bold text-gray-500 mb-1">
                {day}
              </div>
            ))}
            {getMonthDays().map((date, idx) => renderDay(date))}
          </div>
        )}
      </div>

      <div className="px-3 pb-3 pt-2 flex items-center justify-between gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-blue-700 bg-blue-600" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-gray-200 bg-white ring-2 ring-red-400 ring-offset-1" />
            <span>Has Conflict</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            </div>
            <span>Event Dots</span>
          </div>
        </div>
        
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-300 hover:border-blue-400"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Collapse</span>
          </button>
        )}
      </div>
    </div>
  );
}
