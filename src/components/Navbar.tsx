import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { useLang, setLang } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, t } = useLang();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleLang = () => setLang(lang === 'en' ? 'es' : 'en');

  const navLinks = [
    { label: t.nav.home, to: '/' },
    { label: t.nav.models, to: '/#models' },
    { label: t.nav.configurator, to: '/configurator' },
    { label: t.nav.about, to: '/#craft' },
    { label: t.nav.contact, to: '/#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-surface">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-wider text-foreground">
          HAUS<span className="text-gradient-gold">WERK</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 font-body"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'en' ? 'ES' : 'EN'}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/my-builds" className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.myBuilds}
              </Link>
              <button onClick={() => signOut()} className="btn-outline-luxury text-xs py-2 px-4">
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-luxury text-xs py-2 px-6">
              {t.nav.login}
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-foreground">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-border" />
              <button onClick={toggleLang} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4" /> {lang === 'en' ? 'Español' : 'English'}
              </button>
              {user ? (
                <>
                  <Link to="/my-builds" onClick={() => setIsOpen(false)} className="text-sm tracking-[0.15em] uppercase text-muted-foreground">
                    {t.nav.myBuilds}
                  </Link>
                  <button onClick={() => { signOut(); setIsOpen(false); }} className="btn-outline-luxury text-xs">
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)} className="btn-luxury text-center text-xs">
                  {t.nav.login}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
