import { TrendingUp, AlertTriangle, Calendar, Users } from 'lucide-react';

export default function Analytics({ events, staffDb, conflicts, currentDate }) {
  const todaysEvents = events.filter(e => e.date === currentDate);
  const totalConflicts = conflicts.size;
  
  const staffUtilization = staffDb.map(staff => {
    const assignedEvents = todaysEvents.filter(e => 
      e.assignedStaffIds.includes(staff.id)
    );
    const totalHours = assignedEvents.reduce((sum, event) => {
      const [startH, startM] = event.startTime.split(':').map(Number);
      const [endH, endM] = event.endTime.split(':').map(Number);
      const hours = (endH * 60 + endM - startH * 60 - startM) / 60;
      return sum + hours;
    }, 0);
    return { staff, events: assignedEvents.length, hours: totalHours };
  });

  const avgUtilization = staffUtilization.reduce((sum, s) => sum + s.hours, 0) / staffDb.length;
  const utilizationRate = Math.min(100, (avgUtilization / 8) * 100);

  const totalAssignments = todaysEvents.reduce((sum, e) => sum + e.assignedStaffIds.length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <div className="bg-white rounded-lg border-2 border-gray-200 p-3 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-1.5">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Today</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{todaysEvents.length}</div>
        <div className="text-xs text-gray-600">Active Events</div>
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-200 p-3 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-1.5">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Efficiency</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{utilizationRate.toFixed(0)}%</div>
        <div className="text-xs text-gray-600">Staff Utilization</div>
      </div>

      <div className={`bg-white rounded-lg border-2 p-3 hover:shadow-lg transition-shadow ${
        totalConflicts > 0 ? 'border-red-500 bg-red-50' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <div className={`p-1.5 rounded-lg ${totalConflicts > 0 ? 'bg-red-200' : 'bg-yellow-100'}`}>
            <AlertTriangle className={`w-4 h-4 ${totalConflicts > 0 ? 'text-red-700' : 'text-yellow-600'}`} />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Conflicts</span>
        </div>
        <div className={`text-2xl font-bold ${totalConflicts > 0 ? 'text-red-700' : 'text-gray-900'}`}>
          {totalConflicts}
        </div>
        <div className="text-xs text-gray-600">
          {totalConflicts === 0 ? 'All Clear!' : 'Need Attention'}
        </div>
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-200 p-3 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-1.5">
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Assignments</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{totalAssignments}</div>
        <div className="text-xs text-gray-600">Total Staff Slots</div>
      </div>
    </div>
  );
}
