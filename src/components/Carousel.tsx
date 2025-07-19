// src/components/Carousel.tsx
'use client';

import React from 'react';
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import './css/carousel.css'; 

type CarouselProps = {
  children: React.ReactNode;
  options?: EmblaOptionsType;
  /** If false, the carousel functionality will be disabled */
  active?: boolean; 
};

export const Carousel = ({ children, options, active = true }: CarouselProps) => {
  // Conditionally include the Autoplay plugin only when the carousel is active
  const plugins = active ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : [];

  // Pass the `active` state to the Embla hook.
  // When `active` is false, Embla will not initialize its JS logic.
  const [emblaRef] = useEmblaCarousel(
    { loop: true, ...options, active }, 
    plugins
  );

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {React.Children.map(children, (child) => (
          <div className="embla__slide">{child}</div>
        ))}
      </div>
    </div>
  );
};