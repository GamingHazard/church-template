import HeroSection from "@/components/hero-section";
import NewsletterSignup from "@/components/newsletter-signup";
import EventCard from "@/components/event-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Event, Sermon, Pastor } from "@shared/schema";
import { Link } from "wouter";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function Home() {
  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events/upcoming"],
  });

  const { data: recentSermons, isLoading: sermonsLoading } = useQuery<Sermon[]>({
    queryKey: ["/api/sermons/recent"],
  });

  const { data: leadPastor, isLoading: pastorLoading } = useQuery<Pastor>({
    queryKey: ["/api/pastors/lead"],
  });

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // runs only once when the component mounts


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
      <section className="py-16 bg-background">
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
            {eventsLoading ? (
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
            ) : upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg" data-testid="no-events">
                  No upcoming events at this time. Check back soon!
                </p>
              </div>
            )}
          </div>

          {upcomingEvents && upcomingEvents.length > 3 && (
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
      </section>

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

                  <Link href="/about">
                    <Button 
                      className="bg-primary text-primary-foreground hover:opacity-90"
                      data-testid="button-read-full-message"
                    >
                      Read Full Message
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Live Sermon Section */}
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

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Live Stream */}
            <div className="bg-card rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold text-card-foreground mb-4 flex items-center" data-testid="live-stream-title">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium mr-3">
                  LIVE
                </span>
                Sunday Service
              </h3>
              <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Play className="mx-auto h-16 w-16 mb-4 text-primary" />
                  <p className="text-lg font-medium" data-testid="live-stream-status">
                    Live Stream Starting Soon
                  </p>
                  <p className="text-sm" data-testid="live-stream-time">
                    Sundays at 10:30 AM
                  </p>
                </div>
              </div>
              <Link href="/sermons">
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:opacity-90"
                  data-testid="button-join-live-stream"
                >
                  Join Live Stream
                </Button>
              </Link>
            </div>

            {/* Recent Sermons */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground mb-6" data-testid="recent-messages-title">
                Recent Messages
              </h3>

              {sermonsLoading ? (
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
              ) : recentSermons && recentSermons.length > 0 ? (
                recentSermons.slice(0, 3).map((sermon) => (
                  <div key={sermon.id} className="bg-card rounded-lg p-4 shadow hover:shadow-md transition-shadow duration-300" data-testid={`sermon-item-${sermon.id}`}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                          <Play className="text-primary-foreground h-6 w-6" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-card-foreground mb-1" data-testid={`sermon-title-${sermon.id}`}>
                          {sermon.title}
                        </h4>
                        <p className="text-muted-foreground text-sm mb-2" data-testid={`sermon-meta-${sermon.id}`}>
                          {sermon.speaker} • {format(new Date(sermon.date), "MMM d, yyyy")}
                        </p>
                        <p className="text-muted-foreground text-sm" data-testid={`sermon-description-${sermon.id}`}>
                          {sermon.description}
                        </p>
                      </div>
                    </div>
                  </div>
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

      <NewsletterSignup />
    </div>
  );
}
