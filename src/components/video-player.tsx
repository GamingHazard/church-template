import { useEffect, useState } from "react";
import { useSermonContext } from "../contexts/SermonContext";

import axios from "axios";
import { Configs } from "../lib/utils";
import { useAppData } from "../hooks/use-AppData";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  autoplay?: boolean;
  isLiveStream?: boolean;
  sermonId?: string; // Add sermon ID prop
}

declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export function VideoPlayer({ 
  videoUrl, 
  title, 
  autoplay: propAutoplay = false, 
  isLiveStream = false,
  sermonId 
}: VideoPlayerProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(isLiveStream);
  const { currentSermon } = useSermonContext();
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const{refresh} = useAppData();
  
  // Autoplay if there's a current sermon or if autoplay prop is true
  const autoplay = currentSermon !== null || propAutoplay;

 // --- inside your component ---
const trackVideoView = async () => {
  if (hasTrackedView || !sermonId) return; // prevent duplicates in same session

  try {
    const userId = localStorage.getItem('visitor_id') || crypto.randomUUID();
    if (!localStorage.getItem('visitor_id')) {
      localStorage.setItem('visitor_id', userId);
    }

    // Optional: prevent redundant request if this view was already recorded locally
    const viewedKey = `viewed_${sermonId}_${userId}`;
    if (localStorage.getItem(viewedKey)) {
      console.log("Already viewed (local)");
      return;
    }

    console.log("Tracking view for sermon:", sermonId);
    const response = await axios.post(`${Configs.url}/api/views/sermon/${sermonId}/${userId}`);

    if (response.status === 200 || response.status === 201) {
      localStorage.setItem(viewedKey, "true"); // mark locally as viewed
      setHasTrackedView(true);
      refresh(); // update UI
    }
  } catch (error) {
    console.error("Error tracking view:", error);
  }
};


  // Initialize YouTube API
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Setup YouTube API callback
    window.onYouTubeIframeAPIReady = () => {
      if (videoId) {
        const newPlayer = new window.YT.Player(`youtube-player-${videoId}`);
        setPlayer(newPlayer);
      }
    };

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (!videoUrl) {
      setVideoId(null);
      return;
    }

    try {
      // Extract video ID from various YouTube URL formats
      let extractedId: string | null = null;
      let isStreamLink = false;
      
      if (videoUrl.includes('youtube.com')) {
        const url = new URL(videoUrl);
        // Check for live stream URLs
        if (url.pathname.includes('/live/')) {
          extractedId = url.pathname.split('/live/')[1]?.split('/')[0];
          isStreamLink = true;
        } else if (url.searchParams.has('channel')) {
          extractedId = url.searchParams.get('channel');
          isStreamLink = true;
        } else {
          extractedId = url.searchParams.get('v');
        }
      } else if (videoUrl.includes('youtu.be')) {
        extractedId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      }
      
      setIsLive(isStreamLink || isLiveStream);

      if (extractedId && extractedId.length === 11) {
        setVideoId(extractedId);
      } else {
        console.error('Invalid YouTube video ID');
        setVideoId(null);
      }
    } catch (error) {
      console.error('Error parsing video URL:', error);
      setVideoId(null);
    }
  }, [videoUrl]);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-black flex flex-col items-center justify-center text-white">
        <svg
          className="w-16 h-16 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>{videoUrl ? "Invalid video URL" : "Select a sermon to watch"}</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${
    autoplay ? '1' : '0'
  }&origin=${encodeURIComponent(window.location.origin)}&enablejsapi=1&rel=0&modestbranding=1${
    isLive ? '&live=1' : ''
  }&controls=1&showinfo=0&playlist=${videoId}&playsinline=1&fs=1${
    !autoplay ? '&start=0' : ''
  }`;

  return (
   <div className="w-full aspect-video bg-black">
    <iframe
      id={`youtube-player-${videoId}`}
      src={embedUrl}
      title={title || "Video Player"}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      frameBorder="0"
      onLoad={() => {
        // Wait a bit to ensure the iframe is ready
        const checkPlayer = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkPlayer);

            const newPlayer = new window.YT.Player(`youtube-player-${videoId}`, {
              events: {
                onStateChange: (event: any) => {
                  // Detect when user actually clicks play
                  if (event.data === window.YT.PlayerState.PLAYING) {
                    trackVideoView();
                  }
                },
              },
            });

            setPlayer(newPlayer);
          }
        }, 300);
      }}
    />
  </div>
  );
}