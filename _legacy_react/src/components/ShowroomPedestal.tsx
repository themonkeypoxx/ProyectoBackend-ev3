import React, { useState, useEffect, useRef } from 'react'
import { CarModel, PaintColor, CarHotspot } from '../types/car'
import { RotateCw, Sparkles, Volume2, Info, Check } from 'lucide-react'
import { soundEngine } from '../utils/audio'

interface ShowroomPedestalProps {
  currentCar: CarModel
  selectedColor: PaintColor
  onSelectColor: (color: PaintColor) => void
  onConfigureClick: () => void
}

export const ShowroomPedestal: React.FC<ShowroomPedestalProps> = ({
  currentCar,
  selectedColor,
  onSelectColor,
  onConfigureClick
}) => {
  // Turntable rotation state (azimuth angle in degrees)
  const [rotationAngle, setRotationAngle] = useState(24)
  const [isAutoRotating, setIsAutoRotating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [startAngle, setStartAngle] = useState(24)
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 })
  const [activeHotspot, setActiveHotspot] = useState<CarHotspot | null>(null)
  const [showHotspots, setShowHotspots] = useState(true)
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'dramatic' | 'ambient'>('studio')

  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-rotation animation loop
  useEffect(() => {
    if (!isAutoRotating) return
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.35) % 360)
    }, 24)
    return () => clearInterval(interval)
  }, [isAutoRotating])

  // Mouse parallax handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2 // -1 to 1
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMouseParallax({ x: normX, y: normY })

    if (isDragging) {
      const deltaX = e.clientX - dragStartX
      const newAngle = (startAngle + deltaX * 0.4) % 360
      setRotationAngle(newAngle < 0 ? newAngle + 360 : newAngle)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    // Ignore if clicked on buttons or hotspots
    if ((e.target as HTMLElement).closest('button, [data-interactive="true"]')) return
    setIsDragging(true)
    setDragStartX(e.clientX)
    setStartAngle(rotationAngle)
    setIsAutoRotating(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch support for dragging turntable
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, [data-interactive="true"]')) return
    setIsDragging(true)
    setDragStartX(e.touches[0].clientX)
    setStartAngle(rotationAngle)
    setIsAutoRotating(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const deltaX = e.touches[0].clientX - dragStartX
    const newAngle = (startAngle + deltaX * 0.4) % 360
    setRotationAngle(newAngle < 0 ? newAngle + 360 : newAngle)
  }

  // Active vehicle image (either matching the selected color or car hero image)
  const activeImage = selectedColor?.image || currentCar.heroImage

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      className="relative w-full h-[100dvh] min-h-[700px] flex items-center justify-center overflow-hidden select-none bg-[#050505] cursor-grab active:cursor-grabbing"
    >
      {/* =========================================================================
          1. DRAMATIC STUDIO LIGHTING ENVIRONMENT
          ========================================================================= */}
      {/* Deep charcoal background radial spotlight from above */}
      <div className="absolute inset-0 pointer-events-none bg-radial-spotlight opacity-95 transition-opacity duration-700" />

      {/* Overhead ceiling softbox luminaire simulation */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] max-w-[85vw] h-2 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] max-w-[60vw] h-24 bg-gradient-to-b from-white/10 via-white/[0.02] to-transparent blur-2xl pointer-events-none" />

      {/* Downward conical spotlight shaft */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] max-w-[95vw] h-[65vh] pointer-events-none opacity-40 transition-all duration-700"
        style={{
          background:
            lightingPreset === 'dramatic'
              ? 'radial-gradient(ellipse 50% 80% at 50% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 50%, transparent 80%)'
              : 'radial-gradient(ellipse 65% 70% at 50% 0%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.015) 55%, transparent 85%)',
          transform: `translateX(${mouseParallax.x * -12}px)`
        }}
      />

      {/* Deep shadow vignette around screen edges as strictly required by prompt */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_140px_rgba(0,0,0,0.95)]" />

      {/* Showroom stage telemetry header (subtle technical watermark) */}
      <div className="absolute top-24 left-8 sm:left-14 pointer-events-none flex items-center space-x-3 text-[10px] tracking-[0.25em] text-[#888888]/60 font-mono uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
        <span>STAGE 01 · STUTTGART-ZUFFENHAUSEN</span>
        <span className="text-white/30">|</span>
        <span>AZIMUTH: {Math.round(rotationAngle)}°</span>
      </div>

      {/* =========================================================================
          2. THE PEDESTAL (CIRCULAR TURNTABLE PLATFORM)
          ========================================================================= */}
      <div
        className="absolute bottom-[23%] sm:bottom-[21%] left-1/2 -translate-x-1/2 pointer-events-none transition-transform duration-300"
        style={{
          width: 'min(1150px, 92vw)',
          height: 'min(380px, 32vh)',
          transform: `translateX(-50%) perspective(1000px) rotateX(72deg) translateY(${mouseParallax.y * 10}px)`
        }}
      >
        {/* Turntable Outer Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-white/[0.03] blur-3xl" />

        {/* Turntable Base Cylinder Rim Depth (3D bevel drop shadow) */}
        <div className="absolute inset-0 rounded-full border border-white/[0.06] bg-[#080808]/90 shadow-[0_30px_70px_rgba(0,0,0,0.98)]" />

        {/* Outer Chamfer Edge Highlight Ring */}
        <div
          className="absolute inset-[2px] rounded-full border border-white/[0.14] transition-all"
          style={{
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 0 15px rgba(255,255,255,0.05)'
          }}
        />

        {/* Rotating Concentric Turntable Surface with Degree Ticks */}
        <div
          className="absolute inset-[16px] rounded-full border border-white/[0.08] bg-gradient-to-b from-[#141414] via-[#090909] to-[#040404] transition-transform duration-100 ease-out"
          style={{
            transform: `rotate(${rotationAngle}deg)`
          }}
        >
          {/* Precision Anisotropic Radial Texture Lines */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(255,255,255,0.03)_70%,_transparent_100%)]" />

          {/* Concentric Groove Rings */}
          <div className="absolute inset-[18%] rounded-full border border-white/[0.05]" />
          <div className="absolute inset-[36%] rounded-full border border-white/[0.04]" />
          <div className="absolute inset-[54%] rounded-full border border-white/[0.03]" />
          <div className="absolute inset-[72%] rounded-full border border-white/[0.05]" />

          {/* Turntable Degree Axis Markers */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-mono tracking-widest text-white/30">
            000°
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-mono tracking-widest text-white/30">
            180°
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-mono tracking-widest text-white/30">
            090°
          </div>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[8px] font-mono tracking-widest text-white/30">
            270°
          </div>

          {/* Center Stage Ring */}
          <div className="absolute inset-[86%] rounded-full border border-white/[0.15] bg-[#0c0c0c] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Static Pedestal Spotlight Highlight (Overhead Reflection on Turntable) */}
        <div className="absolute inset-[20px] rounded-full bg-gradient-to-t from-transparent via-white/[0.025] to-white/[0.07] pointer-events-none" />
      </div>

      {/* =========================================================================
          3. SOFT FLOOR REFLECTION (POLISHED CONCRETE / GLASS EFFECT)
          ========================================================================= */}
      <div
        className="absolute bottom-[4%] sm:bottom-[6%] left-1/2 -translate-x-1/2 pointer-events-none transition-transform duration-300"
        style={{
          width: 'min(980px, 86vw)',
          transform: `translateX(-50%) perspective(1000px) rotateX(15deg) translateY(${mouseParallax.y * -4}px) scaleY(-0.75)`
        }}
      >
        {/* Inverted Car Reflection with Gradual Bottom Fade and Subtle Blur */}
        <div
          className="w-full relative opacity-35 filter blur-[2.5px] contrast-125"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 80%)'
          }}
        >
          <img
            src={activeImage}
            alt=""
            className="w-full h-auto object-contain pointer-events-none select-none brightness-90"
            style={{
              transform: `scaleX(${1 + mouseParallax.x * 0.02})`
            }}
          />
        </div>
      </div>

      {/* =========================================================================
          4. CENTERPIECE: PHOTOREALISTIC SPORTS CAR (3/4 VIEW)
          ========================================================================= */}
      <div
        className="relative z-10 w-full max-w-[1100px] px-4 sm:px-8 flex flex-col items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${-12 + mouseParallax.y * -8}px) translateX(${mouseParallax.x * 8}px)`
        }}
      >
        {/* Vehicle Image Container */}
        <div className="relative w-full max-w-[960px] aspect-[16/9] sm:aspect-[2/1] flex items-center justify-center">
          {/* Contact Shadow on Floor Underneath the Tires */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-8 bg-black/90 blur-xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-1 left-[20%] w-[25%] h-6 bg-black/95 blur-md rounded-full pointer-events-none" />
          <div className="absolute -bottom-1 right-[22%] w-[25%] h-6 bg-black/95 blur-md rounded-full pointer-events-none" />

          {/* The High-Resolution Car Image */}
          <img
            src={activeImage}
            alt={currentCar.fullName}
            draggable={false}
            className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-all duration-500"
            style={{
              filter: 'contrast(1.04) brightness(1.02)'
            }}
          />

          {/* =====================================================================
              5. INTERACTIVE TELEMETRY HOTSPOTS
              ===================================================================== */}
          {showHotspots &&
            currentCar.hotspots.map((hotspot) => {
              const isActive = activeHotspot?.id === hotspot.id
              return (
                <div
                  key={hotspot.id}
                  data-interactive="true"
                  className="absolute z-20 group"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {/* Hotspot Target Pin */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      soundEngine.playMechanicalClick()
                      setActiveHotspot(isActive ? null : hotspot)
                    }}
                    onMouseEnter={() => {
                      soundEngine.playSelectionTone()
                    }}
                    className="relative w-7 h-7 flex items-center justify-center focus:outline-none"
                    aria-label={hotspot.title}
                  >
                    {/* Outer radar pulse */}
                    <span className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-40 group-hover:opacity-80" />
                    {/* Center glass dot */}
                    <span className="relative w-3 h-3 rounded-full bg-white/90 border border-white shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-transform group-hover:scale-125" />
                  </button>

                  {/* Hotspot Readout Card */}
                  {isActive && (
                    <div
                      className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3.5 glass-panel text-left rounded-[2px] shadow-[0_12px_40px_rgba(0,0,0,0.85)] border border-white/20 animate-in fade-in zoom-in-95 duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-1 text-[8px] font-mono tracking-[0.25em] text-[#888888] uppercase">
                        <span>{hotspot.category}</span>
                        <span className="text-white font-semibold">{hotspot.spec}</span>
                      </div>
                      <h4 className="text-[12px] font-bold tracking-wider text-white mb-1.5 uppercase">
                        {hotspot.title}
                      </h4>
                      <p className="text-[11px] text-[#888888] leading-relaxed font-light">
                        {hotspot.description}
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[9px]">
                        <span className="text-white/40 font-mono">PORSCHE RACING DEPT.</span>
                        <button
                          onClick={() => {
                            setActiveHotspot(null)
                          }}
                          className="text-[#888888] hover:text-white uppercase font-mono tracking-wider"
                        >
                          Dismiss [x]
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>

      {/* =========================================================================
          6. PEDESTAL CONTROLS & SHOWROOM DYNAMICS DOCK
          ========================================================================= */}
      {/* Bottom Floating Control Bar (Right above the Carousel) */}
      <div
        data-interactive="true"
        className="absolute bottom-[20%] left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 py-2 pointer-events-auto"
      >
        {/* Paint Finish Selector Swatches */}
        {currentCar.colors && currentCar.colors.length > 0 && (
          <div className="flex items-center space-x-2 px-3 py-1.5 glass-panel rounded-[2px]">
            <span className="text-[9px] tracking-[0.2em] font-mono text-[#888888] uppercase mr-1 hidden sm:inline">
              FINISH:
            </span>
            {currentCar.colors.map((color) => {
              const isSelected = selectedColor?.id === color.id
              return (
                <button
                  key={color.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    soundEngine.playMechanicalClick()
                    onSelectColor(color)
                  }}
                  className={`group relative w-4 h-4 rounded-full transition-all duration-200 focus:outline-none ${
                    isSelected
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                      : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name} (${color.code})`}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white/90">
                      •
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Turntable Auto-Rotate Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            soundEngine.playMechanicalClick()
            setIsAutoRotating(!isAutoRotating)
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-[9px] font-mono tracking-[0.2em] uppercase glass-panel rounded-[2px] transition-colors ${
            isAutoRotating
              ? 'text-white border-white/40 bg-white/10'
              : 'text-[#888888] hover:text-white'
          }`}
          title="Toggle 360° Turntable Rotation"
        >
          <RotateCw className={`w-3 h-3 ${isAutoRotating ? 'animate-spin' : ''}`} />
          <span>{isAutoRotating ? 'ROTATING 360°' : '360° VIEW'}</span>
        </button>

        {/* Boxer Acoustic Rev Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            soundEngine.toggleSound()
            soundEngine.playBoxerRumble()
          }}
          className="group flex items-center space-x-1.5 px-3 py-1.5 text-[9px] font-mono tracking-[0.2em] uppercase glass-panel rounded-[2px] text-[#888888] hover:text-white transition-colors"
          title="Experience Flat-6 Boxer Acoustic Purr"
        >
          <Volume2 className="w-3 h-3 group-hover:text-white" />
          <span>REV ENGINE</span>
        </button>

        {/* Hotspots Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            soundEngine.playMechanicalClick()
            setShowHotspots(!showHotspots)
          }}
          className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-[9px] font-mono tracking-[0.2em] uppercase glass-panel rounded-[2px] transition-colors ${
            showHotspots ? 'text-white/90' : 'text-[#888888]'
          }`}
          title="Toggle Technical Hotspot Telemetry"
        >
          <Sparkles className="w-3 h-3" />
          <span>{showHotspots ? 'HOTSPOTS ON' : 'HOTSPOTS OFF'}</span>
        </button>
      </div>
    </div>
  )
}
