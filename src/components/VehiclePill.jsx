import { Truck } from 'lucide-react';

export default function VehiclePill({ vehicle, isConflicted, onDragStart, isDraggable = true }) {
  return (
    <div
      draggable={isDraggable}
      onDragStart={onDragStart}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
        ${isDraggable ? 'cursor-move' : 'cursor-default'}
        ${isConflicted 
          ? 'bg-red-100 text-red-900 border-2 border-red-500 font-bold' 
          : 'bg-purple-100 text-purple-800 border-2 border-purple-300'
        }
        hover:shadow-md transition-shadow
      `}
    >
      <Truck className="w-3.5 h-3.5" />
      <span>{vehicle.name}</span>
    </div>
  );
}
