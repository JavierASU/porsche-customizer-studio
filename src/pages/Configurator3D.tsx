import { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import Scene3D from '@/components/configurator/Scene3D';
import type { HdriPreset } from '@/components/configurator/Scene3D';
import ConfigPanel from '@/components/configurator/ConfigPanel';
import type { WheelDesign } from '@/components/3d/PorscheWheels';

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
      <p className="text-sm text-muted-foreground tracking-wider uppercase">
        Loading 3D model…
      </p>
    </div>
  );
}

export default function Configurator3D() {
  const { lang } = useLang();

  const [variant, setVariant] = useState<'964' | '993'>('964');
  const [bodyColor, setBodyColor] = useState('#c0392b');
  const [wheelColor, setWheelColor] = useState('#c0c0c0');
  const [wheelDesign, setWheelDesign] = useState<WheelDesign>('fuchs');
  const [interiorColor, setInteriorColor] = useState('#c88a4a');
  const [autoRotate, setAutoRotate] = useState(true);
  const [hdri, setHdri] = useState<HdriPreset>('studio');
  const [loading, setLoading] = useState(true);

  const resetConfig = () => {
    setBodyColor('#c0392b');
    setWheelColor('#c0c0c0');
    setWheelDesign('fuchs');
    setInteriorColor('#c88a4a');
    setHdri('studio');
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center px-4 md:px-6 py-3 bg-gradient-to-b from-background/95 via-background/60 to-transparent">
        <Link
          to="/configurator"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{lang === 'en' ? 'Back' : 'Volver'}</span>
        </Link>
        <div className="h-5 w-px bg-border/30 mx-4 hidden sm:block" />
        <h1 className="font-display text-lg md:text-xl tracking-wide">
          <span className="text-primary">Porsche</span>{' '}
          <span className="text-foreground">911 ({variant})</span>
        </h1>
      </div>

      {/* 3D Canvas */}
      <Suspense fallback={<LoadingOverlay />}>
        <div
          className="absolute inset-0"
          onPointerDown={() => setLoading(false)}
          onTouchStart={() => setLoading(false)}
        >
          <Scene3D
            variant={variant}
            bodyColor={bodyColor}
            wheelColor={wheelColor}
            interiorColor={interiorColor}
            wheelDesign={wheelDesign}
            autoRotate={autoRotate}
            hdri={hdri}
          />
          {/* Auto-dismiss loading after scene renders */}
          <HiddenLoadingDismisser onReady={() => setLoading(false)} />
        </div>
      </Suspense>

      {loading && <LoadingOverlay />}

      {/* Config panel */}
      <ConfigPanel
        variant={variant}
        setVariant={setVariant}
        bodyColor={bodyColor}
        setBodyColor={setBodyColor}
        wheelColor={wheelColor}
        setWheelColor={setWheelColor}
        wheelDesign={wheelDesign}
        setWheelDesign={setWheelDesign}
        interiorColor={interiorColor}
        setInteriorColor={setInteriorColor}
        hdri={hdri}
        setHdri={setHdri}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        onReset={resetConfig}
      />

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 z-10 text-[10px] text-muted-foreground/50 tracking-wider uppercase">
        {lang === 'en'
          ? 'Drag to rotate • Scroll to zoom'
          : 'Arrastra para rotar • Scroll para zoom'}
      </div>
    </div>
  );
}

/** Tiny helper that dismisses loading after a short delay */
function HiddenLoadingDismisser({ onReady }: { onReady: () => void }) {
  useState(() => {
    const t = setTimeout(onReady, 1500);
    return () => clearTimeout(t);
  });
  return null;
}
