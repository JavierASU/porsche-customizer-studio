import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Save, ArrowLeft } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import {
  carModels, exteriorColors, interiorOptions, wheelOptions, categories,
} from '@/data/porscheData';
import type { CategoryId } from '@/data/porscheData';

type Step = 'model' | 'exterior' | 'interior' | 'wheels' | 'summary';

const steps: { id: Step; en: string; es: string }[] = [
  { id: 'model', en: 'Model', es: 'Modelo' },
  { id: 'exterior', en: 'Exterior', es: 'Exterior' },
  { id: 'interior', en: 'Interior', es: 'Interior' },
  { id: 'wheels', en: 'Wheels', es: 'Rines' },
  { id: 'summary', en: 'Summary', es: 'Resumen' },
];

const Configurator = () => {
  const [searchParams] = useSearchParams();
  const { lang, t } = useLang();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<Step>('model');
  const [selectedModel, setSelectedModel] = useState(searchParams.get('model') || '');
  const [selectedExterior, setSelectedExterior] = useState(searchParams.get('exterior') || 'guards-red');
  const [selectedInterior, setSelectedInterior] = useState(searchParams.get('interior') || 'tan-leather');
  const [selectedWheels, setSelectedWheels] = useState(searchParams.get('wheels') || 'fuchs-classic');
  const [modelCategoryFilter, setModelCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [saving, setSaving] = useState(false);

  const currentModel = carModels.find((m) => m.id === selectedModel);
  const currentExterior = exteriorColors.find((c) => c.id === selectedExterior)!;
  const currentInterior = interiorOptions.find((c) => c.id === selectedInterior)!;
  const currentWheels = wheelOptions.find((w) => w.id === selectedWheels)!;

  useEffect(() => {
    if (searchParams.get('model')) {
      setCurrentStep('exterior');
    }
  }, []);

  const filteredModels = modelCategoryFilter === 'all'
    ? carModels
    : carModels.filter((m) => m.category === modelCategoryFilter);

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  const goNext = () => {
    if (stepIndex < steps.length - 1) setCurrentStep(steps[stepIndex + 1].id);
  };
  const goPrev = () => {
    if (stepIndex > 0) setCurrentStep(steps[stepIndex - 1].id);
  };

  const handleSave = async () => {
    if (!user || !currentModel) return;
    setSaving(true);
    const config = {
      id: Date.now().toString(),
      model: selectedModel,
      modelName: currentModel.name,
      exteriorColor: selectedExterior,
      exteriorName: currentExterior.name[lang],
      interiorColor: selectedInterior,
      interiorName: currentInterior.name[lang],
      wheels: selectedWheels,
      wheelsName: currentWheels.name[lang],
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('hauswerk_builds') || '[]');
    existing.push(config);
    localStorage.setItem('hauswerk_builds', JSON.stringify(existing));
    toast.success(t.configurator.saved);
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20">
        {/* Step indicator */}
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto">
              {steps.map((step, i) => (
                <button
                  key={step.id}
                  onClick={() => {
                    if (step.id === 'model' || selectedModel) setCurrentStep(step.id);
                  }}
                  className={`flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-body whitespace-nowrap transition-colors ${
                    currentStep === step.id ? 'text-gold' : i <= stepIndex ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] border transition-colors ${
                    currentStep === step.id ? 'border-gold text-gold' : i < stepIndex ? 'border-foreground text-foreground' : 'border-border text-muted-foreground'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="hidden sm:inline">{step[lang]}</span>
                  {i < steps.length - 1 && <span className="text-border mx-1">—</span>}
                </button>
              ))}
            </div>
            {(selectedModel === '964' || selectedModel === '993') && (
              <Link
                to={`/configurator-3d`}
                className="btn-luxury text-[10px] tracking-[0.15em] uppercase px-4 py-2 flex items-center gap-2"
              >
                <span>🎮</span> {lang === 'en' ? '3D View' : 'Vista 3D'}
              </Link>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Model Selection */}
          {currentStep === 'model' && (
            <motion.div
              key="model"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-6 py-10"
            >
              <h2 className="section-heading text-3xl md:text-4xl mb-2">{t.configurator.subtitle}</h2>
              <p className="text-muted-foreground mb-8">{currentStep === 'model' ? (lang === 'en' ? 'Choose your Porsche model' : 'Elige tu modelo Porsche') : ''}</p>

              {/* Category filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setModelCategoryFilter('all')}
                  className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase border transition-all ${
                    modelCategoryFilter === 'all' ? 'border-gold bg-gold/10 text-foreground' : 'border-border text-muted-foreground hover:border-muted-foreground'
                  }`}
                >
                  {lang === 'en' ? 'All' : 'Todos'}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setModelCategoryFilter(cat.id)}
                    className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase border transition-all ${
                      modelCategoryFilter === cat.id ? 'border-gold bg-gold/10 text-foreground' : 'border-border text-muted-foreground hover:border-muted-foreground'
                    }`}
                  >
                    {cat.name[lang]}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => { setSelectedModel(model.id); goNext(); }}
                    className={`group text-left border transition-all duration-300 overflow-hidden ${
                      selectedModel === model.id ? 'border-gold ring-1 ring-gold' : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <div className="relative">
                      <img src={model.image} alt={model.name} loading="lazy" className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-[10px] tracking-[0.2em] uppercase text-gold">{model.year}</p>
                        <h3 className="font-display text-lg">{model.name}</h3>
                        <p className="text-xs text-muted-foreground">{model.engine[lang]} · {model.power}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Exterior Color */}
          {currentStep === 'exterior' && currentModel && (
            <motion.div
              key="exterior"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-6 py-10"
            >
              <div className="grid lg:grid-cols-3 gap-10">
                {/* Preview */}
                <div className="lg:col-span-2">
                  <div className="relative aspect-[16/10] rounded-sm overflow-hidden bg-card sticky top-24">
                    <img src={currentModel.image} alt={currentModel.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 mix-blend-color opacity-40" style={{ backgroundColor: currentExterior.hex }} />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-1">{currentModel.year}</p>
                      <h3 className="font-display text-2xl">{currentModel.name}</h3>
                      <p className="text-sm text-muted-foreground">{currentExterior.name[lang]}</p>
                    </div>
                  </div>
                </div>
                {/* Color selection */}
                <div>
                  <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-6">{t.configurator.exteriorColor}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {exteriorColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedExterior(color.id)}
                        className="group flex flex-col items-center gap-2"
                      >
                        <div
                          className={`w-14 h-14 rounded-full border-2 transition-all duration-300 ${
                            selectedExterior === color.id
                              ? 'border-gold scale-110 shadow-[0_0_20px_hsl(38_70%_50%/0.4)]'
                              : 'border-border group-hover:border-muted-foreground group-hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className={`text-[10px] tracking-wider text-center leading-tight transition-colors ${
                          selectedExterior === color.id ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {color.name[lang]}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button onClick={goPrev} className="btn-outline-luxury flex-1 text-center text-xs">
                      <ArrowLeft className="w-3.5 h-3.5 inline mr-2" />{lang === 'en' ? 'Back' : 'Atrás'}
                    </button>
                    <button onClick={goNext} className="btn-luxury flex-1 text-center text-xs">
                      {lang === 'en' ? 'Next' : 'Siguiente'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Interior */}
          {currentStep === 'interior' && currentModel && (
            <motion.div
              key="interior"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-6 py-10"
            >
              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedInterior}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative aspect-[16/10] rounded-sm overflow-hidden bg-card"
                    >
                      <img src={currentInterior.image} alt={currentInterior.name[lang]} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
                        <h3 className="font-display text-2xl">{currentInterior.name[lang]}</h3>
                        <p className="text-sm text-muted-foreground">{lang === 'en' ? 'Premium hand-stitched leather' : 'Cuero premium cosido a mano'}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div>
                  <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-6">{t.configurator.interiorColor}</h3>
                  <div className="space-y-3">
                    {interiorOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedInterior(opt.id)}
                        className={`w-full flex items-center gap-4 p-3 border transition-all duration-300 ${
                          selectedInterior === opt.id ? 'border-gold bg-gold/5' : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0">
                          <img src={opt.image} alt={opt.name[lang]} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left">
                          <p className={`text-sm ${selectedInterior === opt.id ? 'text-foreground' : 'text-muted-foreground'}`}>{opt.name[lang]}</p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full ml-auto border-2 flex-shrink-0 ${
                            selectedInterior === opt.id ? 'border-gold' : 'border-border'
                          }`}
                          style={{ backgroundColor: opt.hex }}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button onClick={goPrev} className="btn-outline-luxury flex-1 text-center text-xs">
                      <ArrowLeft className="w-3.5 h-3.5 inline mr-2" />{lang === 'en' ? 'Back' : 'Atrás'}
                    </button>
                    <button onClick={goNext} className="btn-luxury flex-1 text-center text-xs">
                      {lang === 'en' ? 'Next' : 'Siguiente'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Wheels */}
          {currentStep === 'wheels' && currentModel && (
            <motion.div
              key="wheels"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-6 py-10"
            >
              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedWheels}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative aspect-[16/10] rounded-sm overflow-hidden bg-card flex items-center justify-center"
                    >
                      <img src={currentWheels.image} alt={currentWheels.name[lang]} className="w-full h-full object-contain p-8" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
                        <h3 className="font-display text-2xl">{currentWheels.name[lang]}</h3>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div>
                  <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-6">{t.configurator.wheels}</h3>
                  <div className="space-y-3">
                    {wheelOptions.map((wheel) => (
                      <button
                        key={wheel.id}
                        onClick={() => setSelectedWheels(wheel.id)}
                        className={`w-full flex items-center gap-4 p-3 border transition-all duration-300 ${
                          selectedWheels === wheel.id ? 'border-gold bg-gold/5' : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-sm overflow-hidden flex-shrink-0 bg-card">
                          <img src={wheel.image} alt={wheel.name[lang]} className="w-full h-full object-cover" />
                        </div>
                        <p className={`text-sm text-left ${selectedWheels === wheel.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {wheel.name[lang]}
                        </p>
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button onClick={goPrev} className="btn-outline-luxury flex-1 text-center text-xs">
                      <ArrowLeft className="w-3.5 h-3.5 inline mr-2" />{lang === 'en' ? 'Back' : 'Atrás'}
                    </button>
                    <button onClick={goNext} className="btn-luxury flex-1 text-center text-xs">
                      {lang === 'en' ? 'Review' : 'Revisar'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Summary */}
          {currentStep === 'summary' && currentModel && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto px-6 py-10"
            >
              <div className="text-center mb-10">
                <p className="section-subheading mb-2">{t.configurator.summary}</p>
                <h2 className="font-display text-3xl md:text-4xl">{currentModel.name}</h2>
              </div>

              {/* Summary grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {/* Car preview */}
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-card">
                  <img src={currentModel.image} alt={currentModel.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 mix-blend-color opacity-40" style={{ backgroundColor: currentExterior.hex }} />
                </div>
                {/* Interior preview */}
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-card">
                  <img src={currentInterior.image} alt={currentInterior.name[lang]} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Specs */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="border border-border p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2">{t.configurator.model}</p>
                  <p className="font-display text-lg">{currentModel.name}</p>
                  <p className="text-xs text-muted-foreground">{currentModel.year} · {currentModel.power}</p>
                </div>
                <div className="border border-border p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2">{t.configurator.exteriorColor}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-border" style={{ backgroundColor: currentExterior.hex }} />
                    <p className="text-sm">{currentExterior.name[lang]}</p>
                  </div>
                </div>
                <div className="border border-border p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2">{t.configurator.interiorColor}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-border" style={{ backgroundColor: currentInterior.hex }} />
                    <p className="text-sm">{currentInterior.name[lang]}</p>
                  </div>
                </div>
                <div className="border border-border p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2">{t.configurator.wheels}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm overflow-hidden">
                      <img src={currentWheels.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm">{currentWheels.name[lang]}</p>
                  </div>
                </div>
              </div>

              {/* Wheel preview */}
              <div className="flex justify-center mb-10">
                <div className="w-40 h-40 rounded-sm overflow-hidden bg-card">
                  <img src={currentWheels.image} alt={currentWheels.name[lang]} className="w-full h-full object-contain p-2" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={goPrev} className="btn-outline-luxury text-center text-xs">
                  <ArrowLeft className="w-3.5 h-3.5 inline mr-2" />{lang === 'en' ? 'Modify' : 'Modificar'}
                </button>
                {user ? (
                  <button onClick={handleSave} disabled={saving} className="btn-luxury text-center disabled:opacity-50">
                    <Save className="w-3.5 h-3.5 inline mr-2" />{saving ? '...' : t.configurator.save}
                  </button>
                ) : (
                  <Link to="/auth" className="btn-luxury text-center">
                    {t.configurator.loginToSave}
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default Configurator;
