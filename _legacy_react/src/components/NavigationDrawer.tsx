import React from 'react'
import { X, ArrowRight, MapPin, Compass, ShieldCheck, Flag, Sparkles } from 'lucide-react'
import { soundEngine } from '../utils/audio'

interface NavigationDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSelectSection: (section: string) => void
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectSection
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => {
          soundEngine.playMechanicalClick()
          onClose()
        }}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg h-full bg-[#080808] border-l border-white/10 shadow-2xl flex flex-col z-10 overflow-hidden text-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-7 border-b border-white/[0.08]">
          <div className="flex flex-col">
            <span className="text-[12px] tracking-[0.35em] font-medium text-white uppercase">
              PORSCHE
            </span>
            <span className="text-[9px] font-mono tracking-[0.25em] text-[#888888] uppercase">
              DIRECTORY · EDITORIAL
            </span>
          </div>

          <button
            onClick={() => {
              soundEngine.playMechanicalClick()
              onClose()
            }}
            className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 stroke-[1.2]" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 no-scrollbar font-sans">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#888888] block">
              01 · WORLD OF PERFORMANCE
            </span>
            <ul className="space-y-3">
              {[
                { name: 'Porsche Motorsport', desc: 'TAG Heuer Formula E & WEC Hypercar program', icon: Flag },
                { name: 'Exclusive Manufaktur', desc: 'Paint to Sample & bespoke individualization', icon: Sparkles },
                { name: 'Porsche Heritage & Museum', desc: '75 years of sports car heritage in Stuttgart', icon: Compass },
                { name: 'Porsche Design Timepieces', desc: 'Custom 911 GT3 Chronograph 1 & horology', icon: ShieldCheck }
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      soundEngine.playMechanicalClick()
                      onSelectSection(item.name)
                      onClose()
                    }}
                    className="group w-full flex items-start justify-between py-2 text-left transition-colors"
                  >
                    <div>
                      <div className="text-base font-medium text-white group-hover:text-neutral-300 tracking-wider">
                        {item.name}
                      </div>
                      <div className="text-xs text-[#888888] font-light mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-all transform group-hover:translate-x-1 mt-1" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/[0.08]">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#888888] block">
              02 · CLIENT SERVICES & DEALERS
            </span>
            <ul className="space-y-3 text-sm font-light text-neutral-300">
              {[
                'Porsche Finder (New & Pre-Owned)',
                'Porsche Financial Services',
                'Track Experience & Driving School',
                'Find a Porsche Centre Worldwide',
                'Online Factory Delivery Stuttgart'
              ].map((service) => (
                <li key={service}>
                  <button
                    onClick={() => {
                      soundEngine.playMechanicalClick()
                      alert(`Opening ${service}...`)
                    }}
                    className="hover:text-white transition-colors flex items-center justify-between w-full py-1 text-left"
                  >
                    <span>{service}</span>
                    <span className="text-white/30 text-xs font-mono">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Contact / Dealer Info */}
        <div className="px-8 py-6 border-t border-white/[0.08] bg-[#0c0c0c] text-xs font-mono text-[#888888] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-white/60" />
            <span>PORSCHEPLATZ 1, 70435 STUTTGART</span>
          </div>
        </div>
      </div>
    </div>
  )
}
