import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, RotateCcw, ChevronDown,
  Palette, CircleDot, Armchair,
  ChevronLeft, ChevronRight, Eye,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';

// Images - 964
import img964Side from '@/assets/porsche-964-side.png';
import img964Front from '@/assets/porsche-964-front.png';
import img964Rear from '@/assets/porsche-964-rear.png';
import img964Interior from '@/assets/porsche-964-interior.png';

// Images - 993
import img993Side from '@/assets/porsche-993-side.png';
import img993Front from '@/assets/porsche-993-front.png';
import img993Rear from '@/assets/porsche-993-rear.png';
import img993Interior from '@/assets/porsche-993-interior.png';

/* ─── data ─── */

const MODEL_IMAGES = {
  '964': [
    { src: img964Front, label: { en: 'Front 3/4', es: 'Frontal 3/4' } },
    { src: img964Side,  label: { en: 'Side Profile', es: 'Perfil Lateral' } },
    { src: img964Rear,  label: { en: 'Rear 3/4', es: 'Trasera 3/4' } },
    { src: img964Interior, label: { en: 'Interior', es: 'Interior' } },
  ],
  '993': [
    { src: img993Front, label: { en: 'Front 3/4', es: 'Frontal 3/4' } },
    { src: img993Side,  label: { en: 'Side Profile', es: 'Perfil Lateral' } },
    { src: img993Rear,  label: { en: 'Rear 3/4', es: 'Trasera 3/4' } },
    { src: img993Interior, label: { en: 'Interior', es: 'Interior' } },
  ],
} as const;

const EXTERIOR_COLORS = [
  { id: 'guards-red',    hex: '#b5121b', hue: 0,    name: { en: 'Guards Red',       es: 'Rojo Guardia' } },
  { id: 'midnight-blue', hex: '#0d1b2a', hue: 210,  name: { en: 'Midnight Blue',    es: 'Azul Medianoche' } },
  { id: 'silver',        hex: '#c0c0c0', hue: 0,    name: { en: 'Silver Metallic',  es: 'Plata Metálico' } },
  { id: 'irish-green',   hex: '#1e5631', hue: 145,  name: { en: 'Irish Green',      es: 'Verde Irlandés' } },
  { id: 'signal-yellow', hex: '#f5c518', hue: 48,   name: { en: 'Signal Yellow',    es: 'Amarillo Señal' } },
  { id: 'black',         hex: '#0a0a0a', hue: 0,    name: { en: 'Black',            es: 'Negro' } },
  { id: 'gulf-orange',   hex: '#e87e27', hue: 28,   name: { en: 'Gulf Orange',      es: 'Naranja Gulf' } },
  { id: 'chalk',         hex: '#e8e4de', hue: 36,   name: { en: 'Chalk',            es: 'Tiza' } },
  { id: 'miami-blue',    hex: '#00b4d8', hue: 190,  name: { en: 'Miami Blue',       es: 'Azul Miami' } },
  { id: 'white',         hex: '#f0f0f0', hue: 0,    name: { en: 'Grand Prix White', es: 'Blanco Grand Prix' } },
];

const WHEEL_STYLES = [
  { id: 'fuchs',       name: { en: 'Fuchs Classic',  es: 'Fuchs Clásico' } },
  { id: 'cup',         name: { en: 'Cup Design',     es: 'Diseño Cup' } },
  { id: 'turbo-twist', name: { en: 'Turbo Twist',    es: 'Turbo Twist' } },
];

const INTERIOR_COLORS = [
  { id: 'tan',      hex: '#c88a4a', name: { en: 'Tan Leather',   es: 'Cuero Habano' } },
  { id: 'black',    hex: '#111111', name: { en: 'Black Leather', es: 'Cuero Negro' } },
  { id: 'burgundy', hex: '#6b2737', name: { en: 'Burgundy',      es: 'Borgoña' } },
  { id: 'cognac',   hex: '#9a5b2f', name: { en: 'Cognac',        es: 'Cognac' } },
  { id: 'cream',    hex: '#f5e6c8', name: { en: 'Cream',         es: 'Crema' } },
];

type Tab = 'exterior' | 'wheels' | 'interior';

/* ─── CSS color filter from hex ─── */
function getColorFilter(hex: string): string {
  // Base images are red (#b5121b). We calculate hue-rotate to reach target color.
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);

  let h = 0;
  if (max !== min) {
    const d = max - min;
    if (max === r / 255) h = ((g / 255 - b / 255) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g / 255) h = ((b / 255 - r / 255) / d + 2) * 60;
    else h = ((r / 255 - g / 255) / d + 4) * 60;
  }

  // Base red hue is ~355°
  const baseHue = 355;
  const hueRotate = h - baseHue;
  const satAdjust = s < 0.1 ? 0 : 1;
  const brightAdjust = l < 0.15 ? 0.3 : l > 0.85 ? 1.8 : 0.85 + l;

  if (s < 0.1) {
    // Achromatic (black, silver, white, chalk)
    return `saturate(0) brightness(${brightAdjust})`;
  }

  return `hue-rotate(${hueRotate}deg) saturate(${satAdjust + s}) brightness(${brightAdjust})`;
}

