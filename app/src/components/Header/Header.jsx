"use client";
function Header() {
  return (
    <header className="relative h-screen w-full overflow-hidden flex flex-col justify-between">
      {/* Video Background */}
      <video 
        className="absolute top-0 left-0 h-full w-full object-cover"
        src="/Videos/sik-video.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Overlay to darken video if needed */}
      <div className="absolute top-0 left-0 h-full w-full bg-black/20 z-0"></div>
      
      
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center h-full pl-6 sm:pl-12 md:pl-20 lg:pl-32 text-left w-[90%] md:w-[50%]">
        <h1 
          style={{
            fontFamily: "'Playfair Display', serif",
          }}
          className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-snug"
        >
          SI K-BEAUTY, L'ART DU SOIN CORÉEN, SUBLIMÉ POUR VOUS.
        </h1>
        <p className="text-white mt-6 text-lg sm:text-xl leading-relaxed">
          SI K-Beauty, L'art Du Soin Coréen, <br />
          Sublimé Pour Vous.
        </p>

        <button className="mt-8 px-6 py-3 w-fit text-lg font-dm text-white bg-brandRed 
          hover:bg-[#8b2d21] cursor-pointer hover:scale-105 hover:shadow-[0_4px_20px_rgba(181,72,58,0.4)] 
          rounded-md shadow-md transition-all duration-300 ease-in-out"
        >
          En savoir plus
        </button>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 sm:gap-10 mt-10 text-white text-lg sm:text-xl font-dm">
          <div className="flex items-center gap-3">
            <div>
              <span className="font-playfair text-2xl sm:text-3xl font-semibold block"
              style={{fontFamily: "'Playfair Display', serif"}}>
                +15000
              </span>
              <span className="text-white">Ventes</span>
            </div>
            <div className="hidden sm:block h-10 border-r-2 border-white"></div>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <span style={{fontFamily: "'Playfair Display', serif"}} className="font-playfair text-2xl sm:text-3xl font-semibold block">
                +200
              </span>
              <span className="text-white">Produits</span>
            </div>
            <div className="hidden sm:block h-10 border-r-2 border-white"></div>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <span className="font-playfair text-2xl sm:text-3xl font-semibold block" style={{fontFamily: "'Playfair Display', serif"}}>
                +35
              </span>
              <span className="text-white">Clients</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;