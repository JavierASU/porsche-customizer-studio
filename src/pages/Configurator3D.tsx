import { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  MeshReflectorMaterial,
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, RotateCcw, ChevronDown,
  Palette, CircleDot, Armchair, Sun,
  RotateCw, Camera, Eye, Disc,
} from 'lucide-react';
import PorscheCar from '@/components/3d/PorscheCar';
import type { WheelDesign } from '@/components/3d/PorscheWheels';
import { useLang } from '@/lib/i18n';

/* ─── palettes ─── */

const EXTERIOR_COLORS = [
  { id: 'guards-red',    hex: '#b5121b', name: { en: 'Guards Red',       es: 'Rojo Guardia' } },
  { id: 'midnight-blue', hex: '#0d1b2a', name: { en: 'Midnight Blue',    es: 'Azul Medianoche' } },
  { id: 'silver',        hex: '#c0c0c0', name: { en: 'Silver Metallic',  es: 'Plata Metálico' } },
  { id: 'irish-green',   hex: '#1e5631', name: { en: 'Irish Green',      es: 'Verde Irlandés' } },
  { id: 'signal-yellow', hex: '#f5c518', name: { en: 'Signal Yellow',    es: 'Amarillo Señal' } },
  { id: 'black',         hex: '#0a0a0a', name: { en: 'Black',            es: 'Negro' } },
  { id: 'gulf-orange',   hex: '#e87e27', name: { en: 'Gulf Orange',      es: 'Naranja Gulf' } },
  { id: 'chalk',         hex: '#e8e4de', name: { en: 'Chalk',            es: 'Tiza' } },
  { id: 'miami-blue',    hex: '#00b4d8', name: { en: 'Miami Blue',       es: 'Azul Miami' } },
  { id: 'white',         hex: '#f0f0f0', name: { en: 'Grand Prix White', es: 'Blanco Grand Prix' } },
];

const WHEEL_COLORS = [
  { id: 'chrome',    hex: '#d0d0d0', name: { en: 'Chrome Silver',  es: 'Cromo Plata' } },
  { id: 'black',     hex: '#111111', name: { en: 'Gloss Black',    es: 'Negro Brillo' } },
  { id: 'gold',      hex: '#c8a84e', name: { en: 'Classic Gold',   es: 'Dorado Clásico' } },
  { id: 'gunmetal',  hex: '#3a3a3a', name: { en: 'Gunmetal',       es: 'Gris Grafito' } },
  { id: 'bronze',    hex: '#8B6914', name: { en: 'Satin Bronze',   es: 'Bronce Satinado' } },
];

const WHEEL_DESIGNS: { id: WheelDesign; name: { en: string; es: string } }[] = [
  { id: 'fuchs',        name: { en: 'Fuchs Classic',   es: 'Fuchs Clásico' } },
  { id: 'cup',          name: { en: 'Cup Design',      es: 'Diseño Cup' } },
  { id: 'turbo-twist',  name: { en: 'Turbo Twist',     es: 'Turbo Twist' } },
];

const INTERIOR_COLORS = [
  { id: 'tan',      hex: '#c88a4a', name: { en: 'Tan Leather',  es: 'Cuero Habano' } },
  { id: 'black',    hex: '#111111', name: { en: 'Black Leather', es: 'Cuero Negro' } },
  { id: 'burgundy', hex: '#6b2737', name: { en: 'Burgundy',      es: 'Borgoña' } },
  { id: 'cognac',   hex: '#9a5b2f', name: { en: 'Cognac',        es: 'Cognac' } },
  { id: 'cream',    hex: '#f5e6c8', name: { en: 'Cream',         es: 'Crema' } },
];

type EnvPreset = 'studio' | 'sunset' | 'forest' | 'city' | 'warehouse';

const ENVIRONMENTS: { id: string; preset: EnvPreset; name: { en: string; es: string } }[] = [
  { id: 'studio',    preset: 'studio',    name: { en: 'Studio',       es: 'Estudio' } },
  { id: 'sunset',    preset: 'sunset',    name: { en: 'Sunset',       es: 'Atardecer' } },
  { id: 'forest',    preset: 'forest',    name: { en: 'Forest',       es: 'Bosque' } },
  { id: 'city',      preset: 'city',      name: { en: 'City Night',   es: 'Ciudad Nocturna' } },
  { id: 'warehouse', preset: 'warehouse', name: { en: 'Warehouse',    es: 'Almacén' } },
];

