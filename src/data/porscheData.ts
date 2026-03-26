// Centralized Porsche model & options data
import porsche356 from '@/assets/porsche-356.jpg';
import porscheRed from '@/assets/porsche-red.jpg';
import porscheBlue from '@/assets/porsche-blue.jpg';
import porsche930 from '@/assets/porsche-930.jpg';
import porscheSilver from '@/assets/porsche-silver.jpg';
import porsche993 from '@/assets/porsche-993.jpg';
import porsche996 from '@/assets/porsche-996.jpg';
import porsche997 from '@/assets/porsche-997.jpg';
import porsche991 from '@/assets/porsche-991.jpg';
import porsche992 from '@/assets/porsche-992.jpg';
import porscheCayenne from '@/assets/porsche-cayenne.jpg';
import porscheBoxster from '@/assets/porsche-boxster.jpg';
import porscheCayman from '@/assets/porsche-cayman.jpg';
import porschePanamera from '@/assets/porsche-panamera.jpg';
import porscheMacan from '@/assets/porsche-macan.jpg';
import porscheTaycan from '@/assets/porsche-taycan.jpg';

import interiorTan from '@/assets/interior-tan.jpg';
import interiorBlack from '@/assets/interior-black.jpg';
import interiorBurgundy from '@/assets/interior-burgundy.jpg';
import interiorCognac from '@/assets/interior-cognac.jpg';

import wheelFuchsClassic from '@/assets/wheel-fuchs-classic.jpg';
import wheelFuchsBlack from '@/assets/wheel-fuchs-black.jpg';
import wheelSportSilver from '@/assets/wheel-sport-silver.jpg';
import wheelRsGold from '@/assets/wheel-rs-gold.jpg';
import wheelBbsMesh from '@/assets/wheel-bbs-mesh.jpg';
import wheelTurboTwist from '@/assets/wheel-turbo-twist.jpg';

export type CategoryId = 'heritage' | 'classic-911' | 'modern-911' | 'mid-engine' | 'gran-turismo' | 'suv' | 'electric';

export interface CarCategory {
  id: CategoryId;
  name: { en: string; es: string };
  description: { en: string; es: string };
}

export interface CarModel {
  id: string;
  name: string;
  year: string;
  category: CategoryId;
  image: string;
  engine: { en: string; es: string };
  power: string;
  description: { en: string; es: string };
}

export interface ExteriorColor {
  id: string;
  name: { en: string; es: string };
  hex: string;
}

export interface InteriorOption {
  id: string;
  name: { en: string; es: string };
  hex: string;
  image: string;
}

export interface WheelOption {
  id: string;
  name: { en: string; es: string };
  image: string;
}

export const categories: CarCategory[] = [
  { id: 'heritage', name: { en: 'Heritage', es: 'Herencia' }, description: { en: 'Where the legend began', es: 'Donde comenzó la leyenda' } },
  { id: 'classic-911', name: { en: 'Classic 911', es: '911 Clásico' }, description: { en: 'Air-cooled icons', es: 'Íconos refrigerados por aire' } },
  { id: 'modern-911', name: { en: 'Modern 911', es: '911 Moderno' }, description: { en: 'Evolution of perfection', es: 'Evolución de la perfección' } },
  { id: 'mid-engine', name: { en: 'Mid-Engine', es: 'Motor Central' }, description: { en: 'Pure driving balance', es: 'Balance puro de conducción' } },
  { id: 'gran-turismo', name: { en: 'Gran Turismo', es: 'Gran Turismo' }, description: { en: 'Luxury & performance', es: 'Lujo y rendimiento' } },
  { id: 'suv', name: { en: 'SUV', es: 'SUV' }, description: { en: 'Porsche DNA, elevated', es: 'ADN Porsche, elevado' } },
  { id: 'electric', name: { en: 'Electric', es: 'Eléctrico' }, description: { en: 'The future is now', es: 'El futuro es ahora' } },
];

