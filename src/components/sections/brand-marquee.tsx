"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { ROUTES } from "@/lib/routes";
import type { BrandFrontofficeResponse } from "@/lib/api/types";

interface BrandMarqueeProps {
  brands: BrandFrontofficeResponse[];
}

export function BrandMarquee({ brands }: BrandMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, velocity: 0, lastX: 0, lastTime: 0 });

  const doubled = brands;

  // Auto-scroll animation
  useEffect(() => {
    const track = trackRef.current;
    if (!track || isPaused || isDragging) return;

    let animId: number;
    let scrollPos = track.scrollLeft;
    const speed = 0.5;

    const animate = () => {
      scrollPos += speed;
      // Reset to start of first set when reaching end of first set
      const halfScroll = track.scrollWidth / 2;
      if (scrollPos >= halfScroll) {
        scrollPos -= halfScroll;
      }
      track.scrollLeft = scrollPos;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, isDragging]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    setIsDragging(true);
    dragState.current = {
      startX: e.clientX,
      scrollLeft: track.scrollLeft,
      velocity: 0,
      lastX: e.clientX,
      lastTime: Date.now(),
    };
    track.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const track = trackRef.current;
    if (!track) return;

    const dx = e.clientX - dragState.current.startX;
    const now = Date.now();
    const dt = now - dragState.current.lastTime;

    if (dt > 0) {
      dragState.current.velocity = (e.clientX - dragState.current.lastX) / dt;
    }
    dragState.current.lastX = e.clientX;
    dragState.current.lastTime = now;

    track.scrollLeft = dragState.current.scrollLeft - dx;
  }, [isDragging]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const track = trackRef.current;
    if (!track) return;

    setIsDragging(false);
    track.releasePointerCapture(e.pointerId);

    // Momentum scroll
    let velocity = dragState.current.velocity * 15;
    const decelerate = () => {
      if (Math.abs(velocity) < 0.1) return;
      track.scrollLeft -= velocity;
      velocity *= 0.95;
      requestAnimationFrame(decelerate);
    };
    requestAnimationFrame(decelerate);
  }, [isDragging]);

  if (brands.length === 0) return null;

  return (
    <div
      className="group/marquee relative -mx-4 px-4 sm:mx-0 sm:px-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#FBFCFD] to-transparent sm:w-20" />
      {/* <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#FBFCFD] to-transparent sm:w-20" /> */}

      <div
        ref={trackRef}
        // onPointerDown={onPointerDown}
        // onPointerMove={onPointerMove}
        // onPointerUp={onPointerUp}
        // onPointerCancel={onPointerUp}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide sm:gap-5"
        style={{ cursor: isDragging ? "grabbing" : "grab", userSelect: "none" }}
      >
        {doubled.map((brand, i) => (
          <Link
            key={`${brand.id}-${i}`}
            href={ROUTES.brandDetail(brand.slug ?? "")}
            className="group/brand flex shrink-0 flex-col items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`${brand.persianName} — قطعات یدکی`}
            tabIndex={isDragging ? -1 : 0}
          >
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm shadow-slate-100/50 transition-all duration-300 group-hover/brand:-translate-y-1 group-hover/brand:border-slate-200 group-hover/brand:shadow-lg group-hover/brand:shadow-slate-200/60">
              {brand.iconUrl ? (
                <Image
                  src={brand.iconUrl}
                  alt={`لوگوی ${brand.persianName}`}
                  width={80}
                  height={80}
                  className="h-14 w-14 object-contain transition-transform duration-300 group-hover/brand:scale-110"
                  loading="lazy"
                />
              ) : (
                <span className="text-lg font-bold text-slate-300 transition-colors group-hover/brand:text-slate-500">
                  {brand.englishName?.slice(0, 3) ?? ""}
                </span>
              )}
            </div>

            <span className="max-w-[8rem] truncate text-center text-xs font-medium text-slate-500 transition-colors group-hover/brand:text-slate-800">
              {brand.persianName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
