"use client";
import React, { useRef, useState } from "react";

// Reel component for Instagram reels/videos
function Reel({ src, thumbnail }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (!videoRef.current) return;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className="relative block group w-full sm:w-[300px] lg:w-[350px] h-[400px] sm:h-[500px] lg:h-[600px]"
    >
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={src || "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
          poster={thumbnail || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop&q=80"}
          className={`${isPlaying ? '' : 'grayscale group-hover:grayscale-0'} block w-full h-full object-cover appearance-none transition-all duration-300 cursor-pointer rounded-lg`}
          controls={false}
          playsInline
          onClick={handleVideoClick}
          muted
        />

        {!isPlaying && (
          <button
            type="button"
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Play video"
          >
            <svg 
              width="72" 
              height="72" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              aria-hidden="true" 
              className="drop-shadow-lg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Main Instagram component
export default function Instagram() {
  const reels = [
    {
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop&q=80"
    },
    {
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=600&fit=crop&q=80"
    },
    {
      src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnail: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=600&fit=crop&q=80"
    }
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Instagram Reels Section */}
        <section className="mb-10">
          <h1 
            className="font-mont text-center text-3xl sm:text-4xl mt-6 mb-8 text-brandRed uppercase font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            INSTAGRAM / BEAUTÉS RÉELLES
          </h1>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 lg:gap-12">
            {reels.map((reel, index) => (
              <Reel 
                key={index}
                src={reel.src}
                thumbnail={reel.thumbnail}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
