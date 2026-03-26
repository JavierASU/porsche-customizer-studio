import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import heroPorsche from '@/assets/hero-porsche.jpg';

const Hero = () => {
  const { t } = useLang();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroPorsche} alt="Porsche 911" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="section-subheading mb-6"
            >
              {t.hero.subtitle}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6"
            >
              <span className="text-gradient-gold">{t.hero.title.split(' ')[0]}</span>{' '}
              {t.hero.title.split(' ').slice(1).join(' ')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg"
            >
              {t.hero.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/configurator" className="btn-luxury text-center">
                {t.hero.cta}
              </Link>
              <a href="#models" className="btn-outline-luxury text-center">
                {t.hero.explore}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
