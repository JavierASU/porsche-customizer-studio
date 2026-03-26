import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ModelsSection from '@/components/ModelsSection';
import CraftSection from '@/components/CraftSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ModelsSection />
      <CraftSection />
      <Footer />
    </div>
  );
};

export default Index;
