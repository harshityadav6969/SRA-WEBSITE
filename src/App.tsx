import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CropCategoriesSlider from './components/CropCategoriesSlider';
import ProductSection from './components/ProductSection';
import VideoFeedSection from './components/VideoFeedSection';
import MapSection from './components/MapSection';
import AdvisorSuite from './components/AdvisorSuite';
import FarmerCalculators from './components/FarmerCalculators';
import StorySections from './components/StorySections';
import FarmerReviews from './components/FarmerReviews';
import Portals from './components/Portals';
import AIAssistantWidget from './components/AIAssistantWidget';
import { Leaf, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { PRODUCTS } from './data';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<'English' | 'Hindi' | 'Punjabi'>('English');
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  
  // Lifted state for crop categories slider & video integration
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [activeProductId, setActiveProductId] = useState<string>(PRODUCTS[0].id);

  // Auto transition after loading screen completed
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-brand-light text-gray-900 font-sans antialiased selection:bg-brand-green/20 selection:text-brand-green selection:font-bold">
      <AnimatePresence mode="wait">
        {loading ? (
          <Loader onComplete={() => setLoading(false)} />
        ) : (
          <div className="relative">
            {/* Header Floating Navigation */}
            <Navbar
              currentLang={currentLang}
              setLang={setCurrentLang}
              onNavigate={(id) => {
                const element = document.getElementById(id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onOpenPortalModal={() => setIsPortalOpen(true)}
            />

            {/* Cinematic Narrative Hero Banner */}
            <Hero
              currentLang={currentLang}
              onExploreProducts={() => {
                const element = document.getElementById('products');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onBecomeDealer={() => {
                const element = document.getElementById('dealer-locator');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Custom Sliding Crop Categories Selection Portal */}
            <CropCategoriesSlider
              currentLang={currentLang}
              selectedCrop={selectedCrop}
              setSelectedCrop={setSelectedCrop}
            />

            {/* Premium Seed Catalog with 360 viewer, POP manuals, comparison matrix */}
            <ProductSection
              currentLang={currentLang}
              selectedCrop={selectedCrop}
              setSelectedCrop={setSelectedCrop}
              activeProductId={activeProductId}
              setActiveProductId={setActiveProductId}
            />

            {/* AI Advisor, Sickness Diagnosis and Marketing content generator */}
            <AdvisorSuite currentLang={currentLang} />

            {/* Custom Interactive Live Seed Crop Video Demonstration Feed */}
            <VideoFeedSection
              currentLang={currentLang}
              onSelectProduct={(productId, cropType) => {
                setSelectedCrop(cropType);
                setActiveProductId(productId);
                const element = document.getElementById('products');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            />

            {/* Interactive svg footprint state map and Seed Recommendation engine */}
            <MapSection currentLang={currentLang} />

            {/* Agronomic precision calculators: seed rate, fertilizers, yield profit planner */}
            <FarmerCalculators currentLang={currentLang} />

            {/* Top Farmer Reviews & Ratings */}
            <FarmerReviews currentLang={currentLang} />

            {/* Corporate background story, bento trust, testimonials, search dealers, contact forms */}
            <StorySections
              currentLang={currentLang}
              onOpenPortal={() => setIsPortalOpen(true)}
            />

            {/* Premium footer */}
            <footer className="bg-brand-dark text-white pt-20 pb-10 border-t border-white/5 text-left">
              <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
                
                {/* Brand description column */}
                <div className="md:col-span-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-emerald-400" />
                    <span className="text-lg font-black tracking-tight uppercase text-white font-display">
                      SRA SHRIJI AGRI GENETICS SEEDS PVT LTD
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                    Engineering certified high-yielding hybrid seeds. Empowering sustainable farming, disease-free crops, and prosperous harvest returns for Indian agricultural families.
                  </p>
                  <p className="text-[10px] text-brand-gold font-bold">
                    🎖 ISO 9001:2015 CERTIFIED SEED PRODUCTION HQ
                  </p>
                </div>

                {/* Quick Link column */}
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-emerald-400">Agricultural Links</h4>
                  <ul className="space-y-2 text-xs text-gray-400 font-semibold">
                    <li><a href="#ai-suite" className="hover:text-white transition-colors">AI Crop Advisor</a></li>
                    <li><a href="#products" className="hover:text-white transition-colors">Premium Catalog</a></li>
                    <li><a href="#map-section" className="hover:text-white transition-colors">Dealer Map</a></li>
                    <li><a href="#calculators" className="hover:text-white transition-colors">Farmer Calculators</a></li>
                  </ul>
                </div>

                {/* Company Link column */}
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-emerald-400">Corporate HQ</h4>
                  <ul className="space-y-2 text-xs text-gray-400 font-semibold">
                    <li><a href="#about" className="hover:text-white transition-colors">Who We Are</a></li>
                    <li><a href="#testimonials" className="hover:text-white transition-colors">Farmer Success</a></li>
                    <li><a href="#dealer-locator" className="hover:text-white transition-colors">Dealers Network</a></li>
                    <li><button onClick={() => setIsPortalOpen(true)} className="hover:text-white transition-colors text-left">Dealer Portals</button></li>
                  </ul>
                </div>

                {/* Address details column */}
                <div className="md:col-span-4 space-y-4">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-emerald-400">Headquarters Office</h4>
                  <div className="space-y-2.5 text-xs text-gray-400 font-semibold">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4.5 w-4.5 text-brand-gold flex-shrink-0" />
                      <span>Innov8 Pranava Business Park- 7th Floor, 17,20,21.22,24,25,50,51, SY. 29 To 33, KONDAPUR, KOTHAGUDA, Telangana - 500084</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4.5 w-4.5 text-emerald-400" />
                      <span>Advisory Helpline: +91 9866329911</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4.5 w-4.5 text-emerald-400" />
                      <span>srashrijiagrigeneticsseeds@gmail.com</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Legal Bottom line */}
              <div className="mx-auto max-w-7xl px-6 border-t border-white/5 mt-16 pt-8 flex flex-wrap justify-between items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <p>© 2026 SRA SHRIJI AGRI GENETICS SEEDS PVT LTD Private Limited. All Rights Reserved.</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-gray-300">Privacy Policy</a>
                  <a href="#" className="hover:text-gray-300">Seed Act Terms</a>
                  <a href="#" className="hover:text-gray-300">Farmer Disclaimers</a>
                </div>
              </div>
            </footer>

            {/* Overlaid Portals Dialog */}
            <Portals
              currentLang={currentLang}
              isOpen={isPortalOpen}
              onClose={() => setIsPortalOpen(false)}
            />

            {/* Floating AI Assistant Widget (aside in right down) */}
            <AIAssistantWidget currentLang={currentLang} />

          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
