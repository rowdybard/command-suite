import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Tag } from 'lucide-react';

export default function EventFormModal({ isOpen, onClose, onSave, event, brands }) {
  const [formData, setFormData] = useState({
    brandId: '',
    date: new Date().toISOString().split('T')[0],
    title: '',
    startTime: '09:00',
    endTime: '17:00',
    location: '',
    assignedStaffIds: []
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        brandId: brands[0]?.id || '',
        date: new Date().toISOString().split('T')[0],
        title: '',
        startTime: '09:00',
        endTime: '17:00',
        location: '',
        assignedStaffIds: []
      });
    }
  }, [event, brands, isOpen]);

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

  if (!isOpen) return null;

  const selectedBrand = brands.find(b => b.id === formData.brandId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              placeholder="e.g., Downtown Festival, Birthday Party"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Central Park"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <div className="flex gap-3 pt-4 border-t">
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
