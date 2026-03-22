import { useState } from 'react';
import { X, Download, FileText, Calendar } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, events, staffDb, brands, currentDate }) {
  const [exportType, setExportType] = useState('daily');
  const [format, setFormat] = useState('csv');

  const generateCSV = (data) => {
    const headers = ['Event', 'Brand', 'Date', 'Start Time', 'End Time', 'Location', 'Assigned Staff'];
    const rows = data.map(event => {
      const brand = brands.find(b => b.id === event.brandId);
      const staff = event.assignedStaffIds
        .map(id => staffDb.find(s => s.id === id)?.name)
        .filter(Boolean)
        .join('; ');
      
      return [
        event.title,
        brand?.name || 'Unknown',
        event.date,
        event.startTime,
        event.endTime,
        event.location,
        staff || 'None'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  };

  const generateJSON = (data) => {
    return JSON.stringify(data.map(event => ({
      ...event,
      brand: brands.find(b => b.id === event.brandId)?.name,
      staff: event.assignedStaffIds.map(id => staffDb.find(s => s.id === id)?.name).filter(Boolean)
    })), null, 2);
  };

  const handleExport = () => {
    let data = events;
    let filename = 'dispatch-hub-export';

    if (exportType === 'daily') {
      data = events.filter(e => e.date === currentDate);
      filename = `dispatch-hub-${currentDate}`;
    }

    const content = format === 'csv' ? generateCSV(data) : generateJSON(data);
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Export Data</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Export Scope
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setExportType('daily')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  exportType === 'daily'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Today's Schedule</div>
                    <div className="text-sm text-gray-600">Export events for {currentDate}</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setExportType('all')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  exportType === 'all'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">All Events</div>
                    <div className="text-sm text-gray-600">Export complete event database</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                  format === 'csv'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                CSV
              </button>
              <button
                onClick={() => setFormat('json')}
                className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                  format === 'json'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                JSON
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
