import React, { useEffect, useRef } from "react";

interface AudioShaderProps {
  audioData?: Uint8Array;
  isPlaying?: boolean;
}

const AudioShader = ({
  audioData = new Uint8Array(128).fill(128),
  isPlaying = false,
}: AudioShaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    let hue = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, `hsl(${hue}, 80%, 15%)`);
      gradient.addColorStop(1, `hsl(${hue + 60}, 80%, 25%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw audio visualization
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw circular audio visualization
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        Math.min(centerX, centerY) * 0.8,
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = `hsl(${hue + 120}, 80%, 60%)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw frequency bars
      const barCount = audioData.length;
      const barWidth = (Math.PI * 2) / barCount;

      for (let i = 0; i < barCount; i++) {
        const amplitude = audioData[i] / 255; // Normalize to 0-1
        const barHeight = amplitude * (Math.min(centerX, centerY) * 0.5);

        const angle = i * barWidth;
        const x1 =
          centerX + Math.cos(angle) * (Math.min(centerX, centerY) * 0.5);
        const y1 =
          centerY + Math.sin(angle) * (Math.min(centerX, centerY) * 0.5);
        const x2 =
          centerX +
          Math.cos(angle) * (Math.min(centerX, centerY) * 0.5 + barHeight);
        const y2 =
          centerY +
          Math.sin(angle) * (Math.min(centerX, centerY) * 0.5 + barHeight);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsl(${hue + i}, 80%, 60%)`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Animate hue if playing
      if (isPlaying) {
        hue = (hue + 0.5) % 360;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [audioData, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10 rounded-xl opacity-80"
    />
  );
};

export default AudioShader;