type Tab = 'exterior' | 'wheels' | 'interior' | 'environment';

/* ─── loader ─── */

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-primary/30 rounded-full" />
          <div className="absolute inset-0 border-2 border-t-primary rounded-full animate-spin" />
        </div>
        <span className="text-xs text-primary tracking-[0.25em] uppercase font-light animate-pulse">
          Loading Porsche…
        </span>
      </div>
    </Html>
  );
}

/* ─── reflective floor ─── */

function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.5}
        mirror={0.5}
      />
    </mesh>
  );
}

/* ─── main ─── */

export default function Configurator3D() {
  const { lang } = useLang();
  const controlsRef = useRef<any>(null);

  const [variant, setVariant] = useState<'964' | '993'>('964');
  const [bodyColor, setBodyColor] = useState('#b5121b');
  const [wheelColor, setWheelColor] = useState('#d0d0d0');
  const [wheelDesign, setWheelDesign] = useState<WheelDesign>('fuchs');
  const [interiorColor, setInteriorColor] = useState('#c88a4a');
  const [envPreset, setEnvPreset] = useState<EnvPreset>('studio');
  const [activeTab, setActiveTab] = useState<Tab>('exterior');
  const [panelOpen, setPanelOpen] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showFloor, setShowFloor] = useState(true);

  const selExt = EXTERIOR_COLORS.find(c => c.hex === bodyColor);
  const selWhl = WHEEL_COLORS.find(c => c.hex === wheelColor);
  const selInt = INTERIOR_COLORS.find(c => c.hex === interiorColor);
  const selEnv = ENVIRONMENTS.find(e => e.preset === envPreset);
  const selWhlDesign = WHEEL_DESIGNS.find(w => w.id === wheelDesign);

  const tabs: { id: Tab; icon: React.ReactNode; label: { en: string; es: string } }[] = [
    { id: 'exterior',     icon: <Palette className="w-4 h-4" />,   label: { en: 'Exterior', es: 'Exterior' } },
    { id: 'wheels',       icon: <CircleDot className="w-4 h-4" />, label: { en: 'Wheels',   es: 'Rines' } },
    { id: 'interior',     icon: <Armchair className="w-4 h-4" />,  label: { en: 'Interior', es: 'Interior' } },
    { id: 'environment',  icon: <Sun className="w-4 h-4" />,       label: { en: 'Scene',    es: 'Escena' } },
  ];

  const resetConfig = () => {
    setBodyColor('#b5121b');
    setWheelColor('#d0d0d0');
    setWheelDesign('fuchs');
    setInteriorColor('#c88a4a');
    setEnvPreset('studio');
    setAutoRotate(true);
    setShowFloor(true);
  };

  const resetCamera = () => controlsRef.current?.reset();

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
    <div className="fixed inset-0 bg-background">
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
            <span className="text-foreground">{variant}</span>{' '}
            <span className="text-muted-foreground text-xs font-body tracking-[0.15em] uppercase ml-2">
              {lang === 'en' ? '3D Configurator' : 'Configurador 3D'}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-md transition-all ${autoRotate ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
            title={autoRotate ? 'Stop rotation' : 'Auto rotate'}
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowFloor(!showFloor)}
            className={`p-2 rounded-md transition-all ${showFloor ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
            title="Toggle reflective floor"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={resetCamera} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Reset camera">
            <Camera className="w-4 h-4" />
          </button>
          <button onClick={resetConfig} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Reset all">
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

      {/* ─── 3D canvas ─── */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [4.5, 2, 6], fov: 35 }}
        gl={{
          antialias: true,
          toneMapping: 3,
          toneMappingExposure: 1.2,
        }}
        className="cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.15} />
          <directionalLight position={[8, 12, 6]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />
          <directionalLight position={[-6, 8, -4]} intensity={0.4} color="#b0c4de" />
          <spotLight position={[0, 15, 0]} intensity={0.6} angle={0.4} penumbra={1} castShadow />
          <pointLight position={[-8, 3, -6]} intensity={0.3} color="#ffd700" />
          <pointLight position={[8, 3, 6]} intensity={0.2} color="#87ceeb" />

          <PorscheCar
            bodyColor={bodyColor}
            wheelColor={wheelColor}
            interiorColor={interiorColor}
            autoRotate={autoRotate}
            variant={variant}
            wheelDesign={wheelDesign}
          />

          {showFloor && <ReflectiveFloor />}

          <ContactShadows
            position={[0, -0.41, 0]}
            opacity={showFloor ? 0 : 0.6}
            scale={14}
            blur={2.5}
            far={4}
          />

          <Environment preset={envPreset} background={envPreset !== 'studio'} />

          <EffectComposer>
            <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} intensity={0.4} mipmapBlur />
          </EffectComposer>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={3}
            maxDistance={14}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

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
                onClick={() => setActiveTab(tab.id)}
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
          <div className="p-4 md:p-6 max-h-[280px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'exterior' && (
                <motion.div key="ext" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                  <p className="text-[10px] text-muted-foreground mb-3 tracking-wider uppercase">
                    {selExt?.name[lang] ?? (lang === 'en' ? 'Exterior Color' : 'Color Exterior')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {EXTERIOR_COLORS.map(c => (
                      <ColorSwatch key={c.id} color={c.hex} selected={bodyColor === c.hex} onClick={() => setBodyColor(c.hex)} label={c.name[lang]} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'wheels' && (
                <motion.div key="whl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                  {/* Wheel Design */}
                  <p className="text-[10px] text-muted-foreground mb-2 tracking-wider uppercase">
                    {lang === 'en' ? 'Wheel Design' : 'Diseño de Rin'}: {selWhlDesign?.name[lang]}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {WHEEL_DESIGNS.map(w => (
                      <button
                        key={w.id}
                        onClick={() => setWheelDesign(w.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs tracking-[0.1em] uppercase border transition-all duration-300 ${
                          wheelDesign === w.id
                            ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_hsl(var(--primary)/0.15)]'
                            : 'border-border/30 text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Disc className="w-3.5 h-3.5" />
                        {w.name[lang]}
                      </button>
                    ))}
                  </div>
                  {/* Wheel Color */}
                  <p className="text-[10px] text-muted-foreground mb-2 tracking-wider uppercase">
                    {lang === 'en' ? 'Wheel Color' : 'Color de Rin'}: {selWhl?.name[lang]}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {WHEEL_COLORS.map(c => (
                      <ColorSwatch key={c.id} color={c.hex} selected={wheelColor === c.hex} onClick={() => setWheelColor(c.hex)} label={c.name[lang]} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'interior' && (
                <motion.div key="int" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                  <p className="text-[10px] text-muted-foreground mb-3 tracking-wider uppercase">
                    {selInt?.name[lang] ?? (lang === 'en' ? 'Interior Color' : 'Color Interior')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {INTERIOR_COLORS.map(c => (
                      <ColorSwatch key={c.id} color={c.hex} selected={interiorColor === c.hex} onClick={() => setInteriorColor(c.hex)} label={c.name[lang]} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'environment' && (
                <motion.div key="env" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                  <p className="text-[10px] text-muted-foreground mb-3 tracking-wider uppercase">
                    {selEnv?.name[lang] ?? (lang === 'en' ? 'Environment' : 'Entorno')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ENVIRONMENTS.map(env => (
                      <button
                        key={env.id}
                        onClick={() => setEnvPreset(env.preset)}
                        className={`px-5 py-2.5 rounded-lg text-xs tracking-[0.1em] uppercase border transition-all duration-300 ${
                          envPreset === env.preset
                            ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_hsl(var(--primary)/0.15)]'
                            : 'border-border/30 text-muted-foreground hover:border-muted-foreground hover:text-foreground'
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

          {/* Config summary bar */}
          <div className="px-4 md:px-6 pb-3 flex items-center gap-4 text-[10px] text-muted-foreground/70 tracking-wider uppercase flex-wrap">
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-border/30" style={{ backgroundColor: bodyColor }} />
              {selExt?.name[lang]}
            </span>
            <span className="text-border/20">|</span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-border/30" style={{ backgroundColor: wheelColor }} />
              {selWhl?.name[lang]} · {selWhlDesign?.name[lang]}
            </span>
            <span className="text-border/20">|</span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-border/30" style={{ backgroundColor: interiorColor }} />
              {selInt?.name[lang]}
            </span>
            <span className="text-border/20">|</span>
            <span>{selEnv?.name[lang]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
