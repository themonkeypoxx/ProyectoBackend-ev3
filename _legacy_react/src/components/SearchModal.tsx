import React, { useState, useEffect, useRef } from 'react'
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react'
import { CAR_MODELS } from '../data/cars'
import { soundEngine } from '../utils/audio'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectModel: (index: number) => void
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectModel
}) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const filtered = query.trim() === ''
    ? CAR_MODELS
    : CAR_MODELS.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.series.toLowerCase().includes(query.toLowerCase()) ||
          c.tagline.toLowerCase().includes(query.toLowerCase()) ||
          c.specs.engine.toLowerCase().includes(query.toLowerCase())
      )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => {
          soundEngine.playMechanicalClick()
          onClose()
        }}
      />

      {/* Search Container */}
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2px] shadow-2xl flex flex-col z-10 overflow-hidden text-white">
        {/* Input Bar */}
        <div className="flex items-center px-6 py-5 border-b border-white/[0.08] bg-[#0f0f0f]">
          <Search className="w-5 h-5 text-white/50 mr-4 stroke-[1.2]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models, specs, electric performance, Weissach..."
            className="flex-1 bg-transparent border-none text-white placeholder-neutral-500 text-sm focus:outline-none tracking-wide"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#888888] hover:text-white mr-3 text-xs uppercase font-mono"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => {
              soundEngine.playMechanicalClick()
              onClose()
            }}
            className="p-1 text-white/60 hover:text-white rounded hover:bg-white/10 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5 stroke-[1.2]" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-6 py-3 bg-[#0d0d0d] border-b border-white/[0.05] flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#888888] overflow-x-auto no-scrollbar">
          <span className="uppercase text-white/30 mr-1">TRENDING:</span>
          {['GT3 RS', 'Turbo S', 'Electric GT', 'Weissach', '918 Spyder'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                soundEngine.playMechanicalClick()
                setQuery(tag)
              }}
              className="px-2 py-0.5 rounded-[2px] bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#888888] text-xs font-mono">
              No vehicles match "{query}". Try searching "911" or "GT3".
            </div>
          ) : (
            filtered.map((car) => {
              const originalIndex = CAR_MODELS.findIndex((c) => c.id === car.id)
              return (
                <button
                  key={car.id}
                  onClick={() => {
                    soundEngine.playMechanicalClick()
                    onSelectModel(originalIndex >= 0 ? originalIndex : 0)
                    onClose()
                  }}
                  className="group w-full flex items-center justify-between p-3.5 hover:bg-white/[0.06] border border-transparent hover:border-white/10 rounded-[2px] transition-all text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-10 bg-black/60 rounded border border-white/5 overflow-hidden flex items-center justify-center">
                      <img
                        src={car.heroImage}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold tracking-wider text-white uppercase flex items-center space-x-2">
                        <span>{car.name}</span>
                        <span className="text-[9px] font-mono text-[#888888] bg-white/5 px-1.5 py-0.2 rounded font-normal">
                          {car.specs.powerHp}
                        </span>
                      </div>
                      <div className="text-xs text-[#888888] font-light truncate max-w-sm">
                        {car.tagline}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-right">
                    <div className="text-xs font-mono text-neutral-400">
                      ${car.basePrice.toLocaleString()}*
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-[#0c0c0c] text-[10px] font-mono text-[#888888] flex items-center justify-between">
          <span>PRESS [ESC] TO CLOSE</span>
          <div className="flex items-center space-x-1">
            <span>SELECT TO LOAD</span>
            <CornerDownLeft className="w-3 h-3 text-white/40" />
          </div>
        </div>
      </div>
    </div>
  )
}
