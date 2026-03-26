import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import workshopImg from '@/assets/workshop.jpg';
import interiorTan from '@/assets/interior-tan.jpg';

const stats = [
  { value: '500+', en: 'Cars Restored', es: 'Autos Restaurados' },
  { value: '15+', en: 'Years of Craft', es: 'Años de Oficio' },
  { value: '100%', en: 'Hand-Built', es: 'Hecho a Mano' },
  { value: '∞', en: 'Passion', es: 'Pasión' },
];

const CraftSection = () => {
  const { lang, t } = useLang();

  return (
    <section id="craft" className="relative">
      {/* Workshop parallax section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img src={workshopImg} alt="Workshop" loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 px-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.en}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-4xl md:text-5xl text-gradient-gold mb-2">{stat.value}</p>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{stat[lang]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Craftsmanship detail */}
      <div className="py-32 bg-secondary">
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
              <div className="space-y-4 mb-8">
                {[
                  { en: 'Complete disassembly & media blasting', es: 'Desarmado completo y arenado' },
                  { en: 'Precision body alignment & paint', es: 'Alineación de carrocería y pintura de precisión' },
                  { en: 'Hand-stitched bespoke leather interiors', es: 'Interiores de cuero cosidos a mano a medida' },
                  { en: 'Blueprinted engine rebuild', es: 'Reconstrucción de motor con planos' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{item[lang]}</p>
                  </motion.div>
                ))}
              </div>
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
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-gold/30 rounded-sm hidden lg:block" />
              <div className="absolute -top-4 -left-4 w-16 h-16 border border-gold/20 rounded-sm hidden lg:block" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftSection;
