import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { VideoPlayer } from "../components/video-player";
import { AudioPlayer } from "../components/audio-player";
import { Button } from "../components/ui/button";

interface Sermon {
  _id: string;
  title: string;
  speaker: string;
  date: string;
  description: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  thumbnail?: { url: string };
  series?: string;
  scripture?: string;
  isLive?: boolean;
}
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Play,
  Search,
  Calendar,
  User,
  EyeIcon,
  Send,
  ThumbsUpIcon,
  Share2,
  Circle,
  Archive,
  Loader,
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "../components/ui/skeleton";
import { mockSermons } from "../lib/Data";
import { useAppData } from "../hooks/use-AppData";
import { useToast } from "../hooks/use-toast";
import axios from "axios";
import { Configs } from "../lib/utils";

// Mock Data

export default function Sermons() {
  const { toast } = useToast();

  const { Sermons, loading ,refresh} = useAppData();
  const [searchQuery, setSearchQuery] = useState("");
  const [userId] = useState(localStorage.getItem("visitor_id") || "");
  const [allSermons, setAllSermons] = useState(Sermons);
  const [sermonsLoading, setSermonsLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [watchedSermons, setWatchedSermons] = useState<string[]>(() => {
    const saved = localStorage.getItem("watchedSermons");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSermon, setCurrentSermon] = useState<
    (typeof Sermons)[0] | null
  >(null);

  // Function to handle sermon selection and tracking watched status
  const handleSelectSermon = (sermon: (typeof Sermons)[0]) => {
    setCurrentSermon(sermon);

    if (!watchedSermons.includes(sermon._id)) {
      const newWatched = [...watchedSermons, sermon._id];
      setWatchedSermons(newWatched);
      localStorage.setItem("watchedSermons", JSON.stringify(newWatched));
    }

    // Scroll to the player
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!loading && Sermons?.length > 0) {
      const filteredSermons = Sermons.filter((sermon) => sermon.isLive);

      setAllSermons(Sermons);
      if (!currentSermon && filteredSermons.length > 0) {
        setCurrentSermon(filteredSermons?.[0] || null);
      }
      setSermonsLoading(false);
    }
  }, [loading, Sermons, currentSermon]);

  const filteredSermons = allSermons.filter(
    (sermon) =>
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sermon.series &&
        sermon.series.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displaySermons = searchQuery ? filteredSermons : allSermons;
  const searchLoading = false; // No async search, so always false

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is now handled synchronously by filtering
  };

  const likeSermon = async (sermonId: string) => {
    setLiking(true);
    const userId = localStorage.getItem("visitor_id");
    try {
      const res = await axios.post(`${Configs.url}/api/sermons/like/sermon/${sermonId}`, { userId });
      if (res.status === 200) {
        toast({ title: `${res.data.message}` });
        refresh();
      }
     } catch (error) {
      console.log(error);

     } finally {
       setLiking(false);
     }
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
            <p
              className="text-xl max-w-3xl mx-auto mb-8"
              data-testid="sermons-subtitle"
            >
              Experience our worship services and dive deeper into God's Word
              through our sermon archive.
            </p>
          </div>
        </div>
      </section>

      {/* Sermon Player Section */}
      <section className="py-4 sm:py-8 bg-card">
        <div className="container mx-auto px-2 sm:px-4 lg:px-8 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Main Video Player */}
            <div className="col-span-1 lg:col-span-8">
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  <div className="relative">
                    {(currentSermon || allSermons[0]) && (
                      <VideoPlayer
                        key={(currentSermon || allSermons[0])?._id}
                        videoUrl={
                          (currentSermon || allSermons[0])?.videoUrl || ""
                        }
                        thumbnailUrl={
                          (currentSermon || allSermons[0])?.thumbnail?.url ||
                          (currentSermon || allSermons[0])?.thumbnailUrl ||
                          "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                        }
                        title={(currentSermon || allSermons[0])?.title}
                        autoplay={false}
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {(currentSermon || allSermons[0])?.series && (
                        <Badge variant="secondary" className="text-xs">
                          {(currentSermon || allSermons[0])?.series}
                        </Badge>
                      )}
                      <span className="flex flex-wrap items-center text-muted-foreground text-sm w-full">
                        <span className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:flex-1">
                          <Badge variant="outline" className="text-xs">
                            {(currentSermon || allSermons[0])?.date
                              ? format(
                                  new Date(
                                    (currentSermon || allSermons[0])?.date
                                  ),
                                  "MMMM d, yyyy"
                                )
                              : ""}
                          </Badge>
                          {(currentSermon || allSermons[0])?.isLive ? (
                            <Badge
                              variant="default"
                              className="bg-green-500 text-white"
                            >
                              <Circle className="text-white mr-2 animate-pulse" />
                              Live Now
                            </Badge>
                          ) : (
                              <Badge variant="outline" className="text-xs">
                                <Archive size={20} className=" mr-2" /> Recorded
                              </Badge>
                          )}
                        </span>
                        <Badge variant="outline" className="text-xs mt-4 sm:mt-0  ">
                          <EyeIcon className="inline-block mr-1 h-4 w-4" />
                          Views 10
                        </Badge>
                         
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {(currentSermon || allSermons[0])?.title ||
                        "Select a sermon to watch"}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm mb-4">
                      <User className="mr-2 h-4 w-4" />
                      <span>{(currentSermon || allSermons[0])?.speaker}</span>
                    </div>
                    {(currentSermon || allSermons[0])?.scripture && (
                      <div className="mt-4 mb-5">
                        <Badge variant="outline" className="text-xs">
                          Scripture:{" "}
                          {(currentSermon || allSermons[0])?.scripture}
                        </Badge>
                      </div>
                    )}
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {(currentSermon || allSermons[0])?.description}
                    </p>

                    {(currentSermon || allSermons[0])?.scripture && (
                      <span className=" flex-row mt-10 flex items-center gap-4     p-3 text-xs text-muted-foreground">
                        <span className="flex-row cursor-pointer  flex items-center gap-1">
                          {(currentSermon || allSermons[0])?.likes.length || 0} Likes <ThumbsUpIcon   onClick={() => likeSermon((currentSermon || allSermons[0])?._id)} size={16} />
                        </span>
                        <span className="flex-row cursor-pointer flex-1  flex items-center gap-1">
                          Share
                          <Share2
                            size={16}
                            onClick={() => {
                              try {
                                // or whatever your item ID variable is
                                const url = `${
                                  window.location.origin
                                }/sermons/${
                                  (currentSermon || allSermons[0])?._id
                                }`;
                                navigator.clipboard?.writeText(url);
                                toast({ title: "Sermon link copied" });
                              } catch (e) {
                                toast({
                                  title: "Could not copy sermon link",
                                  variant: "destructive",
                                });
                              }
                            }}
                          />
                        </span>
                        <span className="text-xs text-muted">2 hours ago</span>
                      </span>
                    )}
{/* Liking Spinner */}
                    {liking && (
                      <span className=" flex-row  flex items-center gap-2     p-3 text-xs text-muted-foreground">  
                        <Loader className="animate-spin" size={16} /> processing...
                      </span>
                    )}

                    {/* Audio Player - Always show if available */}
                    {(currentSermon || allSermons[0])?.audioUrl && (
                      <div className="mt-6 border-t pt-6">
                        <h4 className="text-sm font-semibold mb-3">
                          Listen to Audio Version
                        </h4>
                        <AudioPlayer
                          audioUrl={
                            (currentSermon || allSermons[0])?.audioUrl || ""
                          }
                          title={(currentSermon || allSermons[0])?.title || ""}
                          speaker={(currentSermon || allSermons[0])?.speaker}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>{" "}
            {/* Side Sections */}
            <div className="col-span-1 lg:col-span-4 grid grid-rows-1 lg:grid-rows-2 gap-4 lg:gap-6">
              {/* Watched Sermons */}
              <Card className="overflow-hidden flex-1">
                <CardContent className="p-2 sm:p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Recently Watched</h3>
                    {watchedSermons.length > 3 && (
                      <Button variant="ghost" size="sm" className="text-xs">
                        View All
                      </Button>
                    )}
                  </div>
                  {allSermons.length > 0 && watchedSermons.length > 0 ? (
                    <div className="space-y-4  max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                      {allSermons
                        .filter((sermon) => watchedSermons.includes(sermon._id))

                        .map((sermon) => (
                          <Card
                            key={sermon._id}
                            className={`hover:shadow-md transition-all 
                            cursor-pointer hover:bg-slate-300 group transform hover:scale-[1.02] ${
                              currentSermon?._id === sermon._id
                                ? "ring-2 ring-primary bg-primary/5"
                                : "hover:bg-muted/50"
                            }`}
                            onClick={() => handleSelectSermon(sermon)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleSelectSermon(sermon);
                              }
                            }}
                          >
                            <CardContent className="p-3">
                              <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-3">
                                  <div className="flex gap-3">
                                    <div className="w-24 h-16 relative flex-shrink-0">
                                      <img
                                        src={
                                          sermon.thumbnail?.url ||
                                          sermon.thumbnailUrl ||
                                          "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                                        }
                                        alt={sermon.title}
                                        className="w-full h-full object-cover rounded"
                                        onError={(e) => {
                                          const img =
                                            e.target as HTMLImageElement;
                                          if (
                                            img.src !==
                                            "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                                          ) {
                                            img.src =
                                              "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
                                          }
                                        }}
                                      />

                                      <div
                                        className={`absolute inset-0 bg-black/20 flex items-center justify-center 
                                  ${
                                    currentSermon?._id === sermon._id
                                      ? "opacity-100"
                                      : "opacity-0 group-hover:opacity-100"
                                  } transition-opacity
                                `}
                                      >
                                        <Play className="h-6 w-6 text-white" />
                                      </div>
                                    </div>

                                    {/* details */}
                                    <div className="flex-1 min-w-0">
                                      <h4
                                        className={`font-medium text-sm line-clamp-1 mb-1
                                  ${
                                    currentSermon?._id === sermon._id
                                      ? "text-primary"
                                      : ""
                                  }
                                `}
                                      >
                                        {sermon.title}
                                      </h4>{" "}
                                      <div className="flex items-center text-xs text-muted-foreground gap-2 mb-2">
                                        <span>{sermon.speaker}</span>
                                        <span>•</span>
                                        <span>
                                          {format(
                                            new Date(sermon.date),
                                            "MMM d, yyyy"
                                          )}
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground line-clamp-2">
                                        {sermon.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {sermon.audioUrl && (
                                  <div className="w-full">
                                    <AudioPlayer
                                      audioUrl={sermon.audioUrl}
                                      title={sermon.title}
                                      speaker={sermon.speaker}
                                    />
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                      <div className="mb-4">
                        <Play className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        No Recently Watched Sermons
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Start watching sermons to see your history here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card className="relative flex flex-col p-2 sm:p-4 max-h-[360px] lg:max-h-[400px]">
                <CardContent className="overflow-y-auto">
                  <h3 className="font-semibold m-2 sm:m-4">Comments</h3>
                  <Card className="flex-1 w-full bg-background mb-3 border-0">
                    {/* comment card */}
                    <span className="shadow-lg mb-4 w-full pb-3 sm:pb-5 justify-center text-muted-foreground">
                      <span className="flex items-center gap-2 p-2 sm:p-3">
                        <img
                          className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                          src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
                        />
                        <p className="text-sm font-medium flex-1 truncate">
                          User@gmail.com
                        </p>
                        <p className="text-xs text-muted font-medium hidden sm:block">
                          User@gmail.com
                        </p>
                      </span>
                      <p className="text-sm flex-wrap p-2 sm:p-3 line-clamp-4 sm:line-clamp-none">
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Ipsum adipisci rem quod officiis, nulla distinctio
                        minus error, deserunt hic voluptatem numquam explicabo.
                        Excepturi facilis possimus repellendus quia molestias.
                        Obcaecati, sapiente. Excepturi facilis possimus
                        repellendus quia molestias. Obcaecati, sapiente.
                        Excepturi facilis possimus repellendus quia molestias.
                        Obcaecati, sapiente. Excepturi facilis possimus
                        repellendus quia molestias. Obcaecati, sapiente.
                        Excepturi facilis possimus repellendus quia molestias.
                        Obcaecati, sapiente. Excepturi facilis possimus
                        repellendus quia molestias. Obcaecati, sapiente.
                      </p>

                      <span className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 cursor-pointer">
                          <span className="hidden sm:inline">65</span>{" "}
                          <ThumbsUpIcon size={14} />
                        </span>
                        <span className="flex items-center gap-1 cursor-pointer">
                          <span className="hidden sm:inline">Share</span>{" "}
                          <Share2 size={14} />
                        </span>
                        <span className="text-xs text-muted ml-auto">
                          2h ago
                        </span>
                      </span>
                    </span>
                  </Card>
                </CardContent>
                <div className="sticky bottom-0 p-2 w-full bg-card border-t">
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Add comment..."
                      className="flex-1 bg-background max-h-16"
                    />
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-background shadow-md hover:bg-muted/50 transition-colors">
                      <Send className="w-4 h-4 text-muted-foreground cursor-pointer" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sermon Archive */}
      <section className="py-8 sm:py-16 bg-background">
        <div className="container mx-auto px-2 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4"
              data-testid="sermon-archive-title"
            >
              Sermon Archive
            </h2>
            <p
              className="text-lg sm:text-xl text-muted-foreground px-4"
              data-testid="sermon-archive-description"
            >
              Browse and search through our collection of messages
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8 sm:mb-12 px-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search sermons, speakers, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
                data-testid="input-sermon-search"
              />
              <Button
                type="submit"
                variant="outline"
                data-testid="button-search-sermons"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Sermon Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
            {sermonsLoading || (searchQuery && searchLoading) ? (
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
                <Card
                  key={sermon._id}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
                    currentSermon?._id === sermon._id
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  data-testid={`sermon-card-${sermon._id}`}
                >
                  <div className="relative">
                    <img
                      src={
                        sermon.thumbnail?.url ||
                        sermon.thumbnailUrl ||
                        "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                      }
                      alt={sermon.title}
                      className="w-full aspect-video object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (
                          img.src !==
                          "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                        ) {
                          img.src =
                            "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
                        }
                      }}
                      data-testid={`sermon-thumbnail-${sermon._id}`}
                    />
                    <div
                      className={`absolute inset-0 bg-black/20 flex items-center justify-center ${
                        currentSermon?._id === sermon._id
                          ? "opacity-100"
                          : "opacity-0 hover:opacity-100"
                      } transition-opacity duration-300`}
                      onClick={() => {
                        handleSelectSermon(sermon);
                        // Scroll to the top where the video player is
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <Button
                        size="lg"
                        className="rounded-full"
                        data-testid={`button-play-sermon-${sermon._id}`}
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    {sermon.series && (
                      <Badge
                        className="absolute top-2 left-2 bg-primary text-primary-foreground"
                        data-testid={`sermon-series-${sermon._id}`}
                      >
                        {sermon.series}
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4 sm:p-6">
                    <h3
                      className={`text-lg sm:text-xl font-semibold mb-2 line-clamp-2 ${
                        currentSermon?._id === sermon._id
                          ? "text-primary"
                          : "text-card-foreground"
                      }`}
                      data-testid={`sermon-title-${sermon._id}`}
                    >
                      {sermon.title}
                    </h3>

                    <div className="flex flex-wrap gap-y-2 items-center text-muted-foreground text-xs sm:text-sm mb-2">
                      <span className="inline-flex items-center mr-4">
                        <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span data-testid={`sermon-speaker-${sermon._id}`}>
                          {sermon.speaker}
                        </span>
                      </span>

                      <span className="inline-flex items-center">
                        <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span data-testid={`sermon-date-${sermon._id}`}>
                          {format(new Date(sermon.date), "MMM d, yyyy")}
                        </span>
                      </span>
                    </div>
                    {sermon.scripture && (
                      <div className="mb-4">
                        <Badge
                          variant="outline"
                          data-testid={`sermon-scripture-${sermon._id}`}
                        >
                          {sermon.scripture}
                        </Badge>
                      </div>
                    )}

                    <p
                      className="text-muted-foreground text-sm mb-4 line-clamp-3"
                      data-testid={`sermon-description-${sermon._id}`}
                    >
                      {sermon.description}
                    </p>

                    {sermon.videoUrl && (
                      <Button
                        size="sm"
                        className="w-full mb-2"
                        data-testid={`button-watch-video-${sermon._id}`}
                        onClick={() => {
                          handleSelectSermon(sermon);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Watch Now
                      </Button>
                    )}
                    {sermon.audioUrl && (
                      <div className="w-full">
                        <AudioPlayer
                          audioUrl={sermon.audioUrl}
                          title={sermon.title}
                          speaker={sermon.speaker}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p
                  className="text-muted-foreground text-lg"
                  data-testid="no-sermons-found"
                >
                  {searchQuery
                    ? "No sermons found matching your search."
                    : "No sermons available at this time."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
