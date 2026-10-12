'use client';

import React, { useEffect, useRef } from 'react';
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
  { id: 1, href: '/jetson', title: 'NVIDIA Jetson Nano Developer Kit', image: image1 },
  { id: 2, href: '/arduino/interfacing-led', title: 'Control an LED with Arduino', image: image2 },
  { id: 3, href: '/arduino/interfacing-rgb-led', title: 'Interfacing RGB LED with Arduino', image: image3 },
  { id: 4, href: '/arduino/interfacing-seven-segment-display', title: 'Interfacing 7-Segment Display', image: image4 },
  { id: 5, href: '/arduino/interfacing-dc-motor', title: 'Interfacing DC Motor', image: image5 },
  { id: 6, href: '/arduino/interfacing-oled-display-module', title: 'Interfacing OLED Display', image: image6 },
  { id: 7, href: '/arduino/interfacing-pir-sensor', title: 'Interfacing PIR Sensor', image: image7 },
  { id: 8, href: '/arduino/interfacing-dht22', title: 'Interfacing DHT22 Sensor', image: image8 },
];

const RecentPosts = () => {
  const listRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    const desktop = window.matchMedia('(min-width: 768px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!desktop.matches || reduceMotion.matches) return undefined;

    let frame;
    let pos = list.scrollTop;

    const step = () => {
      if (!pausedRef.current) {
        const maxScroll = list.scrollHeight - list.clientHeight;
        pos += 0.5;
        if (pos >= maxScroll) pos = 0;
        list.scrollTop = pos;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  const pause = () => {
    pausedRef.current = true;
  };

  const resume = () => {
    if (listRef.current) listRef.current.scrollTop = Math.round(listRef.current.scrollTop);
    pausedRef.current = false;
  };

  return (
    <section
      aria-label="Recent posts"
      className="relative flex h-[360px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:h-[380px]"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5 dark:border-slate-700 dark:bg-slate-800/60">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent posts</h2>
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          Latest
        </span>
      </div>

      <ul
        ref={listRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
        onTouchStart={pause}
        className="flex-1 space-y-1 overflow-y-auto px-3 py-3 [scrollbar-width:thin]"
      >
        {posts.map(({ id, href, title, image }) => (
          <li key={id}>
            <Link
              href={href}
              className="group flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-colors hover:border-slate-200 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:hover:border-slate-700 dark:hover:bg-slate-800"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <p className="line-clamp-2 text-[13px] font-medium leading-snug text-slate-700 transition-colors group-hover:text-blue-600 dark:text-slate-300 dark:group-hover:text-blue-400">
                {title}
              </p>

              <svg
                className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500 dark:text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent dark:from-slate-900" />
    </section>
  );
};

export default RecentPosts;