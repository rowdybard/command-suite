export const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export const checkTemporalOverlap = (startA, endA, startB, endB) => {
  const startAMin = timeToMinutes(startA);
  const endAMin = timeToMinutes(endA);
  const startBMin = timeToMinutes(startB);
  const endBMin = timeToMinutes(endB);
  
  return (startAMin < endBMin) && (endAMin > startBMin);
};

export const findConflicts = (events, staffDb, vehiclesDb) => {
  const conflicts = new Map();
  
  const eventsByDate = events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});
  
  Object.entries(eventsByDate).forEach(([date, dateEvents]) => {
    dateEvents.forEach((eventA, indexA) => {
      dateEvents.slice(indexA + 1).forEach((eventB) => {
        const hasOverlap = checkTemporalOverlap(
          eventA.startTime,
          eventA.endTime,
          eventB.startTime,
          eventB.endTime
        );
        
        if (hasOverlap) {
          const sharedStaff = (eventA.assignedStaffIds || []).filter(staffId =>
            (eventB.assignedStaffIds || []).includes(staffId)
          );
          
          const sharedVehicles = (eventA.assignedVehicleIds || []).filter(vehicleId =>
            (eventB.assignedVehicleIds || []).includes(vehicleId)
          );
          
          if (sharedStaff.length > 0 || sharedVehicles.length > 0) {
            if (!conflicts.has(eventA.id)) {
              conflicts.set(eventA.id, new Set());
            }
            if (!conflicts.has(eventB.id)) {
              conflicts.set(eventB.id, new Set());
            }
            
            sharedStaff.forEach(staffId => {
              conflicts.get(eventA.id).add(staffId);
              conflicts.get(eventB.id).add(staffId);
            });
            
            sharedVehicles.forEach(vehicleId => {
              conflicts.get(eventA.id).add(vehicleId);
              conflicts.get(eventB.id).add(vehicleId);
            });
          }
        }
      });
    });
  });
  
  return conflicts;
};

export const checkResourceAvailability = (events, date, startTime, endTime, excludeEventId = null) => {
  const relevantEvents = events.filter(e => 
    e.date === date && 
    e.id !== excludeEventId &&
    checkTemporalOverlap(e.startTime, e.endTime, startTime, endTime)
  );
  
  const unavailableStaff = new Set();
  const unavailableVehicles = new Set();
  
  relevantEvents.forEach(event => {
    (event.assignedStaffIds || []).forEach(id => unavailableStaff.add(id));
    (event.assignedVehicleIds || []).forEach(id => unavailableVehicles.add(id));
  });
  
  return {
    unavailableStaff,
    unavailableVehicles
  };
};
