import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sprout, ShieldCheck, Milestone, Sparkles, ChevronLeft, ChevronRight, Droplets, Wheat } from 'lucide-react';
import { PRODUCTS } from '../data';

interface HeroProps {
  onExploreProducts: () => void;
  onBecomeDealer: () => void;
  currentLang: 'English' | 'Hindi' | 'Punjabi';
}

export default function Hero({ onExploreProducts, onBecomeDealer, currentLang }: HeroProps) {
  const t = {
    English: {
      tagline: '🌱 GENETIC EXCELLENCE FOR SUSTAINABLE HARVESTS',
      titleLine1: "Engineering Tomorrow's",
      titleLine2: 'Harvest.',
      subtitle: 'Formulating elite hybrid seed genetics tailored to survive harsh climates, resist devastating diseases, and ensure high-germinating crop yields for India\'s progressive farmers.',
      ctaProducts: 'Explore Seeds',
      ctaDealer: 'Become Dealer',
      badgeTrust: '98% Germination Rate Guaranteed',
      badgeRAndD: 'ICAR Accredited Hybrids',
    },
    Hindi: {
      tagline: '🌱 टिकाऊ खेती के लिए उत्कृष्ट बीज अनुसंधान',
      titleLine1: 'कल की समृद्ध फसल का',
      titleLine2: 'निर्माण।',
      subtitle: 'विशेष रूप से विकसित हाइब्रिड बीज जो बदलते मौसम में खड़े रहें, हानिकारक रोगों से लड़ें, और भारतीय किसानों के लिए भरपूर उपज और ९८% अंकुरण की गारंटी दें।',
      ctaProducts: 'मुख्य बीज देखें',
      ctaDealer: 'डीलर बनें',
      badgeTrust: '98% अंकुरण की गारंटी',
      badgeRAndD: 'ICAR प्रमाणित हाइब्रिड',
    },
    Punjabi: {
      tagline: '🌱 ਟਿਕਾਊ ਖੇਤੀਬਾੜੀ ਲਈ ਉੱਤਮ ਬੀਜ ਅਨੁਸੰਧਾਨ',
      titleLine1: 'ਕੱਲ੍ਹ ਦੀ ਸੁਨਹਿਰੀ ਫਸਲ',
      titleLine2: 'ਦਾ ਨਿਰਮਾਣ।',
      subtitle: 'ਵਿਸ਼ੇਸ਼ ਤੌਰ ਤੇ ਵਿਕਸਤ ਹਾਈਬ੍ਰਿਡ ਬੀਜ ਜੋ ਮੌਸਮ ਦੇ ਥਪੇੜਿਆਂ ਨੂੰ ਸਹਿਣ, ਬਿਮਾਰੀਆਂ ਨਾਲ ਲੜਨ, ਅਤੇ ਕਿਸਾਨਾਂ ਲਈ ਬੰਪਰ ਝਾੜ ਅਤੇ 98% ਉਗਣ ਦੀ ਗਾਰੰਟੀ ਦੇਣ।',
      ctaProducts: 'ਬੀਜਾਂ ਦੀ ਖੋਜ ਕਰੋ',
      ctaDealer: 'ਡੀਲਰ ਬਣੋ',
      badgeTrust: '98% ਉਗਣ ਦੀ ਗਾਰੰਟੀ',
      badgeRAndD: 'ICAR ਪ੍ਰਮਾਣਿਤ ਹਾਈਬ੍ਰਿਡ',
    }
  }[currentLang];

  const sartajProduct = {
    id: 'sartaj-101',
    name: 'Hybrid Sartaj-101',
    cropType: 'Cotton',
    category: 'Bt Cotton Seeds',
    germinationRate: '99.8%',
    expectedYield: '+45% Average',
    tagline: 'Premium quality high-yielding cotton hybrid.',
    image: ''
  };

  const heroProducts = [sartajProduct, ...PRODUCTS];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % heroProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroProducts.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % heroProducts.length);
  };

  const currentProduct = heroProducts[currentIdx];

  const getCropIcon = (cropType: string) => {
    switch (cropType.toLowerCase()) {
      case 'wheat':
        return <Wheat className="h-10 w-10 text-white" />;
      case 'paddy':
        return <Droplets className="h-10 w-10 text-white" />;
      case 'cotton':
        return <Sparkles className="h-10 w-10 text-white" />;
      default:
        return <Sprout className="h-10 w-10 text-white" />;
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark pt-16" id="hero-section">
      {/* Background Cinematic Visual with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80"
          alt="Morning Sunrise Agriculture Fields"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 animate-pulse"
          style={{ animationDuration: '10s' }}
        />
        {/* Subtle Radial Gradient Overlay for cinematic feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/75 to-brand-green/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-24 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1.5 rounded-full"
            >
              <Sprout className="h-4 w-4 text-emerald-400" />
              <span className="text-[11px] font-bold tracking-widest text-emerald-300 uppercase font-display">
                {t.tagline}
              </span>
            </motion.div>

            {/* Main Premium Headline */}
            <h1 className="space-y-1 md:space-y-3">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="block font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
              >
                {t.titleLine1}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="block font-serif text-4xl sm:text-6xl font-normal italic text-brand-amber leading-none"
              >
                {t.titleLine2}
              </motion.span>
            </h1>

            {/* Description Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="max-w-xl text-md md:text-lg text-gray-300 font-medium leading-relaxed"
            >
              {t.subtitle}
            </motion.p>

            {/* Dual Actions CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={onExploreProducts}
                className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-brand-green hover:from-emerald-400 hover:to-brand-green text-white font-bold px-7 py-4 rounded-xl transition-all shadow-[0_8px_24px_rgba(13,92,52,0.3)] hover:-translate-y-0.5"
                id="hero-explore-btn"
              >
                {t.ctaProducts}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <button
                onClick={onBecomeDealer}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 px-7 py-4 rounded-xl font-bold transition-all backdrop-blur-md hover:-translate-y-0.5"
                id="hero-dealer-btn"
              >
                {t.ctaDealer}
              </button>
            </motion.div>

            {/* Quick trust bullet stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ delay: 1, duration: 1 }}
              className="pt-4 border-t border-white/10 flex flex-wrap gap-6 text-xs font-semibold text-gray-400"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {t.badgeTrust}
              </div>
              <div className="flex items-center gap-1.5">
                <Milestone className="h-4 w-4 text-brand-amber" />
                {t.badgeRAndD}
              </div>
            </motion.div>

          </div>

          {/* Floating UI visual container on the right */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
              className="relative w-full max-w-sm"
            >
              {/* Decorative behind glow */}
              <div className="absolute -inset-4 bg-brand-green/30 rounded-3xl blur-2xl opacity-40 animate-pulse" />
              
              {/* Premium Floating Seed Bag Design (3D aspect ratio illustration) */}
              <div className="relative glass-dark rounded-3xl p-6 shadow-2xl border border-white/10 overflow-hidden group w-full">
                <div className="absolute top-0 right-0 bg-brand-gold text-brand-dark font-display text-[9px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                  Premium Quality
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-amber to-amber-500 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-brand-dark" />
                  </div>
                  <div>
                    <h3 className="text-white text-xs font-bold uppercase tracking-wider">Sra Shriji Seeds</h3>
                    <p className="text-emerald-400 text-[10px] font-mono font-bold">GENETIC RESEARCH LABS</p>
                  </div>
                </div>

                {/* Floating Seed Icon Vector style with slider buttons */}
                <div className="h-80 w-full bg-brand-dark rounded-2xl flex items-center justify-center relative border border-white/5 mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-brand-dark" />
                  
                  {/* Manual Arrow Controls */}
                  <button 
                    onClick={handlePrev}
                    className="absolute left-2.5 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-md hover:scale-105 active:scale-95"
                    title="Previous Product"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button 
                    onClick={handleNext}
                    className="absolute right-2.5 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-md hover:scale-105 active:scale-95"
                    title="Next Product"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Indicator Dot Dots */}
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 max-w-[80%] overflow-x-auto scrollbar-none py-1 px-2 bg-black/40 rounded-full backdrop-blur-xs">
                    {heroProducts.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIdx(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all cursor-pointer flex-shrink-0 ${
                          idx === currentIdx ? 'w-3.5 bg-brand-gold' : 'w-1.5 bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Dynamic Product Item */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentProduct.id}
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="flex flex-col items-center z-10 w-full px-12 text-center h-full justify-center pt-2 pb-6"
                    >
                      {currentProduct.image ? (
                        <div className="h-44 w-full flex items-center justify-center mb-3">
                          <img 
                            src={currentProduct.image} 
                            alt={currentProduct.name} 
                            className="h-44 max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <motion.div
                          animate={{
                            y: [0, -6, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                          className="relative h-24 w-20 bg-gradient-to-t from-brand-green to-emerald-400 rounded-t-full rounded-b-[40%] flex items-center justify-center shadow-[0_12px_24px_rgba(13,92,52,0.35)] mb-4"
                        >
                          <div className="h-12 w-8 bg-brand-light/25 rounded-full blur-sm absolute top-4 left-4" />
                          {getCropIcon(currentProduct.cropType)}
                        </motion.div>
                      )}
                      
                      <span className="text-white text-base font-black tracking-wider block truncate max-w-full font-poppins">
                        {currentProduct.name}
                      </span>
                      <span className="text-brand-amber text-[10px] uppercase font-black tracking-widest mt-0.5 block truncate font-poppins">
                        {currentProduct.category}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Spec tags */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 overflow-hidden">
                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">Purity Ratio</p>
                    <p className="text-xs font-extrabold text-white truncate mt-0.5">
                      {currentProduct.germinationRate ? `${currentProduct.germinationRate} Guaranteed` : '99.8% Premium'}
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 overflow-hidden">
                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">Yield Potential</p>
                    <p className="text-xs font-extrabold text-emerald-400 truncate mt-0.5">
                      {currentProduct.expectedYield}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Elegant Bottom Wave/Curve separator */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-light to-transparent z-10" />
    </section>
  );
}
