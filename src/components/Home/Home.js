'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import SimulationEmbed from '../SimulationEmbed.jsx';
import Footer from '../Footer/Footer';
import MyBook from '../ArdBook';
import RecentPosts from '../recentPost/Recent';

import image1 from '../../../public/images/Arduino_SKT.webp';
import image2 from '../../../public/images/jetson_Sarkitshala.webp';
import image4 from '../../../public/images/Bristo.webp';
import image5 from '../../../public/images/esp.webp';
import image6 from '../../../public/images/Pi_Sarkitshala.webp';
import image7 from '../../../public/images/hr.jpg';
import image8 from '../../../public/images/Drone.webp';

import img1 from '../../../public/images/ArdTech.webp';
import img2 from '../../../public/images/ESPTech.webp';
import img3 from '../../../public/images/raspTech.webp';
import img4 from '../../../public/images/jetsonTech.webp';
import img5 from '../../../public/images/droneTech.webp';



const heroSlides = [
  { image: image1, href: '/arduino', alt: 'Arduino projects and experiments on Sarkitshala' },
  { image: image2, href: '/jetson', alt: 'Jetson Nano AI projects on Sarkitshala' },
  { image: image4, href: '/arduino', alt: 'Arduino electronics learning resources' },
  { image: image5, href: '/esp', alt: 'ESP32 IoT experiments on Sarkitshala' },
  { image: image6, href: '/raspberry', alt: 'Raspberry Pi projects and tutorials' },
  { image: image7, href: '/esp', alt: 'ESP32 sensor interfacing guides' },
  { image: image8, href: '/drone', alt: 'Drone technology and embedded systems' },
];

const exploreTechnologies = [
  { src: img1, href: '/arduino', title: 'Arduino', desc: 'Open-source hardware for embedded electronics and prototyping.', badge: 'Popular' },
  { src: img2, href: '/esp', title: 'ESP32', desc: 'WiFi and Bluetooth MCU for powerful IoT projects.', badge: 'IoT' },
  { src: img3, href: '/raspberry', title: 'Raspberry Pi', desc: 'A tiny Linux computer for learning, coding, and making.', badge: 'Linux' },
  { src: img4, href: '/jetson', title: 'Jetson Nano', desc: 'AI computing at the edge with GPU acceleration.', badge: 'AI' },
  { src: img5, href: '/drone', title: 'Drone Tech', desc: 'Fly with embedded tech and remote sensing systems.', badge: 'Advanced' },
];

const badgeColors = {
  Popular: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  IoT: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Linux: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  AI: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
};

const iconButton =
  'inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700';



export function HomePage() {
  const plugin = useMemo(() => Autoplay({ delay: 4000, stopOnInteraction: true }), []);

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-24 md:px-6">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Carousel plugins={[plugin]} className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {heroSlides.map((slide, index) => (
                  <CarouselItem key={slide.href + index}>
                    <Link
                      href={slide.href}
                      className="relative block h-56 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-800 sm:h-72 lg:h-[380px]"
                    >
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                      />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="lg:col-span-4">
            <RecentPosts />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Explore technologies</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Pick a platform and start with the basic experiments.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
          {exploreTechnologies.map((tech) => (
            <Link
              key={tech.href}
              href={tech.href}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500"
            >
              <div className="relative h-28 overflow-hidden bg-slate-100 dark:bg-slate-800 sm:h-36">
                <Image
                  src={tech.src}
                  alt={`${tech.title} projects and experiments`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeColors[tech.badge]}`}>
                  {tech.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <h3 className="mb-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400 sm:text-base">
                  {tech.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-[13px]">{tech.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    
{/* <SimulationEmbed /> */}


      <section className="border-t border-slate-200 bg-slate-50 px-4 py-12 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Free Arduino book</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              A complete guide to electronics, automation and open-source projects.
            </p>
          </div>
          <MyBook />
        </div>
      </section>

      <Footer />
    </main>
  );
}