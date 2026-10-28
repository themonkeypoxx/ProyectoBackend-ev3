import React, { useState, useEffect } from 'react'
import { CAR_MODELS } from './data/cars'
import { PaintColor } from './types/car'
import { Header } from './components/Header'
import { ShowroomPedestal } from './components/ShowroomPedestal'
import { FloatingSpecs } from './components/FloatingSpecs'
import { ModelCarousel } from './components/ModelCarousel'
import { ConfiguratorDrawer } from './components/ConfiguratorDrawer'
import { SpecsModal } from './components/SpecsModal'
import { ModelsMatrixModal } from './components/ModelsMatrixModal'
import { NavigationDrawer } from './components/NavigationDrawer'
import { SearchModal } from './components/SearchModal'
import { soundEngine } from './utils/audio'

export default function App() {
  // Active model in carousel (defaults to 911 GT3 RS)
  const [activeModelIndex, setActiveModelIndex] = useState(0)
  const currentCar = CAR_MODELS[activeModelIndex]

  // Active color for current car
  const [selectedColor, setSelectedColor] = useState<PaintColor>(currentCar.colors[0])

  // Modals and Drawers
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false)
  const [isSpecsOpen, setIsSpecsOpen] = useState(false)
  const [isModelsMatrixOpen, setIsModelsMatrixOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Keep color in sync when changing models
  useEffect(() => {
    if (currentCar.colors && currentCar.colors.length > 0) {
      setSelectedColor(currentCar.colors[0])
    }
  }, [activeModelIndex, currentCar])

  // Global keyboard shortcuts (Cmd+K for search, Escape to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      } else if (e.key === 'Escape') {
        setIsConfiguratorOpen(false)
        setIsSpecsOpen(false)
        setIsModelsMatrixOpen(false)
        setIsMenuOpen(false)
        setIsSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelectModel = (index: number) => {
    setActiveModelIndex(index)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050505] text-white select-none font-sans">
      {/* 1. TOP NAVIGATION BAR */}
      <Header
        onOpenModels={() => setIsModelsMatrixOpen(true)}
        onOpenServices={() => setIsMenuOpen(true)}
        onOpenDiscover={() => setIsMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* 2. HERO SECTION (THE PEDESTAL WITH 3D SHOWROOM EXPERIENCE) */}
      <ShowroomPedestal
        currentCar={currentCar}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        onConfigureClick={() => setIsConfiguratorOpen(true)}
      />

      {/* 3. STRICT 12-COLUMN FLOATING DATA & PRIMARY CTA */}
      <FloatingSpecs
        car={currentCar}
        onConfigureClick={() => setIsConfiguratorOpen(true)}
        onOpenSpecsModal={() => setIsSpecsOpen(true)}
      />

      {/* 4. BOTTOM 20% HORIZONTAL MODEL SELECTOR CAROUSEL */}
      <ModelCarousel
        models={CAR_MODELS}
        activeIndex={activeModelIndex}
        onSelectModel={handleSelectModel}
      />

      {/* =======================================================================
          INTERACTIVE LUXURY OVERLAYS & MODALS
          ======================================================================= */}
      {/* Porsche Model Configurator Drawer */}
      <ConfiguratorDrawer
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
        car={currentCar}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />

      {/* Full Telemetry Data Sheet Modal */}
      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        car={currentCar}
      />

      {/* Models Matrix Full View */}
      <ModelsMatrixModal
        isOpen={isModelsMatrixOpen}
        onClose={() => setIsModelsMatrixOpen(false)}
        onSelectModel={(idx) => {
          handleSelectModel(idx)
          setIsModelsMatrixOpen(false)
        }}
      />

      {/* Two-Line Hamburger Navigation Drawer */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectSection={(section) => {
          if (section.toLowerCase().includes('model')) {
            setIsModelsMatrixOpen(true)
          } else {
            alert(`Navigating to ${section}...`)
          }
        }}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectModel={(idx) => {
          handleSelectModel(idx)
          setIsSearchOpen(false)
        }}
      />
    </div>
  )
}
