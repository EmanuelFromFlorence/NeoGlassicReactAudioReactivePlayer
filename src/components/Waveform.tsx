import React, { useEffect, useRef, useState } from "react";
import { Slider } from "./ui/slider";

interface WaveformProps {
  audioUrl?: string;
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  onSeek?: (time: number) => void;
}

const Waveform = ({
  audioUrl = "https://example.com/audio.mp3",
  currentTime = 0,
  duration = 180, // 3 minutes default
  isPlaying = false,
  onSeek = () => {},
}: WaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>(
    Array(100)
      .fill(0)
      .map(() => Math.random() * 0.8 + 0.2), // Generate dummy waveform data
  );

  // Draw waveform animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / waveformData.length;
      const barGap = 2;
      const scaleFactor = canvas.height * 0.8;

      waveformData.forEach((amplitude, index) => {
        const x = index * (barWidth + barGap);
        const height = amplitude * scaleFactor;
        const y = (canvas.height - height) / 2;

        // Calculate progress position
        const progress = currentTime / duration;
        const isPlayed = index / waveformData.length < progress;

        // Set color based on whether this section has been played
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        if (isPlayed) {
          gradient.addColorStop(0, "#4c1d95"); // purple-900
          gradient.addColorStop(1, "#8b5cf6"); // purple-500
        } else {
          gradient.addColorStop(0, "#475569"); // slate-600
          gradient.addColorStop(1, "#94a3b8"); // slate-400
        }
        ctx.fillStyle = gradient;

        // Draw with rounded corners
        const radius = Math.min(barWidth / 2, height / 2, 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, y + height - radius);
        ctx.quadraticCurveTo(
          x + barWidth,
          y + height,
          x + barWidth - radius,
          y + height,
        );
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
      });
    };

    draw();

    if (isPlaying) {
      const interval = setInterval(draw, 50);
      return () => clearInterval(interval);
    }
  }, [waveformData, currentTime, duration, isPlaying]);

  const handleSliderChange = (value: number[]) => {
    onSeek((value[0] * duration) / 100);
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-24">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          width={600}
          height={96}
        />
        <div className="absolute inset-0 flex items-center">
          <Slider
            defaultValue={[0]}
            value={[(currentTime / duration) * 100]}
            onValueChange={handleSliderChange}
            max={100}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Waveform;
