import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dispatchHub_v1';

const INITIAL_BRANDS = [
  {
    id: 'brand-1',
    name: 'Concessions',
    color: 'bg-blue-500 border-blue-600',
    badge: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'brand-2',
    name: 'Inflatables',
    color: 'bg-purple-500 border-purple-600',
    badge: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'brand-3',
    name: 'Performers',
    color: 'bg-green-500 border-green-600',
    badge: 'bg-green-100 text-green-800 border-green-300'
  }
];

const INITIAL_STAFF = [
  { id: 'staff-1', name: 'Staff 1' },
  { id: 'staff-2', name: 'Staff 2' },
  { id: 'staff-3', name: 'Staff 3' },
  { id: 'staff-4', name: 'Staff 4' },
  { id: 'staff-5', name: 'Staff 5' },
];

const INITIAL_VEHICLES = [
  { id: 'vehicle-1', name: 'White Chevy Tahoe', type: 'Truck' },
  { id: 'vehicle-2', name: 'Foam Trailer', type: 'Trailer' },
  { id: 'vehicle-3', name: 'Cargo Van', type: 'Van' },
];

const getInitialEvents = () => {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'event-1',
      brandId: 'brand-1',
      date: today,
      title: 'Event 1',
      startTime: '09:00',
      endTime: '14:00',
      location: 'Location A',
      assignedStaffIds: ['staff-1', 'staff-2'],
      assignedVehicleIds: ['vehicle-1']
    },
    {
      id: 'event-2',
      brandId: 'brand-2',
      date: today,
      title: 'Event 2',
      startTime: '12:00',
      endTime: '16:00',
      location: 'Location B',
      assignedStaffIds: ['staff-2', 'staff-3'],
      assignedVehicleIds: ['vehicle-1', 'vehicle-2']
    },
    {
      id: 'event-3',
      brandId: 'brand-3',
      date: today,
      title: 'Event 3',
      startTime: '18:00',
      endTime: '22:00',
      location: 'Location C',
      assignedStaffIds: ['staff-4'],
      assignedVehicleIds: ['vehicle-3']
    }
  ];
};

const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      
      if (parsed && typeof parsed === 'object') {
        return {
          brands: Array.isArray(parsed.brands) ? parsed.brands : INITIAL_BRANDS,
          staff: Array.isArray(parsed.staff) ? parsed.staff : INITIAL_STAFF,
          vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles : INITIAL_VEHICLES,
          events: Array.isArray(parsed.events) ? parsed.events : getInitialEvents()
        };
      }
    }
  } catch (error) {
    console.error('Failed to load from localStorage, using defaults:', error);
    localStorage.removeItem(STORAGE_KEY);
  }
  
  return {
    brands: INITIAL_BRANDS,
    staff: INITIAL_STAFF,
    vehicles: INITIAL_VEHICLES,
    events: getInitialEvents()
  };
};

const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const useDispatchStore = () => {
  const initialData = loadFromLocalStorage();
  
  const [brands, setBrandsInternal] = useState(initialData.brands);
  const [staff, setStaffInternal] = useState(initialData.staff);
  const [vehicles, setVehiclesInternal] = useState(initialData.vehicles);
  const [events, setEventsInternal] = useState(initialData.events);

  useEffect(() => {
    const currentState = {
      brands,
      staff,
      vehicles,
      events
    };
    saveToLocalStorage(currentState);
  }, [brands, staff, vehicles, events]);

  const setBrands = useCallback((newBrands) => {
    if (typeof newBrands === 'function') {
      setBrandsInternal(prev => {
        const updated = newBrands(prev);
        return updated;
      });
    } else {
      setBrandsInternal(newBrands);
    }
  }, []);

  const setStaff = useCallback((newStaff) => {
    if (typeof newStaff === 'function') {
      setStaffInternal(prev => {
        const updated = newStaff(prev);
        return updated;
      });
    } else {
      setStaffInternal(newStaff);
    }
  }, []);

  const setVehicles = useCallback((newVehicles) => {
    if (typeof newVehicles === 'function') {
      setVehiclesInternal(prev => {
        const updated = newVehicles(prev);
        return updated;
      });
    } else {
      setVehiclesInternal(newVehicles);
    }
  }, []);

  const setEvents = useCallback((newEvents) => {
    if (typeof newEvents === 'function') {
      setEventsInternal(prev => {
        const updated = newEvents(prev);
        return updated;
      });
    } else {
      setEventsInternal(newEvents);
    }
  }, []);

  const resetStore = useCallback(() => {
    const freshData = {
      brands: INITIAL_BRANDS,
      staff: INITIAL_STAFF,
      vehicles: INITIAL_VEHICLES,
      events: getInitialEvents()
    };
    
    setBrandsInternal(freshData.brands);
    setStaffInternal(freshData.staff);
    setVehiclesInternal(freshData.vehicles);
    setEventsInternal(freshData.events);
    
    saveToLocalStorage(freshData);
  }, []);

  return {
    brands,
    staff,
    vehicles,
    events,
    setBrands,
    setStaff,
    setVehicles,
    setEvents,
    resetStore
  };
};
