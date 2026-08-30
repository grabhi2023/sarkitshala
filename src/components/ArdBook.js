'use client';
import { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Image from 'next/image';

import img1 from '../../public/ArdBook/1.webp';
import img2 from '../../public/ArdBook/2.webp';
import img3 from '../../public/ArdBook/3.webp';
import img4 from '../../public/ArdBook/4.webp';
import img5 from '../../public/ArdBook/5.webp';
import img6 from '../../public/ArdBook/6.webp';
import img7 from '../../public/ArdBook/7.webp';
import img8 from '../../public/ArdBook/8.webp';
import img9 from '../../public/ArdBook/9.webp';
import img10 from '../../public/ArdBook/10.webp';
import img11 from '../../public/ArdBook/11.webp';
import imgauth from '../../public/ArdBook/About_Author.webp';
import imgack from '../../public/ArdBook/Ack.webp';
import imgcover from '../../public/ArdBook/cover.webp';


const pages = [
  imgcover, imgauth, imgack,
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11,
];

export default function MyBook() {
  const bookRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextPage = () => bookRef.current.pageFlip().flipNext();
  const prevPage = () => bookRef.current.pageFlip().flipPrev();

return (
    <div className="flex justify-center items-center min-h-screen  transition-colors duration-500 relative px-2  overflow-hidden">
      
      {/* Previous Button - Adaptive colors */}
      <button
        onClick={prevPage}
        className="absolute left-2 md:left-8 z-20 bg-white/80 dark:bg-black/60 backdrop-blur-md hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 text-gray-800 dark:text-white rounded-full p-4 shadow-lg transition-all border border-gray-200 dark:border-white/10"
        aria-label="Previous Page"
      >
        ◀
      </button>

      {/* Flip Book Container */}
      <div className="relative drop-shadow-2xl w-full max-w-[1000px] flex justify-center">
        <HTMLFlipBook
          ref={bookRef}
          width={isMobile ? 320 : 450}
          height={isMobile ? 450 : 600}
          size="stretch"
          minWidth={280}
          maxWidth={1000}
          minHeight={350}
          maxHeight={680}
          showCover={true}
          mobileScrollSupport={true}
          drawShadow={true}
          useMouseEvents={true}
          usePortrait={isMobile}
          className="book rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => {
            const { width } = bookRef.current.pageFlip().getPageFlip().getState();
            const clickX = e.clientX;
            const middle = width / 2;
            if (clickX > middle) bookRef.current.pageFlip().flipNext();
            else bookRef.current.pageFlip().flipPrev();
          }}
        >
          {/* Cover Page */}
          <div className="flex flex-col justify-center items-center h-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white p-6 relative">
            <h1 className="text-3xl md:text-5xl font-extrabold font-serif drop-shadow-lg mb-4">
              Arduino Book
            </h1>
            <p className="text-sm md:text-lg max-w-xs text-center font-light opacity-90">
              Your complete guide to electronics, automation & open-source projects.
            </p>
            <span className="absolute bottom-4 right-4 text-xs italic opacity-60">IoT Students</span>
          </div>

          {/* Book Pages - Adaptive to Theme */}
          {pages.map((img, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 flex flex-col justify-center items-center p-4 transition-colors duration-300"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={img}
                  alt={`Page ${index + 1}`}
                  fill
                  className="object-contain p-2"
                  priority={index < 3}
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-zinc-600 mt-2 italic">
                Page {index + 1}
              </span>
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {/* Next Button - Adaptive colors */}
      <button
        onClick={nextPage}
        className="absolute right-2 md:right-8 z-20 bg-white/80 dark:bg-black/60 backdrop-blur-md hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 text-gray-800 dark:text-white rounded-full p-4 shadow-lg transition-all border border-gray-200 dark:border-white/10"
        aria-label="Next Page"
      >
        ▶
      </button>
    </div>
  );
}



