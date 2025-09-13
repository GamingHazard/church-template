import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Plus, Edit, Trash2, Calendar, Users, DollarSign, Image, Mail, Eye, Bell, Settings as SettingsIcon, Phone, MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/login-form";

// Define types locally since shared/schema is removed
export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  speaker?: string;
  imageUrl?: string;
  category: 'general' | 'service' | 'youth' | 'community';
};

export type Sermon = {
  id: string;
  title: string;
  speaker: string;
  date: string;
  description: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  scripture?: string;
  series?: string;
};

export type Newsletter = {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
};

export type Donation = {
  id: string;
  amount: string;
  donorName?: string;
  purpose: 'general' | 'missions' | 'building' | 'special';
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
};

export type GalleryImage = {
  id: string;
  title: string;
  imageUrl: string;
  category: 'general' | 'events' | 'worship' | 'community';
};

export type Pastor = {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  email: string;
  isLead: boolean;
  order: number;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  type: 'donation' | 'event' | 'system' | 'user';
  createdAt: string;
  read: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subscribedAt: string;
  remindersCount: number;
  avatarUrl: string;
};

// Mock Data
const mockEvents: Event[] = [
  { id: '1', title: 'Community BBQ', description: 'Join us for a fun-filled day of food and fellowship.', date: new Date().toISOString(), time: '12:00 PM', location: 'Church Lawn', category: 'community', speaker: 'Pastor John' },
  { id: '2', title: 'Youth Night', description: 'Games, worship, and a powerful message for our youth.', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), time: '7:00 PM', location: 'Youth Hall', category: 'youth' },
];

const mockSermons: Sermon[] = [
    { id: '1', title: 'The Power of Forgiveness', speaker: 'Pastor John', date: new Date().toISOString(), description: 'A sermon on the importance of forgiveness.', videoUrl: 'https://youtube.com/watch?v=123', audioUrl: 'https://spotify.com/track/123', thumbnailUrl: 'https://via.placeholder.com/150', scripture: 'Matthew 6:14-15', series: 'Foundations of Faith' },
    { id: '2', title: 'Living a Life of Purpose', speaker: 'Pastor Jane', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), description: 'Discovering your God-given purpose.', videoUrl: 'https://youtube.com/watch?v=456', audioUrl: 'https://spotify.com/track/456', thumbnailUrl: 'https://via.placeholder.com/150', scripture: 'Jeremiah 29:11', series: 'Life Application' },
];

const mockNewsletters: Newsletter[] = [
  { id: '1', email: 'test1@example.com', subscribedAt: new Date().toISOString(), active: true },
  { id: '2', email: 'test2@example.com', subscribedAt: new Date().toISOString(), active: false },
];

const mockDonations: Donation[] = [
  { id: '1', amount: '100.00', donorName: 'Jane Doe', purpose: 'missions', status: 'completed', createdAt: new Date().toISOString() },
  { id: '2', amount: '50.00', purpose: 'general', status: 'completed', createdAt: new Date().toISOString() },
];

const mockGalleryImages: GalleryImage[] = [
  { id: '1', title: 'Worship Night', imageUrl: 'https://via.placeholder.com/300', category: 'worship' },
  { id: '2', title: 'Community Outreach', imageUrl: 'https://via.placeholder.com/300', category: 'community' },
];

const mockPastors: Pastor[] = [
    { id: '1', name: 'Pastor John Doe', title: 'Lead Pastor', bio: 'Pastor John has been leading our congregation for over 15 years, with a heart for the community and a passion for teaching the Word.', imageUrl: 'https://i.pravatar.cc/150?u=pastorjohn', email: 'pastor.john@church.com', isLead: true, order: 1 },
    { id: '2', name: 'Pastor Jane Smith', title: 'Youth Pastor', bio: 'Pastor Jane has a gift for connecting with young people and helping them grow in their faith.', imageUrl: 'https://i.pravatar.cc/150?u=pastorjane', email: 'pastor.jane@church.com', isLead: false, order: 2 },
];

