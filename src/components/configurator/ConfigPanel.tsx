import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette, CircleDot, Armchair, Sun, RotateCcw, Eye, EyeOff,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import type { WheelDesign } from '@/components/3d/PorscheWheels';
import type { HdriPreset } from './Scene3D';

/* ─── Color / option data ─── */
const BODY_COLORS = [
  { id: 'guards-red', hex: '#c0392b', name: { en: 'Guards Red', es: 'Rojo Guardia' } },
  { id: 'midnight-blue', hex: '#1a237e', name: { en: 'Midnight Blue', es: 'Azul Medianoche' } },
  { id: 'silver', hex: '#b0b0b0', name: { en: 'Silver', es: 'Plata' } },
  { id: 'irish-green', hex: '#1b5e20', name: { en: 'Irish Green', es: 'Verde Irlandés' } },
  { id: 'signal-yellow', hex: '#f9a825', name: { en: 'Signal Yellow', es: 'Amarillo Señal' } },
  { id: 'black', hex: '#111111', name: { en: 'Black', es: 'Negro' } },
  { id: 'gulf-orange', hex: '#e65100', name: { en: 'Gulf Orange', es: 'Naranja Gulf' } },
  { id: 'chalk', hex: '#e8e4de', name: { en: 'Chalk', es: 'Tiza' } },
  { id: 'miami-blue', hex: '#00acc1', name: { en: 'Miami Blue', es: 'Azul Miami' } },
  { id: 'white', hex: '#f5f5f5', name: { en: 'White', es: 'Blanco' } },
];

const WHEEL_COLORS = [
  { hex: '#c0c0c0', name: { en: 'Silver', es: 'Plata' } },
  { hex: '#111111', name: { en: 'Black', es: 'Negro' } },
  { hex: '#d4af37', name: { en: 'Gold', es: 'Dorado' } },
  { hex: '#333333', name: { en: 'Gunmetal', es: 'Gris Acero' } },
];

const WHEEL_DESIGNS: { id: WheelDesign; name: { en: string; es: string } }[] = [
  { id: 'fuchs', name: { en: 'Fuchs Classic', es: 'Fuchs Clásico' } },
  { id: 'cup', name: { en: 'Cup Design', es: 'Diseño Cup' } },
  { id: 'turbo-twist', name: { en: 'Turbo Twist', es: 'Turbo Twist' } },
];

const INTERIOR_COLORS = [
  { hex: '#c88a4a', name: { en: 'Tan Leather', es: 'Cuero Habano' } },
  { hex: '#111111', name: { en: 'Black Leather', es: 'Cuero Negro' } },
  { hex: '#6b2737', name: { en: 'Burgundy', es: 'Borgoña' } },
  { hex: '#9a5b2f', name: { en: 'Cognac', es: 'Cognac' } },
  { hex: '#f5e6c8', name: { en: 'Cream', es: 'Crema' } },
];

const HDRI_OPTIONS: { id: HdriPreset; name: { en: string; es: string } }[] = [
  { id: 'studio', name: { en: 'Studio', es: 'Estudio' } },
  { id: 'sunset', name: { en: 'Sunset', es: 'Atardecer' } },
  { id: 'dawn', name: { en: 'Dawn', es: 'Amanecer' } },
  { id: 'night', name: { en: 'Night', es: 'Noche' } },
  { id: 'warehouse', name: { en: 'Warehouse', es: 'Almacén' } },
  { id: 'city', name: { en: 'City', es: 'Ciudad' } },
];

type Tab = 'exterior' | 'wheels' | 'interior' | 'environment';

interface ConfigPanelProps {
  variant: '964' | '993';
  setVariant: (v: '964' | '993') => void;
  bodyColor: string;
  setBodyColor: (c: string) => void;
  wheelColor: string;
  setWheelColor: (c: string) => void;
  wheelDesign: WheelDesign;
  setWheelDesign: (d: WheelDesign) => void;
  interiorColor: string;
  setInteriorColor: (c: string) => void;
  hdri: HdriPreset;
  setHdri: (h: HdriPreset) => void;
  autoRotate: boolean;
  setAutoRotate: (v: boolean) => void;
  onReset: () => void;
}

const tabs: { id: Tab; icon: React.ReactNode; label: { en: string; es: string } }[] = [
  { id: 'exterior', icon: <Palette className="w-4 h-4" />, label: { en: 'Exterior', es: 'Exterior' } },
  { id: 'wheels', icon: <CircleDot className="w-4 h-4" />, label: { en: 'Wheels', es: 'Rines' } },
  { id: 'interior', icon: <Armchair className="w-4 h-4" />, label: { en: 'Interior', es: 'Interior' } },
  { id: 'environment', icon: <Sun className="w-4 h-4" />, label: { en: 'Environment', es: 'Entorno' } },
];

