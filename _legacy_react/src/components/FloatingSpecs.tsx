import React from 'react'
import { CarModel } from '../types/car'
import { ArrowRight, Sliders, FileText } from 'lucide-react'
import { soundEngine } from '../utils/audio'

interface FloatingSpecsProps {
  car: CarModel
  onConfigureClick: () => void
  onOpenSpecsModal: () => void
}

export const FloatingSpecs: React.FC<FloatingSpecsProps> = ({
  car,
  onConfigureClick,
  onOpenSpecsModal
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      {/* Strict 12-Column Grid Container */}
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 grid grid-cols-12 gap-4 lg:gap-8 items-center h-full">
        {/* =====================================================================
            LEFT SIDE (COLUMNS 1 TO 3 / 4): VERTICALLY FLOATING TECHNICAL SPECS
            ===================================================================== */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 pointer-events-auto flex flex-col justify-center space-y-7 pl-1 sm:pl-2">
          {/* Series Tagline Watermark */}
          <div className="flex items-center space-x-2 text-[9px] font-mono tracking-[0.3em] uppercase text-[#888888] pb-1 border-b border-white/[0.08] w-fit">
            <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
            <span>{car.badgeText || 'TECHNICAL TELEMETRY'}</span>
          </div>

          {/* Spec Item 1: Acceleration 0-100 km/h */}
          <div className="group flex flex-col space-y-1">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#888888] uppercase font-light">
              0–100 KM/H
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extralight tracking-tight text-white font-mono">
                {car.specs.acceleration}
              </span>
              <span className="text-[10px] text-[#888888] font-mono tracking-widest uppercase">
                SEC
              </span>
            </div>
            <div className="w-8 h-[1px] bg-white/20 group-hover:w-16 transition-all duration-300" />
          </div>

          {/* Spec Item 2: Top Speed */}
          <div className="group flex flex-col space-y-1">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#888888] uppercase font-light">
              TOP SPEED
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extralight tracking-tight text-white font-mono">
                {car.specs.topSpeed}
              </span>
            </div>
            <div className="w-8 h-[1px] bg-white/20 group-hover:w-16 transition-all duration-300" />
          </div>

          {/* Spec Item 3: Power Output */}
          <div className="group flex flex-col space-y-1">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#888888] uppercase font-light">
              POWER OUTPUT
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extralight tracking-tight text-white font-mono">
                {car.specs.powerHp}
              </span>
              <span className="text-[11px] text-[#888888] font-mono">
                ({car.specs.powerKw})
              </span>
            </div>
            <div className="w-8 h-[1px] bg-white/20 group-hover:w-16 transition-all duration-300" />
          </div>

          {/* Spec Item 4: Powertrain Engine */}
          <div className="group hidden sm:flex flex-col space-y-1">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#888888] uppercase font-light">
              ENGINE ARCHITECTURE
            </span>
            <span className="text-[13px] font-light text-white/90 tracking-wider">
              {car.specs.engine}
            </span>
          </div>

          {/* Interactive Spec Sheet Trigger */}
          <button
            onClick={() => {
              soundEngine.playMechanicalClick()
              onOpenSpecsModal()
            }}
            className="w-fit flex items-center space-x-2 text-[10px] font-mono tracking-[0.25em] text-[#888888] hover:text-white transition-colors uppercase pt-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>FULL DATA SHEET</span>
          </button>
        </div>

        {/* =====================================================================
            CENTER COLUMNS (COLUMNS 4 TO 9): MASSIVE NEGATIVE SPACE (70% VIEWPORT)
            ===================================================================== */}
        <div className="hidden md:block md:col-span-4 lg:col-span-6 pointer-events-none" />

        {/* =====================================================================
            RIGHT SIDE (COLUMNS 10 TO 12): PRIMARY CALL TO ACTION (CTA)
            ===================================================================== */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 pointer-events-auto flex flex-col justify-center items-start md:items-end text-left md:text-right space-y-6 pr-1 sm:pr-2">
          {/* MSRP Starting Price readout */}
          <div className="flex flex-col md:items-end space-y-1">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#888888] font-light">
              STARTING FROM
            </span>
            <span className="text-xl sm:text-2xl font-light tracking-wider text-white">
              ${car.basePrice.toLocaleString()}
              <span className="text-[11px] text-[#888888] ml-1">*</span>
            </span>
            <span className="text-[9px] font-mono text-[#888888]/70 tracking-widest uppercase">
              EXCL. TAXES & VAT
            </span>
          </div>

          {/* PRIMARY CTA: Ghost button style
              (transparent background, 1px solid white border, sharp corners or 2px border-radius) */}
          <button
            onClick={() => {
              soundEngine.playMechanicalClick()
              onConfigureClick()
            }}
            className="group relative flex items-center justify-center space-x-3 px-8 sm:px-10 py-4 border border-white bg-transparent text-white text-[11px] tracking-[0.3em] font-medium uppercase rounded-[2px] transition-all duration-300 hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-[0.98] focus:outline-none w-full sm:w-auto"
          >
            <span className="relative z-10">CONFIGURE MODEL</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Secondary Actions / Build Status */}
          <div className="flex flex-col md:items-end space-y-2 pt-2">
            <button
              onClick={() => {
                soundEngine.playMechanicalClick()
                onConfigureClick()
              }}
              className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.25em] uppercase text-[#888888] hover:text-white transition-colors"
            >
              <Sliders className="w-3 h-3" />
              <span>MANUFACTUR OPTIONS</span>
            </button>
            <span className="text-[9px] font-mono text-[#888888]/60 tracking-wider">
              BUILD CODE: {car.id.toUpperCase()}-2025-DE
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
