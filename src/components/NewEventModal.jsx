import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Tag, Users, Truck, Lock, AlertCircle } from 'lucide-react';
import { checkResourceAvailability } from '../utils/conflictEngine';

export default function NewEventModal({ 
  isOpen, 
  onClose, 
  onSave, 
  event, 
  brands, 
  allStaff, 
  allVehicles, 
  allEvents 
}) {
  const [formData, setFormData] = useState({
    brandId: '',
    date: new Date().toISOString().split('T')[0],
    title: '',
    startTime: '09:00',
    endTime: '17:00',
    location: '',
    assignedStaffIds: [],
    assignedVehicleIds: []
  });

  const [availability, setAvailability] = useState({
    unavailableStaff: new Set(),
    unavailableVehicles: new Set()
  });

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        assignedStaffIds: event.assignedStaffIds || [],
        assignedVehicleIds: event.assignedVehicleIds || []
      });
    } else {
      setFormData({
        brandId: brands[0]?.id || '',
        date: new Date().toISOString().split('T')[0],
        title: '',
        startTime: '09:00',
        endTime: '17:00',
        location: '',
        assignedStaffIds: [],
        assignedVehicleIds: []
      });
    }
  }, [event, brands, isOpen]);

  useEffect(() => {
    if (formData.date && formData.startTime && formData.endTime) {
      const result = checkResourceAvailability(
        allEvents,
        formData.date,
        formData.startTime,
        formData.endTime,
        event?.id
      );
      setAvailability(result);
    }
  }, [formData.date, formData.startTime, formData.endTime, allEvents, event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.brandId && formData.location) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleStaff = (staffId) => {
    if (availability.unavailableStaff.has(staffId)) return;
    
    setFormData(prev => ({
      ...prev,
      assignedStaffIds: prev.assignedStaffIds.includes(staffId)
        ? prev.assignedStaffIds.filter(id => id !== staffId)
        : [...prev.assignedStaffIds, staffId]
    }));
  };

  const toggleVehicle = (vehicleId) => {
    if (availability.unavailableVehicles.has(vehicleId)) return;
    
    setFormData(prev => ({
      ...prev,
      assignedVehicleIds: prev.assignedVehicleIds.includes(vehicleId)
        ? prev.assignedVehicleIds.filter(id => id !== vehicleId)
        : [...prev.assignedVehicleIds, vehicleId]
    }));
  };

  if (!isOpen) return null;

  const selectedBrand = brands.find(b => b.id === formData.brandId);
  const hasUnavailableResources = availability.unavailableStaff.size > 0 || availability.unavailableVehicles.size > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {event ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {hasUnavailableResources && (
            <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-yellow-900 mb-1">Resource Conflicts Detected</div>
                  <div className="text-sm text-yellow-800">
                    Some staff or vehicles are unavailable during this time slot. They are locked and cannot be selected.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Tag className="w-4 h-4" />
                  Brand / Division
                </label>
                <select
                  value={formData.brandId}
                  onChange={(e) => handleChange('brandId', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-semibold"
                  required
                >
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {selectedBrand && (
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 rounded text-sm font-bold border ${selectedBrand.badge}`}>
                      {selectedBrand.name}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Event 4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Location D"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                required
              />
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Assign Crew</h3>
                <span className="text-sm text-gray-600">
                  ({formData.assignedStaffIds.length} selected)
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {allStaff.map(staff => {
                  const isSelected = formData.assignedStaffIds.includes(staff.id);
                  const isUnavailable = availability.unavailableStaff.has(staff.id);
                  
                  return (
                    <button
                      key={staff.id}
                      type="button"
                      onClick={() => toggleStaff(staff.id)}
                      disabled={isUnavailable}
                      className={`
                        p-4 rounded-lg border-2 font-semibold text-left transition-all relative
                        ${isUnavailable
                          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                          : isSelected
                            ? 'bg-blue-600 border-blue-700 text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{staff.name}</span>
                        {isUnavailable && (
                          <Lock className="w-4 h-4 text-red-500" />
                        )}
                        {isSelected && !isUnavailable && (
                          <span className="text-xl">✓</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Assign Vehicles</h3>
                <span className="text-sm text-gray-600">
                  ({formData.assignedVehicleIds.length} selected)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {allVehicles.map(vehicle => {
                  const isSelected = formData.assignedVehicleIds.includes(vehicle.id);
                  const isUnavailable = availability.unavailableVehicles.has(vehicle.id);
                  
                  return (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => toggleVehicle(vehicle.id)}
                      disabled={isUnavailable}
                      className={`
                        p-4 rounded-lg border-2 font-semibold text-left transition-all relative
                        ${isUnavailable
                          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                          : isSelected
                            ? 'bg-purple-600 border-purple-700 text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-purple-400'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span>{vehicle.name}</span>
                        {isUnavailable && (
                          <Lock className="w-4 h-4 text-red-500" />
                        )}
                        {isSelected && !isUnavailable && (
                          <span className="text-xl">✓</span>
                        )}
                      </div>
                      <div className="text-xs opacity-75">{vehicle.type}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 mt-6 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
