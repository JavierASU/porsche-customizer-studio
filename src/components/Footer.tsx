import { useLang } from '@/lib/i18n';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { lang, t } = useLang();

  return (
    <footer id="contact" className="py-20 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="font-display text-3xl tracking-wider mb-4">
              HAUS<span className="text-gradient-gold">WERK</span>
            </h3>
            <p className="text-muted-foreground font-light leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gold mb-6">{t.footer.navigation}</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.home}</Link></li>
              <li><Link to="/#models" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.models}</Link></li>
              <li><Link to="/configurator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.configurator}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gold mb-6">{t.footer.contact}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>info@hauswerk.com</li>
              <li>+1 (555) 911-0911</li>
              <li>Stuttgart, Germany</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} HAUSWERK. {t.footer.rights}</p>
          <div className="flex gap-6">
            {['Instagram', 'YouTube', 'LinkedIn'].map((social) => (
              <a key={social} href="#" className="text-xs text-muted-foreground hover:text-gold transition-colors tracking-wider uppercase">{social}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