const mockNotifications: Notification[] = [
  { id: '1', title: 'New Donation', description: 'A donation of $100.00 was received from Jane Doe for the missions fund.', type: 'donation', createdAt: new Date().toISOString(), read: false },
  { id: '2', title: 'Event Reminder', description: 'The "Community BBQ" event is scheduled for tomorrow at 12:00 PM.', type: 'event', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: false },
  { id: '3', title: 'New Subscriber', description: 'A new user (user@example.com) subscribed to the newsletter.', type: 'user', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: true },
  { id: '4', title: 'System Maintenance', description: 'Scheduled system maintenance will occur tonight at midnight. The admin panel may be temporarily unavailable.', type: 'system', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: true },
];

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', subscribedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), remindersCount: 5, avatarUrl: 'https://i.pravatar.cc/150?u=user1' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', subscribedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), remindersCount: 2, avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
  { id: '3', name: 'Sam Wilson', email: 'sam.wilson@example.com', phone: '555-555-5555', subscribedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), remindersCount: 0, avatarUrl: 'https://i.pravatar.cc/150?u=user3' },
];


type EventForm = Omit<Event, 'id'>;
type SermonForm = Omit<Sermon, 'id'>;
type GalleryForm = Omit<GalleryImage, 'id'>;
type PastorForm = Omit<Pastor, 'id'>;

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("events");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [editingPastor, setEditingPastor] = useState<Pastor | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showSermonDialog, setShowSermonDialog] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [showPastorDialog, setShowPastorDialog] = useState(false);

  const { toast } = useToast();

  // State management for mock data
  const [events, setEvents] = useState(mockEvents);
  const [sermons, setSermons] = useState(mockSermons);
  const [newsletters, setNewsletters] = useState(mockNewsletters);
  const [donations, setDonations] = useState(mockDonations);
  const [galleryImages, setGalleryImages] = useState(mockGalleryImages);
  const [pastors, setPastors] = useState(mockPastors);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [users, setUsers] = useState(mockUsers);

  const [eventsLoading, setEventsLoading] = useState(true);
  const [sermonsLoading, setSermonsLoading] = useState(true);
  const [newslettersLoading, setNewslettersLoading] = useState(true);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [pastorsLoading, setPastorsLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEventsLoading(false);
      setSermonsLoading(false);
      setNewslettersLoading(false);
      setDonationsLoading(false);
      setGalleryLoading(false);
      setPastorsLoading(false);
      setNotificationsLoading(false);
      setUsersLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);


  // Event form
  const eventForm = useForm<EventForm>({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      speaker: "",
      imageUrl: "",
      category: "general",
    },
  });

  // Sermon form
  const sermonForm = useForm<SermonForm>({
    defaultValues: {
      title: "",
      speaker: "",
      date: "",
      description: "",
      videoUrl: "",
      audioUrl: "",
      thumbnailUrl: "",
      scripture: "",
      series: "",
    },
  });

  // Gallery form
  const galleryForm = useForm<GalleryForm>({
    defaultValues: {
      title: "",
      imageUrl: "",
      category: "general",
    },
  });

  // Pastor form
  const pastorForm = useForm<PastorForm>({
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      imageUrl: "",
      email: "",
      isLead: false,
      order: 0,
    },
  });

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: (name: any, value: string) => void,
    fieldName: "imageUrl" | "thumbnailUrl"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const localUrl = URL.createObjectURL(file);
      setValue(fieldName, localUrl);
      toast({
        title: "Image Uploaded",
        description: "A local preview of the image is now available.",
      });
    }
  };

  // Mutations replaced with state updates
  const createEvent = (data: EventForm) => {
    const newEvent: Event = { ...data, id: Date.now().toString() };
    setEvents(prev => [...prev, newEvent]);
    toast({ title: "Event created successfully!" });
    setShowEventDialog(false);
    eventForm.reset();
  };

  const updateEvent = (id: string, data: Partial<EventForm>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    toast({ title: "Event updated successfully!" });
    setShowEventDialog(false);
    setEditingEvent(null);
    eventForm.reset();
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    toast({ title: "Event deleted successfully!" });
  };

  const createSermon = (data: SermonForm) => {
    const newSermon: Sermon = { ...data, id: Date.now().toString() };
    setSermons(prev => [...prev, newSermon]);
    toast({ title: "Sermon created successfully!" });
    setShowSermonDialog(false);
    sermonForm.reset();
  };

  const updateSermon = (id: string, data: Partial<SermonForm>) => {
    setSermons(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    toast({ title: "Sermon updated successfully!" });
    setShowSermonDialog(false);
    setEditingSermon(null);
    sermonForm.reset();
  };

  const deleteSermon = (id: string) => {
    setSermons(prev => prev.filter(s => s.id !== id));
    toast({ title: "Sermon deleted successfully!" });
  };

  const createGalleryImage = (data: GalleryForm) => {
    const newImage: GalleryImage = { ...data, id: Date.now().toString() };
    setGalleryImages(prev => [...prev, newImage]);
    toast({ title: "Image added to gallery!" });
    setShowGalleryDialog(false);
    galleryForm.reset();
  };

  const createPastor = (data: PastorForm) => {
    const newPastor: Pastor = { ...data, id: Date.now().toString() };
    setPastors(prev => [...prev, newPastor]);
    toast({ title: "Pastor added successfully!" });
    setShowPastorDialog(false);
    pastorForm.reset();
  };

  const updatePastor = (id: string, data: Partial<PastorForm>) => {
    setPastors(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    toast({ title: "Pastor updated successfully!" });
    setShowPastorDialog(false);
    setEditingPastor(null);
    pastorForm.reset();
  };

  const deletePastor = (id: string) => {
    setPastors(prev => prev.filter(p => p.id !== id));
    toast({ title: "Pastor deleted successfully!" });
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast({ title: "Notification archived." });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({ title: "Notification deleted." });
  };

  const archiveAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({ title: "All notifications archived." });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({ title: "All notifications cleared." });
  };


  // Event handlers
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    eventForm.reset({
      title: event.title,
      description: event.description,
      date: format(new Date(event.date), "yyyy-MM-dd"),
      time: event.time,
      location: event.location,
      speaker: event.speaker || "",
      imageUrl: event.imageUrl || "",
      category: event.category,
    });
    setShowEventDialog(true);
  };

  const handleSubmitEvent = (data: EventForm) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, data);
    } else {
      createEvent(data);
    }
  };

  const handleSubmitSermon = (data: SermonForm) => {
    if (editingSermon) {
      updateSermon(editingSermon.id, data);
    } else {
      createSermon(data);
    }
  };

  const handleEditSermon = (sermon: Sermon) => {
    setEditingSermon(sermon);
    sermonForm.reset({
      ...sermon,
      date: format(new Date(sermon.date), "yyyy-MM-dd"),
    });
    setShowSermonDialog(true);
  };

  const handleSubmitGallery = (data: GalleryForm) => {
    createGalleryImage(data);
  };

  const handleSubmitPastor = (data: PastorForm) => {
    if (editingPastor) {
      updatePastor(editingPastor.id, data);
    } else {
      createPastor(data);
    }
  };

  const handleEditPastor = (pastor: Pastor) => {
    setEditingPastor(pastor);
    pastorForm.reset(pastor);
    setShowPastorDialog(true);
  };

  const resetEventDialog = () => {
    setShowEventDialog(false);
    setEditingEvent(null);
    eventForm.reset();
  };

  const resetSermonDialog = () => {
    setShowSermonDialog(false);
    setEditingSermon(null);
    sermonForm.reset();
  };

  const resetPastorDialog = () => {
    setShowPastorDialog(false);
    setEditingPastor(null);
    pastorForm.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h1 className="text-4xl font-bold" data-testid="admin-title">
            Admin Dashboard
          </h1>
          <p className="text-xl mt-2 opacity-90" data-testid="admin-subtitle">
            Manage church events, sermons, and content
          </p>
        </div>
      </section>

      {/* Admin Tabs */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-9 mb-8">
              <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
              <TabsTrigger value="sermons" data-testid="tab-sermons">Sermons</TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
              <TabsTrigger value="newsletters" data-testid="tab-newsletters">Newsletter</TabsTrigger>
              <TabsTrigger value="donations" data-testid="tab-donations">Donations</TabsTrigger>
              <TabsTrigger value="gallery" data-testid="tab-gallery">Gallery</TabsTrigger>
              <TabsTrigger value="pastors" data-testid="tab-pastors">Pastors</TabsTrigger>
              <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
              <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
            </TabsList>

            {/* Events Tab */}
            <TabsContent value="events">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Events Management
                  </CardTitle>
                  <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingEvent(null)} data-testid="button-add-event">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingEvent ? "Edit Event" : "Create New Event"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={eventForm.handleSubmit(handleSubmitEvent)} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title">Event Title</Label>
                            <Input {...eventForm.register("title")} data-testid="input-event-title" />
                          </div>
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                              value={eventForm.watch("category")}
                              onValueChange={(value) => eventForm.setValue("category", value as any)}
                            >
                              <SelectTrigger data-testid="select-event-category">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="service">Service</SelectItem>
                                <SelectItem value="youth">Youth</SelectItem>
                                <SelectItem value="community">Community</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea {...eventForm.register("description")} data-testid="textarea-event-description" />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="date">Date</Label>
                            <Input type="date" {...eventForm.register("date")} data-testid="input-event-date" />
                          </div>
                          <div>
                            <Label htmlFor="time">Time</Label>
                            <Input {...eventForm.register("time")} placeholder="7:00 PM" data-testid="input-event-time" />
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input {...eventForm.register("location")} data-testid="input-event-location" />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="speaker">Speaker (Optional)</Label>
                            <Input {...eventForm.register("speaker")} data-testid="input-event-speaker" />
                          </div>
                          <div>
                            <Label htmlFor="imageUrl">Image (URL or Upload)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                {...eventForm.register("imageUrl")}
                                placeholder="https://example.com/image.jpg"
                                data-testid="input-event-image"
                              />
                              <Input
                                type="file"
                                id="event-image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, eventForm.setValue, "imageUrl")}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('event-image-upload')?.click()}
                              >
                                Upload
                              </Button>
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={resetEventDialog} data-testid="button-cancel-event">
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            data-testid="button-save-event"
                          >
                            {editingEvent ? "Update Event" : "Create Event"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventsLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          </TableRow>
                        ))
                      ) : events && events.length > 0 ? (
                        events.map((event) => (
                          <TableRow key={event.id} data-testid={`event-row-${event.id}`}>
                            <TableCell className="font-medium">{event.title}</TableCell>
                            <TableCell>{format(new Date(event.date), "MMM d, yyyy")}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{event.category}</Badge>
                            </TableCell>
                            <TableCell>{event.location}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEditEvent(event)}
                                  data-testid={`button-edit-event-${event.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      data-testid={`button-delete-event-${event.id}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{event.title}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteEvent(event.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No events found. Create your first event!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sermons Tab */}
            <TabsContent value="sermons">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Eye className="mr-2 h-5 w-5" />
                    Sermons Management
                  </CardTitle>
                  <Dialog open={showSermonDialog} onOpenChange={setShowSermonDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingSermon(null)} data-testid="button-add-sermon">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Sermon
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingSermon ? "Edit Sermon" : "Create New Sermon"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={sermonForm.handleSubmit(handleSubmitSermon)} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title">Sermon Title</Label>
                            <Input {...sermonForm.register("title")} data-testid="input-sermon-title" />
                          </div>
                          <div>
                            <Label htmlFor="speaker">Speaker</Label>
                            <Input {...sermonForm.register("speaker")} data-testid="input-sermon-speaker" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea {...sermonForm.register("description")} data-testid="textarea-sermon-description" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date">Date</Label>
                            <Input type="date" {...sermonForm.register("date")} data-testid="input-sermon-date" />
                          </div>
                           <div>
                            <Label htmlFor="scripture">Scripture</Label>
                            <Input {...sermonForm.register("scripture")} data-testid="input-sermon-scripture" />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="videoUrl">Video URL</Label>
                            <Input {...sermonForm.register("videoUrl")} data-testid="input-sermon-video" />
                          </div>
                          <div>
                            <Label htmlFor="audioUrl">Audio URL</Label>
                            <Input {...sermonForm.register("audioUrl")} data-testid="input-sermon-audio" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="thumbnailUrl">Thumbnail (URL or Upload)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              {...sermonForm.register("thumbnailUrl")}
                              placeholder="https://example.com/thumb.jpg"
                              data-testid="input-sermon-thumbnail"
                            />
                            <Input
                              type="file"
                              id="sermon-thumb-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, sermonForm.setValue, "thumbnailUrl")}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('sermon-thumb-upload')?.click()}
                            >
                              Upload
                            </Button>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={resetSermonDialog}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingSermon ? "Update Sermon" : "Create Sermon"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Speaker</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sermonsLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          </TableRow>
                        ))
                      ) : sermons && sermons.length > 0 ? (
                        sermons.map((sermon) => (
                          <TableRow key={sermon.id}>
                            <TableCell className="font-medium">{sermon.title}</TableCell>
                            <TableCell>{sermon.speaker}</TableCell>
                            <TableCell>{format(new Date(sermon.date), "MMM d, yyyy")}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEditSermon(sermon)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Sermon</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{sermon.title}"?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteSermon(sermon.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            No sermons found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="mr-2 h-5 w-5" />
                        User Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Subscribed</TableHead>
                            <TableHead>Reminders</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {usersLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                              <TableRow key={i}>
                                <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                              </TableRow>
                            ))
                          ) : users.map(user => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{user.phone}</TableCell>
                              <TableCell>{format(new Date(user.subscribedAt), "MMM d, yyyy")}</TableCell>
                              <TableCell className="text-center">{user.remindersCount}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="outline" size="icon" onClick={() => toast({ title: `Emailing ${user.name}` })}>
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="icon" onClick={() => toast({ title: `Sending SMS to ${user.name}` })}>
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="icon" onClick={() => toast({ title: `Calling ${user.name}` })}>
                                    <Phone className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Mail className="mr-2 h-5 w-5" />
                        Broadcast Message
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const message = (form.elements.namedItem('broadcast-message') as HTMLTextAreaElement).value;
                        if (message) {
                          toast({
                            title: "Broadcast Sent!",
                            description: `Message sent to ${users.length} users.`,
                          });
                          form.reset();
                        } else {
                          toast({
                            title: "Error",
                            description: "Message cannot be empty.",
                            variant: "destructive"
                          });
                        }
                      }}>
                        <div className="space-y-2">
                          <Label htmlFor="broadcast-message">Message</Label>
                          <Textarea id="broadcast-message" placeholder="Type your message to all users..." rows={5} />
                        </div>
                        <Button type="submit" className="w-full">
                          Send Broadcast
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Newsletter Tab */}
            <TabsContent value="newsletters">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Newsletter Subscribers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-muted-foreground">
                      Total Subscribers: <span className="font-semibold">{newsletters?.length || 0}</span>
                    </p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Subscribed Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newslettersLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          </TableRow>
                        ))
                      ) : newsletters && newsletters.length > 0 ? (
                        newsletters.map((subscriber) => (
                          <TableRow key={subscriber.id} data-testid={`subscriber-row-${subscriber.id}`}>
                            <TableCell>{subscriber.email}</TableCell>
                            <TableCell>{format(new Date(subscriber.subscribedAt || new Date()), "MMM d, yyyy")}</TableCell>
                            <TableCell>
                              <Badge variant={subscriber.active ? "default" : "secondary"}>
                                {subscriber.active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8">
                            No newsletter subscribers yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Donations Tab */}
            <TabsContent value="donations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Donation Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-muted-foreground">
                      Total Donations: <span className="font-semibold">
                        ${donations?.reduce((sum, donation) => sum + parseFloat(donation.amount), 0).toFixed(2) || "0.00"}
                      </span>
                    </p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Donor</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donationsLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          </TableRow>
                        ))
                      ) : donations && donations.length > 0 ? (
                        donations.map((donation) => (
                          <TableRow key={donation.id} data-testid={`donation-row-${donation.id}`}>
                            <TableCell className="font-medium">${donation.amount}</TableCell>
                            <TableCell>{donation.donorName || "Anonymous"}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{donation.purpose}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  donation.status === "completed" ? "default" : 
                                  donation.status === "failed" ? "destructive" : "secondary"
                                }
                              >
                                {donation.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{format(new Date(donation.createdAt || new Date()), "MMM d, yyyy")}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No donations recorded yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Image className="mr-2 h-5 w-5" />
                    Gallery Management
                  </CardTitle>
                  <Dialog open={showGalleryDialog} onOpenChange={setShowGalleryDialog}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-gallery-image">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Gallery Image</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={galleryForm.handleSubmit(handleSubmitGallery)} className="space-y-4">
                        <div>
                          <Label htmlFor="title">Image Title</Label>
                          <Input {...galleryForm.register("title")} data-testid="input-gallery-title" />
                        </div>
                        <div>
                          <Label htmlFor="imageUrl">Image (URL or Upload)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              {...galleryForm.register("imageUrl")}
                              placeholder="https://example.com/image.jpg"
                              data-testid="input-gallery-url"
                            />
                            <Input
                              type="file"
                              id="gallery-image-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, galleryForm.setValue, "imageUrl")}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('gallery-image-upload')?.click()}
                            >
                              Upload
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={galleryForm.watch("category")}
                            onValueChange={(value) => galleryForm.setValue("category", value as any)}
                          >
                            <SelectTrigger data-testid="select-gallery-category">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="events">Events</SelectItem>
                              <SelectItem value="worship">Worship</SelectItem>
                              <SelectItem value="community">Community</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setShowGalleryDialog(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            Add Image
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryLoading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-lg" />
                      ))
                    ) : galleryImages && galleryImages.length > 0 ? (
                      galleryImages.map((image) => (
                        <div key={image.id} className="relative group" data-testid={`gallery-item-${image.id}`}>
                          <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="text-white text-center">
                              <p className="font-medium">{image.title}</p>
                              <Badge className="mt-1">{image.category}</Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">No gallery images yet. Add your first image!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pastors Tab */}
            <TabsContent value="pastors">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Pastors Management
                  </CardTitle>
                  <Dialog open={showPastorDialog} onOpenChange={setShowPastorDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingPastor(null)} data-testid="button-add-pastor">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Pastor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingPastor ? "Edit Pastor" : "Add New Pastor"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={pastorForm.handleSubmit(handleSubmitPastor)} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input {...pastorForm.register("name")} />
                          </div>
                          <div>
                            <Label htmlFor="title">Title</Label>
                            <Input {...pastorForm.register("title")} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea {...pastorForm.register("bio")} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" {...pastorForm.register("email")} />
                          </div>
                          <div>
                            <Label htmlFor="imageUrl">Image (URL or Upload)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                {...pastorForm.register("imageUrl")}
                                placeholder="https://example.com/pastor.jpg"
                              />
                              <Input
                                type="file"
                                id="pastor-image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, pastorForm.setValue, "imageUrl")}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('pastor-image-upload')?.click()}
                              >
                                Upload
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={resetPastorDialog}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingPastor ? "Update Pastor" : "Add Pastor"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastorsLoading ? (
                        Array.from({ length: 2 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          </TableRow>
                        ))
                      ) : pastors && pastors.length > 0 ? (
                        pastors.map((pastor) => (
                          <TableRow key={pastor.id}>
                            <TableCell className="font-medium">{pastor.name}</TableCell>
                            <TableCell>{pastor.title}</TableCell>
                            <TableCell>{pastor.email}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEditPastor(pastor)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Pastor</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {pastor.name}?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deletePastor(pastor.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            No pastors found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={archiveAllNotifications}>
                      Archive All
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Clear All
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all notifications. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={clearAllNotifications} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Clear All
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notificationsLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-1/3" />
                          </div>
                        </div>
                      ))
                    ) : notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div key={notification.id} className={`flex items-start gap-4 p-4 rounded-lg border ${!notification.read ? 'bg-muted/50' : 'bg-background'}`}>
                          <div className="flex-shrink-0 mt-1">
                            {notification.type === 'donation' && <DollarSign className="h-5 w-5 text-green-500" />}
                            {notification.type === 'event' && <Calendar className="h-5 w-5 text-blue-500" />}
                            {notification.type === 'system' && <SettingsIcon className="h-5 w-5 text-gray-500" />}
                            {notification.type === 'user' && <Users className="h-5 w-5 text-purple-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-black">{notification.title}</p>
                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                              </div>
                              {!notification.read && (
                                <Badge variant="solid" className="text-xs bg-purple-100 text-purple-600">New</Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-muted-foreground text-gray-400">
                                {format(new Date(notification.createdAt), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => archiveNotification(notification.id)} disabled={notification.read}>
                                  Archive
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Notification?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the notification titled "{notification.title}".
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteNotification(notification.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Bell className="mx-auto h-10 w-10 mb-4" />
                        <h3 className="text-lg font-semibold">No Notifications</h3>
                        <p className="text-sm">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <SettingsIcon className="mr-2 h-5 w-5" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="website" orientation="vertical">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <TabsList className="flex flex-col h-full bg-transparent p-0">
                        <TabsTrigger value="website" className="justify-start w-full">Website Settings</TabsTrigger>
                        <TabsTrigger value="profile" className="justify-start w-full">Admin Profile</TabsTrigger>
                        <TabsTrigger value="general" className="justify-start w-full">General</TabsTrigger>
                      </TabsList>
                      <div className="md:col-span-3">
                        <TabsContent value="website">
                          <Card>
                            <CardHeader>
                              <CardTitle>Website Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="site-name">Site Name</Label>
                                <Input id="site-name" defaultValue="My Church" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="site-description">Site Description</Label>
                                <Textarea id="site-description" defaultValue="Welcome to our church website." />
                              </div>
                              <Button>Save Changes</Button>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value="profile">
                          <Card>
                            <CardHeader>
                              <CardTitle>Admin Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="admin-name">Name</Label>
                                <Input id="admin-name" defaultValue="Admin User" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="admin-email">Email</Label>
                                <Input id="admin-email" type="email" defaultValue="admin@church.com" />
                              </div>
                              <Button>Update Profile</Button>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value="general">
                          <Card>
                            <CardHeader>
                              <CardTitle>General Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <Label>Enable Maintenance Mode</Label>
                                  <p className="text-xs text-muted-foreground">
                                    Temporarily disable public access to the site.
                                  </p>
                                </div>
                                <Switch />
                              </div>
                              <Button variant="destructive">Clear Cache</Button>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </div>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs would be implemented similarly... */}
          </Tabs>
        </div>
      </section>
    </div>
  );
}

export default function Admin() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  

  // Show login form if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <LoginForm />;
  }

  return <AdminDashboard />;
}
