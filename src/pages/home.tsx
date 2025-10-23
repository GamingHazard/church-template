import HeroSection from "../components/hero-section";
import NewsletterSignup from "../components/newsletter-signup";
import EventCard from "../components/event-card";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Clock, Play } from "lucide-react";
import { Link } from "wouter";
import { format, set } from "date-fns";
import { Skeleton } from "../components/ui/skeleton";
import { useEffect, useState } from "react";
 
import { useAppData } from "../hooks/use-AppData";
import { VideoPlayer } from "../components/video-player";



interface Sermon {
  _id: string;
  title: string;
  speaker: string;
  date: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  thumbnail?: {
    url: string;
  };
  isLive?: boolean;
}
 

 
export default function Home() {
  const { events, Sermons, loading, error, refresh,Pastors } = useAppData();

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>(events);
  const [recentSermons, setRecentSermons] = useState<any[]>(Sermons);
  const [currentSermon, setCurrentSermon] = useState<any>(Sermons?.[0] || null);
  const [leadPastor, setLeadPastor] = useState<any>(null);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [sermonsLoading, setSermonsLoading] = useState(true);
  const [pastorLoading, setPastorLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Simulate fetching data
    const timer = setTimeout(() => {
if (Sermons) {
  const liveSermons = Sermons.filter(sermon => sermon.isLive);
  if (!currentSermon && liveSermons.length>0) {
     setCurrentSermon(liveSermons?.[0] || null);
  }else{setCurrentSermon(Sermons?.[0] || null);}
}

      
      setUpcomingEvents(events);
      setRecentSermons(Sermons);
      setLeadPastor(Pastors);
      setEventsLoading(false);
      setSermonsLoading(false);
      setPastorLoading(false);
    }, 1500); // 1.5 second delay

    return () => clearTimeout(timer);
  }, [Sermons, events, Pastors]);


  return (
    <div>
      <HeroSection />

      {/* Welcome Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="welcome-title">
              You Belong Here
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="welcome-description">
              At FaithLife Church, we believe everyone has a place at God's table. Come as you are,
              and discover a community that will welcome you with open arms and help you grow in faith.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://answeredfaith.com/wp-content/uploads/2024/07/praise-and-worship-bible-study.jpg"
                alt="Beautiful church interior with stained glass"
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="church-interior-image"
              />
            </div>

            <div className="space-y-6">
              <div className="bg-muted/20 p-6 rounded-xl">
                <h3 className="text-2xl font-semibold text-foreground mb-4" data-testid="service-times-title">
                  Sunday Services
                </h3>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-center" data-testid="early-service">
                    <Clock className="w-5 h-5 mr-3 text-primary" />
                    <span>Early Service: 8:30 AM</span>
                  </div>
                  <div className="flex items-center" data-testid="main-service">
                    <Clock className="w-5 h-5 mr-3 text-primary" />
                    <span>Main Service: 10:30 AM</span>
                  </div>
                  <div className="flex items-center" data-testid="evening-service">
                    <Clock className="w-5 h-5 mr-3 text-primary" />
                    <span>Evening Service: 6:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/20 p-6 rounded-xl">
                <h3 className="text-2xl font-semibold text-foreground mb-4" data-testid="what-to-expect-title">
                  What to Expect
                </h3>
                <p className="text-muted-foreground" data-testid="what-to-expect-description">
                  Casual dress, uplifting worship music, practical biblical teaching,
                  and friendly people ready to welcome you. Services last about 75 minutes
                  with childcare available for all ages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (<section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="upcoming-events-title">
              Upcoming Events
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="upcoming-events-description">
              Join us for fellowship, growth, and community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsLoading  ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))
            ) : events && events.length > 0 ? (
              events.slice(0, 3).map((event) => (
                <EventCard key={event._id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg" data-testid="no-events">
                  No upcoming events at this time. Check back soon!
                </p>
              </div>
            )}
          </div>

          {events && events.length > 3 && (
            <div className="text-center mt-8">
              <Link href="/events">
                <Button 
                  className="bg-secondary text-secondary-foreground hover:opacity-90"
                  data-testid="button-view-all-events"
                >
                  View All Events
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>)}

      {/* Pastor Message */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {pastorLoading ? (
                <Skeleton className="rounded-xl w-full h-[400px]" />
              ) : (
                <img
                  src={leadPastor?.imageUrl || "https://t4.ftcdn.net/jpg/09/59/90/05/360_F_959900529_TsWNG6lFpVUbHTd0KytLwKZ3SxBQNdkR.jpg"}
                  alt="Pastor delivering sermon from church pulpit"
                  className="rounded-xl shadow-lg w-full h-auto"
                  data-testid="pastor-image"
                />
              )}
            </div>

            <div>
              {pastorLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-10 w-32" />
                </div>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="pastor-message-title">
                    A Message from {leadPastor?.name || "Our Pastor"}
                  </h2>
                  <blockquote className="text-lg text-muted-foreground leading-relaxed mb-6 italic" data-testid="pastor-message-quote">
                    "In a world that often feels divided, we invite you to experience the unifying love of Christ.
                    Our church family is built on the foundation of grace, acceptance, and genuine community.
                    Whether you're taking your first steps in faith or have been walking with Jesus for years,
                    you'll find a home here."
                  </blockquote>

                  <div className="mb-6">
                    <p className="font-semibold text-foreground" data-testid="pastor-name">
                      {leadPastor?.name || "Pastor David Johnson"}
                    </p>
                    <p className="text-muted-foreground" data-testid="pastor-title">
                      {leadPastor?.title || "Lead Pastor"}
                    </p>
                  </div>

                  {/* <Link href="/about">
                    <Button 
                      className="bg-primary text-primary-foreground hover:opacity-90"
                      data-testid="button-read-full-message"
                    >
                      Read Full Message
                    </Button>
                  </Link> */}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Live Sermon Section */}
     {Sermons && Sermons.length > 0 && (
       <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="watch-listen-title">
              Watch & Listen
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="watch-listen-description">
              Experience our worship services live or catch up on past messages
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Featured Video Player */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <VideoPlayer
                    videoUrl={currentSermon?.videoUrl || ""}
                    thumbnailUrl={currentSermon?.thumbnailUrl || currentSermon?.thumbnail?.url}
                    title={currentSermon?.title}
                    autoplay={false}
                  />
                  {currentSermon && (
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{currentSermon.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {currentSermon.speaker} • {format(new Date(currentSermon.date), "MMMM d, yyyy")}
                      </p>
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                        {currentSermon.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Sermons */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground mb-6" data-testid="recent-messages-title">
                Recent Messages
              </h3>

              {sermonsLoading  ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg p-4 shadow">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="w-16 h-16 rounded-lg" />
                      <div className="flex-grow space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </div>
                ))
              ) : Sermons && Sermons.length > 0 ? (
                Sermons.slice(0, 3).map((sermon) => (
                  <Card 
                    key={sermon._id} 
                    className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${
                      currentSermon?._id === sermon._id ? 'ring-2 ring-primary' : ''
                    }`}
                    data-testid={`sermon-item-${sermon._id}`}
                    onClick={() => setCurrentSermon(sermon)}
                  >
                    <div className="flex p-4 gap-4">
                      <div className="flex-shrink-0 relative w-20 h-20">
                        <img 
                          src={sermon.thumbnail?.url || sermon.thumbnailUrl || "/placeholder-sermon.jpg"} 
                          alt={sermon.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors" data-testid={`sermon-title-${sermon._id}`}>
                          {sermon.title}
                        </h4>
                        <p className="text-muted-foreground text-sm mt-1" data-testid={`sermon-meta-${sermon._id}`}>
                          {sermon.speaker}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1" data-testid={`sermon-date-${sermon._id}`}>
                          {format(new Date(sermon.date), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2" data-testid={`sermon-description-${sermon._id}`}>
                          {sermon.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground" data-testid="no-sermons">
                    No recent sermons available.
                  </p>
                </div>
              )}

              <Link href="/sermons">
                <Button 
                  className="w-full bg-secondary text-secondary-foreground hover:opacity-90 mt-4"
                  data-testid="button-view-all-sermons"
                >
                  View All Sermons
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
     )}

      <NewsletterSignup />
    </div>
  );
}
