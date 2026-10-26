"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music2 } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface AudioPlayerProps {
  autoPlayTrigger?: boolean;
}

export default function AudioPlayer({ autoPlayTrigger }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube Iframe API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    }

    function initPlayer() {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player("youtube-hidden-player", {
        height: "1",
        width: "1",
        videoId: "__vWA6Lv9pE",
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: "__vWA6Lv9pE",
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            setIsReady(true);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
            }
          },
        },
      });
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // When parent opens invitation, trigger play
  useEffect(() => {
    if (autoPlayTrigger && playerRef.current && isReady) {
      try {
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch (e) {
        console.warn("Autoplay audio blocked or pending interaction:", e);
      }
    }
  }, [autoPlayTrigger, isReady]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Hidden YouTube container */}
      <div className="hidden pointer-events-none" aria-hidden="true">
        <div id="youtube-hidden-player" />
      </div>

      {/* Floating Audio Controller */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Matikan Musik" : "Putar Musik"}
          className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-full shadow-xl border backdrop-blur-md transition-all duration-300 cursor-pointer ${
            isPlaying
              ? "bg-[#831f1f]/95 text-amber-200 border-amber-400/60 shadow-red-950/30"
              : "bg-[#faf7f2]/95 text-stone-800 border-stone-300 hover:border-amber-600"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-700 ${
              isPlaying ? "animate-spin-slow bg-amber-500 text-red-950" : "bg-stone-200 text-stone-600"
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
          </div>

          <span className="text-xs font-serif font-medium tracking-wide pr-1 hidden sm:inline">
            {isPlaying ? "Musik Khidmat" : "Putar Musik"}
          </span>

          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-stone-400 group-hover:text-stone-700" />
          )}
        </button>
      </div>
    </>
  );
}
