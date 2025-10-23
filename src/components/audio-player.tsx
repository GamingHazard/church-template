import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "../lib/utils";
import useSound from "use-sound";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  speaker?: string;
  className?: string;
}

export function AudioPlayer({ audioUrl, title, speaker, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [play, { pause, sound, stop }] = useSound(audioUrl, {
    volume: isMuted ? 0 : volume,
    format: ['mp3', 'wav', 'ogg'],
    html5: true,
    preload: true,
    onplay: () => {
      console.log('Playing audio:', audioUrl);
      setIsPlaying(true);
      setError(null);
    },
    onload: () => {
      console.log('Audio loaded successfully');
      setIsLoading(false);
      setError(null);
    },
    onloaderror: (_id: unknown, err: unknown) => {
      console.error('Error loading audio:', err);
      console.error('Audio URL:', audioUrl);
      setIsLoading(false);
      setError(`Failed to load audio file: ${err}`);
      setIsPlaying(false);
    },
    onplayerror: (_id: unknown, err: unknown) => {
      console.error('Error playing audio:', err);
      setError('Failed to play audio');
      setIsPlaying(false);
    },
    onend: () => {
      console.log('Audio playback ended');
      setIsPlaying(false);
      setCurrentTime(0);
    },
    onpause: () => setIsPlaying(false),
    onstop: () => {
      setIsPlaying(false);
      setCurrentTime(0);
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && sound) {
      interval = setInterval(() => {
        setCurrentTime(sound.seek());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, sound]);

  useEffect(() => {
    if (sound) {
      setDuration(sound.duration());
    }
  }, [sound]);

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (sound) {
      sound.volume(newVolume);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    if (sound) {
      sound.seek(newTime);
      setCurrentTime(newTime);
    }
  };

  const skipForward = () => {
    if (sound) {
      const newTime = Math.min(currentTime + 10, duration);
      sound.seek(newTime);
      setCurrentTime(newTime);
    }
  };

  const skipBackward = () => {
    if (sound) {
      const newTime = Math.max(currentTime - 10, 0);
      sound.seek(newTime);
      setCurrentTime(newTime);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("Audio playback error:", e);
    const audio = e.currentTarget;
    if (audio.error) {
      console.error("Audio error code:", audio.error.code);
      console.error("Audio error message:", audio.error.message);
    }
    setIsPlaying(false);
  };

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none">{title}</h3>
          {speaker && (
            <p className="text-sm text-muted-foreground">{speaker}</p>
          )}
          {error && (
            <p className="text-sm text-red-500">Error: {error}</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={skipBackward}
              title="Skip back 10 seconds"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              onClick={togglePlay}
              variant="outline"
              className="h-10 w-10"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={skipForward}
              title="Skip forward 10 seconds"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-16 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}