import { motion, AnimatePresence } from 'framer-motion';
import type { Variant, WheelStyle, InteriorColor } from './ConfiguratorData';
import { wheelImagePath, interiorImagePath } from './ConfiguratorData';

interface DetailPreviewProps {
  variant: Variant;
  wheelStyle: WheelStyle;
  interiorColor: InteriorColor;
  activeTab: 'exterior' | 'wheels' | 'interior';
  lang: 'en' | 'es';
}

export default function DetailPreview({ variant, wheelStyle, interiorColor, activeTab, lang }: DetailPreviewProps) {
  const showDetail = activeTab === 'wheels' || activeTab === 'interior';
  const detailImage = activeTab === 'wheels'
    ? wheelImagePath(variant, wheelStyle.id)
    : interiorImagePath(interiorColor.id);
  const detailLabel = activeTab === 'wheels'
    ? wheelStyle.name[lang]
    : interiorColor.name[lang];

  return (
    <AnimatePresence>
      {showDetail && (
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.9 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute bottom-52 md:bottom-56 right-4 md:right-8 z-15 w-48 md:w-64"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border/20 bg-card/80 backdrop-blur-xl shadow-2xl">
            <img
              src={detailImage}
              alt={detailLabel}
              width={512}
              height={512}
              loading="lazy"
              className="w-full aspect-square object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-[10px] tracking-[0.15em] uppercase text-white/90 font-body">
                {activeTab === 'wheels'
                  ? (lang === 'en' ? 'Wheels' : 'Rines')
                  : (lang === 'en' ? 'Interior' : 'Interior')}
              </p>
              <p className="text-xs text-white font-medium">{detailLabel}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
