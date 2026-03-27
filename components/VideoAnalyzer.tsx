import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Video, Upload, Play, Pause, Loader2, Camera, Cpu,
  RotateCcw, RotateCw
} from 'lucide-react';

import { analyzeTrafficVideoFrame } from '../services/ai';
import { ViolationRecord, WeatherState } from '../types';

interface VideoAnalyzerProps {
  weather: WeatherState;
  onViolationDetected: (v: ViolationRecord) => void;
}

const VideoAnalyzer: React.FC<VideoAnalyzerProps> = ({ weather }) => {

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();

    setIsPlaying(!isPlaying);
  };

  const seek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    canvasRef.current.width = 640;
    canvasRef.current.height = 360;

    ctx.drawImage(videoRef.current, 0, 0, 640, 360);

    const image = canvasRef.current.toDataURL('image/jpeg');
    setIsAnalyzing(true);

    await analyzeTrafficVideoFrame(image, weather);

    setIsAnalyzing(false);
  }, [weather]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(captureFrame, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, captureFrame]);

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">

      {/* HEADER */}
      <header className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black">Vision Intelligence Unit</h2>
          <p className="text-slate-500">Video analysis system</p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-white border rounded-xl flex gap-2"
        >
          <Upload size={16} /> Upload Video
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleVideoUpload}
          className="hidden"
          accept="video/*"
        />
      </header>

      {/* GRID FIXED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-full overflow-hidden">

        {/* VIDEO SECTION */}
        <div className="lg:col-span-8 w-full min-w-0">

          <div className="w-full max-w-full bg-black rounded-3xl overflow-hidden aspect-video relative">

            {videoUrl ? (
              <>
                {/* VIDEO FIXED */}
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full max-w-full object-contain"
                  onTimeUpdate={(e) =>
                    setProgress(
                      (e.currentTarget.currentTime /
                        e.currentTarget.duration) * 100
                    )
                  }
                  autoPlay
                  muted
                />

                {/* CONTROLS */}
                <div className="absolute bottom-0 w-full p-4 flex items-center gap-4 bg-black/60">
                  <button onClick={() => seek(-10)}>
                    <RotateCcw size={18} />
                  </button>

                  <button onClick={togglePlay}>
                    {isPlaying ? <Pause /> : <Play />}
                  </button>

                  <button onClick={() => seek(10)}>
                    <RotateCw size={18} />
                  </button>

                  <div className="flex-1 h-1 bg-gray-500">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-full flex items-center justify-center text-gray-400 cursor-pointer"
              >
                <Video size={50} />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-4 w-full min-w-0">
          <div className="bg-slate-900 text-white p-6 rounded-3xl h-full flex items-center justify-center">
            {isAnalyzing ? (
              <Loader2 className="animate-spin" />
            ) : (
              <p>Awaiting Video Input...</p>
            )}
          </div>
        </div>

      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default VideoAnalyzer;