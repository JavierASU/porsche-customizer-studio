import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, RotateCcw, ChevronDown,
  Palette, CircleDot, Armchair,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import {
  EXTERIOR_COLORS, WHEEL_STYLES, INTERIOR_COLORS,
  bodyImagePath, wheelImagePath, interiorImagePath,
  type ExteriorColor, type WheelStyle, type InteriorColor, type Tab,
} from '@/components/configurator/ConfiguratorData';
import DetailPreview from '@/components/configurator/DetailPreview';

export default function Configurator3D() {
  const { lang } = useLang();

  const [variant, setVariant] = useState<'964' | '993'>('964');
  const [bodyColor, setBodyColor] = useState<ExteriorColor>(EXTERIOR_COLORS[0]);
  const [wheelStyle, setWheelStyle] = useState<WheelStyle>(WHEEL_STYLES[0]);
  const [interiorColor, setInteriorColor] = useState<InteriorColor>(INTERIOR_COLORS[0]);
  const [activeTab, setActiveTab] = useState<Tab>('exterior');
  const [panelOpen, setPanelOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // View mode: 'body' shows the car, 'wheel' shows wheel close-up, 'interior' shows interior
  const [viewMode, setViewMode] = useState<'body' | 'wheel' | 'interior'>('body');

  // Sync view mode with active tab
  useEffect(() => {
    setViewMode(activeTab === 'wheels' ? 'wheel' : activeTab === 'interior' ? 'interior' : 'body');
  }, [activeTab]);

  const currentImage = viewMode === 'body'
    ? bodyImagePath(variant, bodyColor.id)
    : viewMode === 'wheel'
      ? wheelImagePath(variant, wheelStyle.id)
      : interiorImagePath(interiorColor.id);

  const imageKey = viewMode === 'body'
    ? `${variant}-${bodyColor.id}`
    : viewMode === 'wheel'
      ? `wheel-${variant}-${wheelStyle.id}`
      : `interior-${interiorColor.id}`;

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
      {/* Top bar */}
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

      {/* Variant selector */}
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

      {/* Main image area */}
      <div className="absolute inset-0 flex items-center justify-center pt-20 pb-60 md:pb-48">
        <motion.img
          key={imageKey}
          src={currentImage}
          alt={`Porsche 911 ${variant}`}
          width={1920}
          height={1080}
          className={`max-w-full max-h-full object-contain drop-shadow-2xl select-none ${
            viewMode !== 'body' ? 'rounded-2xl max-w-[80%] md:max-w-[60%]' : ''
          }`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          draggable={false}
        />

        {/* View mode label */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70">
          {viewMode === 'body' && (lang === 'en' ? 'Exterior view' : 'Vista exterior')}
          {viewMode === 'wheel' && (lang === 'en' ? 'Wheel detail' : 'Detalle de rines')}
          {viewMode === 'interior' && (lang === 'en' ? 'Interior view' : 'Vista interior')}
        </div>

        {/* Small thumbnail of the car when viewing wheel/interior */}
        <AnimatePresence>
          {viewMode !== 'body' && (
            <motion.button
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              onClick={() => setActiveTab('exterior')}
              className="absolute bottom-4 left-4 md:left-8 z-10 rounded-xl overflow-hidden border border-border/30 bg-card/60 backdrop-blur-lg shadow-xl hover:border-primary/40 transition-colors"
            >
              <img
                src={bodyImagePath(variant, bodyColor.id)}
                alt="Car overview"
                width={160}
                height={90}
                loading="lazy"
                className="w-32 md:w-40 h-auto object-contain"
              />
              <div className="px-2 py-1 text-[9px] tracking-wider uppercase text-muted-foreground">
                {bodyColor.name[lang]}
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom panel */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 transition-transform duration-500 ${panelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-2.75rem)]'}`}>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="mx-auto flex items-center gap-2 px-8 py-2 bg-card/80 backdrop-blur-xl border border-border/20 border-b-0 rounded-t-xl text-xs text-muted-foreground hover:text-foreground"
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

          {/* Tab content */}
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
                  <div className="flex flex-wrap gap-3">
                    {WHEEL_STYLES.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setWheelStyle(w)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                          wheelStyle.id === w.id ? 'border-primary text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <img
                          src={wheelImagePath(variant, w.id)}
                          alt={w.name[lang]}
                          width={48}
                          height={48}
                          loading="lazy"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="text-xs uppercase tracking-wider">{w.name[lang]}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'interior' && (
                <motion.div key="int" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <p className="text-[10px] text-muted-foreground mb-3 tracking-wider uppercase">{lang === 'en' ? 'Interior color' : 'Color interior'}</p>
                  <div className="flex flex-wrap gap-3">
                    {INTERIOR_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setInteriorColor(c)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                          interiorColor.id === c.id ? 'border-primary text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <img
                          src={interiorImagePath(c.id)}
                          alt={c.name[lang]}
                          width={48}
                          height={48}
                          loading="lazy"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="text-xs uppercase tracking-wider">{c.name[lang]}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary bar */}
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
