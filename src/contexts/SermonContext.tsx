import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sermon } from '../types/sermon';

interface SermonContextType {
  currentSermon: Sermon | null;
  watchedSermons: string[];
  searchQuery: string;
  setCurrentSermon: (sermon: Sermon | null) => void;
  setWatchedSermons: (ids: string[]) => void;
  setSearchQuery: (query: string) => void;
}

const SermonContext = createContext<SermonContextType | undefined>(undefined);

export function SermonProvider({ children }: { children: React.ReactNode }) {
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(() => {
    const saved = localStorage.getItem('currentSermon');
    return saved ? JSON.parse(saved) : null;
  });

  const [watchedSermons, setWatchedSermons] = useState<string[]>(() => {
    const saved = localStorage.getItem('watchedSermons');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState(() => {
    const saved = localStorage.getItem('sermonSearchQuery');
    return saved || '';
  });

  useEffect(() => {
    localStorage.setItem('currentSermon', JSON.stringify(currentSermon));
    localStorage.setItem('watchedSermons', JSON.stringify(watchedSermons));
    localStorage.setItem('sermonSearchQuery', searchQuery);
  }, [currentSermon, watchedSermons, searchQuery]);

  return (
    <SermonContext.Provider 
      value={{
        currentSermon,
        watchedSermons,
        searchQuery,
        setCurrentSermon,
        setWatchedSermons,
        setSearchQuery,
      }}
    >
      {children}
    </SermonContext.Provider>
  );
}

export function useSermonContext() {
  const context = useContext(SermonContext);
  if (context === undefined) {
    throw new Error('useSermonContext must be used within a SermonProvider');
  }
  return context;
}
