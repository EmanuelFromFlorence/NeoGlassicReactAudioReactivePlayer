import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Import } from "lucide-react";
import { Track } from "./Playlist";

interface PlaylistImportProps {
  onImport: (tracks: Track[]) => void;
  theme: "neomorphic" | "glassmorphic";
}

const PlaylistImport = ({ onImport, theme }: PlaylistImportProps) => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      // Validate the imported data
      if (!Array.isArray(parsed)) {
        throw new Error("Imported data must be an array");
      }

      const validTracks = parsed.filter((track) => {
        return (
          typeof track === "object" &&
          track !== null &&
          typeof track.id === "string" &&
          typeof track.title === "string" &&
          typeof track.artist === "string" &&
          typeof track.duration === "number" &&
          typeof track.audioUrl === "string"
        );
      });

      if (validTracks.length === 0) {
        throw new Error("No valid tracks found in the imported data");
      }

      onImport(validTracks);
      setJsonInput("");
      setError("");
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
    }
  };

  const sampleJson = JSON.stringify(
    [
      {
        id: "sample1",
        title: "Sample Track 1",
        artist: "Artist Name",
        duration: 180,
        audioUrl: "https://example.com/track1.mp3",
      },
      {
        id: "sample2",
        title: "Sample Track 2",
        artist: "Another Artist",
        duration: 240,
        audioUrl: "https://example.com/track2.mp3",
      },
    ],
    null,
    2,
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 left-4 z-20 rounded-full w-10 h-10 ${
            theme === "neomorphic"
              ? "bg-white bg-opacity-10 shadow-[0_4px_8px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.1)]"
              : "bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-20"
          }`}
        >
          <Import className="h-5 w-5 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={
          theme === "neomorphic"
            ? "bg-gradient-to-br from-slate-800 to-slate-900 border-none shadow-[0_20px_50px_rgba(0,0,0,0.3),_inset_0_1px_1px_rgba(255,255,255,0.1)]"
            : "bg-slate-900 bg-opacity-50 backdrop-blur-xl border border-white border-opacity-20"
        }
      >
        <DialogHeader>
          <DialogTitle className="text-white">Import Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`Paste your playlist JSON here\n\nExample format:\n${sampleJson}`}
            className="h-60 font-mono text-sm bg-slate-800 bg-opacity-50 border-slate-700"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setJsonInput(sampleJson)}
              className={
                theme === "neomorphic"
                  ? "bg-white bg-opacity-10 border-none shadow-[0_4px_8px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.1)] text-white"
                  : "bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 text-white"
              }
            >
              Load Example
            </Button>
            <Button
              onClick={handleImport}
              className={
                theme === "neomorphic"
                  ? "bg-gradient-to-br from-purple-500 to-blue-600 border-none shadow-[0_4px_8px_rgba(0,0,0,0.3),_inset_0_1px_1px_rgba(255,255,255,0.2)]"
                  : "bg-purple-500 bg-opacity-70 backdrop-blur-md border border-purple-400 border-opacity-30"
              }
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistImport;
