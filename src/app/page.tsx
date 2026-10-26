"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HeroCover from "@/components/HeroCover";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WisdomQuote from "@/components/WisdomQuote";
import EventDetails from "@/components/EventDetails";
import HistoryTimeline from "@/components/HistoryTimeline";
import PhotoGallery from "@/components/PhotoGallery";
import RsvpSection from "@/components/RsvpSection";
import LocationMap from "@/components/LocationMap";
import ShareGenerator from "@/components/ShareGenerator";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";

function InvitationContent() {
  const searchParams = useSearchParams();
  const rawTo = searchParams.get("to") || "";
  const guestName = rawTo ? rawTo.replace(/\+/g, " ") : "Bapak / Ibu / Saudara/i";

  const [isOpened, setIsOpened] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setHasStartedAudio(true);
    // Smooth scroll down to header
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleReopen = () => {
    setIsOpened(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-fothang-ivory relative text-fothang-dark">
      {/* Interactive Envelope Cover Overlay */}
      <HeroCover
        guestName={guestName}
        isOpen={isOpened}
        onOpen={handleOpenInvitation}
      />

      {/* Floating Audio Controller */}
      <AudioPlayer autoPlayTrigger={hasStartedAudio} />

      {/* Main Invitation Layout */}
      <div className={isOpened ? "opacity-100 transition-opacity duration-1000" : "opacity-0"}>
        <Navbar />
        <HeroSection guestName={guestName} />
        <WisdomQuote />
        <EventDetails />
        <HistoryTimeline />
        <PhotoGallery />
        <RsvpSection initialGuestName={guestName === "Bapak / Ibu / Saudara/i" ? "" : guestName} />
        <LocationMap />
        <ShareGenerator />
        <Footer onReopenEnvelope={handleReopen} />
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#2a0e0e] text-fothang-gold-300 font-serif">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-fothang-gold-400 border-t-transparent animate-spin" />
            <span className="text-sm tracking-widest font-chinese">廣航佛堂 • 廿週年堂慶</span>
          </div>
        </div>
      }
    >
      <InvitationContent />
    </Suspense>
  );
}
