import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, RotateCcw, ChevronDown,
  Palette, CircleDot, Armchair,
  ChevronLeft, ChevronRight, Eye,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';

const imagePath = (model: '964' | '993', color: string) =>
  new URL(`../assets/${model}/${color}.png`, import.meta.url).href;

const EXTERIOR_COLORS = [
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

const WHEEL_STYLES = [
  { id: 'fuchs', name: { en: 'Fuchs Classic', es: 'Fuchs Clásico' } },
  { id: 'cup', name: { en: 'Cup Design', es: 'Diseño Cup' } },
  { id: 'turbo-twist', name: { en: 'Turbo Twist', es: 'Turbo Twist' } },
];

const INTERIOR_COLORS = [
  { id: 'tan', hex: '#c88a4a', name: { en: 'Tan Leather', es: 'Cuero Habano' } },
  { id: 'black', hex: '#111111', name: { en: 'Black Leather', es: 'Cuero Negro' } },
  { id: 'burgundy', hex: '#6b2737', name: { en: 'Burgundy', es: 'Borgoña' } },
  { id: 'cognac', hex: '#9a5b2f', name: { en: 'Cognac', es: 'Cognac' } },
  { id: 'cream', hex: '#f5e6c8', name: { en: 'Cream', es: 'Crema' } },
];

type Tab = 'exterior' | 'wheels' | 'interior';

export default function Configurator3D() {
  const { lang } = useLang();

  const [variant, setVariant] = useState<'964' | '993'>('964');
  const [bodyColor, setBodyColor] = useState(EXTERIOR_COLORS[0]);
  const [wheelStyle, setWheelStyle] = useState(WHEEL_STYLES[0]);
  const [interiorColor, setInteriorColor] = useState(INTERIOR_COLORS[0]);
  const [activeTab, setActiveTab] = useState<Tab>('exterior');
  const [panelOpen, setPanelOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [viewIdx, setViewIdx] = useState(0);
  const currentImage = imagePath(variant, bodyColor.id);

  const nextView = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setViewIdx((i) => (i + 1) % 3);
      setIsTransitioning(false);
    }, 180);
  }, []);

  const prevView = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setViewIdx((i) => (i + 2) % 3);
      setIsTransitioning(false);
    }, 180);
  }, []);

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
  };

  const tabs: { id: Tab; icon: React.ReactNode; label: { en: string; es: string } }[] = [
    { id: 'exterior', icon: <Palette className="w-4 h-4" />, label: { en: 'Exterior', es: 'Exterior' } },
    { id: 'wheels', icon: <CircleDot className="w-4 h-4" />, label: { en: 'Wheels', es: 'Rines' } },
    { id: 'interior', icon: <Armchair className="w-4 h-4" />, label: { en: 'Interior', es: 'Interior' } },
  ];

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-6 py-3 bg-gradient-to-b from-background/95 via-background/60 to-transparent">
        <div className="flex items-center gap-4">
          <Link to="/configurator" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Back' : 'Volver'}</span>
          </Link>
          <div className="h-5 w-px bg-border/30 hidden sm:block" />
          <h1 className="font-display text-lg md:text-xl tracking-wide">
            <span className="text-primary">Porsche</span> <span className="text-foreground">911 ({variant})</span>
          </h1>
        </div>
        <button onClick={resetConfig} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Reset">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 flex gap-1 p-1 bg-card/80 backdrop-blur-xl border border-border/20 rounded-xl">
        {(['964', '993'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-6 py-2 text-xs tracking-[0.15em] uppercase font-body rounded-lg transition-all duration-300 ${
              variant === v ? 'bg-primary/15 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {v === '964' ? '911 (964)' : '911 (993)'}
          </button>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pt-20 pb-60 md:pb-48">
        <button onClick={prevView} className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-card/60 backdrop-blur-lg border border-border/20 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={nextView} className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-card/60 backdrop-blur-lg border border-border/20 text-muted-foreground hover:text-foreground">
          <ChevronRight className="w-5 h-5" />
        </button>

        <motion.img
          key={`${variant}-${bodyColor.id}`}
          src={currentImage}
          alt={`Porsche 911 ${variant} ${bodyColor.name[lang]}`}
          width={1920}
          height={1080}
          className="max-w-full max-h-full object-contain drop-shadow-2xl select-none"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: isTransitioning ? 0 : 1, scale: isTransitioning ? 0.98 : 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          draggable={false}
        />

        <div className="absolute top-28 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70">
          {lang === 'en' ? 'Photoreal color reference' : 'Referencia de color fotorrealista'}
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 z-20 transition-transform duration-500 ${panelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-2.75rem)]'}`}>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="mx-auto flex items-center gap-2 px-8 py-2 bg-card/80 backdrop-blur-xl border border-border/20 border-b-0 rounded-t-xl text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${panelOpen ? 'rotate-0' : 'rotate-180'}`} />
          {lang === 'en' ? 'Customize' : 'Personalizar'}
        </button>

        <div className="bg-card/90 backdrop-blur-2xl border-t border-border/15">
          <div className="flex border-b border-border/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-[0.1em] uppercase border-b-2 transition-all ${
                  activeTab === tab.id ? 'text-primary border-primary bg-primary/5' : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label[lang]}</span>
              </button>
            ))}
          </div>

          <div className="p-4 md:p-6 max-h-[220px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'exterior' && (
                <motion.div key="ext" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <p className="text-[10px] text-muted-foreground mb-3 tracking-wider uppercase">{bodyColor.name[lang]}</p>
                  <div className="grid grid-cols-5 gap-3">
                    {EXTERIOR_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setBodyColor(c)}
                        className={`px-2 py-2 rounded-lg text-[10px] uppercase border transition-all ${
                          bodyColor.id === c.id ? 'border-primary text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {c.name[lang]}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'wheels' && (
                <motion.div key="wh" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <p className="text-[10px] text-muted-foreground mb-3 tracking-wider uppercase">{lang === 'en' ? 'Wheel style' : 'Estilo de rin'}</p>
                  <div className="flex flex-wrap gap-2">
                    {WHEEL_STYLES.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setWheelStyle(w)}
                        className={`px-4 py-2 rounded-lg text-xs uppercase border ${wheelStyle.id === w.id ? 'border-primary text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'}`}
                      >
                        {w.name[lang]}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'interior' && (
                <motion.div key="int" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <p className="text-[10px] text-muted-foreground mb-3 tracking-wider uppercase">{lang === 'en' ? 'Interior color' : 'Color interior'}</p>
                  <div className="flex flex-wrap gap-2">
                    {INTERIOR_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setInteriorColor(c)}
                        className={`px-4 py-2 rounded-lg text-xs uppercase border ${interiorColor.id === c.id ? 'border-primary text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'}`}
                      >
                        {c.name[lang]}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-4 md:px-6 pb-3 flex items-center gap-3 text-[10px] text-muted-foreground/80 uppercase flex-wrap">
            <span>{bodyColor.name[lang]}</span>
            <span className="text-border/20">|</span>
            <span>{wheelStyle.name[lang]}</span>
            <span className="text-border/20">|</span>
            <span>{interiorColor.name[lang]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
