
import { useState, useEffect, useMemo } from 'react';
import { UserHistoryItem, UserHistoryEventType } from '../types';

const MOCK_CITIES = ['New York', 'London', 'Berlin', 'Tokyo', 'San Francisco', 'Toronto', 'Sydney', 'Paris'];
const MOCK_COUNTRIES = ['USA', 'UK', 'Germany', 'Japan', 'Canada', 'Australia', 'France'];
const MOCK_DEVICES = ['Chrome on Windows', 'Safari on Mac', 'Firefox on Linux', 'Mobile Safari on iPhone', 'Chrome on Android'];
const MOCK_NAMES = ['Alex Johnson', 'Sarah Miller', 'Mike Chen', 'Emily Davis', 'James Wilson', 'Lisa Anderson'];

const generateMockHistory = (count: number): UserHistoryItem[] => {
  return Array.from({ length: count }).map((_, i) => {
    const eventTypes: UserHistoryEventType[] = ['registration', 'login', 'login', 'login', 'password_reset', 'settings_update', 'api_key_created'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const name = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
    const countryIndex = Math.floor(Math.random() * MOCK_COUNTRIES.length);
    
    // Generate a date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    return {
      id: `evt-${Math.random().toString(36).substr(2, 9)}`,
      user_id: `user-${Math.floor(Math.random() * 1000)}`,
      user_name: name,
      user_email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      user_avatar: `https://ui-avatars.com/api/?name=${name}&background=random&size=128`,
      event_type: eventType,
      created_at: date.toISOString(),
      city: MOCK_CITIES[Math.floor(Math.random() * MOCK_CITIES.length)],
      country: MOCK_COUNTRIES[countryIndex],
      country_code: MOCK_COUNTRIES[countryIndex].substring(0, 2).toUpperCase(),
      timezone: 'UTC',
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      proxy: Math.random() > 0.9,
      device: MOCK_DEVICES[Math.floor(Math.random() * MOCK_DEVICES.length)],
    };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

const INITIAL_DATA = generateMockHistory(150);

interface UseUserHistoryProps {
  autoLoad?: boolean;
}

export const useUserHistory = ({ autoLoad = true }: UseUserHistoryProps = {}) => {
  const [history, setHistory] = useState<UserHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    if (autoLoad) {
      loadHistory();
    }
  }, [autoLoad]);

  const loadHistory = async () => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setHistory(INITIAL_DATA);
    setIsLoading(false);
  };

  const refresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Prepend a new random event to simulate real-time updates
    const newEvent = generateMockHistory(1)[0];
    newEvent.created_at = new Date().toISOString();
    setHistory(prev => [newEvent, ...prev]);
    setIsLoading(false);
  };

  // Filter Logic
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      // Search Filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery || 
        item.user_name.toLowerCase().includes(searchLower) ||
        item.user_email.toLowerCase().includes(searchLower) ||
        item.user_id.toLowerCase().includes(searchLower);

      // Event Type Filter
      const matchesType = eventTypeFilter === 'all' || item.event_type === eventTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [history, searchQuery, eventTypeFilter]);

  // Pagination Logic
  const totalItems = filteredHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(start, start + itemsPerPage);
  }, [filteredHistory, currentPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, eventTypeFilter]);

  return {
    history: paginatedHistory,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    isLoading,
    refresh,
    searchQuery,
    setSearchQuery,
    eventTypeFilter,
    setEventTypeFilter,
  };
};
