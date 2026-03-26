import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

import porscheRed from '@/assets/porsche-red.jpg';
import porscheBlue from '@/assets/porsche-blue.jpg';
import porscheSilver from '@/assets/porsche-silver.jpg';
import interiorTan from '@/assets/interior-tan.jpg';

const carModels = [
  { id: '911-classic', name: '911 Classic (1964–1973)', image: porscheRed },
  { id: '911-g-body', name: '911 G-Body (1974–1989)', image: porscheBlue },
  { id: '964', name: '964 (1989–1994)', image: porscheSilver },
];

const exteriorColors = [
  { id: 'guards-red', name: 'Guards Red', hex: '#c0392b' },
  { id: 'midnight-blue', name: 'Midnight Blue', hex: '#1a2744' },
  { id: 'silver-metallic', name: 'Silver Metallic', hex: '#c0c0c0' },
  { id: 'irish-green', name: 'Irish Green', hex: '#1e5631' },
  { id: 'signal-yellow', name: 'Signal Yellow', hex: '#f5c518' },
  { id: 'black', name: 'Black', hex: '#1a1a1a' },
  { id: 'gulf-orange', name: 'Gulf Orange', hex: '#e87e27' },
  { id: 'chalk', name: 'Chalk', hex: '#e8e4de' },
];

const interiorColors = [
  { id: 'tan-leather', name: 'Tan Leather', hex: '#c88a4a', image: interiorTan },
  { id: 'black-leather', name: 'Black Leather', hex: '#1a1a1a' },
  { id: 'burgundy-leather', name: 'Burgundy Leather', hex: '#6b2737' },
  { id: 'cognac-leather', name: 'Cognac Leather', hex: '#9a5b2f' },
];

const wheelOptions = [
  { id: 'fuchs-classic', name: 'Fuchs Classic' },
  { id: 'fuchs-black', name: 'Fuchs Black Edition' },
  { id: 'sport-silver', name: 'Sport Silver' },
  { id: 'rs-style', name: 'RS Style Gold' },
];

const Configurator = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLang();
  const { user } = useAuth();

  const [selectedModel, setSelectedModel] = useState(searchParams.get('model') || '911-classic');
  const [selectedExterior, setSelectedExterior] = useState('guards-red');
  const [selectedInterior, setSelectedInterior] = useState('tan-leather');
  const [selectedWheels, setSelectedWheels] = useState('fuchs-classic');
  const [saving, setSaving] = useState(false);

  const currentModel = carModels.find((m) => m.id === selectedModel) || carModels[0];
  const currentExterior = exteriorColors.find((c) => c.id === selectedExterior)!;
  const currentInterior = interiorColors.find((c) => c.id === selectedInterior)!;
  const currentWheels = wheelOptions.find((w) => w.id === selectedWheels)!;

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    // For now we save to localStorage until DB tables are created
    const config = {
      id: Date.now().toString(),
      model: selectedModel,
      modelName: currentModel.name,
      exteriorColor: selectedExterior,
      exteriorName: currentExterior.name,
      interiorColor: selectedInterior,
      interiorName: currentInterior.name,
      wheels: selectedWheels,
      wheelsName: currentWheels.name,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('hauswerk_builds') || '[]');
    existing.push(config);
    localStorage.setItem('hauswerk_builds', JSON.stringify(existing));

    toast.success(t.configurator.saved);
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="section-subheading mb-3">{t.configurator.subtitle}</p>
            <h1 className="section-heading text-4xl md:text-5xl">{t.configurator.title}</h1>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Preview */}
            <div className="lg:col-span-3">
              <motion.div
                key={selectedModel + selectedExterior}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[4/3] rounded-sm overflow-hidden bg-card"
              >
                <img
                  src={currentModel.image}
                  alt={currentModel.name}
                  className="w-full h-full object-cover"
                />
                {/* Color overlay to simulate exterior color */}
                <div
                  className="absolute inset-0 mix-blend-color opacity-40"
                  style={{ backgroundColor: currentExterior.hex }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
                  <h3 className="font-display text-2xl">{currentModel.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentExterior.name} · {currentInterior.name} · {currentWheels.name}</p>
                </div>
              </motion.div>

              {/* Interior preview */}
              {currentInterior.image && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 aspect-video rounded-sm overflow-hidden bg-card"
                >
                  <img src={currentInterior.image} alt="Interior" className="w-full h-full object-cover" loading="lazy" />
                </motion.div>
              )}
            </div>

            {/* Controls */}
            <div className="lg:col-span-2 space-y-8">
              {/* Model Select */}
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-4">{t.configurator.model}</h3>
                <div className="space-y-2">
                  {carModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`w-full text-left px-4 py-3 text-sm border transition-all duration-300 ${
                        selectedModel === model.id
                          ? 'border-gold bg-gold/10 text-foreground'
                          : 'border-border text-muted-foreground hover:border-muted-foreground'
                      }`}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exterior Color */}
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-4">{t.configurator.exteriorColor}</h3>
                <div className="grid grid-cols-4 gap-3">
                  {exteriorColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedExterior(color.id)}
                      className="group flex flex-col items-center gap-2"
                      title={color.name}
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                          selectedExterior === color.id
                            ? 'border-gold scale-110 shadow-[0_0_15px_hsl(38_70%_50%/0.4)]'
                            : 'border-border group-hover:border-muted-foreground'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[10px] text-muted-foreground tracking-wider text-center leading-tight">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interior */}
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-4">{t.configurator.interiorColor}</h3>
                <div className="grid grid-cols-4 gap-3">
                  {interiorColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedInterior(color.id)}
                      className="group flex flex-col items-center gap-2"
                      title={color.name}
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                          selectedInterior === color.id
                            ? 'border-gold scale-110 shadow-[0_0_15px_hsl(38_70%_50%/0.4)]'
                            : 'border-border group-hover:border-muted-foreground'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[10px] text-muted-foreground tracking-wider text-center leading-tight">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wheels */}
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-4">{t.configurator.wheels}</h3>
                <div className="space-y-2">
                  {wheelOptions.map((wheel) => (
                    <button
                      key={wheel.id}
                      onClick={() => setSelectedWheels(wheel.id)}
                      className={`w-full text-left px-4 py-3 text-sm border transition-all duration-300 ${
                        selectedWheels === wheel.id
                          ? 'border-gold bg-gold/10 text-foreground'
                          : 'border-border text-muted-foreground hover:border-muted-foreground'
                      }`}
                    >
                      {wheel.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save */}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-luxury w-full text-center disabled:opacity-50"
                  >
                    {saving ? '...' : t.configurator.save}
                  </button>
                ) : (
                  <Link to="/auth" className="btn-outline-luxury w-full text-center block">
                    {t.configurator.loginToSave}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurator;
