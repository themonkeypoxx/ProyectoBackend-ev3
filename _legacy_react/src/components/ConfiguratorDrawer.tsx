import React, { useState } from 'react'
import { CarModel, PaintColor, WheelOption } from '../types/car'
import { X, Check, ShieldCheck, ChevronRight, Download, Send } from 'lucide-react'
import { soundEngine } from '../utils/audio'

interface ConfiguratorDrawerProps {
  isOpen: boolean
  onClose: () => void
  car: CarModel
  selectedColor: PaintColor
  onSelectColor: (color: PaintColor) => void
}

interface PackageOption {
  id: string
  name: string
  description: string
  price: number
  selected: boolean
}

export const ConfiguratorDrawer: React.FC<ConfiguratorDrawerProps> = ({
  isOpen,
  onClose,
  car,
  selectedColor,
  onSelectColor
}) => {
  const [selectedWheel, setSelectedWheel] = useState<WheelOption>(car.wheels[0] || {
    id: 'w-default',
    name: 'Standard Wheels',
    size: '20" / 21"',
    finish: 'Satin Titanium',
    price: 0
  })

  const [packages, setPackages] = useState<PackageOption[]>([
    {
      id: 'pkg-weissach',
      name: 'Weissach Package',
      description: 'Carbon-weave exposed hood, roof, rear wing, and anti-roll bars. Saves 22 kg.',
      price: 33520,
      selected: true
    },
    {
      id: 'pkg-pccb',
      name: 'Porsche Ceramic Composite Brakes (PCCB)',
      description: '410 mm front / 390 mm rear carbon-ceramic discs with yellow calipers.',
      price: 9210,
      selected: true
    },
    {
      id: 'pkg-lift',
      name: 'Front Axle Hydraulic Lift System',
      description: 'Raises front lip by 30 mm at up to 50 km/h with GPS smart memory.',
      price: 3670,
      selected: false
    },
    {
      id: 'pkg-pdls',
      name: 'Tinted Matrix LED Headlights (PDLS+)',
      description: 'Motorsport darkened housing with dynamic cornering light distribution.',
      price: 1630,
      selected: true
    }
  ])

  const [reservedSuccess, setReservedSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'paint' | 'wheels' | 'packages' | 'summary'>('paint')

  if (!isOpen) return null

  const togglePackage = (pkgId: string) => {
    soundEngine.playMechanicalClick()
    setPackages((prev) =>
      prev.map((p) => (p.id === pkgId ? { ...p, selected: !p.selected } : p))
    )
  }

  // Calculate total configured price
  const packagesTotal = packages.reduce((sum, p) => (p.selected ? sum + p.price : sum), 0)
  const wheelPrice = selectedWheel?.price || 0
  const colorPrice = selectedColor?.type === 'special' ? 4220 : selectedColor?.type === 'metallic' ? 1420 : 0
  const totalPrice = car.basePrice + wheelPrice + colorPrice + packagesTotal
  const monthlyLease = Math.round(totalPrice / 60)

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => {
          soundEngine.playMechanicalClick()
          onClose()
        }}
      />

      {/* Slide-out Configurator Panel */}
      <div className="relative w-full max-w-2xl h-full bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.08] bg-[#0d0d0d]">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#888888]">
              PORSCHE CAR CONFIGURATOR
            </span>
            <h2 className="text-xl font-bold tracking-wider text-white uppercase">
              {car.fullName}
            </h2>
          </div>

          <button
            onClick={() => {
              soundEngine.playMechanicalClick()
              onClose()
            }}
            className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Close configurator"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Mini Preview Bar */}
        <div className="relative px-8 py-4 bg-[#080808] border-b border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-11 relative overflow-hidden bg-black/60 rounded border border-white/10">
              <img
                src={selectedColor?.image || car.heroImage}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-white tracking-wide uppercase">
                {selectedColor.name}
              </div>
              <div className="text-[10px] text-[#888888] font-mono">
                WHEELS: {selectedWheel?.finish || 'STANDARD'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-mono text-[#888888] tracking-widest uppercase">
              ESTIMATED MSRP
            </div>
            <div className="text-lg font-light text-white font-mono">
              ${totalPrice.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Configuration Step Tabs */}
        <div className="flex border-b border-white/[0.08] bg-[#0c0c0c] px-8">
          {(['paint', 'wheels', 'packages', 'summary'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                soundEngine.playMechanicalClick()
                setActiveTab(tab)
              }}
              className={`py-3.5 px-4 text-[11px] font-mono tracking-[0.2em] uppercase transition-colors relative ${
                activeTab === tab ? 'text-white font-semibold' : 'text-[#888888] hover:text-white'
              }`}
            >
              <span>{tab}</span>
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Configuration Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 no-scrollbar">
          {/* TAB 1: PAINT COLORS */}
          {activeTab === 'paint' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xs font-mono tracking-[0.25em] text-[#888888] uppercase mb-1">
                  01 · EXTERIOR PAINTWORK
                </h3>
                <p className="text-sm text-white/90 font-light">
                  Select genuine Porsche Exclusive Manufaktur automotive finishes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {car.colors.map((color) => {
                  const isSelected = selectedColor.id === color.id
                  const priceTag =
                    color.type === 'special'
                      ? '+$4,220'
                      : color.type === 'metallic'
                      ? '+$1,420'
                      : 'Included'
                  return (
                    <button
                      key={color.id}
                      onClick={() => {
                        soundEngine.playMechanicalClick()
                        onSelectColor(color)
                      }}
                      className={`flex items-center space-x-3.5 p-3.5 rounded-[2px] border transition-all text-left focus:outline-none ${
                        isSelected
                          ? 'border-white bg-white/[0.06] shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                          : 'border-white/10 hover:border-white/30 bg-[#111111]'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full border border-white/20 shadow-inner flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white tracking-wide truncate">
                          {color.name}
                        </div>
                        <div className="text-[10px] font-mono text-[#888888] flex items-center justify-between mt-0.5">
                          <span>CODE {color.code}</span>
                          <span className={isSelected ? 'text-white' : ''}>{priceTag}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 2: WHEELS */}
          {activeTab === 'wheels' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xs font-mono tracking-[0.25em] text-[#888888] uppercase mb-1">
                  02 · WHEEL CONFIGURATION
                </h3>
                <p className="text-sm text-white/90 font-light">
                  Forged motorsport alloy and lightweight magnesium assemblies.
                </p>
              </div>

              <div className="space-y-3">
                {car.wheels.map((wheel) => {
                  const isSelected = selectedWheel.id === wheel.id
                  return (
                    <button
                      key={wheel.id}
                      onClick={() => {
                        soundEngine.playMechanicalClick()
                        setSelectedWheel(wheel)
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-[2px] border text-left transition-all focus:outline-none ${
                        isSelected
                          ? 'border-white bg-white/[0.06] shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                          : 'border-white/10 hover:border-white/30 bg-[#111111]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-white tracking-wide">
                          {wheel.name}
                        </div>
                        <div className="text-[11px] text-[#888888] font-mono">
                          {wheel.size} · {wheel.finish}
                        </div>
                      </div>

                      <div className="text-right pl-4">
                        <span className="text-xs font-mono text-white">
                          {wheel.price === 0 ? 'Standard' : `+$${wheel.price.toLocaleString()}`}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xs font-mono tracking-[0.25em] text-[#888888] uppercase mb-1">
                  03 · PERFORMANCE PACKAGES
                </h3>
                <p className="text-sm text-white/90 font-light">
                  Motorsport aerodynamics, chassis tuning, and high-voltage packages.
                </p>
              </div>

              <div className="space-y-3">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => togglePackage(pkg.id)}
                    className={`cursor-pointer p-4 rounded-[2px] border transition-all ${
                      pkg.selected
                        ? 'border-white/70 bg-white/[0.05]'
                        : 'border-white/10 hover:border-white/30 bg-[#111111]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={pkg.selected}
                          onChange={() => {}}
                          className="mt-1 accent-white"
                        />
                        <div>
                          <div className="text-xs font-semibold text-white uppercase tracking-wider">
                            {pkg.name}
                          </div>
                          <p className="text-[11px] text-[#888888] mt-1 font-light leading-relaxed">
                            {pkg.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-white whitespace-nowrap pl-4">
                        +${pkg.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xs font-mono tracking-[0.25em] text-[#888888] uppercase mb-1">
                  04 · BUILD SUMMARY & ALLOCATION
                </h3>
                <p className="text-sm text-white/90 font-light">
                  Review your individualized technical specification.
                </p>
              </div>

              <div className="p-4 bg-[#121212] border border-white/10 rounded-[2px] space-y-3 text-xs font-mono">
                <div className="flex justify-between text-[#888888]">
                  <span>BASE VEHICLE ({car.name})</span>
                  <span className="text-white">${car.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#888888]">
                  <span>COLOR: {selectedColor.name.toUpperCase()}</span>
                  <span className="text-white">
                    {colorPrice === 0 ? '$0' : `+$${colorPrice.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#888888]">
                  <span>WHEEL SPEC: {selectedWheel.finish.toUpperCase()}</span>
                  <span className="text-white">
                    {wheelPrice === 0 ? '$0' : `+$${wheelPrice.toLocaleString()}`}
                  </span>
                </div>
                {packages
                  .filter((p) => p.selected)
                  .map((p) => (
                    <div key={p.id} className="flex justify-between text-[#888888]">
                      <span>{p.name.toUpperCase()}</span>
                      <span className="text-white">+${p.price.toLocaleString()}</span>
                    </div>
                  ))}
                <div className="pt-3 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>TOTAL CONFIGURATION MSRP</span>
                  <span>${totalPrice.toLocaleString()}*</span>
                </div>
              </div>

              {/* Reserve feedback */}
              {reservedSuccess ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-[2px] text-emerald-300 text-xs flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span>
                    Allocation Request Registered. Porsche Centre Stuttgart concierge will reach out within 2 hours.
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-white/[0.02] border border-white/10 rounded-[2px] text-[11px] text-[#888888] space-y-1">
                  <div className="text-white font-medium">FINANCING & LEASING</div>
                  <div>
                    Estimated monthly lease: <span className="text-white font-mono">${monthlyLease}/mo</span> for 36 months with 10% down payment.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="px-8 py-5 border-t border-white/[0.08] bg-[#0d0d0d] flex items-center justify-between">
          <button
            onClick={() => {
              soundEngine.playMechanicalClick()
              alert(`Porsche Build Code: P-${car.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}\nSaved to clipboard.`)
            }}
            className="flex items-center space-x-2 text-xs font-mono text-[#888888] hover:text-white transition-colors uppercase tracking-wider"
          >
            <Download className="w-4 h-4" />
            <span>SAVE CODE</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playMechanicalClick()
              setReservedSuccess(true)
            }}
            className="px-8 py-3.5 bg-white text-black hover:bg-neutral-200 font-semibold text-xs tracking-[0.25em] uppercase rounded-[2px] transition-all flex items-center space-x-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] focus:outline-none"
          >
            <span>{reservedSuccess ? 'ALLOCATION SECURED' : 'REQUEST ALLOCATION'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
