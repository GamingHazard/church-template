import { useEffect, useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  autoplay?: boolean;
}

export function VideoPlayer({ videoUrl, thumbnailUrl, title, autoplay = false }: VideoPlayerProps) {
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (!videoUrl) {
      setVideoId(null);
      return;
    }

    try {
      // Extract video ID from various YouTube URL formats
      let extractedId: string | null = null;
      
      if (videoUrl.includes('youtube.com')) {
        const url = new URL(videoUrl);
        extractedId = url.searchParams.get('v');
      } else if (videoUrl.includes('youtu.be')) {
        extractedId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      }

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
  }&origin=${encodeURIComponent(window.location.origin)}&enablejsapi=1&rel=0&modestbranding=1`;

  return (
    <div className="w-full aspect-video bg-black">
      <iframe
        src={embedUrl}
        title={title || "Video Player"}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        
        frameBorder="0"
      />
    </div>
  );
}