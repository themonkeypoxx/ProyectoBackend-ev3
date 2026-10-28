export interface CarSpec {
  acceleration: string
  topSpeed: string
  powerHp: string
  powerKw: string
  engine: string
  torque: string
  drivetrain: string
  weight: string
  transmission: string
}

export interface PaintColor {
  id: string
  name: string
  hex: string
  code: string
  image: string
  type: 'standard' | 'metallic' | 'special'
}

export interface CarHotspot {
  id: string
  title: string
  category: string
  description: string
  spec: string
  x: number
  y: number
}

export interface WheelOption {
  id: string
  name: string
  size: string
  finish: string
  price: number
}

export interface CarModel {
  id: string
  name: string
  fullName: string
  tagline: string
  series: string
  basePrice: number
  specs: CarSpec
  heroImage: string
  colors: PaintColor[]
  wheels: WheelOption[]
  hotspots: CarHotspot[]
  description: string
  badgeText?: string
}
