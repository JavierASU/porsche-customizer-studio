import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLang();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast.success('Account created! Check your email to verify.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl mb-2">
              {isLogin ? t.auth.signIn : t.auth.signUp}
            </h1>
            <p className="text-muted-foreground text-sm">HAUSWERK</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">
                  {t.auth.fullName}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="w-full bg-secondary border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">
                {t.auth.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-secondary border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-muted-foreground block mb-2">
                {t.auth.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-secondary border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-luxury w-full text-center disabled:opacity-50"
            >
              {loading ? '...' : isLogin ? t.auth.signIn : t.auth.signUp}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            {isLogin ? t.auth.noAccount : t.auth.hasAccount}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gold hover:text-gold-light transition-colors"
            >
              {isLogin ? t.auth.signUp : t.auth.signIn}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
