"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-2 rounded-full bg-stone-900/85 backdrop-blur-xl border border-amber-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] select-none",
        className
      )}
    >
      {items.map((item, idx) => {
        const isHovered = hoveredIdx === idx;
        return (
          <a
            key={item.title}
            href={item.href}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="relative p-2.5 rounded-full text-stone-300 hover:text-amber-300 transition-colors focus:outline-hidden"
          >
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: -45, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-stone-900 border border-amber-500/40 text-[11px] font-mono font-semibold text-amber-200 whitespace-nowrap shadow-lg pointer-events-none"
                >
                  {item.title}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Icon with scale effect */}
            <motion.div
              animate={{
                scale: isHovered ? 1.25 : 1,
                y: isHovered ? -2 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center justify-center w-6 h-6"
            >
              {item.icon}
            </motion.div>
          </a>
        );
      })}
    </div>
  );
}