export const carModels: CarModel[] = [
  { id: '356', name: '356 Speedster', year: '1948–1965', category: 'heritage', image: porsche356, engine: { en: 'Flat-4', es: 'Bóxer-4' }, power: '60–115 HP', description: { en: 'The car that started it all', es: 'El auto que comenzó todo' } },
  { id: '911-classic', name: '911 Classic', year: '1964–1973', category: 'classic-911', image: porscheRed, engine: { en: 'Flat-6 Air-Cooled', es: 'Bóxer-6 Refrigerado por Aire' }, power: '130–190 HP', description: { en: 'The original sports car icon', es: 'El ícono deportivo original' } },
  { id: '911-g-body', name: '911 G-Body', year: '1974–1989', category: 'classic-911', image: porscheBlue, engine: { en: 'Flat-6 Air-Cooled', es: 'Bóxer-6 Refrigerado por Aire' }, power: '150–231 HP', description: { en: 'The impact bumper era', es: 'La era de los parachoques de impacto' } },
  { id: '930-turbo', name: '930 Turbo', year: '1975–1989', category: 'classic-911', image: porsche930, engine: { en: 'Flat-6 Turbo Air-Cooled', es: 'Bóxer-6 Turbo Refrigerado por Aire' }, power: '260–330 HP', description: { en: 'The widowmaker legend', es: 'La leyenda "viudadora"' } },
  { id: '964', name: '964', year: '1989–1994', category: 'classic-911', image: porscheSilver, engine: { en: 'Flat-6 Air-Cooled', es: 'Bóxer-6 Refrigerado por Aire' }, power: '250–381 HP', description: { en: 'The modernized classic', es: 'El clásico modernizado' } },
  { id: '993', name: '993', year: '1994–1998', category: 'classic-911', image: porsche993, engine: { en: 'Flat-6 Air-Cooled', es: 'Bóxer-6 Refrigerado por Aire' }, power: '272–430 HP', description: { en: 'The last air-cooled 911', es: 'El último 911 refrigerado por aire' } },
  { id: '996', name: '996', year: '1998–2004', category: 'modern-911', image: porsche996, engine: { en: 'Flat-6 Water-Cooled', es: 'Bóxer-6 Refrigerado por Agua' }, power: '300–462 HP', description: { en: 'The water-cooled revolution', es: 'La revolución refrigerada por agua' } },
  { id: '997', name: '997', year: '2004–2012', category: 'modern-911', image: porsche997, engine: { en: 'Flat-6 Water-Cooled', es: 'Bóxer-6 Refrigerado por Agua' }, power: '325–620 HP', description: { en: 'Return to classic design cues', es: 'Regreso a las líneas clásicas' } },
  { id: '991', name: '991', year: '2011–2019', category: 'modern-911', image: porsche991, engine: { en: 'Flat-6 Twin-Turbo', es: 'Bóxer-6 Biturbo' }, power: '350–700 HP', description: { en: 'Turbocharged perfection', es: 'Perfección turboalimentada' } },
  { id: '992', name: '992', year: '2019–Present', category: 'modern-911', image: porsche992, engine: { en: 'Flat-6 Twin-Turbo', es: 'Bóxer-6 Biturbo' }, power: '379–640 HP', description: { en: 'The current masterpiece', es: 'La obra maestra actual' } },
  { id: 'boxster', name: 'Boxster / 718', year: '1996–Present', category: 'mid-engine', image: porscheBoxster, engine: { en: 'Flat-4/6', es: 'Bóxer-4/6' }, power: '220–414 HP', description: { en: 'Open-top mid-engine thrill', es: 'Emoción descapotable de motor central' } },
  { id: 'cayman', name: 'Cayman / 718', year: '2005–Present', category: 'mid-engine', image: porscheCayman, engine: { en: 'Flat-4/6', es: 'Bóxer-4/6' }, power: '300–414 HP', description: { en: 'The perfectly balanced coupe', es: 'El coupé perfectamente equilibrado' } },
  { id: 'panamera', name: 'Panamera', year: '2009–Present', category: 'gran-turismo', image: porschePanamera, engine: { en: 'V6/V8 Twin-Turbo', es: 'V6/V8 Biturbo' }, power: '330–690 HP', description: { en: 'The four-door sports car', es: 'El deportivo de cuatro puertas' } },
  { id: 'cayenne', name: 'Cayenne', year: '2002–Present', category: 'suv', image: porscheCayenne, engine: { en: 'V6/V8 Twin-Turbo', es: 'V6/V8 Biturbo' }, power: '340–670 HP', description: { en: 'The sports car of SUVs', es: 'El deportivo de los SUV' } },
  { id: 'macan', name: 'Macan', year: '2014–Present', category: 'suv', image: porscheMacan, engine: { en: 'Inline-4 Turbo / Electric', es: 'I4 Turbo / Eléctrico' }, power: '261–440 HP', description: { en: 'Compact performance SUV', es: 'SUV compacto de alto rendimiento' } },
  { id: 'taycan', name: 'Taycan', year: '2019–Present', category: 'electric', image: porscheTaycan, engine: { en: 'Dual Electric Motors', es: 'Doble Motor Eléctrico' }, power: '402–952 HP', description: { en: 'Electric soul, Porsche heart', es: 'Alma eléctrica, corazón Porsche' } },
];

