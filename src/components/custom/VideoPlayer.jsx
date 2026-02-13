import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { videoData } from "@/data/videoData";
import {
  Volume2, VolumeX, Play, Pause, X,
  ChevronDown, RotateCcw, RotateCcw as Rewind10,
  RotateCw as Forward10, Maximize
} from "lucide-react";
import 'youtube-video-element';

const VideoPlayer = ({ video, isMinimized, setMinimized, onClose, onVideoSwitch }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const controls = useAnimation();

  // --- State ---
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isEnded, setIsEnded] = useState(false);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);

  // --- Playback Sync ---
  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      if (isPlaying) {
        player.play().catch(() => setIsPlaying(false));
      } else {
        player.pause();
      }
    }
  }, [isPlaying, video]); // Re-run when video changes too

  useEffect(() => {
    // Reset all playback states to initial values
    setProgress(0);
    setDuration(0);
    setIsEnded(false);

    // Force the video element to the start if it exists
    if (playerRef.current) {
      playerRef.current.currentTime = 0;
    }

    // Auto-play the new video
    setIsPlaying(true);
  }, [video]);

  if (!video) return null;

  // --- Handlers ---
  const handleSkip = (seconds) => {
    if (playerRef.current) {
      playerRef.current.currentTime += seconds;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleDragEnd = (event, info) => {
    // If the user drags down more than 150px, minimize the player
    if (info.offset.y > 150) {
      setMinimized(true);
    } else {
      // If they didn't drag far enough, snap back to top
      controls.start({ y: 0 });
    }
  };

  const handleOnPlay = () => { setIsPlaying(true); setIsEnded(false); };
  const handleOnPause = () => setIsPlaying(false);
  const handleOnEnded = () => { setIsPlaying(false); setIsEnded(true); };

  const handleRestart = (e) => {
    if (e) e.stopPropagation();
    if (playerRef.current) {
      playerRef.current.currentTime = 0;
      setIsPlaying(true);
      setIsEnded(false);
    }
  };

  const handleTogglePlay = (e) => {
    if (e) e.stopPropagation();
    if (isEnded) handleRestart();
    else setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (e) => {
    if (!isSeeking && e.target.duration) {
      setProgress(e.target.currentTime / e.target.duration);
    }
  };

  const handleDurationChange = (e) => {
    if (e.target.duration) setDuration(e.target.duration);
  };

  const handleSeekEnd = (val) => {
    setIsSeeking(false);
    if (playerRef.current) {
      playerRef.current.currentTime = (val[0] / 100) * duration;
    }
  };

  const handleVolumeChange = (val) => {
    const newVolume = val[0] / 100;
    setVolume(newVolume);
    if (newVolume > 0) setPrevVolume(newVolume);
    if (playerRef.current) playerRef.current.volume = newVolume;
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (volume > 0) {
      setPrevVolume(volume);
      handleVolumeChange([0]);
    } else {
      handleVolumeChange([prevVolume * 100]);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mm = Math.floor(seconds / 60);
    const ss = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <motion.div
      ref={containerRef}
      layout
      onDragEnd={handleDragEnd}
      initial={{ y: "100%" }}
      animate={{
        y: 0,
        height: isMinimized ? "72px" : "100vh",
        backgroundColor: isMinimized ? "rgba(0,0,0,0)" : "hsl(var(--background))",
        bottom: 0
      }}
      className="fixed left-0 right-0 z-50 flex flex-col overflow-hidden text-foreground shadow-2xl"
    >
      {/* 1. VIDEO AREA */}
      <div className={`relative bg-black transition-all ${isMinimized ? "flex items-center h-full p-2 gap-3" : "w-full aspect-video"}`}>

        {!isMinimized && (
          <>
            {/* Top Left: Minimize */}
            <button
              onClick={(e) => { e.stopPropagation(); setMinimized(true); }}
              className="absolute top-4 left-4 z-30 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors"
            >
              <ChevronDown size={24} />
            </button>

            {/* Top Right: Close Player (Your Request) */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-4 right-4 z-30 p-2 bg-black/50 rounded-full text-white hover:bg-red-600 transition-colors"
            >
              <X size={24} />
            </button>
          </>
        )}

        {/* --- CENTER SYNCED CONTROLS --- */}
        {!isMinimized && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 cursor-pointer"
            onClick={handleTogglePlay}
          >
            <AnimatePresence>
              {(!isPlaying || isEnded) && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  className="p-6 bg-white/10 rounded-full backdrop-blur-md border border-white/20 shadow-xl"
                >
                  {isEnded ? (
                    <RotateCcw size={48} className="text-white" />
                  ) : (
                    <Play size={48} className="text-white fill-white" />
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className={isMinimized ? "w-28 h-full flex justify-center items-center flex-shrink-0 rounded overflow-hidden" : "w-full h-full"}>
          <youtube-video
            ref={playerRef}
            src={video.mediaUrl}
            className="h-full w-auto"
            playsinline
            params={`modestbranding=1&rel=0&controls=0&disablekb=1&iv_load_policy=3&origin=${window.location.origin}`}
            onplay={handleOnPlay}
            onpause={handleOnPause}
            onended={handleOnEnded}
            ontimeupdate={handleTimeUpdate}
            ondurationchange={handleDurationChange}
          />
        </div>

        {/* Mini Player UI */}
        {isMinimized && (
          <div className="flex-1 flex justify-between items-center pr-2 min-w-0" onClick={() => setMinimized(false)}>
            <p className="text-sm font-bold truncate pr-4">{video.title}</p>
            <div className="flex items-center gap-4 flex-shrink-0">
              <button onClick={handleTogglePlay}>
                {isEnded ? <RotateCcw size={20} /> : isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); onClose(); }}>
                <X size={22} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. BOTTOM CONTROLS AREA */}
      {!isMinimized && (
        <>
          <div className="px-4 py-3 bg-card border-b">
            <Slider
              value={[progress * 100]}
              max={100}
              step={0.1}
              onValueChange={(v) => { setIsSeeking(true); setProgress(v[0] / 100); }}
              onValueCommit={handleSeekEnd}
              className="mb-4 cursor-pointer"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                {/* Back 10s */}
                <button onClick={() => handleSkip(-10)} className="flex flex-col items-center hover:text-red-500 transition-colors">
                  <Rewind10 size={22} />
                  <span className="text-[10px] font-bold">-10s</span>
                </button>

                {/* Play/Pause */}
                <button onClick={handleTogglePlay} className="hover:text-red-500 transition-colors">
                  {isEnded ? <RotateCcw size={24} /> : isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>

                {/* Forward 10s */}
                <button onClick={() => handleSkip(10)} className="flex flex-col items-center hover:text-red-500 transition-colors">
                  <Forward10 size={22} />
                  <span className="text-[10px] font-bold">+10s</span>
                </button>

                <div className="flex items-center gap-3 w-32 ml-2">
                  <button onClick={toggleMute}>
                    {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <Slider value={[volume * 100]} max={100} onValueChange={handleVolumeChange} className="w-20 cursor-pointer" />
                </div>

                <span className="text-xs font-mono text-muted-foreground tabular-nums">
                  {formatTime(progress * duration)} / {formatTime(duration)}
                </span>
              </div>

              {/* Fullscreen Button beside progress info (Your Request) */}
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                title="Toggle Fullscreen"
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>

          {/* 3. RECOMMENDATIONS AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <h2 className="text-xl font-bold leading-tight">{video.title}</h2>
            <hr className="opacity-10" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Up Next</h3>
            <div className="space-y-4">
              {videoData.categories.map((cat) => (
                <React.Fragment key={cat.category.slug}>
                  {cat.contents.filter(v => v.slug !== video.slug).map((item) => (
                    <div key={item.slug} className="flex gap-3 cursor-pointer group active:scale-95 transition-all" onClick={() => onVideoSwitch(item)}>
                      <div className="w-32 aspect-video rounded-md overflow-hidden bg-muted flex justify-center items-center flex-shrink-0">
                        <img src={item.thumbnailUrl} className="object-cover h-full group-hover:scale-110 transition-transform" alt="" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold line-clamp-2 group-hover:text-red-500 transition-colors">{item.title}</h4>
                        <p className="text-[10px] text-muted-foreground mt-1">Dino Ventures</p>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default VideoPlayer;