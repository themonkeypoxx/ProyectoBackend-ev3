import React, { useState } from 'react'
import { Search, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react'
import { soundEngine } from '../utils/audio'

interface HeaderProps {
  onOpenModels: () => void
  onOpenServices: () => void
  onOpenDiscover: () => void
  onOpenSearch: () => void
  onOpenMenu: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onOpenModels,
  onOpenServices,
  onOpenDiscover,
  onOpenSearch,
  onOpenMenu
}) => {
  const [soundActive, setSoundActive] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleToggleSound = () => {
    const state = soundEngine.toggleSound()
    setSoundActive(state)
  }

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
      setIsFullscreen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-20 px-6 sm:px-10 md:px-14 flex items-center justify-between border-b border-white/[0.04] bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[6px] transition-all">
      {/* Left: Minimalist Brand Typography Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            soundEngine.playMechanicalClick()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="group flex items-center gap-3 text-left focus:outline-none"
          title="Porsche Stuttgart"
        >
          {/* Minimalist Stuttgart Crest Line Symbol */}
          <svg
            className="w-5 h-6 text-white/80 group-hover:text-white transition-colors opacity-90 group-hover:opacity-100"
            viewBox="0 0 24 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M12 2L2 6V16C2 23 12 28 12 28C12 28 22 23 22 16V6L12 2Z" />
            <path d="M12 2V28" strokeWidth="0.8" strokeDasharray="1 1" />
            <path d="M5 10H19" strokeWidth="0.8" />
            <path d="M7 16H17" strokeWidth="0.8" />
          </svg>

          <div className="flex flex-col">
            <span className="text-[17px] tracking-[0.38em] font-medium text-white transition-opacity group-hover:opacity-100 select-none">
              PORSCHE
            </span>
            <span className="text-[8px] tracking-[0.25em] text-[#888888] uppercase select-none font-light">
              Stuttgart · Germany
            </span>
          </div>
        </button>
      </div>

      {/* Center: Discrete Navigation Links */}
      <nav className="hidden md:flex items-center space-x-10 lg:space-x-14">
        <button
          onClick={() => {
            soundEngine.playMechanicalClick()
            onOpenModels()
          }}
          className="group relative py-2 text-[13px] tracking-[0.2em] uppercase font-normal text-[#888888] hover:text-white transition-colors duration-200"
        >
          <span>Models</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
        </button>

        <button
          onClick={() => {
            soundEngine.playMechanicalClick()
            onOpenServices()
          }}
          className="group relative py-2 text-[13px] tracking-[0.2em] uppercase font-normal text-[#888888] hover:text-white transition-colors duration-200"
        >
          <span>Services</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
        </button>

        <button
          onClick={() => {
            soundEngine.playMechanicalClick()
            onOpenDiscover()
          }}
          className="group relative py-2 text-[13px] tracking-[0.2em] uppercase font-normal text-[#888888] hover:text-white transition-colors duration-200"
        >
          <span>Discover</span>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
        </button>
      </nav>

      {/* Right: Sound, Fullscreen, Search Icon, and Minimalist Hamburger (Two Thin Lines) */}
      <div className="flex items-center space-x-5 sm:space-x-7">
        {/* Subtle Sound Experience Toggle */}
        <button
          onClick={handleToggleSound}
          className="group flex items-center space-x-2 text-[#888888] hover:text-white transition-colors text-[10px] tracking-[0.2em] uppercase"
          title={soundActive ? 'Mute Audio Acoustics' : 'Enable Cockpit Acoustic Feedback'}
        >
          {soundActive ? (
            <Volume2 className="w-4 h-4 text-white stroke-[1.2]" />
          ) : (
            <VolumeX className="w-4 h-4 stroke-[1.2] opacity-60 group-hover:opacity-100" />
          )}
          <span className="hidden xl:inline text-[9px] text-[#888888] font-mono">
            {soundActive ? 'AUDIO ON' : 'AUDIO OFF'}
          </span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={handleToggleFullscreen}
          className="hidden lg:flex items-center text-[#888888] hover:text-white transition-colors"
          title="Cinematic Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 stroke-[1.2]" />
          ) : (
            <Maximize2 className="w-4 h-4 stroke-[1.2]" />
          )}
        </button>

        {/* Thin Sharp Search Icon */}
        <button
          onClick={() => {
            soundEngine.playMechanicalClick()
            onOpenSearch()
          }}
          className="p-1.5 text-white/80 hover:text-white transition-colors focus:outline-none"
          aria-label="Search models and services"
          title="Search (Cmd + K)"
        >
          <Search className="w-4 h-4 stroke-[1.2]" />
        </button>

        {/* Minimalist Hamburger Menu (Two Thin Parallel Lines) */}
        <button
          onClick={() => {
            soundEngine.playMechanicalClick()
            onOpenMenu()
          }}
          className="group flex flex-col justify-center items-end w-8 h-8 space-y-1.5 p-1 focus:outline-none"
          aria-label="Toggle navigation menu"
          title="Menu"
        >
          <span className="w-6 h-[1px] bg-white group-hover:bg-white transition-all duration-300 group-hover:w-7" />
          <span className="w-4 h-[1px] bg-white group-hover:bg-white transition-all duration-300 group-hover:w-7" />
        </button>
      </div>
    </header>
  )
}
