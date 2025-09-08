import { useState } from "react";
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
import { Plus, Edit, Trash2, Calendar, Users, DollarSign, Image, Mail, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Event, Sermon, Newsletter, Donation, GalleryImage, Pastor, insertEventSchema, insertSermonSchema, insertGalleryImageSchema, insertPastorSchema } from "@shared/schema";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Form schemas with proper date handling
const eventFormSchema = insertEventSchema.extend({
  date: z.string().min(1, "Date is required"),
});

const sermonFormSchema = insertSermonSchema.extend({
  date: z.string().min(1, "Date is required"),
});

const galleryFormSchema = insertGalleryImageSchema;
const pastorFormSchema = insertPastorSchema;

type EventForm = z.infer<typeof eventFormSchema>;
type SermonForm = z.infer<typeof sermonFormSchema>;
type GalleryForm = z.infer<typeof galleryFormSchema>;
type PastorForm = z.infer<typeof pastorFormSchema>;

export default function Admin() {
  const [activeTab, setActiveTab] = useState("events");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [editingPastor, setEditingPastor] = useState<Pastor | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showSermonDialog, setShowSermonDialog] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [showPastorDialog, setShowPastorDialog] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: sermons, isLoading: sermonsLoading } = useQuery<Sermon[]>({
    queryKey: ["/api/sermons"],
  });

  const { data: newsletters, isLoading: newslettersLoading } = useQuery<Newsletter[]>({
    queryKey: ["/api/newsletter/subscribers"],
  });

  const { data: donations, isLoading: donationsLoading } = useQuery<Donation[]>({
    queryKey: ["/api/donations"],
  });

  const { data: galleryImages, isLoading: galleryLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  const { data: pastors, isLoading: pastorsLoading } = useQuery<Pastor[]>({
    queryKey: ["/api/pastors"],
  });

  // Event form
  const eventForm = useForm<EventForm>({
    resolver: zodResolver(eventFormSchema),
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
    resolver: zodResolver(sermonFormSchema),
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
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      category: "general",
    },
  });

  // Pastor form
  const pastorForm = useForm<PastorForm>({
    resolver: zodResolver(pastorFormSchema),
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

  // Mutations
  const createEventMutation = useMutation({
    mutationFn: async (data: EventForm) => {
      const eventData = { ...data, date: new Date(data.date) };
      const response = await apiRequest("POST", "/api/events", eventData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event created successfully!" });
      setShowEventDialog(false);
      eventForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Failed to create event", description: error.message, variant: "destructive" });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EventForm> }) => {
      const eventData = data.date ? { ...data, date: new Date(data.date) } : data;
      const response = await apiRequest("PUT", `/api/events/${id}`, eventData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event updated successfully!" });
      setShowEventDialog(false);
      setEditingEvent(null);
      eventForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Failed to update event", description: error.message, variant: "destructive" });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/events/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete event", description: error.message, variant: "destructive" });
    },
  });

  const createSermonMutation = useMutation({
    mutationFn: async (data: SermonForm) => {
      const sermonData = { ...data, date: new Date(data.date) };
      const response = await apiRequest("POST", "/api/sermons", sermonData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sermons"] });
      toast({ title: "Sermon created successfully!" });
      setShowSermonDialog(false);
      sermonForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Failed to create sermon", description: error.message, variant: "destructive" });
    },
  });

  const createGalleryImageMutation = useMutation({
    mutationFn: async (data: GalleryForm) => {
      const response = await apiRequest("POST", "/api/gallery", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Image added to gallery!" });
      setShowGalleryDialog(false);
      galleryForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Failed to add image", description: error.message, variant: "destructive" });
    },
  });

  const createPastorMutation = useMutation({
    mutationFn: async (data: PastorForm) => {
      const response = await apiRequest("POST", "/api/pastors", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pastors"] });
      toast({ title: "Pastor added successfully!" });
      setShowPastorDialog(false);
      pastorForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Failed to add pastor", description: error.message, variant: "destructive" });
    },
  });

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
      updateEventMutation.mutate({ id: editingEvent.id, data });
    } else {
      createEventMutation.mutate(data);
    }
  };

  const handleSubmitSermon = (data: SermonForm) => {
    createSermonMutation.mutate(data);
  };

  const handleSubmitGallery = (data: GalleryForm) => {
    createGalleryImageMutation.mutate(data);
  };

  const handleSubmitPastor = (data: PastorForm) => {
    createPastorMutation.mutate(data);
  };

  const resetEventDialog = () => {
    setShowEventDialog(false);
    setEditingEvent(null);
    eventForm.reset();
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
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
              <TabsTrigger value="sermons" data-testid="tab-sermons">Sermons</TabsTrigger>
              <TabsTrigger value="newsletters" data-testid="tab-newsletters">Newsletter</TabsTrigger>
              <TabsTrigger value="donations" data-testid="tab-donations">Donations</TabsTrigger>
              <TabsTrigger value="gallery" data-testid="tab-gallery">Gallery</TabsTrigger>
              <TabsTrigger value="pastors" data-testid="tab-pastors">Pastors</TabsTrigger>
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
                            {eventForm.formState.errors.title && (
                              <p className="text-destructive text-sm">{eventForm.formState.errors.title.message}</p>
                            )}
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
                            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                            <Input {...eventForm.register("imageUrl")} data-testid="input-event-image" />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={resetEventDialog} data-testid="button-cancel-event">
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={createEventMutation.isPending || updateEventMutation.isPending}
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
                                        onClick={() => deleteEventMutation.mutate(event.id)}
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
                            <TableCell>{format(new Date(subscriber.subscribedAt), "MMM d, yyyy")}</TableCell>
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
                            <TableCell>{format(new Date(donation.createdAt), "MMM d, yyyy")}</TableCell>
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
                          <Label htmlFor="imageUrl">Image URL</Label>
                          <Input {...galleryForm.register("imageUrl")} data-testid="input-gallery-url" />
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
                          <Button type="submit" disabled={createGalleryImageMutation.isPending}>
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

            {/* Other tabs would be implemented similarly... */}
          </Tabs>
        </div>
      </section>
    </div>
  );
}
