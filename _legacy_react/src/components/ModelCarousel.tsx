import React, { useEffect, useRef } from 'react'
import { CarModel } from '../types/car'
import { soundEngine } from '../utils/audio'

interface ModelCarouselProps {
  models: CarModel[]
  activeIndex: number
  onSelectModel: (index: number) => void
}

export const ModelCarousel: React.FC<ModelCarouselProps> = ({
  models,
  activeIndex,
  onSelectModel
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePrevious = () => {
    soundEngine.playMechanicalClick()
    const nextIndex = activeIndex === 0 ? models.length - 1 : activeIndex - 1
    onSelectModel(nextIndex)
  }

  const handleNext = () => {
    soundEngine.playMechanicalClick()
    const nextIndex = activeIndex === models.length - 1 ? 0 : activeIndex + 1
    onSelectModel(nextIndex)
  }

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, models.length])

  const currentModel = models[activeIndex]

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[20%] min-h-[140px] z-30 flex flex-col justify-end pb-8 pointer-events-none select-none">
      {/* Subtle bottom edge gradient to ground the interface */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-[1720px] mx-auto px-6 sm:px-10 flex flex-col items-center justify-center">
        {/* Horizontal Slider UI with Edge Fade-out Mask */}
        <div
          className="relative w-full overflow-hidden flex items-center justify-center pointer-events-auto"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)'
          }}
        >
          <div className="flex items-center justify-center space-x-6 sm:space-x-12 md:space-x-16 py-2 transition-all duration-500 ease-out">
            {models.map((model, index) => {
              const isActive = index === activeIndex
              const distance = Math.abs(index - activeIndex)

              // Adjacent models or wrap-around representation
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    soundEngine.playMechanicalClick()
                    onSelectModel(index)
                  }}
                  className={`group relative whitespace-nowrap transition-all duration-300 focus:outline-none ${
                    isActive
                      ? 'opacity-100 scale-100 z-10 cursor-default'
                      : distance === 1 || distance === models.length - 1
                      ? 'opacity-40 hover:opacity-75 scale-90 cursor-pointer hidden sm:block'
                      : 'opacity-15 hover:opacity-40 scale-75 cursor-pointer hidden lg:block'
                  }`}
                >
                  {/* Active State: Centered, Large (32px), Bold, and White */}
                  {isActive ? (
                    <div className="flex items-center space-x-6 sm:space-x-8">
                      {/* Minimalist Left Arrow (<-) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePrevious()
                        }}
                        className="p-2 text-white/60 hover:text-white transition-colors focus:outline-none"
                        aria-label="Previous model"
                        title="Previous Model (←)"
                      >
                        <svg
                          className="w-5 h-5 stroke-[1.2]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {/* Active Model Name: 32px, Bold, Crisp White */}
                      <span className="text-[26px] sm:text-[32px] font-bold text-white tracking-[0.18em] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                        {model.name}
                      </span>

                      {/* Minimalist Right Arrow (->) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNext()
                        }}
                        className="p-2 text-white/60 hover:text-white transition-colors focus:outline-none"
                        aria-label="Next model"
                        title="Next Model (→)"
                      >
                        <svg
                          className="w-5 h-5 stroke-[1.2]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    /* Inactive State: Smaller (18px), semi-transparent, fading out */
                    <span className="text-[16px] sm:text-[18px] font-light text-white/50 group-hover:text-white/80 tracking-[0.16em] uppercase transition-colors">
                      {model.name}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Small Pagination Dots directly below the active text */}
        <div className="flex items-center space-x-2.5 mt-4 pointer-events-auto">
          {models.map((_, dotIndex) => {
            const isActiveDot = dotIndex === activeIndex
            return (
              <button
                key={dotIndex}
                onClick={() => {
                  soundEngine.playMechanicalClick()
                  onSelectModel(dotIndex)
                }}
                className={`transition-all duration-300 focus:outline-none ${
                  isActiveDot
                    ? 'w-6 h-1 bg-white rounded-full'
                    : 'w-1.5 h-1 bg-white/20 hover:bg-white/50 rounded-full'
                }`}
                aria-label={`Select model ${dotIndex + 1}`}
              />
            )
          })}
        </div>

        {/* Model Subtitle / Tagline */}
        <div className="mt-2 text-[10px] font-mono tracking-[0.25em] text-[#888888]/80 uppercase hidden sm:block">
          {currentModel.tagline}
        </div>
      </div>
    </div>
  )
}
