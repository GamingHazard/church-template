import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, User, Users } from "lucide-react";
import { format, isPast } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "@/components/event-card";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  speaker?: string;
  imageUrl?: string;
  category: string;
}

// Mock Data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Community BBQ",
    date: new Date("2025-09-20T17:00:00.000Z").toISOString(),
    location: "Church Lawn",
    description: "Join us for a fun evening of food, games, and fellowship.",
    imageUrl: "https://st.depositphotos.com/1001959/1895/i/450/depositphotos_18952187-stock-photo-bbq-grill-with-various-kind.jpg",
    category: "community",
    time: "5:00 PM",
    speaker: "John Doe",
  },
  {
    id: "2",
    title: "Youth Movie Night",
    date: new Date("2025-09-26T19:00:00.000Z").toISOString(),
    location: "Youth Hall",
    description: "A fun movie night for all our youth group members.",
    imageUrl: "https://media.istockphoto.com/id/1299321783/photo/friends-watching-a-movie-in-a-home-theater.jpg?s=612x612&w=0&k=20&c=kS-0-s-11aZa-b-LgdnRkG85L-0uTih2dei29p3hG-s=",
    category: "youth",
    time: "7:00 PM",
  },
  {
    id: "3",
    title: "Worship Night",
    date: new Date("2025-10-04T18:30:00.000Z").toISOString(),
    location: "Main Sanctuary",
    description: "An evening of worship and prayer.",
    imageUrl: "https://www.prochurchlights.com/wp-content/uploads/2022/03/pexels-luis-quintero-2774556.jpg",
    category: "service",
    time: "6:30 PM",
    speaker: "Worship Team",
  },
  {
    id: "4",
    title: "Men's Breakfast",
    date: new Date("2025-08-16T08:00:00.000Z").toISOString(),
    location: "Fellowship Hall",
    description: "A time for men to connect and grow together.",
    imageUrl: "https://media.istockphoto.com/id/1302423033/photo/the-perfect-start-to-a-productive-day.jpg?s=612x612&w=0&k=20&c=X0-s-1-1aZa-b-LgdnRkG85L-0uTih2dei29p3hG-s=",
    category: "community",
    time: "8:00 AM",
    speaker: "Guest Speaker",
  },
];

export default function Events() {
	const [activeTab, setActiveTab] = useState("upcoming");
	const [allEvents, setAllEvents] = useState<Event[]>([]);
	const [eventsLoading, setEventsLoading] = useState(true);

	useEffect(() => {
		window.scrollTo(0, 0);
		// Simulate fetching data
		const timer = setTimeout(() => {
			setAllEvents(mockEvents);
			setEventsLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	const upcomingEvents = allEvents.filter(
		(event) => !isPast(new Date(event.date))
	);
	const pastEvents = allEvents.filter((event) => isPast(new Date(event.date)));

	const getCategoryColor = (category: string) => {
		switch (category) {
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
		events?: Event[];
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
				events.map((event) => <EventCard key={event.id} event={event} />)
			) : (
				<div className="col-span-full text-center py-12">
					<p
						className="text-muted-foreground text-lg"
						data-testid="no-events"
					>
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
						<p
							className="text-xl max-w-3xl mx-auto"
							data-testid="events-subtitle"
						>
							Join us for worship, fellowship, and community events that
							brings us together in faith and friendship.
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
			) : upcomingEvents.length > 0 && (
				<section className="py-16 bg-card">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
						<div className="text-center mb-12">
							<h2
								className="text-4xl font-bold text-card-foreground mb-4"
								data-testid="featured-event-title"
							>
								Next Event
							</h2>
							<p
								className="text-xl text-muted-foreground"
								data-testid="featured-event-description"
							>
								Don't miss our upcoming gathering
							</p>
						</div>

						<Card className="overflow-hidden shadow-xl max-w-4xl mx-auto">
							<div className="grid md:grid-cols-2">
								<div>
									<img
										src={
											upcomingEvents[0].imageUrl ||
											"https://images.unsplash.com/photo-1577303935007-0d306ee638cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
										}
										alt={upcomingEvents[0].title}
										className="w-full h-64 md:h-full object-cover"
										data-testid="featured-event-image"
									/>
								</div>
								<CardContent className="p-8">
									<div className="flex items-center mb-4">
										<Badge
											className={getCategoryColor(
												upcomingEvents[0].category
											)}
											data-testid="featured-event-category"
										>
											{upcomingEvents[0].category.toUpperCase()}
										</Badge>
									</div>

									<h3
										className="text-3xl font-bold text-card-foreground mb-4"
										data-testid="featured-event-name"
									>
										{upcomingEvents[0].title}
									</h3>

									<p
										className="text-muted-foreground mb-6 text-lg"
										data-testid="featured-event-desc"
									>
										{upcomingEvents[0].description}
									</p>

									<div className="space-y-3 mb-6">
										<div className="flex items-center text-muted-foreground">
											<Calendar className="mr-3 h-5 w-5 text-primary" />
											<span data-testid="featured-event-date">
												{format(
													new Date(upcomingEvents[0].date),
													"EEEE, MMMM d, yyyy"
												)}
											</span>
										</div>
										<div className="flex items-center text-muted-foreground">
											<Clock className="mr-3 h-5 w-5 text-primary" />
											<span data-testid="featured-event-time">
												{upcomingEvents[0].time}
											</span>
										</div>
										<div className="flex items-center text-muted-foreground">
											<MapPin className="mr-3 h-5 w-5 text-primary" />
											<span data-testid="featured-event-location">
												{upcomingEvents[0].location}
											</span>
										</div>
										{upcomingEvents[0].speaker && (
											<div className="flex items-center text-muted-foreground">
												<User className="mr-3 h-5 w-5 text-primary" />
												<span data-testid="featured-event-speaker">
													{upcomingEvents[0].speaker}
												</span>
											</div>
										)}
									</div>

									<Button
										size="lg"
										className="w-full bg-primary text-primary-foreground hover:opacity-90"
										data-testid="button-featured-event-register"
									>
										<Users className="mr-2 h-5 w-5" />
										Set Reminder
									</Button>
								</CardContent>
							</div>
						</Card>
					</div>
				</section>
			)}

			{/* Events Tabs */}
			<section className="py-16 bg-background">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
					<div className="text-center mb-12">
						<h2
							className="text-4xl font-bold text-foreground mb-4"
							data-testid="all-events-title"
						>
							All Events
						</h2>
						<p
							className="text-xl text-muted-foreground"
							data-testid="all-events-description"
						>
							Browse upcoming and past church events
						</p>
					</div>

					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full"
					>
						<TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
							<TabsTrigger value="upcoming" data-testid="tab-upcoming">
								Upcoming Events
							</TabsTrigger>
							<TabsTrigger value="past" data-testid="tab-past">
								Past Events
							</TabsTrigger>
						</TabsList>

						<TabsContent
							value="upcoming"
							data-testid="upcoming-events-content"
						>
							<EventsGrid events={upcomingEvents} loading={eventsLoading} />
						</TabsContent>

						<TabsContent
							value="past"
							data-testid="past-events-content"
						>
							<EventsGrid events={pastEvents} loading={eventsLoading} />
						</TabsContent>
					</Tabs>
				</div>
			</section>
		</div>
	);
}
