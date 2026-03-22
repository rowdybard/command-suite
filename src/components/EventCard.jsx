import { MapPin, Clock, Edit3, AlertTriangle } from 'lucide-react';
import StaffPill from './StaffPill';

export default function EventCard({ 
  event, 
  brand, 
  assignedStaff, 
  conflictedStaffIds,
  onDrop, 
  onDragOver,
  onRemoveStaff,
  onOpenQuickEdit
}) {
  const hasConflicts = conflictedStaffIds.size > 0;

  return (
    <div
      onDrop={(e) => onDrop(e, event.id)}
      onDragOver={onDragOver}
      className={`
        bg-white rounded-lg border-2 p-4 mb-4 transition-all
        ${hasConflicts 
          ? 'border-red-500 conflict-pulse' 
          : `border-l-4 ${brand.color.split(' ')[1]}`
        }
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-1 rounded text-xs font-bold border ${brand.badge}`}>
              {brand.name}
            </span>
            {hasConflicts && (
              <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-900 rounded text-xs font-bold border border-red-500">
                <AlertTriangle className="w-3 h-3" />
                CONFLICT
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
        </div>
        <button
          onClick={() => onOpenQuickEdit(event)}
          className="md:hidden p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Quick Edit"
        >
          <Edit3 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="font-semibold">
            {event.startTime} - {event.endTime}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
      </div>

      <div className="border-t-2 border-gray-200 pt-3">
        <div className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Assigned Staff ({assignedStaff.length})
        </div>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {assignedStaff.length === 0 ? (
            <div className="text-sm text-gray-400 italic py-2">
              Drop staff here or use Quick Edit
            </div>
          ) : (
            assignedStaff.map(staff => (
              <StaffPill
                key={staff.id}
                staff={staff}
                isConflicted={conflictedStaffIds.has(staff.id)}
                onDragStart={(e) => {
                  e.dataTransfer.setData('staffId', staff.id);
                  e.dataTransfer.setData('sourceEventId', event.id);
                }}
                isDraggable={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
