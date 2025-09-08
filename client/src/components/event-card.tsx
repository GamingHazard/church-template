import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Clock, User } from "lucide-react";
import { Event } from "@shared/schema";
import { format } from "date-fns";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderPhone, setReminderPhone] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const reminderMutation = useMutation({
    mutationFn: async (data: { eventId: string; email?: string; phone?: string }) => {
      const response = await apiRequest("POST", "/api/event-reminders", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reminder Set!",
        description: "We'll remind you about this event.",
      });
      setIsDialogOpen(false);
      setReminderEmail("");
      setReminderPhone("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to set reminder",
        variant: "destructive",
      });
    },
  });

  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderEmail && !reminderPhone) {
      toast({
        title: "Error",
        description: "Please provide either email or phone number",
        variant: "destructive",
      });
      return;
    }

    reminderMutation.mutate({
      eventId: event.id,
      email: reminderEmail || undefined,
      phone: reminderPhone || undefined,
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300" data-testid={`event-card-${event.id}`}>
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover"
          data-testid={`event-image-${event.id}`}
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center text-primary mb-2">
          <Calendar className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium" data-testid={`event-date-${event.id}`}>
            {format(new Date(event.date), "EEEE, MMMM d")}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-card-foreground mb-2" data-testid={`event-title-${event.id}`}>
          {event.title}
        </h3>
        
        <p className="text-muted-foreground mb-4" data-testid={`event-description-${event.id}`}>
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="mr-2 h-4 w-4" />
            <span data-testid={`event-time-${event.id}`}>{event.time}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="mr-2 h-4 w-4" />
            <span data-testid={`event-location-${event.id}`}>{event.location}</span>
          </div>
          {event.speaker && (
            <div className="flex items-center text-muted-foreground text-sm">
              <User className="mr-2 h-4 w-4" />
              <span data-testid={`event-speaker-${event.id}`}>{event.speaker}</span>
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-secondary text-secondary-foreground hover:opacity-90"
              data-testid={`button-set-reminder-${event.id}`}
            >
              Set Reminder
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
                  disabled={reminderMutation.isPending}
                  data-testid="button-confirm-reminder"
                >
                  {reminderMutation.isPending ? "Setting..." : "Set Reminder"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
