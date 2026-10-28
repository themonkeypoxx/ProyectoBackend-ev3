import React from 'react'
import { CarModel } from '../types/car'
import { X, Check, Gauge, Zap, Wind, ShieldAlert } from 'lucide-react'
import { soundEngine } from '../utils/audio'

interface SpecsModalProps {
  isOpen: boolean
  onClose: () => void
  car: CarModel
}

export const SpecsModal: React.FC<SpecsModalProps> = ({ isOpen, onClose, car }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => {
          soundEngine.playMechanicalClick()
          onClose()
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0c0c] border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.95)] rounded-[2px] flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.08] bg-[#0f0f0f]">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#888888]">
              OFFICIAL FACTORY TELEMETRY
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-white uppercase">
              {car.fullName} — SPECIFICATION SHEET
            </h2>
          </div>

          <button
            onClick={() => {
              soundEngine.playMechanicalClick()
              onClose()
            }}
            className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar text-white">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#121212] border border-white/5 rounded-[2px]">
            <div>
              <div className="text-[9px] font-mono tracking-widest text-[#888888] uppercase">
                0–100 KM/H
              </div>
              <div className="text-2xl font-light text-white font-mono mt-0.5">
                {car.specs.acceleration}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-widest text-[#888888] uppercase">
                TOP SPEED
              </div>
              <div className="text-2xl font-light text-white font-mono mt-0.5">
                {car.specs.topSpeed}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-widest text-[#888888] uppercase">
                MAX POWER
              </div>
              <div className="text-2xl font-light text-white font-mono mt-0.5">
                {car.specs.powerHp}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-widest text-[#888888] uppercase">
                KERB WEIGHT
              </div>
              <div className="text-2xl font-light text-white font-mono mt-0.5">
                {car.specs.weight}
              </div>
            </div>
          </div>

          {/* Detailed Telemetry Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-mono">
            {/* Powertrain */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold tracking-[0.25em] text-[#888888] uppercase border-b border-white/10 pb-2 flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-white" />
                <span>POWERTRAIN & TRANSMISSION</span>
              </h4>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-[#888888]">Engine Layout</span>
                <span>{car.specs.engine}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-[#888888]">Transmission</span>
                <span>{car.specs.transmission}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-[#888888]">Peak Torque</span>
                <span>{car.specs.torque}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-[#888888]">Drive Configuration</span>
                <span>{car.specs.drivetrain}</span>
              </div>
            </div>

            {/* Chassis & Aerodynamics */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold tracking-[0.25em] text-[#888888] uppercase border-b border-white/10 pb-2 flex items-center space-x-2">
                <Wind className="w-4 h-4 text-white" />
                <span>AERODYNAMICS & CHASSIS</span>
              </h4>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-[#888888]">Front Axle</span>
                <span>Double wishbone with teardrop profiles</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-[#888888]">Rear Axle</span>
                <span>Multi-link with integrated rear-axle steer</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-[#888888]">Active Aerodynamics</span>
                <span>Porsche Active Aerodynamics (PAA) + DRS</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-[#888888]">Braking Architecture</span>
                <span>Monobloc aluminum fixed calipers</span>
              </div>
            </div>
          </div>

          {/* Description Narrative */}
          <div className="p-5 bg-white/[0.02] border border-white/10 rounded-[2px]">
            <h4 className="text-xs font-mono tracking-[0.25em] text-[#888888] uppercase mb-2">
              ENGINEERING HERITAGE
            </h4>
            <p className="text-sm font-light text-neutral-300 leading-relaxed">
              {car.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-white/[0.08] bg-[#0f0f0f] flex items-center justify-between text-xs font-mono text-[#888888]">
          <span>DR. ING. H.C. F. PORSCHE AG · STUTTGART</span>
          <button
            onClick={() => {
              soundEngine.playMechanicalClick()
              onClose()
            }}
            className="text-white hover:underline uppercase tracking-wider"
          >
            Close [ESC]
          </button>
        </div>
      </div>
    </div>
  )
}
