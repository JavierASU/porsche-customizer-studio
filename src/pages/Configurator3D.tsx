import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, ChevronDown, Palette, CircleDot, Armchair, Sun } from 'lucide-react';
import PorscheCar from '@/components/3d/PorscheCar';
import { useLang } from '@/lib/i18n';

const EXTERIOR_COLORS = [
  { id: 'guards-red', hex: '#c0392b', name: { en: 'Guards Red', es: 'Rojo Guardia' } },
  { id: 'midnight-blue', hex: '#1a2744', name: { en: 'Midnight Blue', es: 'Azul Medianoche' } },
  { id: 'silver', hex: '#c0c0c0', name: { en: 'Silver Metallic', es: 'Plata Metálico' } },
  { id: 'irish-green', hex: '#1e5631', name: { en: 'Irish Green', es: 'Verde Irlandés' } },
  { id: 'signal-yellow', hex: '#f5c518', name: { en: 'Signal Yellow', es: 'Amarillo Señal' } },
  { id: 'black', hex: '#1a1a1a', name: { en: 'Black', es: 'Negro' } },
  { id: 'gulf-orange', hex: '#e87e27', name: { en: 'Gulf Orange', es: 'Naranja Gulf' } },
  { id: 'chalk', hex: '#e8e4de', name: { en: 'Chalk', es: 'Tiza' } },
  { id: 'miami-blue', hex: '#00b4d8', name: { en: 'Miami Blue', es: 'Azul Miami' } },
  { id: 'white', hex: '#f0f0f0', name: { en: 'Grand Prix White', es: 'Blanco Grand Prix' } },
];

const WHEEL_COLORS = [
  { id: 'chrome', hex: '#d0d0d0', name: { en: 'Chrome Silver', es: 'Cromo Plata' } },
  { id: 'black', hex: '#1a1a1a', name: { en: 'Gloss Black', es: 'Negro Brillo' } },
  { id: 'gold', hex: '#c8a84e', name: { en: 'Classic Gold', es: 'Dorado Clásico' } },
  { id: 'gunmetal', hex: '#4a4a4a', name: { en: 'Gunmetal', es: 'Gris Grafito' } },
  { id: 'bronze', hex: '#8B6914', name: { en: 'Satin Bronze', es: 'Bronce Satinado' } },
];

const INTERIOR_COLORS = [
  { id: 'tan', hex: '#c88a4a', name: { en: 'Tan Leather', es: 'Cuero Habano' } },
  { id: 'black', hex: '#1a1a1a', name: { en: 'Black Leather', es: 'Cuero Negro' } },
  { id: 'burgundy', hex: '#6b2737', name: { en: 'Burgundy', es: 'Borgoña' } },
  { id: 'cognac', hex: '#9a5b2f', name: { en: 'Cognac', es: 'Cognac' } },
  { id: 'cream', hex: '#f5e6c8', name: { en: 'Cream', es: 'Crema' } },
];

const ENVIRONMENTS = [
  { id: 'studio', preset: 'studio' as const, name: { en: 'Studio', es: 'Estudio' } },
  { id: 'sunset', preset: 'sunset' as const, name: { en: 'Sunset', es: 'Atardecer' } },
  { id: 'forest', preset: 'forest' as const, name: { en: 'Forest', es: 'Bosque' } },
  { id: 'city', preset: 'city' as const, name: { en: 'City Night', es: 'Ciudad Nocturna' } },
  { id: 'warehouse', preset: 'warehouse' as const, name: { en: 'Warehouse', es: 'Almacén' } },
];

type Tab = 'exterior' | 'wheels' | 'interior' | 'environment';

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-[#c8a84e] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#c8a84e] tracking-[0.2em] uppercase font-light">Loading 3D Model…</span>
      </div>
    </Html>
  );
}

