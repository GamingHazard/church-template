import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Configs } from "../lib/utils";
import { set } from "date-fns";

interface Event {
    _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  speaker?: string;
  thumbnailUrl?: string;
  category: "general" | "service" | "youth" | "community";
  thumbnail: { url?: string; public_id?: string }
}

interface Sermon {
 _id: string;
  title: string;
  speaker: string;
  date: string;
  description: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  scripture?: string;
  series?: string;
  thumbnail: { url?: string; public_id?: string }}

interface AppData {
  events: Event[];
  Sermons: Sermon[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

 
export const useAppData = (): AppData => {
  const [events, setEvents] = useState<Event[]>([]);
  const [Sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
   
    setError(null);

    try {
      // Fetch both endpoints in parallel
      const [eventsRes, sermonsRes] = await Promise.all([
        axios.get(`${Configs.url}/api/events/all`),
        axios.get(`${Configs.url}/api/sermons/all`),
      ]);

      setEvents(eventsRes.data.events || []);
      setSermons(sermonsRes.data.sermons || []);
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.response?.data?.message || "Failed to load data");
    }  
  }, []);

  // Automatically fetch on mount
  useEffect(() => {
setLoading(true);
   const interval = setInterval(() => {
     fetchData();
     
      setLoading(false);
    }, 3000);  
    return () => clearInterval(interval);
  }, [fetchData]);

  return { events, Sermons, loading, error, refresh: fetchData };
};
