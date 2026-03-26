import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import interiorTan from '@/assets/interior-tan.jpg';

const CraftSection = () => {
  const { t } = useLang();

  return (
    <section id="craft" className="py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="section-subheading mb-4">{t.craft.subtitle}</p>
            <h2 className="section-heading mb-8">{t.craft.title}</h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed mb-8">
              {t.craft.description}
            </p>
            <button className="btn-outline-luxury">{t.craft.cta}</button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <img
              src={interiorTan}
              alt="Porsche Interior Craftsmanship"
              loading="lazy"
              className="w-full aspect-[4/3] object-cover rounded-sm"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-gold/30 rounded-sm" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CraftSection;