export default function Configurator3D() {
  const { lang } = useLang();

  const [variant, setVariant] = useState<'964' | '993'>('964');
  const [bodyColor, setBodyColor] = useState('#c0392b');
  const [wheelColor, setWheelColor] = useState('#d0d0d0');
  const [interiorColor, setInteriorColor] = useState('#c88a4a');
  const [envPreset, setEnvPreset] = useState<'studio' | 'sunset' | 'forest' | 'city' | 'warehouse'>('studio');
  const [activeTab, setActiveTab] = useState<Tab>('exterior');
  const [panelOpen, setPanelOpen] = useState(true);

  const selectedExterior = EXTERIOR_COLORS.find(c => c.hex === bodyColor);
  const selectedWheel = WHEEL_COLORS.find(c => c.hex === wheelColor);
  const selectedInterior = INTERIOR_COLORS.find(c => c.hex === interiorColor);
  const selectedEnv = ENVIRONMENTS.find(e => e.preset === envPreset);

  const tabs: { id: Tab; icon: React.ReactNode; label: { en: string; es: string } }[] = [
    { id: 'exterior', icon: <Palette className="w-4 h-4" />, label: { en: 'Exterior', es: 'Exterior' } },
    { id: 'wheels', icon: <CircleDot className="w-4 h-4" />, label: { en: 'Wheels', es: 'Rines' } },
    { id: 'interior', icon: <Armchair className="w-4 h-4" />, label: { en: 'Interior', es: 'Interior' } },
    { id: 'environment', icon: <Sun className="w-4 h-4" />, label: { en: 'Environment', es: 'Entorno' } },
  ];

  const resetConfig = () => {
    setBodyColor('#c0392b');
    setWheelColor('#d0d0d0');
    setInteriorColor('#c88a4a');
    setEnvPreset('studio');
  };

  return (
    <div className="fixed inset-0 bg-background">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-6 py-3 bg-gradient-to-b from-background/90 to-transparent">
        <div className="flex items-center gap-4">
          <Link
            to="/configurator"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Back' : 'Volver'}</span>
          </Link>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <h1 className="font-display text-lg md:text-xl tracking-wide">
            <span className="text-gold">Porsche</span>{' '}
            <span className="text-foreground">{variant}</span>{' '}
            <span className="text-muted-foreground text-sm font-body">
              {lang === 'en' ? '3D Customizer' : 'Personalizador 3D'}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={resetConfig} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model selector */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 flex gap-1 p-1 bg-card/80 backdrop-blur-md border border-border rounded-lg">
        {(['964', '993'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-5 py-2 text-xs tracking-[0.15em] uppercase font-body rounded-md transition-all duration-300 ${
              variant === v
                ? 'bg-gold/20 text-gold border border-gold/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {v === '964' ? '911 (964)' : '911 (993)'}
          </button>
        ))}
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [5, 3, 5], fov: 40 }}
        gl={{ antialias: true, toneMapping: 3 }}
        className="cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={2048} />
          <spotLight position={[-10, 10, -5]} intensity={0.5} angle={0.3} penumbra={1} />

          <PorscheCar
            bodyColor={bodyColor}
            wheelColor={wheelColor}
            interiorColor={interiorColor}
            variant={variant}
          />

          <ContactShadows position={[0, -0.58, 0]} opacity={0.5} scale={12} blur={2.5} far={4} />

          <Environment preset={envPreset} background={envPreset !== 'studio'} />

          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={4}
            maxDistance={12}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>

      {/* Customization panel */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 transition-transform duration-500 ${panelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'}`}>
        {/* Toggle handle */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="mx-auto flex items-center gap-2 px-6 py-2 bg-card/90 backdrop-blur-md border border-border border-b-0 rounded-t-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${panelOpen ? 'rotate-0' : 'rotate-180'}`} />
          {lang === 'en' ? 'Customize' : 'Personalizar'}
        </button>

        <div className="bg-card/90 backdrop-blur-xl border-t border-border">
          {/* Tab navigation */}
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-[0.1em] uppercase transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-gold border-b-2 border-gold bg-gold/5'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label[lang]}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4 md:p-6 max-h-[280px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'exterior' && (
                <motion.div key="ext" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <p className="text-xs text-muted-foreground mb-3">
                    {selectedExterior?.name[lang] || (lang === 'en' ? 'Select color' : 'Selecciona color')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {EXTERIOR_COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setBodyColor(color.hex)}
                        className="group flex flex-col items-center gap-1.5"
                        title={color.name[lang]}
                      >
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 ${
                            bodyColor === color.hex
                              ? 'border-gold scale-110 shadow-[0_0_15px_hsl(38_70%_50%/0.4)]'
                              : 'border-border/50 hover:border-muted-foreground hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[9px] text-muted-foreground max-w-[60px] text-center leading-tight truncate">
                          {color.name[lang]}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'wheels' && (
                <motion.div key="whl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <p className="text-xs text-muted-foreground mb-3">
                    {selectedWheel?.name[lang] || (lang === 'en' ? 'Select wheel color' : 'Selecciona color de rin')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {WHEEL_COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setWheelColor(color.hex)}
                        className="group flex flex-col items-center gap-1.5"
                        title={color.name[lang]}
                      >
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 ${
                            wheelColor === color.hex
                              ? 'border-gold scale-110 shadow-[0_0_15px_hsl(38_70%_50%/0.4)]'
                              : 'border-border/50 hover:border-muted-foreground hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[9px] text-muted-foreground max-w-[60px] text-center leading-tight truncate">
                          {color.name[lang]}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'interior' && (
                <motion.div key="int" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <p className="text-xs text-muted-foreground mb-3">
                    {selectedInterior?.name[lang] || (lang === 'en' ? 'Select interior' : 'Selecciona interior')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {INTERIOR_COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setInteriorColor(color.hex)}
                        className="group flex flex-col items-center gap-1.5"
                        title={color.name[lang]}
                      >
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 ${
                            interiorColor === color.hex
                              ? 'border-gold scale-110 shadow-[0_0_15px_hsl(38_70%_50%/0.4)]'
                              : 'border-border/50 hover:border-muted-foreground hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[9px] text-muted-foreground max-w-[60px] text-center leading-tight truncate">
                          {color.name[lang]}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'environment' && (
                <motion.div key="env" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <p className="text-xs text-muted-foreground mb-3">
                    {selectedEnv?.name[lang] || (lang === 'en' ? 'Select environment' : 'Selecciona entorno')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ENVIRONMENTS.map((env) => (
                      <button
                        key={env.id}
                        onClick={() => setEnvPreset(env.preset)}
                        className={`px-4 py-2.5 rounded-md text-xs tracking-[0.1em] uppercase border transition-all duration-300 ${
                          envPreset === env.preset
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {env.name[lang]}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Current config summary */}
          <div className="px-4 md:px-6 pb-4 flex items-center gap-4 text-[10px] text-muted-foreground tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: bodyColor }} />
              {selectedExterior?.name[lang]}
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: wheelColor }} />
              {selectedWheel?.name[lang]}
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: interiorColor }} />
              {selectedInterior?.name[lang]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
