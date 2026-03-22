import { X, Users } from 'lucide-react';

export default function QuickEditModal({ isOpen, onClose, event, brand, allStaff, onToggleStaff, conflictedStaffIds }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                <p className="text-sm text-gray-600">
                  {event.startTime} - {event.endTime} • {event.location}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
            Tap to Assign/Unassign Staff
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {allStaff.map(staff => {
              const isAssigned = event.assignedStaffIds.includes(staff.id);
              const isConflicted = conflictedStaffIds.has(staff.id);
              
              return (
                <button
                  key={staff.id}
                  onClick={() => onToggleStaff(event.id, staff.id)}
                  className={`
                    p-4 rounded-lg border-2 font-semibold text-left transition-all
                    ${isAssigned
                      ? isConflicted
                        ? 'bg-red-50 border-red-500 text-red-900'
                        : `${brand.color} text-white`
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{staff.name}</span>
                    {isAssigned && (
                      <span className="text-2xl">✓</span>
                    )}
                  </div>
                  {isConflicted && (
                    <div className="text-xs mt-1 font-bold">⚠️ CONFLICT</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
