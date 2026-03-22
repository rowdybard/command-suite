import { User } from 'lucide-react';

export default function StaffPill({ staff, isConflicted, onDragStart, isDraggable = true }) {
  return (
    <div
      draggable={isDraggable}
      onDragStart={onDragStart}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
        ${isDraggable ? 'cursor-move' : 'cursor-default'}
        ${isConflicted 
          ? 'bg-red-100 text-red-900 border-2 border-red-500 font-bold' 
          : 'bg-gray-100 text-gray-800 border-2 border-gray-300'
        }
        hover:shadow-md transition-shadow
      `}
    >
      <User className="w-3.5 h-3.5" />
      <span>{staff.name}</span>
    </div>
  );
}
