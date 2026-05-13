"use client";
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Models component for individual routine cards
function Models({ src, alt }) {
  const [hover, setHover] = useState(false);
  
  return (
    <div 
      className={`${hover ? 'grayscale-0' : ''} grayscale transition-all duration-500 ease-in-out cursor-pointer transform hover:scale-105`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-auto object-cover"
      />
    </div>
  );
}

import routine1 from "../../assets/Images/routine1.png";
import routine2 from "../../assets/Images/routine2.png";
import routine3 from "../../assets/Images/routine3.png";
import routine4 from "../../assets/Images/routine4.png";
import routine5 from "../../assets/Images/routine5.png";

export default function Routine() {
  // Import routine images
  const routineImages = [
    { src: routine1?.src || routine1, alt: "Routine 1" },
    { src: routine2?.src || routine2, alt: "Routine 2" },
    { src: routine3?.src || routine3, alt: "Routine 3" },
    { src: routine4?.src || routine4, alt: "Routine 4" },
    { src: routine5?.src || routine5, alt: "Routine 5" }
  ];

  return (
    <div className="sm:w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h1 
            className="font-mont text-center text-3xl sm:text-4xl mt-6 mb-5 text-brandRed uppercase font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ROUTINES PAR BESOIN
          </h1>
        </div>

        {/* Mobile Swiper */}
        <div className="sm:hidden mt-6">
          <Swiper
            spaceBetween={12}
            slidesPerView={1.3}
            centeredSlides={true}
            className="pb-4"
          >
            {routineImages.map((routine, index) => (
              <SwiperSlide key={index}>
                <div className="w-full aspect-[3/4]">
                  <Models 
                    src={routine.src}
                    alt={routine.alt}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:flex justify-center items-center w-full gap-2 sm:gap-4 lg:gap-6 mt-10">
          {routineImages.map((routine, index) => (
            <div key={index} className="w-1/5 flex-shrink-0">
              <Models 
                src={routine.src}
                alt={routine.alt}
              />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center items-center mt-10 mb-12">
          <button 
            className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 uppercase cursor-pointer bg-white font-mont text-sm sm:text-base lg:text-lg font-medium hover:bg-gray-50 transition-colors duration-300 transform hover:scale-105"
            style={{ 
              border: "solid 1px black",
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            Je découvre ma routine idéale
          </button>
        </div>
      </div>
    </div>
  );
}
