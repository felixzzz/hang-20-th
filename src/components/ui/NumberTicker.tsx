"use client";

import React, { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  padZero?: boolean;
}

export function NumberTicker({
  value,
  direction = "up",
  className,
  padZero = true,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(direction === "down" ? value : 0);
  const springVal = useSpring(motionVal, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    motionVal.set(value);
  }, [motionVal, value]);

  useEffect(() => {
    return springVal.on("change", (latest) => {
      if (ref.current) {
        const rounded = Math.round(latest);
        ref.current.textContent = padZero && rounded < 10 ? `0${rounded}` : `${rounded}`;
      }
    });
  }, [springVal, padZero]);

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums font-mono tracking-tight", className)}
    >
      {padZero && value < 10 ? `0${value}` : `${value}`}
    </span>
  );
}
