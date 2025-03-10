import React from "react";
import { Music, Play, Pause } from "lucide-react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
}

interface PlaylistProps {
  tracks: Track[];
  currentTrackId?: string;
  isPlaying?: boolean;
  onTrackSelect: (track: Track) => void;
  theme?: "neomorphic" | "glassmorphic";
}

const Playlist = ({
  tracks = [],
  currentTrackId = "",
  isPlaying = false,
  onTrackSelect,
  theme = "neomorphic",
}: PlaylistProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Determine container styles based on theme
  const containerStyles =
    theme === "neomorphic"
      ? "bg-white bg-opacity-10 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_8px_16px_rgba(0,0,0,0.2)]"
      : "bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20";

  // Determine active item styles based on theme
  const activeItemStyles =
    theme === "neomorphic"
      ? "bg-white bg-opacity-20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_4px_8px_rgba(0,0,0,0.15)]"
      : "bg-white bg-opacity-20 border border-white border-opacity-30";

  // Determine icon container styles based on theme
  const iconContainerStyles =
    theme === "neomorphic"
      ? "bg-gradient-to-br from-purple-500 to-blue-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_4px_8px_rgba(0,0,0,0.15)]"
      : "bg-purple-500 bg-opacity-70 backdrop-blur-md border border-purple-400 border-opacity-30";

  return (
    <div className={`w-full rounded-xl p-4 ${containerStyles}`}>
      <h3 className="text-lg font-semibold mb-3 text-white">Playlist</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {tracks.map((track) => {
          const isActive = track.id === currentTrackId;

          return (
            <div
              key={track.id}
              onClick={() => onTrackSelect(track)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                isActive
                  ? activeItemStyles
                  : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${iconContainerStyles}`}
                >
                  {isActive && isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : isActive ? (
                    <Play className="h-5 w-5 text-white" />
                  ) : (
                    <Music className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{track.title}</p>
                  <p className="text-xs text-gray-300">{track.artist}</p>
                </div>
              </div>
              <span className="text-sm text-gray-300">
                {formatTime(track.duration)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Playlist;
