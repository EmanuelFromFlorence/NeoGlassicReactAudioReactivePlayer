import React, { useState, useEffect, useRef, useCallback } from "react";
import Waveform from "./Waveform";
import PlaybackControls from "./PlaybackControls";
import Playlist, { Track } from "./Playlist";
import AudioShader from "./AudioShader";
import ThemeToggle from "./ThemeToggle";
import PlaylistImport from "./PlaylistImport";

interface AudioPlayerProps {
  initialTrack?: Track;
  playlist?: Track[];
}

const defaultPlaylist: Track[] = [
  {
    id: "1",
    title: "Lofi Study",
    artist: "Lofi Geek",
    duration: 144,
    audioUrl:
      "https://storage.googleapis.com/media-session/sintel/snow-fight.mp3",
  },
  {
    id: "2",
    title: "Chill Vibes",
    artist: "Chill Music Lab",
    duration: 184,
    audioUrl:
      "https://storage.googleapis.com/media-session/big-buck-bunny/big-buck-bunny-background-music.mp3",
  },
  {
    id: "3",
    title: "Ambient Waves",
    artist: "Ambient Sounds",
    duration: 261,
    audioUrl:
      "https://storage.googleapis.com/media-session/big-buck-bunny/big-buck-bunny-surround-sound.mp3",
  },
  {
    id: "4",
    title: "Meditation",
    artist: "Zen Music",
    duration: 156,
    audioUrl:
      "https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3",
  },
];

const AudioPlayer = ({
  initialTrack,
  playlist: initialPlaylist,
}: AudioPlayerProps) => {
  const [theme, setTheme] = useState<"neomorphic" | "glassmorphic">(
    "neomorphic",
  );
  const [playlist, setPlaylist] = useState<Track[]>(
    initialPlaylist || defaultPlaylist,
  );
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioInitializedRef = useRef<boolean>(false);

  const [currentTrack, setCurrentTrack] = useState<Track>(
    initialTrack || (initialPlaylist || defaultPlaylist)[0],
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrack?.duration || 0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [audioData, setAudioData] = useState<Uint8Array>(
    new Uint8Array(128).fill(128),
  );
  const [audioError, setAudioError] = useState<string>("");

  // Initialize audio context and analyzer on user interaction
  const initializeAudioContext = useCallback(() => {
    if (audioInitializedRef.current) return;

    try {
      if (audioRef.current && !audioContextRef.current) {
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        sourceRef.current = audioContextRef.current.createMediaElementSource(
          audioRef.current,
        );
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        audioInitializedRef.current = true;
      }
    } catch (error) {
      console.error("Error initializing audio context:", error);
      setAudioError("Failed to initialize audio. Please try again.");
    }
  }, []);

  // Update audio data for visualization
  useEffect(() => {
    if (!analyserRef.current || !isPlaying) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateData = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      setAudioData(dataArray);
      requestAnimationFrame(updateData);
    };

    const animationId = requestAnimationFrame(updateData);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

  // Set up audio event listeners
  useEffect(() => {
    if (audioRef.current) {
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current?.duration || 0);
        setAudioError("");
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        playNextTrack();
      };

      const handleError = (e: Event) => {
        console.error("Audio error:", e);
        setAudioError(
          "Failed to load audio. The file may be unavailable or blocked by CORS policy.",
        );
        setIsPlaying(false);
      };

      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("ended", handleEnded);
      audioRef.current.addEventListener("error", handleError);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata,
          );
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          audioRef.current.removeEventListener("ended", handleEnded);
          audioRef.current.removeEventListener("error", handleError);
        }
      };
    }
  }, []);

  // Update volume and mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      setAudioError("");
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Error playing track:", err);
          setAudioError(
            "Failed to play audio. Please try again or select another track.",
          );
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]);

  const handlePlayPause = () => {
    // Initialize audio context on first user interaction
    initializeAudioContext();

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setAudioError("");
          })
          .catch((error) => {
            console.error("Playback error:", error);
            setAudioError(
              "Failed to play audio. The file may be unavailable or blocked by CORS policy.",
            );
            setIsPlaying(false);
          });
      }
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0) setIsMuted(false);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleTrackSelect = (track: Track) => {
    // Initialize audio context on first user interaction
    initializeAudioContext();

    if (track.id === currentTrack.id) {
      handlePlayPause();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const playNextTrack = useCallback(() => {
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id,
    );
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(true);
  }, [currentTrack.id, playlist]);

  const playPreviousTrack = useCallback(() => {
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id,
    );
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrack(playlist[prevIndex]);
    setIsPlaying(true);
  }, [currentTrack.id, playlist]);

  const handleImportPlaylist = (newTracks: Track[]) => {
    setPlaylist(newTracks);
    setCurrentTrack(newTracks[0]);
    setIsPlaying(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "neomorphic" ? "glassmorphic" : "neomorphic");
  };

  // Determine container styles based on theme
  const containerStyles =
    theme === "neomorphic"
      ? "bg-gradient-to-br from-slate-800 to-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.3),_inset_0_1px_1px_rgba(255,255,255,0.1)]"
      : "bg-slate-900 bg-opacity-50 backdrop-blur-xl border border-white border-opacity-10";

  // Determine panel styles based on theme
  const panelStyles =
    theme === "neomorphic"
      ? "bg-white bg-opacity-10 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_8px_16px_rgba(0,0,0,0.2)]"
      : "bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20";

  return (
    <div
      className={`w-full max-w-3xl mx-auto p-8 space-y-6 rounded-2xl relative overflow-hidden ${containerStyles}`}
    >
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        preload="auto"
        crossOrigin="anonymous"
      />

      {/* Theme toggle button */}
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      {/* Playlist import button */}
      <PlaylistImport onImport={handleImportPlaylist} theme={theme} />

      {/* Audio visualization shader */}
      <AudioShader audioData={audioData} isPlaying={isPlaying} />

      <div className="relative z-10">
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl font-bold text-white">
            {currentTrack.title}
          </h2>
          <p className="text-md text-gray-300">{currentTrack.artist}</p>

          {audioError && (
            <p className="text-red-400 text-sm mt-2 px-4 py-2 rounded-lg bg-red-900 bg-opacity-20">
              {audioError}
            </p>
          )}
        </div>

        <div className={`p-5 rounded-xl mb-6 ${panelStyles}`}>
          <Waveform
            audioUrl={currentTrack.audioUrl}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            onSeek={handleSeek}
          />
        </div>

        <div className={`p-4 rounded-xl mb-6 ${panelStyles}`}>
          <PlaybackControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            onPlayPause={handlePlayPause}
            onVolumeChange={handleVolumeChange}
            onMuteToggle={handleMuteToggle}
            onNext={playNextTrack}
            onPrevious={playPreviousTrack}
            theme={theme}
          />
        </div>

        <Playlist
          tracks={playlist}
          currentTrackId={currentTrack.id}
          isPlaying={isPlaying}
          onTrackSelect={handleTrackSelect}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
