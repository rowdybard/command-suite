import { AlertTriangle, X, Bell } from 'lucide-react';

export default function NotificationBanner({ conflicts, events, staffDb, onDismiss }) {
  if (conflicts.size === 0) return null;

  const conflictDetails = [];
  conflicts.forEach((staffIds, eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      staffIds.forEach(staffId => {
        const staff = staffDb.find(s => s.id === staffId);
        if (staff) {
          conflictDetails.push({ event, staff });
        }
      });
    }
  });

  const uniqueConflicts = conflictDetails.reduce((acc, detail) => {
    const key = `${detail.staff.id}-${detail.event.date}`;
    if (!acc.has(key)) {
      acc.set(key, detail);
    }
    return acc;
  }, new Map());

  return (
    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-200 rounded-lg flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-700" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Scheduling Conflicts Detected
            </h3>
            <button
              onClick={onDismiss}
              className="text-red-700 hover:text-red-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-red-800 mb-3">
            <strong>{uniqueConflicts.size}</strong> staff member(s) are double-booked with overlapping time slots.
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Array.from(uniqueConflicts.values()).slice(0, 5).map((detail, idx) => (
              <div key={idx} className="bg-white rounded p-2 text-sm border border-red-300">
                <span className="font-bold text-red-900">{detail.staff.name}</span>
                <span className="text-gray-600"> has overlapping assignments on </span>
                <span className="font-semibold text-gray-900">{detail.event.date}</span>
              </div>
            ))}
          </div>
          {uniqueConflicts.size > 5 && (
            <div className="mt-2 text-sm text-red-700 font-semibold">
              + {uniqueConflicts.size - 5} more conflicts
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