export const exteriorColors: ExteriorColor[] = [
  { id: 'guards-red', name: { en: 'Guards Red', es: 'Rojo Guardia' }, hex: '#c0392b' },
  { id: 'midnight-blue', name: { en: 'Midnight Blue', es: 'Azul Medianoche' }, hex: '#1a2744' },
  { id: 'silver-metallic', name: { en: 'Silver Metallic', es: 'Plata Metálico' }, hex: '#c0c0c0' },
  { id: 'irish-green', name: { en: 'Irish Green', es: 'Verde Irlandés' }, hex: '#1e5631' },
  { id: 'signal-yellow', name: { en: 'Signal Yellow', es: 'Amarillo Señal' }, hex: '#f5c518' },
  { id: 'black', name: { en: 'Black', es: 'Negro' }, hex: '#1a1a1a' },
  { id: 'gulf-orange', name: { en: 'Gulf Orange', es: 'Naranja Gulf' }, hex: '#e87e27' },
  { id: 'chalk', name: { en: 'Chalk', es: 'Tiza' }, hex: '#e8e4de' },
  { id: 'miami-blue', name: { en: 'Miami Blue', es: 'Azul Miami' }, hex: '#00b4d8' },
  { id: 'gentian-blue', name: { en: 'Gentian Blue', es: 'Azul Genciana' }, hex: '#2c3e82' },
  { id: 'racing-yellow', name: { en: 'Racing Yellow', es: 'Amarillo Racing' }, hex: '#f7dc6f' },
  { id: 'gt-silver', name: { en: 'GT Silver', es: 'Plata GT' }, hex: '#a8a9ad' },
];

export const interiorOptions: InteriorOption[] = [
  { id: 'tan-leather', name: { en: 'Tan Leather', es: 'Cuero Habano' }, hex: '#c88a4a', image: interiorTan },
  { id: 'black-leather', name: { en: 'Black Leather', es: 'Cuero Negro' }, hex: '#1a1a1a', image: interiorBlack },
  { id: 'burgundy-leather', name: { en: 'Burgundy Leather', es: 'Cuero Borgoña' }, hex: '#6b2737', image: interiorBurgundy },
  { id: 'cognac-leather', name: { en: 'Cognac Leather', es: 'Cuero Cognac' }, hex: '#9a5b2f', image: interiorCognac },
];

export const wheelOptions: WheelOption[] = [
  { id: 'fuchs-classic', name: { en: 'Fuchs Classic Silver', es: 'Fuchs Clásico Plata' }, image: wheelFuchsClassic },
  { id: 'fuchs-black', name: { en: 'Fuchs Black Edition', es: 'Fuchs Edición Negra' }, image: wheelFuchsBlack },
  { id: 'sport-silver', name: { en: 'Sport Design Silver', es: 'Sport Design Plata' }, image: wheelSportSilver },
  { id: 'rs-gold', name: { en: 'RS Style Gold', es: 'Estilo RS Dorado' }, image: wheelRsGold },
  { id: 'bbs-mesh', name: { en: 'BBS Mesh Polished', es: 'BBS Malla Pulida' }, image: wheelBbsMesh },
  { id: 'turbo-twist', name: { en: 'Turbo Twist Satin Black', es: 'Turbo Twist Negro Satinado' }, image: wheelTurboTwist },
];
