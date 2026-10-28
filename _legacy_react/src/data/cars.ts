import { CarModel } from '../types/car'

export const CAR_MODELS: CarModel[] = [
  {
    id: '911-gt3-rs',
    name: '911 GT3 RS',
    fullName: 'Porsche 911 GT3 RS (992)',
    tagline: 'Born from Flacht. Aerodynamics elevated to pure motorsport art.',
    series: '911',
    basePrice: 241300,
    specs: {
      acceleration: '3.2s',
      topSpeed: '296 km/h',
      powerHp: '525 HP',
      powerKw: '386 kW',
      engine: '4.0L Naturally Aspirated Boxer-6',
      torque: '465 Nm',
      drivetrain: 'Rear-Wheel Drive with Rear-Axle Steering',
      weight: '1,450 kg (DIN)',
      transmission: '7-Speed Porsche Doppelkupplung (PDK)'
    },
    heroImage: '/cars/porsche-911-studio.jpg',
    colors: [
      { id: 'c-arctic', name: 'Arctic Grey', hex: '#83878b', code: '1A', image: '/cars/porsche-911-arctic-grey.jpg', type: 'special' },
      { id: 'c-silver', name: 'GT Silver Metallic', hex: '#d6d7d9', code: 'U2', image: '/cars/porsche-911-studio.jpg', type: 'metallic' },
      { id: 'c-guards', name: 'Guards Red', hex: '#cb1f27', code: 'G1', image: '/cars/porsche-911-guards-red.jpg', type: 'standard' },
      { id: 'c-shark', name: 'Shark Blue', hex: '#166fb5', code: 'D7', image: '/cars/porsche-911-shark-blue.jpg', type: 'special' },
      { id: 'c-racing', name: 'Racing Yellow', hex: '#e8bb12', code: 'P3', image: '/cars/porsche-911-racing-yellow.jpg', type: 'standard' },
      { id: 'c-black', name: 'Jet Black Metallic', hex: '#181819', code: '2T', image: '/cars/porsche-911-jet-black.jpg', type: 'metallic' },
      { id: 'c-python', name: 'Python Green', hex: '#2ca447', code: '3I', image: '/cars/porsche-911-python-green.jpg', type: 'special' }
    ],
    wheels: [
      { id: 'w1', name: '20/21" GT3 RS Lightweight Forged Magnesium Wheels', size: '20" Front / 21" Rear', finish: 'Satin Neodyme', price: 14500 },
      { id: 'w2', name: '20/21" GT3 RS Forged Lightweight Alloy Wheels', size: '20" Front / 21" Rear', finish: 'Satin Black with Rim Border in Guards Red', price: 3200 },
      { id: 'w3', name: '20/21" GT3 RS Lightweight Aluminum Wheels', size: '20" Front / 21" Rear', finish: 'Satin Darksilver', price: 0 }
    ],
    hotspots: [
      {
        id: 'h-wing',
        title: 'ACTIVE DRS REAR WING',
        category: 'AERODYNAMICS',
        description: 'Swan-neck hydraulic wing structure with Drag Reduction System generating 860 kg of downforce at 285 km/h.',
        spec: '860 KG @ 285 KM/H',
        x: 82,
        y: 42
      },
      {
        id: 'h-engine',
        title: '4.0L FLAT-SIX HIGH-REV',
        category: 'POWERTRAIN',
        description: 'Naturally aspirated motorsport engine with individual throttle bodies revving to an uncompromising 9,000 RPM.',
        spec: '9,000 RPM REDLINE',
        x: 64,
        y: 50
      },
      {
        id: 'h-brakes',
        title: 'PORSCHE CERAMIC COMPOSITE (PCCB)',
        category: 'CHASSIS',
        description: '410 mm front and 390 mm rear carbon-ceramic internally vented discs with 6-piston aluminum monobloc fixed calipers.',
        spec: '410 MM CARBON-CERAMIC',
        x: 32,
        y: 65
      },
      {
        id: 'h-lights',
        title: 'TINTED MATRIX LED HEADLIGHTS',
        category: 'LIGHTING',
        description: 'Porsche Dynamic Light System Plus (PDLS+) with 84 individually controlled light points and motorsport dark housing.',
        spec: 'PDLS+ 84 MATRIX LED',
        x: 20,
        y: 48
      }
    ],
    description: 'The Porsche 911 GT3 RS is uncompromised track capability engineered for road legality. Its central radiator concept, active aero elements, and teardrop-profile double wishbone front axle deliver unprecedented mechanical grip.',
    badgeText: 'GT MOTORSPORT'
  },
  {
    id: '911-turbo-s',
    name: '911 TURBO S',
    fullName: 'Porsche 911 Turbo S (992.2)',
    tagline: 'The definitive supercar benchmark. Omnipresent power in any condition.',
    series: '911',
    basePrice: 230400,
    specs: {
      acceleration: '2.7s',
      topSpeed: '330 km/h',
      powerHp: '650 HP',
      powerKw: '478 kW',
      engine: '3.8L Twin-Turbocharged Boxer-6',
      torque: '800 Nm',
      drivetrain: 'All-Wheel Drive (PTM)',
      weight: '1,640 kg (DIN)',
      transmission: '8-Speed Porsche Doppelkupplung (PDK)'
    },
    heroImage: '/cars/supercar-black-room.jpg',
    colors: [
      { id: 'c-black-turbo', name: 'Jet Black Metallic', hex: '#111112', code: '2T', image: '/cars/supercar-black-room.jpg', type: 'metallic' },
      { id: 'c-silver-turbo', name: 'GT Silver Metallic', hex: '#d6d7d9', code: 'U2', image: '/cars/porsche-911-studio.jpg', type: 'metallic' },
      { id: 'c-arctic-turbo', name: 'Arctic Grey', hex: '#83878b', code: '1A', image: '/cars/porsche-911-arctic-grey.jpg', type: 'special' }
    ],
    wheels: [
      { id: 'w-turbo-1', name: '20/21" 911 Turbo S Exclusive Design Wheels', size: '20" Front / 21" Rear', finish: 'High-Gloss Black', price: 4200 },
      { id: 'w-turbo-2', name: '20/21" 911 Turbo S Central Lock Wheels', size: '20" Front / 21" Rear', finish: 'Brushed Titanium', price: 0 }
    ],
    hotspots: [
      {
        id: 'h-turbo-vtg',
        title: 'VARIABLE TURBINE GEOMETRY (VTG)',
        category: 'TURBOCHARGING',
        description: 'Twin variable turbine geometry turbochargers ensuring instantaneous throttle response across all RPM bands.',
        spec: '800 NM TORQUE PEAK',
        x: 65,
        y: 48
      },
      {
        id: 'h-turbo-ptm',
        title: 'PORSCHE TRACTION MANAGEMENT',
        category: 'DRIVETRAIN',
        description: 'Intelligent all-wheel-drive system capable of routing up to 500 Nm of torque to the front wheels in milliseconds.',
        spec: 'ELECTRONIC AWD CLUTCH',
        x: 35,
        y: 62
      }
    ],
    description: 'The 911 Turbo S combines breathtaking 2.7-second acceleration with everyday usability. Variable turbine geometry and active Porsche Active Aerodynamics (PAA) make it an absolute master of speed.',
    badgeText: 'SUPERCAR BENCHMARK'
  },
  {
    id: 'taycan-turbo-gt',
    name: 'TAYCAN TURBO GT',
    fullName: 'Porsche Taycan Turbo GT with Weissach Package',
    tagline: 'Record-shatterer at the Nürburgring. Pure electric peak performance.',
    series: 'Taycan',
    basePrice: 230000,
    specs: {
      acceleration: '2.2s',
      topSpeed: '305 km/h',
      powerHp: '1,034 HP',
      powerKw: '760 kW',
      engine: 'Dual Permanent-Magnet Synchronous Electric Motors',
      torque: '1,300 Nm',
      drivetrain: 'All-Wheel Drive with Rear Torque Vectoring',
      weight: '2,220 kg',
      transmission: '2-Speed Transmission on Rear Axle'
    },
    heroImage: '/cars/supercar-overhead-light.jpg',
    colors: [
      { id: 'c-taycan-dark', name: 'Night Green Metallic', hex: '#1c2d28', code: 'N1', image: '/cars/supercar-overhead-light.jpg', type: 'metallic' },
      { id: 'c-taycan-silver', name: 'Dolomite Silver Metallic', hex: '#d2d5d8', code: 'M0', image: '/cars/porsche-911-studio.jpg', type: 'metallic' }
    ],
    wheels: [
      { id: 'w-taycan-1', name: '21" Turbo GT Forged Lightweight Aeroblades', size: '21" Staggered', finish: 'Satin Carbon / Diamond Cut', price: 0 }
    ],
    hotspots: [
      {
        id: 'h-inverter',
        title: 'SILICON CARBIDE INVERTER',
        category: 'HIGH VOLTAGE',
        description: '900-amp pulse inverter operating with silicon carbide semiconductor switches to transmit over 1,000 HP with 98% efficiency.',
        spec: '900A PULSE INVERTER',
        x: 60,
        y: 52
      },
      {
        id: 'h-attack-mode',
        title: 'ATTACK MODE BOOST',
        category: 'TELEMETRY',
        description: '10-second burst of 120 kW additional power activated via steering column paddle, derived directly from Formula E racing.',
        spec: '+120 KW BOOST',
        x: 42,
        y: 40
      }
    ],
    description: 'Lapping the Nürburgring Nordschleife in 7:07.55, the Taycan Turbo GT is the fastest electric series-production saloon car in history.',
    badgeText: 'E-PERFORMANCE'
  },
  {
    id: '718-gt4-rs',
    name: '718 GT4 RS',
    fullName: 'Porsche 718 Cayman GT4 RS',
    tagline: 'Mid-engine acoustic symphony. Unadulterated mechanical ecstasy.',
    series: '718',
    basePrice: 160700,
    specs: {
      acceleration: '3.4s',
      topSpeed: '315 km/h',
      powerHp: '500 HP',
      powerKw: '368 kW',
      engine: '4.0L Naturally Aspirated Boxer-6',
      torque: '450 Nm',
      drivetrain: 'Mid-Engine / Rear-Wheel Drive',
      weight: '1,415 kg (Lightweight)',
      transmission: '7-Speed Short-Ratio PDK'
    },
    heroImage: '/cars/supercar-studio-orange.jpg',
    colors: [
      { id: 'c-gt4-orange', name: 'Gulf Orange / Lava', hex: '#d95a1e', code: 'H2', image: '/cars/supercar-studio-orange.jpg', type: 'special' },
      { id: 'c-gt4-grey', name: 'Arctic Grey', hex: '#83878b', code: '1A', image: '/cars/porsche-911-arctic-grey.jpg', type: 'special' }
    ],
    wheels: [
      { id: 'w-gt4-1', name: '20" 718 Cayman GT4 RS Forged Magnesium Wheels', size: '20" Front / 20" Rear', finish: 'Satin Indigo Blue', price: 15640 }
    ],
    hotspots: [
      {
        id: 'h-gt4-intake',
        title: 'REAR QUARTER AIR INTAKES',
        category: 'ACOUSTICS',
        description: 'Intake sound boxes placed directly behind the occupant windows delivering uncompressed mechanical sound induction into the cockpit.',
        spec: 'DIRECT INDUCTION SOUND',
        x: 52,
        y: 38
      }
    ],
    description: 'With the beating heart of the 911 GT3 transplanted into a featherweight mid-engine Cayman chassis, the GT4 RS is visceral motorsport perfection.',
    badgeText: 'MID-ENGINE RACER'
  },
  {
    id: '918-spyder',
    name: '918 SPYDER',
    fullName: 'Porsche 918 Spyder Weissach Package',
    tagline: 'The timeless hybrid hypercar icon. The blueprint of future motorsport.',
    series: 'Hypercar',
    basePrice: 845000,
    specs: {
      acceleration: '2.6s',
      topSpeed: '345 km/h',
      powerHp: '887 HP',
      powerKw: '652 kW',
      engine: '4.6L Naturally Aspirated V8 + Dual Electric Motors',
      torque: '1,280 Nm combined',
      drivetrain: 'Hybrid All-Wheel Drive',
      weight: '1,634 kg (Weissach)',
      transmission: '7-Speed PDK Hybrid'
    },
    heroImage: '/cars/supercar-studio-red.jpg',
    colors: [
      { id: 'c-918-red', name: 'Liquid Metal Chrome Red', hex: '#8a1c22', code: 'S9', image: '/cars/supercar-studio-red.jpg', type: 'special' },
      { id: 'c-918-silver', name: 'Liquid Metal Silver', hex: '#c5c8ca', code: 'S1', image: '/cars/porsche-911-studio.jpg', type: 'metallic' }
    ],
    wheels: [
      { id: 'w-918-1', name: '20/21" 918 Spyder Magnesium Wheels', size: '20" Front / 21" Rear', finish: 'Weissach Carbon / Polished Lip', price: 0 }
    ],
    hotspots: [
      {
        id: 'h-918-exhaust',
        title: 'TOP-PIPE EXHAUST SYSTEM',
        category: 'THERMODYNAMICS',
        description: 'Top-exit exhaust pipes routed directly out through the engine cover, optimizing thermal management and downforce diffuser packaging.',
        spec: 'TOP-PIPE 850°C EXHAUST',
        x: 68,
        y: 36
      }
    ],
    description: 'The definitive milestone in automotive engineering history. The first series production sports car to break the 7-minute barrier at the Nürburgring Nordschleife.',
    badgeText: 'HERITAGE HYPERCAR'
  }
]
