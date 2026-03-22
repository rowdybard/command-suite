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

export const findConflicts = (events, staffDb) => {
  const conflicts = new Map();
  
  const eventsByDate = events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});
  
  Object.entries(eventsByDate).forEach(([date, dateEvents]) => {
    dateEvents.forEach((eventA, indexA) => {
      dateEvents.slice(indexA + 1).forEach((eventB) => {
        const sharedStaff = eventA.assignedStaffIds.filter(staffId =>
          eventB.assignedStaffIds.includes(staffId)
        );
        
        if (sharedStaff.length > 0) {
          const hasOverlap = checkTemporalOverlap(
            eventA.startTime,
            eventA.endTime,
            eventB.startTime,
            eventB.endTime
          );
          
          if (hasOverlap) {
            sharedStaff.forEach(staffId => {
              if (!conflicts.has(eventA.id)) {
                conflicts.set(eventA.id, new Set());
              }
              if (!conflicts.has(eventB.id)) {
                conflicts.set(eventB.id, new Set());
              }
              conflicts.get(eventA.id).add(staffId);
              conflicts.get(eventB.id).add(staffId);
            });
          }
        }
      });
    });
  });
  
  return conflicts;
};
