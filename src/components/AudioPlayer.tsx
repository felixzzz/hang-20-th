"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music2 } from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";

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
  const { cms } = useCms();
  const { showId, showZh } = useLanguage();
  const videoId = cms.audio?.youtubeVideoId || "__vWA6Lv9pE";
  const titleId = cms.audio?.titleId || "Musik Khidmat";
  const titleZh = cms.audio?.titleZh || "梵音清曲";

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const playerRef = useRef<any>(null);

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
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: videoId,
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
          playerRef.current = null;
        } catch (e) {
          // ignore
        }
      }
    };
  }, [videoId]);

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
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Matikan Musik" : "Putar Musik"}
          className={`group flex items-center gap-2 px-3 py-2 rounded-full shadow-md border backdrop-blur-md transition-all duration-300 cursor-pointer ${
            isPlaying
              ? "bg-[#7c1818]/95 text-[#fbf5e8] border-[#dfba6d]/50"
              : "bg-white/90 text-stone-700 border-stone-200 hover:border-[#dfba6d]"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-700 ${
              isPlaying ? "animate-spin-slow bg-[#dfba6d] text-[#7c1818]" : "bg-stone-100 text-stone-600"
            }`}
          >
            <Music2 className="w-3 h-3" />
          </div>

          <span className="text-[11px] font-serif font-medium tracking-wide pr-1 hidden sm:inline">
            {isPlaying ? (
              <>
                {showId && <span>{titleId}</span>}
                {showId && showZh && <span> • </span>}
                {showZh && <span className="font-chinese">{titleZh}</span>}
              </>
            ) : (
              <>
                {showId && <span>Putar Musik</span>}
                {showId && showZh && <span> • </span>}
                {showZh && <span className="font-chinese">播放樂曲</span>}
              </>
            )}
          </span>

          {isPlaying ? (
            <Volume2 className="w-3.5 h-3.5 text-[#dfba6d]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
          )}
        </button>
      </div>
    </>
  );
}
