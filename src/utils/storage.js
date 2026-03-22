const STORAGE_KEYS = {
  BRANDS: 'dispatchHub_brands',
  STAFF: 'dispatchHub_staff',
  EVENTS: 'dispatchHub_events',
};

export const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const getInitialBrands = () => loadFromStorage(STORAGE_KEYS.BRANDS, [
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
]);

export const getInitialStaff = () => loadFromStorage(STORAGE_KEYS.STAFF, [
  { id: 'staff-1', name: 'Alex Johnson' },
  { id: 'staff-2', name: 'Sam Martinez' },
  { id: 'staff-3', name: 'Jordan Lee' },
  { id: 'staff-4', name: 'Casey Brown' },
  { id: 'staff-5', name: 'Taylor Davis' },
]);

export const getInitialEvents = () => {
  const today = new Date().toISOString().split('T')[0];
  return loadFromStorage(STORAGE_KEYS.EVENTS, [
    {
      id: 'event-1',
      brandId: 'brand-1',
      date: today,
      title: 'Downtown Festival',
      startTime: '09:00',
      endTime: '14:00',
      location: 'Central Park',
      assignedStaffIds: ['staff-1', 'staff-2']
    },
    {
      id: 'event-2',
      brandId: 'brand-2',
      date: today,
      title: 'Birthday Party',
      startTime: '12:00',
      endTime: '16:00',
      location: '123 Oak Street',
      assignedStaffIds: ['staff-2', 'staff-3']
    },
    {
      id: 'event-3',
      brandId: 'brand-3',
      date: today,
      title: 'Corporate Event',
      startTime: '18:00',
      endTime: '22:00',
      location: 'Convention Center',
      assignedStaffIds: ['staff-4']
    }
  ]);
};

export const saveBrands = (brands) => saveToStorage(STORAGE_KEYS.BRANDS, brands);
export const saveStaff = (staff) => saveToStorage(STORAGE_KEYS.STAFF, staff);
export const saveEvents = (events) => saveToStorage(STORAGE_KEYS.EVENTS, events);
