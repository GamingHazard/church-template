import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Search, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Sermon } from "@shared/schema";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Sermons() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: allSermons, isLoading: sermonsLoading } = useQuery<Sermon[]>({
    queryKey: ["/api/sermons"],
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery<Sermon[]>({
    queryKey: ["/api/sermons/search", { q: searchQuery }],
    enabled: searchQuery.length > 0,
  });

  const displaySermons = searchQuery ? searchResults : allSermons;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6" data-testid="sermons-title">
              Watch & Listen
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8" data-testid="sermons-subtitle">
              Experience our worship services and dive deeper into God's Word through our sermon archive.
            </p>
          </div>
        </div>
      </section>

      {/* Live Stream Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-card-foreground mb-4" data-testid="live-stream-section-title">
              Join Us Live
            </h2>
            <p className="text-muted-foreground" data-testid="live-stream-description">
              Watch our Sunday service live or catch the replay
            </p>
          </div>

          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {/* YouTube embed placeholder */}
                  <div className="text-center text-muted-foreground">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                      LIVE SUNDAYS 10:30 AM
                    </div>
                    <Play className="mx-auto h-20 w-20 mb-4 text-primary" />
                    <p className="text-lg font-medium" data-testid="live-stream-status">
                      Live Stream
                    </p>
                    <p className="text-sm mt-2" data-testid="live-stream-next">
                      Next service: Sunday at 10:30 AM
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Button 
                  size="lg" 
                  className="w-full bg-primary text-primary-foreground hover:opacity-90"
                  data-testid="button-watch-live"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Live Stream
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sermon Archive */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="sermon-archive-title">
              Sermon Archive
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="sermon-archive-description">
              Browse and search through our collection of messages
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-12">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search sermons, speakers, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
                data-testid="input-sermon-search"
              />
              <Button type="submit" variant="outline" data-testid="button-search-sermons">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Sermon Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(sermonsLoading || (searchQuery && searchLoading)) ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full aspect-video" />
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : displaySermons && displaySermons.length > 0 ? (
              displaySermons.map((sermon) => (
                <Card key={sermon.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300" data-testid={`sermon-card-${sermon.id}`}>
                  <div className="relative">
                    <img
                      src={sermon.thumbnailUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225"}
                      alt={sermon.title}
                      className="w-full aspect-video object-cover"
                      data-testid={`sermon-thumbnail-${sermon.id}`}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Button size="lg" className="rounded-full" data-testid={`button-play-sermon-${sermon.id}`}>
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    {sermon.series && (
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground" data-testid={`sermon-series-${sermon.id}`}>
                        {sermon.series}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-card-foreground mb-2 line-clamp-2" data-testid={`sermon-title-${sermon.id}`}>
                      {sermon.title}
                    </h3>
                    
                    <div className="flex items-center text-muted-foreground text-sm mb-2">
                      <User className="mr-2 h-4 w-4" />
                      <span data-testid={`sermon-speaker-${sermon.id}`}>{sermon.speaker}</span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground text-sm mb-4">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span data-testid={`sermon-date-${sermon.id}`}>
                        {format(new Date(sermon.date), "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`sermon-description-${sermon.id}`}>
                      {sermon.description}
                    </p>
                    
                    {sermon.scripture && (
                      <div className="mb-4">
                        <Badge variant="outline" data-testid={`sermon-scripture-${sermon.id}`}>
                          {sermon.scripture}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {sermon.videoUrl && (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          data-testid={`button-watch-video-${sermon.id}`}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Watch
                        </Button>
                      )}
                      {sermon.audioUrl && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          data-testid={`button-listen-audio-${sermon.id}`}
                        >
                          Listen
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg" data-testid="no-sermons-found">
                  {searchQuery ? "No sermons found matching your search." : "No sermons available at this time."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