function ColorSwatch({
  hex, selected, onClick, label,
}: { hex: string; selected: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`group relative w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
        selected ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-border/30 hover:border-foreground/50'
      }`}
      style={{ backgroundColor: hex }}
    >
      {selected && (
        <motion.div
          layoutId="swatch-check"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-sm" />
        </motion.div>
      )}
    </button>
  );
}

export default function ConfigPanel(props: ConfigPanelProps) {
  const { lang } = useLang();
  const [tab, setTab] = useState<Tab>('exterior');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute right-0 top-0 bottom-0 z-20 flex flex-col items-end pointer-events-none">
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="pointer-events-auto mt-20 mr-4 p-2 rounded-lg bg-card/60 backdrop-blur-xl border border-border/20 text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto mt-2 mr-4 mb-4 w-72 rounded-2xl overflow-hidden border border-border/15 shadow-2xl"
            style={{
              background: 'rgba(10, 10, 10, 0.75)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-border/10">
              <div className="flex gap-1">
                {(['964', '993'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => props.setVariant(v)}
                    className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-body rounded-lg transition-all ${
                      props.variant === v
                        ? 'bg-primary/15 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => props.setAutoRotate(!props.autoRotate)}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    props.autoRotate ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={props.autoRotate ? 'Stop rotation' : 'Auto rotate'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={props.onReset}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border/10">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[9px] tracking-[0.1em] uppercase border-b-2 transition-all ${
                    tab === t.id
                      ? 'text-primary border-primary bg-primary/5'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label[lang]}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-4 max-h-[50vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {tab === 'exterior' && (
                  <motion.div key="ext" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    <p className="text-[10px] text-muted-foreground mb-3 tracking-wider uppercase">
                      {BODY_COLORS.find(c => c.hex === props.bodyColor)?.name[lang] || 'Color'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {BODY_COLORS.map((c) => (
                        <ColorSwatch
                          key={c.id}
                          hex={c.hex}
                          selected={props.bodyColor === c.hex}
                          onClick={() => props.setBodyColor(c.hex)}
                          label={c.name[lang]}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {tab === 'wheels' && (
                  <motion.div key="wh" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-2 tracking-wider uppercase">
                        {lang === 'en' ? 'Design' : 'Diseño'}
                      </p>
                      <div className="flex gap-2">
                        {WHEEL_DESIGNS.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => props.setWheelDesign(d.id)}
                            className={`flex-1 px-2 py-2 rounded-lg text-[10px] uppercase tracking-wider border transition-all ${
                              props.wheelDesign === d.id
                                ? 'border-primary text-primary bg-primary/10'
                                : 'border-border/30 text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {d.name[lang]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-2 tracking-wider uppercase">
                        {lang === 'en' ? 'Color' : 'Color'}
                      </p>
                      <div className="flex gap-2">
                        {WHEEL_COLORS.map((c) => (
                          <ColorSwatch
                            key={c.hex}
                            hex={c.hex}
                            selected={props.wheelColor === c.hex}
                            onClick={() => props.setWheelColor(c.hex)}
                            label={c.name[lang]}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {tab === 'interior' && (
                  <motion.div key="int" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    <p className="text-[10px] text-muted-foreground mb-3 tracking-wider uppercase">
                      {INTERIOR_COLORS.find(c => c.hex === props.interiorColor)?.name[lang] || 'Interior'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {INTERIOR_COLORS.map((c) => (
                        <ColorSwatch
                          key={c.hex}
                          hex={c.hex}
                          selected={props.interiorColor === c.hex}
                          onClick={() => props.setInteriorColor(c.hex)}
                          label={c.name[lang]}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {tab === 'environment' && (
                  <motion.div key="env" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    <p className="text-[10px] text-muted-foreground mb-3 tracking-wider uppercase">
                      {lang === 'en' ? 'Lighting environment' : 'Entorno de iluminación'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {HDRI_OPTIONS.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => props.setHdri(h.id)}
                          className={`px-3 py-2.5 rounded-lg text-[10px] uppercase tracking-wider border transition-all ${
                            props.hdri === h.id
                              ? 'border-primary text-primary bg-primary/10'
                              : 'border-border/30 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {h.name[lang]}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
