import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import { categories, carModels } from '@/data/porscheData';
import type { CategoryId } from '@/data/porscheData';

const ModelsSection = () => {
  const { lang, t } = useLang();
  const [activeCategory, setActiveCategory] = useState<CategoryId>('classic-911');

  const filtered = carModels.filter((m) => m.category === activeCategory);
  const activeCat = categories.find((c) => c.id === activeCategory)!;

  return (
    <section id="models" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="section-subheading mb-4">{t.models.subtitle}</p>
          <h2 className="section-heading">{t.models.title}</h2>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-xs tracking-[0.15em] uppercase font-body transition-all duration-300 border ${
                activeCategory === cat.id
                  ? 'border-gold bg-gold/10 text-foreground'
                  : 'border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.name[lang]}
            </button>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm mb-12 italic">
          {activeCat.description[lang]}
        </p>

        {/* Models grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((model, i) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative"
              >
                <div className="relative overflow-hidden bg-card rounded-sm">
                  <img
                    src={model.image}
                    alt={model.name}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-1">{model.year}</p>
                      <h3 className="font-display text-xl mb-1">{model.name}</h3>
                      <p className="text-xs text-muted-foreground mb-1">{model.engine[lang]} · {model.power}</p>
                      <p className="text-xs text-muted-foreground mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {model.description[lang]}
                      </p>
                      <Link
                        to={`/configurator?model=${model.id}`}
                        className="btn-luxury text-[10px] py-2 px-5 inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      >
                        {t.models.configure}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ModelsSection;
