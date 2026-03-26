export const EXTERIOR_COLORS = [
  { id: 'guards-red', name: { en: 'Guards Red', es: 'Rojo Guardia' } },
  { id: 'midnight-blue', name: { en: 'Midnight Blue', es: 'Azul Medianoche' } },
  { id: 'silver', name: { en: 'Silver Metallic', es: 'Plata Metálico' } },
  { id: 'irish-green', name: { en: 'Irish Green', es: 'Verde Irlandés' } },
  { id: 'signal-yellow', name: { en: 'Signal Yellow', es: 'Amarillo Señal' } },
  { id: 'black', name: { en: 'Black', es: 'Negro' } },
  { id: 'gulf-orange', name: { en: 'Gulf Orange', es: 'Naranja Gulf' } },
  { id: 'chalk', name: { en: 'Chalk', es: 'Tiza' } },
  { id: 'miami-blue', name: { en: 'Miami Blue', es: 'Azul Miami' } },
  { id: 'white', name: { en: 'Grand Prix White', es: 'Blanco Grand Prix' } },
] as const;

export const WHEEL_STYLES = [
  { id: 'fuchs', name: { en: 'Fuchs Classic', es: 'Fuchs Clásico' } },
  { id: 'cup', name: { en: 'Cup Design', es: 'Diseño Cup' } },
  { id: 'turbo-twist', name: { en: 'Turbo Twist', es: 'Turbo Twist' } },
] as const;

export const INTERIOR_COLORS = [
  { id: 'tan', hex: '#c88a4a', name: { en: 'Tan Leather', es: 'Cuero Habano' } },
  { id: 'black', hex: '#111111', name: { en: 'Black Leather', es: 'Cuero Negro' } },
  { id: 'burgundy', hex: '#6b2737', name: { en: 'Burgundy', es: 'Borgoña' } },
  { id: 'cognac', hex: '#9a5b2f', name: { en: 'Cognac', es: 'Cognac' } },
  { id: 'cream', hex: '#f5e6c8', name: { en: 'Cream', es: 'Crema' } },
] as const;

export type ExteriorColor = (typeof EXTERIOR_COLORS)[number];
export type WheelStyle = (typeof WHEEL_STYLES)[number];
export type InteriorColor = (typeof INTERIOR_COLORS)[number];
export type Variant = '964' | '993';
export type Tab = 'exterior' | 'wheels' | 'interior';

export const bodyImagePath = (model: Variant, color: string) =>
  new URL(`../../assets/${model}/${color}.png`, import.meta.url).href;

export const wheelImagePath = (model: Variant, style: string) =>
  new URL(`../../assets/wheels/${model}-${style}.png`, import.meta.url).href;

export const interiorImagePath = (color: string) =>
  new URL(`../../assets/interiors/${color}.png`, import.meta.url).href;
