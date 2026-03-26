import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';

interface SavedBuild {
  id: string;
  modelName: string;
  exteriorName: string;
  interiorName: string;
  wheelsName: string;
  createdAt: string;
  model: string;
  exteriorColor: string;
  interiorColor: string;
  wheels: string;
}

const MyBuilds = () => {
  const { t } = useLang();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [builds, setBuilds] = useState<SavedBuild[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('hauswerk_builds') || '[]');
    setBuilds(stored);
  }, []);

  const deleteBuild = (id: string) => {
    const updated = builds.filter((b) => b.id !== id);
    setBuilds(updated);
    localStorage.setItem('hauswerk_builds', JSON.stringify(updated));
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="section-subheading mb-3">{t.builds.subtitle}</p>
            <h1 className="section-heading text-4xl">{t.builds.title}</h1>
          </motion.div>

          {builds.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground mb-6">{t.builds.empty}</p>
              <Link to="/configurator" className="btn-luxury">
                {t.builds.startBuilding}
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {builds.map((build, i) => (
                <motion.div
                  key={build.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border border-border p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <h3 className="font-display text-xl mb-1">{build.modelName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {build.exteriorName} · {build.interiorName} · {build.wheelsName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(build.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/configurator?model=${build.model}&exterior=${build.exteriorColor}&interior=${build.interiorColor}&wheels=${build.wheels}`}
                      className="btn-outline-luxury text-xs py-2 px-4"
                    >
                      {t.builds.load}
                    </Link>
                    <button
                      onClick={() => deleteBuild(build.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBuilds;
