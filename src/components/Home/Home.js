'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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

const images = [
  { src: image1.src, href: '/arduino' },
  { src: image2.src, href: '/jetson' },
  { src: image4.src, href: '/arduino' },
  { src: image5.src, href: '/esp' },
  { src: image6.src, href: '/raspberry' },
  { src: image7.src, href: '/esp/dht11' },
  { src: image8.src, href: '/drone' },
];

const exploreTechnologies = [
  {
    src: img1.src,
    href: '/arduino',
    title: 'Arduino',
    desc: 'Open-source hardware for embedded electronics and prototyping.',
    badge: 'Popular',
  },
  {
    src: img2.src,
    href: '/esp',
    title: 'ESP32',
    desc: 'WiFi + Bluetooth MCU for powerful IoT projects.',
    badge: 'IoT',
  },
  {
    src: img3.src,
    href: '/raspberry',
    title: 'Raspberry Pi',
    desc: 'A tiny Linux computer for learning, coding, and making.',
    badge: 'Linux',
  },
  {
    src: img4.src,
    href: '/jetson',
    title: 'Jetson Nano',
    desc: 'AI computing at the edge with GPU acceleration.',
    badge: 'AI',
  },
  {
    src: img5.src,
    href: '/drone',
    title: 'Drone Tech',
    desc: 'Fly with embedded tech and remote sensing systems.',
    badge: 'Advanced',
  },
];

const badgeColors = {
  Popular: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  IoT: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  Linux: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  AI: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
};

export function HomePage() {
  const plugin = useMemo(() =>
    Autoplay({ delay: 4000, stopOnInteraction: true }), []);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto pt-24 pb-12 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Carousel */}
          <div className="lg:col-span-8">
            <Carousel plugins={[plugin]} className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <Link href={img.href}>
                      <div className="relative h-56 sm:h-72 md:h-[380px] w-full rounded-2xl overflow-hidden border border-border bg-muted">
                        <Image
                          src={img.src}
                          alt={`Slide ${index + 1}`}
                          fill
                          priority={index === 0}
                          className="object-cover hover:scale-[1.02] transition-transform duration-700"
                        />
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Recent Posts */}
          <div className="lg:col-span-4">
            <RecentPosts />
          </div>
        </div>
      </section>

      {/* Explore Technologies */}
      <section className="max-w-7xl mx-auto py-12 px-4 md:px-6">

        {/* Section Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            What we cover
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Explore Technologies
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {exploreTechnologies.map((tech, index) => (
            <Link key={index} href={tech.href}>
              <div className="
                group relative rounded-2xl border border-border bg-card
                hover:border-blue-500/40 hover:shadow-md
                transition-all duration-250 overflow-hidden h-full
              ">
                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-muted">
                  <Image
                    src={tech.src}
                    alt={tech.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <span className={`absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColors[tech.badge]}`}>
                    {tech.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tech.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tech.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Arduino Book Section */}
      <section className="border-t border-border bg-muted/30 dark:bg-muted/10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Free Resource
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Arduino Book
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A complete guide to electronics, automation & open-source projects.
            </p>
          </div>
          <MyBook />
        </div>
      </section>

      <Footer />
    </main>
  );
}