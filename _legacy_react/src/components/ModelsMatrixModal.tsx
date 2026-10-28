import React, { useState } from 'react'
import { CarModel } from '../types/car'
import { CAR_MODELS } from '../data/cars'
import { X, ArrowRight, Gauge, Zap, Flame } from 'lucide-react'
import { soundEngine } from '../utils/audio'

interface ModelsMatrixModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectModel: (modelIndex: number) => void
}

export const ModelsMatrixModal: React.FC<ModelsMatrixModalProps> = ({
  isOpen,
  onClose,
  onSelectModel
}) => {
  const [filter, setFilter] = useState<string>('all')

  if (!isOpen) return null

  const filteredCars = filter === 'all'
    ? CAR_MODELS
    : CAR_MODELS.filter((c) => c.series.toLowerCase() === filter.toLowerCase())

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050505] animate-in fade-in duration-300 overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-8 sm:px-14 py-6 border-b border-white/[0.08] bg-[#050505]/95 backdrop-blur-lg">
        <div className="flex items-center space-x-6">
          <span className="text-[14px] tracking-[0.38em] font-medium text-white uppercase">
            PORSCHE
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[11px] font-mono tracking-[0.25em] text-[#888888] uppercase">
            ALL MODEL LINES
          </span>
        </div>

        {/* Filter pills */}
        <div className="hidden sm:flex items-center space-x-6 text-[11px] font-mono tracking-[0.2em] uppercase">
          {['all', '911', '718', 'taycan', 'hypercar'].map((item) => (
            <button
              key={item}
              onClick={() => {
                soundEngine.playMechanicalClick()
                setFilter(item)
              }}
              className={`transition-colors ${
                filter === item ? 'text-white font-semibold' : 'text-[#888888] hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            soundEngine.playMechanicalClick()
            onClose()
          }}
          className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Close models matrix"
        >
          <X className="w-6 h-6 stroke-[1.2]" />
        </button>
      </div>

      {/* Grid of Models */}
      <div className="max-w-[1720px] mx-auto w-full px-8 sm:px-14 py-12 flex-1">
        <div className="mb-8">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#888888]">
            STUTTGART SHOWROOM SELECTION
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-white mt-1">
            Explore The High-Performance Fleet
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => {
            const originalIndex = CAR_MODELS.findIndex((c) => c.id === car.id)
            return (
              <div
                key={car.id}
                className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2px] p-6 hover:border-white/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#888888] uppercase">
                    SERIES {car.series}
                  </span>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-white/60 bg-white/5 px-2 py-0.5 rounded-[2px] uppercase">
                    {car.badgeText}
                  </span>
                </div>

                {/* Model Title */}
                <h3 className="text-xl font-bold tracking-wider text-white uppercase mb-2">
                  {car.name}
                </h3>
                <p className="text-xs text-[#888888] font-light line-clamp-2 mb-6">
                  {car.tagline}
                </p>

                {/* Image Stage Preview */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-b from-[#111] to-[#050505] rounded-[2px] border border-white/5 flex items-center justify-center mb-6 group-hover:border-white/20 transition-colors">
                  <img
                    src={car.heroImage}
                    alt={car.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Quick specs pill */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-center font-mono text-[10px] mb-6">
                  <div>
                    <div className="text-[#888888]">0-100 KM/H</div>
                    <div className="text-white font-medium mt-0.5">{car.specs.acceleration}</div>
                  </div>
                  <div>
                    <div className="text-[#888888]">TOP SPEED</div>
                    <div className="text-white font-medium mt-0.5">{car.specs.topSpeed}</div>
                  </div>
                  <div>
                    <div className="text-[#888888]">POWER</div>
                    <div className="text-white font-medium mt-0.5">{car.specs.powerHp}</div>
                  </div>
                </div>

                {/* Footer price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-[#888888] block">BASE MSRP</span>
                    <span className="text-base font-light text-white font-mono">
                      ${car.basePrice.toLocaleString()}*
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      soundEngine.playMechanicalClick()
                      onSelectModel(originalIndex >= 0 ? originalIndex : 0)
                      onClose()
                    }}
                    className="flex items-center space-x-2 px-4 py-2 border border-white/30 text-white hover:bg-white hover:text-black transition-all text-[10px] font-mono tracking-widest uppercase rounded-[2px]"
                  >
                    <span>VIEW IN 3D</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
