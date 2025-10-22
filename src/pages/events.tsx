import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Calendar, MapPin, Clock, User, Users } from "lucide-react";
import { format, isPast } from "date-fns";
import { Skeleton } from "../components/ui/skeleton";
import EventCard from "../components/event-card";
import { useAppData } from "../hooks/use-AppData"; // <- ensure this path/name matches your hook file

interface EventItem {
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

export default function Events() {
  // destructure according to your hook's API
  const { events = [], loading: hookLoading = false } = useAppData();

  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(true);

  // scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // when hook data or hook loading changes, update local state
  useEffect(() => {
    // Use the hook's loading state directly; you can keep an extra UI delay here if desired.
    setEventsLoading(hookLoading);

    // safely set events array (default to empty array)
    setAllEvents(Array.isArray(events) ? events : []);
  }, [events, hookLoading]);

  // derive upcoming/past with useMemo for performance
  const upcomingEvents = useMemo(() => {
    return allEvents.filter((event) => {
      if (!event?.date) return true; // keep it if no date (or adjust behavior)
      const d = new Date(event.date);
      if (isNaN(d.getTime())) return true; // invalid date => treat as upcoming (or change)
      return !isPast(d);
    });
  }, [allEvents]);

  const pastEvents = useMemo(() => {
    return allEvents.filter((event) => {
      if (!event?.date) return false;
      const d = new Date(event.date);
      if (isNaN(d.getTime())) return false;
      return isPast(d);
    });
  }, [allEvents]);

  const getCategoryColor = (category: string) => {
    switch ((category || "").toLowerCase()) {
      case "service":
        return "bg-primary text-primary-foreground";
      case "youth":
        return "bg-secondary text-secondary-foreground";
      case "community":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const EventsGrid = ({
    events,
    loading,
  }: {
    events?: EventItem[];
    loading: boolean;
  }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="w-full h-48" />
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        ))
      ) : events && events.length > 0 ? (
        events.map((event) => <EventCard key={event._id} event={event} />)
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground text-lg" data-testid="no-events">
            No events available in this category.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6" data-testid="events-title">
              Church Events
            </h1>
            <p className="text-xl max-w-3xl mx-auto" data-testid="events-subtitle">
              Join us for worship, fellowship, and community events that brings us
              together in faith and friendship.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {eventsLoading ? (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <Skeleton className="h-96 w-full" />
          </div>
        </section>
      ) : upcomingEvents.length > 0 ? (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-card-foreground mb-4" data-testid="featured-event-title">
                Next Event
              </h2>
              <p className="text-xl text-muted-foreground" data-testid="featured-event-description">
                Don't miss our upcoming gathering
              </p>
            </div>

            <Card className="overflow-hidden shadow-xl max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2">
                <div>
                  <img
                    src={upcomingEvents[0].thumbnail.url||upcomingEvents[0].thumbnailUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"}
                    alt={upcomingEvents[0].title}
                    className="w-full h-64 md:h-full object-cover"
                    data-testid="featured-event-image"
                  />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Badge className={getCategoryColor(upcomingEvents[0].category)} data-testid="featured-event-category">
                      {upcomingEvents[0].category?.toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="text-3xl font-bold text-card-foreground mb-4" data-testid="featured-event-name">
                    {upcomingEvents[0].title}
                  </h3>

                  <p className="text-muted-foreground mb-6 text-lg" data-testid="featured-event-desc">
                    {upcomingEvents[0].description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-3 h-5 w-5 text-primary" />
                      <span data-testid="featured-event-date">
                        {upcomingEvents[0].date ? format(new Date(upcomingEvents[0].date), "EEEE, MMMM d, yyyy") : "Date TBA"}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-3 h-5 w-5 text-primary" />
                      <span data-testid="featured-event-time">{upcomingEvents[0].time || "Time TBA"}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-3 h-5 w-5 text-primary" />
                      <span data-testid="featured-event-location">{upcomingEvents[0].location || "Location TBA"}</span>
                    </div>
                    {upcomingEvents[0].speaker && (
                      <div className="flex items-center text-muted-foreground">
                        <User className="mr-3 h-5 w-5 text-primary" />
                        <span data-testid="featured-event-speaker">{upcomingEvents[0].speaker}</span>
                      </div>
                    )}
                  </div>

                  <Button size="lg" className="w-full bg-primary text-primary-foreground hover:opacity-90" data-testid="button-featured-event-register">
                    <Users className="mr-2 h-5 w-5" />
                    Set Reminder
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      ) : null}

      {/* Events Tabs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="all-events-title">
              All Events
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="all-events-description">
              Browse upcoming and past church events
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upcoming" | "past")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
              <TabsTrigger value="upcoming" data-testid="tab-upcoming">
                Upcoming Events
              </TabsTrigger>
              <TabsTrigger value="past" data-testid="tab-past">
                Past Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" data-testid="upcoming-events-content">
              <EventsGrid events={upcomingEvents} loading={eventsLoading} />
            </TabsContent>

            <TabsContent value="past" data-testid="past-events-content">
              <EventsGrid events={pastEvents} loading={eventsLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
