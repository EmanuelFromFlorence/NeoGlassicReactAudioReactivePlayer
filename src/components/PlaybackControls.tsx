import React from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";

interface PlaybackControlsProps {
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  volume?: number;
  isMuted?: boolean;
  onPlayPause?: () => void;
  onVolumeChange?: (value: number[]) => void;
  onMuteToggle?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  theme?: "neomorphic" | "glassmorphic";
}

const PlaybackControls = ({
  isPlaying = false,
  currentTime = 0,
  duration = 180, // 3 minutes as default duration
  volume = 75,
  isMuted = false,
  onPlayPause = () => {},
  onVolumeChange = () => {},
  onMuteToggle = () => {},
  onNext = () => {},
  onPrevious = () => {},
  theme = "neomorphic",
}: PlaybackControlsProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Determine button styles based on theme
  const smallButtonStyles =
    theme === "neomorphic"
      ? "bg-white bg-opacity-10 hover:bg-opacity-20 shadow-[0_4px_8px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.1)]"
      : "bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-md border border-white border-opacity-20";

  const playButtonStyles =
    theme === "neomorphic"
      ? "bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-[0_8px_16px_rgba(0,0,0,0.3),_inset_0_1px_1px_rgba(255,255,255,0.2)]"
      : "bg-purple-500 bg-opacity-70 hover:bg-opacity-80 backdrop-blur-md border border-purple-400 border-opacity-30";

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 text-white">
      <div className="flex items-center gap-4 w-full md:w-auto justify-center">
        <Button
          variant="ghost"
          size="icon"
          className={`w-10 h-10 rounded-full ${smallButtonStyles}`}
          onClick={onPrevious}
        >
          <SkipBack className="h-5 w-5 text-white" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`w-16 h-16 rounded-full ${playButtonStyles}`}
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-white" />
          ) : (
            <Play className="h-8 w-8 text-white ml-1" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`w-10 h-10 rounded-full ${smallButtonStyles}`}
          onClick={onNext}
        >
          <SkipForward className="h-5 w-5 text-white" />
        </Button>
      </div>

      <div className="text-sm text-gray-300 w-full md:w-auto text-center">
        <span>{formatTime(currentTime)}</span>
        <span className="mx-2">/</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <Button
          variant="ghost"
          size="icon"
          className={`h-10 w-10 rounded-full ${smallButtonStyles}`}
          onClick={onMuteToggle}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 text-white" />
          )}
        </Button>
        <Slider
          defaultValue={[volume]}
          value={[volume]}
          max={100}
          step={1}
          className="w-28 md:w-32"
          onValueChange={onVolumeChange}
        />
      </div>
    </div>
  );
};

export default PlaybackControls;
