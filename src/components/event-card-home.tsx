import { Card, CardContent } from "./ui/card";
import { Calendar, MapPin, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export type Event = {
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
};

interface EventCardProps {
  event: Event;
}

export default function EventCardHome({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300" data-testid={`event-card-${event._id}`}>
      {(event?.thumbnail?.url || event?.thumbnailUrl) && (
        <img
          src={event?.thumbnail?.url || event?.thumbnailUrl || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
          alt={event.title}
          className="w-full h-48 object-cover"
          data-testid={`event-image-${event._id}`}
          onError={(e) => {
            e.currentTarget.src = '/placeholder-event.jpg';
            e.currentTarget.alt = 'Event placeholder image';
          }}
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center text-primary mb-2">
          <Calendar className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium" data-testid={`event-date-${event._id}`}>
            {format(new Date(event.date), "EEEE, MMMM d")}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-card-foreground mb-2" data-testid={`event-title-${event._id}`}>
          {event.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`event-description-${event._id}`}>
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="mr-2 h-4 w-4" />
            <span data-testid={`event-time-${event._id}`}>{event.time}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="mr-2 h-4 w-4" />
            <span data-testid={`event-location-${event._id}`}>{event.location}</span>
          </div>
          {event.speaker && (
            <div className="flex items-center text-muted-foreground text-sm">
              <User className="mr-2 h-4 w-4" />
              <span data-testid={`event-speaker-${event._id}`}>{event.speaker}</span>
            </div>
          )}
        </div>

        <Link href="/events">
          <a className="text-primary hover:underline text-sm">See more →</a>
        </Link>
      </CardContent>
    </Card>
  );
}