/* ─── component ─── */

export default function Configurator3D() {
  const { lang } = useLang();

  const [variant, setVariant] = useState<'964' | '993'>('964');
  const [viewIdx, setViewIdx] = useState(0);
  const [bodyColor, setBodyColor] = useState(EXTERIOR_COLORS[0]);
  const [wheelStyle, setWheelStyle] = useState(WHEEL_STYLES[0]);
  const [interiorColor, setInteriorColor] = useState(INTERIOR_COLORS[0]);
  const [activeTab, setActiveTab] = useState<Tab>('exterior');
  const [panelOpen, setPanelOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = MODEL_IMAGES[variant];
  const currentView = images[viewIdx];
  const isInteriorView = viewIdx === 3;

  const nextView = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setViewIdx(i => (i + 1) % images.length);
      setIsTransitioning(false);
    }, 200);
  }, [images.length]);

  const prevView = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setViewIdx(i => (i - 1 + images.length) % images.length);
      setIsTransitioning(false);
    }, 200);
  }, [images.length]);

  // Reset view when variant changes
  useEffect(() => { setViewIdx(0); }, [variant]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextView();
      if (e.key === 'ArrowLeft') prevView();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextView, prevView]);

  const resetConfig = () => {
    setBodyColor(EXTERIOR_COLORS[0]);
    setWheelStyle(WHEEL_STYLES[0]);
    setInteriorColor(INTERIOR_COLORS[0]);
    setViewIdx(0);
  };

  const colorFilter = getColorFilter(bodyColor.hex);

  const tabs: { id: Tab; icon: React.ReactNode; label: { en: string; es: string } }[] = [
    { id: 'exterior', icon: <Palette className="w-4 h-4" />, label: { en: 'Exterior', es: 'Exterior' } },
    { id: 'wheels',   icon: <CircleDot className="w-4 h-4" />, label: { en: 'Wheels', es: 'Rines' } },
    { id: 'interior', icon: <Armchair className="w-4 h-4" />, label: { en: 'Interior', es: 'Interior' } },
  ];

  const ColorSwatch = ({ color, selected, onClick, label }: {
    color: string; selected: boolean; onClick: () => void; label: string;
  }) => (
    <button onClick={onClick} className="group flex flex-col items-center gap-1.5" title={label}>
      <div
        className={`w-10 h-10 md:w-11 md:h-11 rounded-full border-2 transition-all duration-300 ${
          selected
            ? 'border-primary scale-110 shadow-[0_0_20px_hsl(var(--primary)/0.5)]'
            : 'border-border/40 hover:border-muted-foreground hover:scale-105'
        }`}
        style={{ backgroundColor: color }}
      />
      <span className="text-[9px] text-muted-foreground max-w-[56px] text-center leading-tight truncate">
        {label}
      </span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* ─── top bar ─── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-6 py-3 bg-gradient-to-b from-background/95 via-background/60 to-transparent">
        <div className="flex items-center gap-4">
          <Link
            to="/configurator"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Back' : 'Volver'}</span>
          </Link>
          <div className="h-5 w-px bg-border/30 hidden sm:block" />
          <h1 className="font-display text-lg md:text-xl tracking-wide">
            <span className="text-primary">Porsche</span>{' '}
            <span className="text-foreground">911 ({variant})</span>{' '}
            <span className="text-muted-foreground text-xs font-body tracking-[0.15em] uppercase ml-2">
              {lang === 'en' ? 'Configurator' : 'Configurador'}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewIdx(3)}
            className={`p-2 rounded-md transition-all ${isInteriorView ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
            title={lang === 'en' ? 'Interior view' : 'Vista interior'}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={resetConfig} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── model selector ─── */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 flex gap-1 p-1 bg-card/80 backdrop-blur-xl border border-border/20 rounded-xl">
        {(['964', '993'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-6 py-2 text-xs tracking-[0.15em] uppercase font-body rounded-lg transition-all duration-300 ${
              variant === v
                ? 'bg-primary/15 text-primary border border-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.15)]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {v === '964' ? '911 (964)' : '911 (993)'}
          </button>
        ))}
      </div>

      {/* ─── car image viewer ─── */}
      <div className="absolute inset-0 flex items-center justify-center pt-24 pb-72 md:pb-56">
        {/* Navigation arrows */}
        <button
          onClick={prevView}
          className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-card/60 backdrop-blur-lg border border-border/20 text-muted-foreground hover:text-foreground hover:bg-card/80 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextView}
          className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-card/60 backdrop-blur-lg border border-border/20 text-muted-foreground hover:text-foreground hover:bg-card/80 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Car image with color filter */}
        <div className="relative w-full h-full flex items-center justify-center px-16">
          <motion.img
            key={`${variant}-${viewIdx}`}
            src={currentView.src}
            alt={`Porsche 911 ${variant} - ${currentView.label[lang]}`}
            className="max-w-full max-h-full object-contain drop-shadow-2xl select-none"
            style={{
              filter: isInteriorView ? 'none' : colorFilter,
              transition: 'filter 0.5s ease',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isTransitioning ? 0 : 1, scale: isTransitioning ? 0.95 : 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            draggable={false}
          />

          {/* Gradient floor reflection */}
          {!isInteriorView && (
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
          )}
        </div>

        {/* View indicator dots */}
        <div className="absolute bottom-[calc(100%-100%+1rem)] md:bottom-auto flex items-center gap-3 z-10" style={{ bottom: panelOpen ? '17.5rem' : '4rem' }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => { setViewIdx(i); setIsTransitioning(false); }, 200);
              }}
              className={`transition-all duration-300 ${
                viewIdx === i
                  ? 'w-8 h-2 rounded-full bg-primary'
                  : 'w-2 h-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/60'
              }`}
              title={img.label[lang]}
            />
          ))}
        </div>

        {/* View label */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
          {currentView.label[lang]}
        </div>
      </div>

      {/* ─── bottom panel ─── */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 transition-transform duration-500 ease-out ${panelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-2.75rem)]'}`}>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="mx-auto flex items-center gap-2 px-8 py-2 bg-card/80 backdrop-blur-xl border border-border/20 border-b-0 rounded-t-xl text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${panelOpen ? 'rotate-0' : 'rotate-180'}`} />
          {lang === 'en' ? 'Customize' : 'Personalizar'}
        </button>

        <div className="bg-card/90 backdrop-blur-2xl border-t border-border/15">
          {/* Tabs */}
          <div className="flex border-b border-border/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'interior') setViewIdx(3);
                  else if (viewIdx === 3) setViewIdx(0);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-[0.1em] uppercase transition-all duration-300 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-primary border-primary bg-primary/5'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label[lang]}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 max-h-[220px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'exterior' && (
                <motion.div key="ext" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                  <p className="text-[10px] text-muted-foreground mb-3 tracking-wider uppercase">
                    {bodyColor.name[lang]}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {EXTERIOR_COLORS.map(c => (
                      <ColorSwatch
                        key={c.id}
                        color={c.hex}
                        selected={bodyColor.id === c.id}
                        onClick={() => setBodyColor(c)}
                        label={c.name[lang]}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'wheels' && (
                <motion.div key="whl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                  <p className="text-[10px] text-muted-foreground mb-2 tracking-wider uppercase">
                    {lang === 'en' ? 'Wheel Design' : 'Diseño de Rin'}: {wheelStyle.name[lang]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {WHEEL_STYLES.map(w => (
                      <button
                        key={w.id}
                        onClick={() => setWheelStyle(w)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs tracking-[0.1em] uppercase border transition-all duration-300 ${
                          wheelStyle.id === w.id
                            ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_hsl(var(--primary)/0.15)]'
                            : 'border-border/30 text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <CircleDot className="w-3.5 h-3.5" />
                        {w.name[lang]}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'interior' && (
                <motion.div key="int" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                  <p className="text-[10px] text-muted-foreground mb-3 tracking-wider uppercase">
                    {interiorColor.name[lang]}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {INTERIOR_COLORS.map(c => (
                      <ColorSwatch
                        key={c.id}
                        color={c.hex}
                        selected={interiorColor.id === c.id}
                        onClick={() => setInteriorColor(c)}
                        label={c.name[lang]}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Config summary bar */}
          <div className="px-4 md:px-6 pb-3 flex items-center gap-4 text-[10px] text-muted-foreground/70 tracking-wider uppercase flex-wrap">
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-border/30" style={{ backgroundColor: bodyColor.hex }} />
              {bodyColor.name[lang]}
            </span>
            <span className="text-border/20">|</span>
            <span>{wheelStyle.name[lang]}</span>
            <span className="text-border/20">|</span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-border/30" style={{ backgroundColor: interiorColor.hex }} />
              {interiorColor.name[lang]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
