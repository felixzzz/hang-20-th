"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import HeroCover from "@/components/HeroCover";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WisdomQuote from "@/components/WisdomQuote";
import EventDetails from "@/components/EventDetails";
import HistoryTimeline from "@/components/HistoryTimeline";
import PhotoGallery from "@/components/PhotoGallery";
import RsvpSection from "@/components/RsvpSection";
import DonationSection from "@/components/DonationSection";
import LocationMap from "@/components/LocationMap";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";
import AmbientLanternCanvas from "@/components/AmbientLanternCanvas";

function InvitationContent() {
  const searchParams = useSearchParams();
  const rawTo = searchParams.get("to") || "";
  const guestName = rawTo ? rawTo.replace(/\+/g, " ") : "Bapak / Ibu / Saudara/i";

  const [isOpened, setIsOpened] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);

  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpened]);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setHasStartedAudio(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleReopen = () => {
    window.scrollTo(0, 0);
    setIsOpened(false);
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

      {/* Ambient Floating Lantern Dust */}
      {isOpened && <AmbientLanternCanvas />}

      {/* Main Invitation Layout - Always rendered for accessibility & SEO */}
      <div className="transition-opacity duration-700">
        <Navbar />
        <HeroSection guestName={guestName} />
        <WisdomQuote />
        <EventDetails />
        <HistoryTimeline />
        <PhotoGallery />
        <RsvpSection initialGuestName={guestName === "Bapak / Ibu / Saudara/i" ? "" : guestName} />
        <DonationSection />
        <LocationMap />
        <Footer onReopenEnvelope={handleReopen} />
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#2a0e0e] text-amber-300 font-serif">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <span className="text-sm tracking-widest font-chinese">廣航佛堂 • 廿週年堂慶</span>
          </div>
        </div>
      }
    >
      <LanguageProvider>
        <InvitationContent />
      </LanguageProvider>
    </Suspense>
  );
}
