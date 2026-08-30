'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import image1 from '../../../public/AllImages/jetson_Sarkitshala.webp';
import image2 from '../../../public/AllImages/image1.webp';
import image3 from '../../../public/AllImages/image11.webp';
import image4 from '../../../public/AllImages/image13.webp';
import image5 from '../../../public/AllImages/image7.webp';
import image6 from '../../../public/AllImages/image9.webp';
import image7 from '../../../public/AllImages/image6.webp';
import image8 from '../../../public/AllImages/RGBLED.webp';

const posts = [
  { id: 1, slug: "/jetson", title: "NVIDIA Jetson Nano Developer Kit", image: image1 },
  { id: 2, slug: "arduino/interfacing-led", title: "Control an LED with Arduino", image: image2 },
  { id: 3, slug: "arduino/interfacing-rgb-led", title: "Interfacing RGB LED with Arduino", image: image3 },
  { id: 4, slug: "arduino/interfacing-seven-segment-display", title: "Interfacing 7-Segment Display", image: image4 },
  { id: 5, slug: "arduino/interfacing-dc-motor", title: "Interfacing DC Motor", image: image5 },
  { id: 6, slug: "arduino/interfacing-oled-display-module", title: "Interfacing OLED Display", image: image6 },
  { id: 7, slug: "arduino/interfacing-pir-sensor", title: "Interfacing PIR Sensor", image: image7 },
  { id: 8, slug: "arduino/interfacing-dht22", title: "Interfacing DHT11 Sensor", image: image8 },
];

const RecentPosts = () => {
  const listRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list || window.innerWidth < 768) return;

    let frame;
    let pos = 0;

    const step = () => {
      if (!isHovered && list) {
        pos += 0.6;
        const maxScroll = list.scrollHeight - list.clientHeight;
        if (pos >= maxScroll) pos = 0;
        list.scrollTop = pos;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isHovered]);

  return (
    <div className="w-full h-[400px] rounded-2xl border border-border bg-card overflow-hidden flex flex-col">

      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-border bg-card">
        <span className="text-sm font-semibold text-foreground">Recent Posts</span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Latest
        </span>
      </div>

      {/* Scrollable List */}
      <ul
        ref={listRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scrollbar-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {posts.map(({ id, slug, title, image }) => (
          <li key={id}>
            <Link
              href={`/${slug}`}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent border border-transparent hover:border-border transition-all duration-200 group"
            >
              {/* Thumbnail */}
              <div className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title */}
              <p className="text-[13px] font-medium leading-snug text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                {title}
              </p>

              {/* Arrow */}
              <svg
                className="w-3.5 h-3.5 shrink-0 text-muted-foreground/40 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all ml-auto"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent rounded-b-2xl" />
    </div>
  );
};

export default RecentPosts;