import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLang } from '@/lib/i18n';
import heroPorsche from '@/assets/hero-porsche.jpg';

const Hero = () => {
  const { t } = useLang();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroPorsche}
          alt="Porsche 911"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="section-subheading mb-6">{t.hero.subtitle}</p>
            <h1 className="section-heading text-5xl md:text-7xl lg:text-8xl mb-6">
              {t.hero.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/configurator" className="btn-luxury text-center">
                {t.hero.cta}
              </Link>
              <a href="#models" className="btn-outline-luxury text-center">
                {t.hero.explore}
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
