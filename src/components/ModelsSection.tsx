import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import porscheRed from '@/assets/porsche-red.jpg';
import porscheBlue from '@/assets/porsche-blue.jpg';
import porscheSilver from '@/assets/porsche-silver.jpg';

const models = [
  { id: '911-classic', name: '911 Classic', year: '1964–1973', image: porscheRed },
  { id: '911-g-body', name: '911 G-Body', year: '1974–1989', image: porscheBlue },
  { id: '964', name: '964', year: '1989–1994', image: porscheSilver },
];

const ModelsSection = () => {
  const { t } = useLang();

  return (
    <section id="models" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="section-subheading mb-4">{t.models.subtitle}</p>
          <h2 className="section-heading">{t.models.title}</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {models.map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="group"
            >
              <div className="relative overflow-hidden bg-card rounded-sm mb-6">
                <img
                  src={model.image}
                  alt={model.name}
                  loading="lazy"
                  className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <Link
                    to={`/configurator?model=${model.id}`}
                    className="btn-luxury w-full text-center block text-xs"
                  >
                    {t.models.configure}
                  </Link>
                </div>
              </div>
              <h3 className="font-display text-2xl mb-1">{model.name}</h3>
              <p className="text-muted-foreground text-sm tracking-wider">{model.year}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelsSection;
