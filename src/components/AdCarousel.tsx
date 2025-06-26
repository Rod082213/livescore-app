// src/components/AdCarousel.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AdCarouselProps {
  images: string[];
  interval?: number; // Optional interval in milliseconds
}

const AdCarousel = ({ images, interval = 5000 }: AdCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set up an interval to change the image
    const slideInterval = setInterval(() => {
      // Go to the next image, looping back to the start if at the end
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    // Clean up the interval when the component unmounts
    return () => clearInterval(slideInterval);
  }, [images.length, interval]);

  return (
    <div className="relative rounded-lg h-70 overflow-hidden">
      {images.map((imageSrc, index) => (
        <Image
          key={imageSrc}
          src={imageSrc}
          alt={`Promotional Banner ${index + 1}`}
          layout="fill"
          objectFit="cover"
          quality={100}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

export default AdCarousel;