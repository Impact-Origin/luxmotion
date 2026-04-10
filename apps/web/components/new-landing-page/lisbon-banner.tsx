"use client"

export function LisbonBanner() {
  return (
    <section className="relative w-full py-[40px] md:py-[64px] px-0 overflow-hidden">
      {/* Video container: full width, fixed height, stretched horizontally */}
      <div className="relative w-full h-[280px] md:h-[400px] lg:h-[480px]">
        <video
          src="/video/ad.mp4"
          loop
          playsInline
          muted
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
        {/* Faixa branca a vir de cima: 100% branco no topo (cobre o canto e o preto), depois gradiente */}
        <div className="absolute top-0 left-0 right-0 h-[120px] md:h-[56px] pointer-events-none" style={{ background: "linear-gradient(to bottom, white 0%, white 35%, rgba(255,255,255,0.6) 55%, transparent 100%)" }} />
        {/* Fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[48px] md:h-[40px] bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none" />
      </div>
    </section>
  )
}