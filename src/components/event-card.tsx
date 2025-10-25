import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Calendar, MapPin, Clock, User, Contact } from "lucide-react";
import { format, isFuture, set } from "date-fns";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { useAppData } from "../hooks/use-AppData";
import axios from "axios";
import { Configs } from "../lib/utils";

// Define Event type locally
export type Event = {
     _id: string;
     id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  speaker?: string;
  thumbnailUrl?: string;
  category: "general" | "service" | "youth" | "community";
  thumbnail: { url?: string; public_id?: string }
  reminders: string[];
};

export type User = {
  reminder: string[];
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { refresh } = useAppData();
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderPhone, setReminderPhone] = useState("");
  const [visitorId] = useState(localStorage.getItem("visitor_id") || "");
  const [user, setUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isSettingReminder, setIsSettingReminder] = useState(false);

  // Check if event is upcoming (not past)
  const isUpcoming = isFuture(new Date(event.date));

  const handleReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("visitor_id");

    if (!reminderEmail && !reminderPhone) {
      toast({
        title: "Error",
        description: "Please provide either email or phone number",
        variant: "destructive",
      });
      return;
    }

    setIsSettingReminder(true);

    try {
     

       
      const response = await axios.post(`${Configs.url}/api/events/reminders/new`, {
        eventId: event._id,
        userId,
        contact: reminderPhone,
        email: reminderEmail,
        eventTitle: event.title,
      });

      if (response.status === 200) {
        toast({
          title: "Reminder Set!",
          description: `You'll be notified about "${event.title}"`,
        });

        if (response.data.user) {
          localStorage.setItem("visitor_profile", JSON.stringify(response.data.user));
          setUser(response.data.user);
        }
        refresh();
      }
      
      setIsDialogOpen(false);
      setReminderEmail("");
      setReminderPhone("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set reminder. Please try again.",
        variant: "destructive",
      });
      console.error("Error setting reminder:", error);
    } finally {
      setIsSettingReminder(false);
    }
  };

   

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
        
        <p className="text-gray-400 mb-4 flex-wrap" data-testid={`event-description-${event._id}`}>
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-muted-foreground text-gray-400 text-sm">
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

        {isUpcoming && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className={`w-full bg-secondary text-${event?.reminders.includes(visitorId) ? "green-500" : "white"} hover:opacity-90 bg-${event?.reminders.includes(visitorId) ? "current" : "secondary"}`}
                data-testid={`button-set-reminder-${event._id}`}
              >
                {isSettingReminder ? "Setting..." : event?.reminders.includes(visitorId) ? "Reminder Set" : "Set Reminder"}
              </Button>
              
                      </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleReminderSubmit}>
              <DialogHeader>
                <DialogTitle>Set Event Reminder</DialogTitle>
                <DialogDescription>
                  Get notified about {event.title}. Provide your email or phone number.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={reminderEmail}
                    onChange={(e) => setReminderEmail(e.target.value)}
                    placeholder="your@email.com"
                    data-testid="input-reminder-email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={reminderPhone}
                    onChange={(e) => setReminderPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    data-testid="input-reminder-phone"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel-reminder"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSettingReminder}
                  data-testid="button-confirm-reminder"
                >
                  {isSettingReminder ? "Setting..." : "Set Reminder"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        )}
        
        {!isUpcoming && (
          <Button 
            className="w-full bg-muted text-muted-foreground cursor-not-allowed"
            disabled
            data-testid={`button-past-event-${event._id}`}
          >
            Past Event
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
