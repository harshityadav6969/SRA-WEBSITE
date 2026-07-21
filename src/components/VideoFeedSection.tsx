import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play, Pause, ShoppingBag, Eye, Sprout, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PRODUCTS } from '../data';
import { Product } from '../types';

interface VideoFeedSectionProps {
  currentLang: 'English' | 'Hindi' | 'Punjabi';
  onSelectProduct: (productId: string, cropType: string) => void;
}

interface VideoCardData {
  id: string;
  videoUrl: string;
  productId: string;
  titleEn: string;
  titleHi: string;
  titlePa: string;
  price: string;
  taglineEn: string;
  taglineHi: string;
  taglinePa: string;
}

const VIDEO_FEEDS: VideoCardData[] = [
  {
    id: 'vf-1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-farmer-hands-holding-fresh-soil-and-wheat-stalks-41804-large.mp4',
    productId: 'wheat-super-2967',
    titleEn: 'Super 2967 Wheat',
    titleHi: 'सुपर 2967 गेहूं',
    titlePa: 'ਸੁਪਰ 2967 ਕਣਕ',
    price: '₹1,420 / 40kg',
    taglineEn: 'Massive tillering & rust-resistance in action!',
    taglineHi: 'असाधारण फुटाव और पीला रतुआ मुक्त फसल!',
    taglinePa: 'ਸ਼ਾਨਦਾਰ ਫੁਟਾਰਾ ਅਤੇ ਪੀਲੀ ਕੁੰਗੀ ਤੋਂ ਪੂਰੀ ਸੁਰੱਖਿਆ!'
  },
  {
    id: 'vf-2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-corn-field-under-sunny-sky-34538-large.mp4',
    productId: 'sra-5144-plus',
    titleEn: 'SRA 5144 Plus Maize',
    titleHi: 'SRA 5144 प्लस मक्का',
    titlePa: 'SRA 5144 ਪਲੱਸ ਮੱਕੀ',
    price: '₹440 / 4kg',
    taglineEn: '100% complete cob tip-filling and heavy kernels.',
    taglineHi: 'भुट्टे के ऊपर तक पूरे दाने और भारी वजनदार पैदावार।',
    taglinePa: 'ਛੱਲੀ ਦੇ ਅਖੀਰ ਤੱਕ ਭਰੇ ਦਾਣੇ ਅਤੇ ਬੰਪਰ ਝਾੜ।'
  },
  {
    id: 'vf-3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rice-growing-in-fields-43196-large.mp4',
    productId: 'paddy-pusa-1847',
    titleEn: 'Pusa 1847 Paddy',
    titleHi: 'पूसा 1847 धान',
    titlePa: 'ਪੂਸਾ 1847 ਝੋਨਾ',
    price: '₹950 / 10kg',
    taglineEn: 'BLB-resistant legendary aromatic long basmati grains.',
    taglineHi: 'झुलसा रोग रोधी, लंबी खुशबूदार बासमती फसल।',
    taglinePa: 'ਝੁਲਸ ਰੋਗ ਪ੍ਰਤੀਰੋਧਕ, ਲੰਬੇ ਖੁਸ਼ਬੂਦਾਰ ਬਾਸਮਤੀ ਦਾਣੇ।'
  },
  {
    id: 'vf-4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mustard-seeds-in-agriculture-fields-43187-large.mp4',
    productId: 'mustard-sra-4646',
    titleEn: 'SRA 4646 Mustard',
    titleHi: 'SRA 4646 सरसों',
    titlePa: 'SRA 4646 ਸਰ੍ਹੋਂ',
    price: '₹390 / 1kg',
    taglineEn: 'Golden branching with 42% maximum oil recovery.',
    taglineHi: 'मजबूत शाखाएं और 42% तक अधिक तेल मात्रा।',
    taglinePa: 'ਜ਼ਿਆਦਾ ਟਾਹਣੀਆਂ ਅਤੇ 42% ਤੱਕ ਵੱਧ ਤੇਲ ਦੀ ਰਿਕਵਰੀ।'
  },
  {
    id: 'vf-5',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-grain-harvest-in-golden-sunset-34305-large.mp4',
    productId: 'millet-tiger-90',
    titleEn: 'Tiger 90 Pearl Millet',
    titleHi: 'टाइगर 90 बाजरा',
    titlePa: 'ਟਾਈਗਰ 90 ਬਾਜਰਾ',
    price: '₹210 / 1.5kg',
    taglineEn: 'Arid climate survivor: Long robust packed cobs.',
    taglineHi: 'सूखे को मात देने वाला: लंबे और ठोस दानों से भरे सिट्टे।',
    taglinePa: 'ਸੋਕੇ ਦਾ ਮੁਕਾਬਲਾ ਕਰਨ ਵਾਲਾ: ਲੰਬੇ ਅਤੇ ਠੋਸ ਦਾਲਾਂ ਭਰੇ ਸਿੱਟੇ।'
  }
];

export default function VideoFeedSection({ currentLang, onSelectProduct }: VideoFeedSectionProps) {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({
    'vf-1': true,
    'vf-2': true,
    'vf-3': true,
    'vf-4': true,
    'vf-5': true
  });
  
  // Quickview modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const t = {
    English: {
      sectionHeader: 'SRA SHRIJI FIELD DEMONSTRATIONS',
      sectionTitle: 'Live Harvest Video Feeds',
      subtitle: 'Watch our hybrid seeds growing in real Indian fields. Click any video to play/pause with sound controls.',
      viewInCatalog: 'Select & View Details',
      quickSpecs: 'Quick Agronomic Specs',
      yield: 'Expected Yield',
      duration: 'Crop Duration',
      resistance: 'Disease Immunity',
      btnQuickView: 'Quick View Specs',
      close: 'Close',
    },
    Hindi: {
      sectionHeader: 'स्रा श्रीजी खेतों से सीधा प्रदर्शन',
      sectionTitle: 'लाइव फसल वीडियो फीड',
      subtitle: 'वास्तविक भारतीय खेतों में हमारे हाइब्रिड बीजों की लाइव बढ़त देखें। आवाज के साथ प्ले/पॉज करने के लिए क्लिक करें।',
      viewInCatalog: 'कैटलॉग में देखें',
      quickSpecs: 'कृषि विज्ञान संबंधी जानकारी',
      yield: 'अनुमानित पैदावार',
      duration: 'फसल की अवधि',
      resistance: 'रोग प्रतिरोधक क्षमता',
      btnQuickView: 'त्वरित विवरण देखें',
      close: 'बंद करें',
    },
    Punjabi: {
      sectionHeader: 'ਸਰਾ ਸ਼੍ਰੀਜੀ ਖੇਤਾਂ ਤੋਂ ਸਿੱਧਾ ਪ੍ਰਦਰਸ਼ਨ',
      sectionTitle: 'ਲਾਈਵ ਫਸਲ ਵੀਡੀਓ ਫੀਡ',
      subtitle: 'ਭਾਰਤੀ ਖੇਤਾਂ ਵਿੱਚ ਸਾਡੇ ਹਾਈਬ੍ਰਿਡ ਬੀਜਾਂ ਦਾ ਲਾਈਵ ਵਾਧਾ ਦੇਖੋ। ਵੀਡੀਓ ਚਲਾਉਣ/ਰੋਕਣ ਲਈ ਕਲਿੱਕ ਕਰੋ।',
      viewInCatalog: 'ਕੈਟਾਲਾਗ ਵਿੱਚ ਦੇਖੋ',
      quickSpecs: 'ਖੇਤੀਬਾੜੀ ਸਬੰਧੀ ਵੇਰਵੇ',
      yield: 'ਅਨੁਮਾਨਿਤ ਝਾੜ',
      duration: 'ਫਸਲ ਦੀ ਮਿਆਦ',
      resistance: 'ਬਿਮਾਰੀ ਪ੍ਰਤੀ ਰੋਧਕਤਾ',
      btnQuickView: 'ਤੁਰੰਤ ਵੇਰਵੇ ਦੇਖੋ',
      close: 'ਬੰਦ ਕਰੋ',
    }
  }[currentLang];

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleVideoClick = (feedId: string) => {
    const video = videoRefs.current[feedId];
    if (!video) return;

    if (playingVideoId === feedId) {
      // Pause current
      video.pause();
      setPlayingVideoId(null);
    } else {
      // Pause any other video
      Object.keys(videoRefs.current).forEach((key) => {
        const otherVideo = videoRefs.current[key];
        if (otherVideo && key !== feedId) {
          otherVideo.pause();
        }
      });

      // Play this video
      video.play().catch((err) => console.log('Autoplay blocked:', err));
      setPlayingVideoId(feedId);
    }
  };

  const toggleMute = (e: React.MouseEvent, feedId: string) => {
    e.stopPropagation();
    const video = videoRefs.current[feedId];
    if (!video) return;

    video.muted = !video.muted;
    setMutedStates((prev) => ({
      ...prev,
      [feedId]: video.muted
    }));
  };

  const handleViewSpecs = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
    }
  };

  // Autoplay/Pause when slide enters viewport using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const feedId = entry.target.getAttribute('data-feed-id');
          if (!feedId) return;

          const video = videoRefs.current[feedId];
          if (!video) return;

          if (entry.isIntersecting) {
            // Auto play muted when scroll enters
            video.play().catch(() => {});
            setPlayingVideoId(feedId);
          } else {
            video.pause();
            if (playingVideoId === feedId) {
              setPlayingVideoId(null);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    const slides = document.querySelectorAll('.video-feed-slide');
    slides.forEach((slide) => observer.observe(slide));

    return () => {
      slides.forEach((slide) => observer.unobserve(slide));
    };
  }, [playingVideoId]);

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden border-b border-white/5" id="video-feed-section">
      {/* Background Ambience lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-amber/5 rounded-full filter blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="text-left space-y-4">
            <span className="text-xs tracking-widest font-black text-emerald-400 uppercase font-display block flex items-center gap-1.5">
              <Sprout className="h-4 w-4 text-brand-gold animate-bounce" />
              {t.sectionHeader}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-display">
              {t.sectionTitle}
            </h2>
            <div className="h-1 w-20 bg-brand-amber rounded-full" />
            <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-2xl">
              {t.subtitle}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleScroll('left')}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-brand-green hover:border-brand-green text-white transition-all shadow-sm flex items-center justify-center cursor-pointer"
              aria-label="Previous videos"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-brand-green hover:border-brand-green text-white transition-all shadow-sm flex items-center justify-center cursor-pointer"
              aria-label="Next videos"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Video Horizontal Scroller */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-8 px-2 scroll-smooth"
        >
          {VIDEO_FEEDS.map((feed) => {
            const isPlaying = playingVideoId === feed.id;
            const isMuted = mutedStates[feed.id];
            const title = currentLang === 'Hindi' ? feed.titleHi : currentLang === 'Punjabi' ? feed.titlePa : feed.titleEn;
            const tagline = currentLang === 'Hindi' ? feed.taglineHi : currentLang === 'Punjabi' ? feed.taglinePa : feed.taglineEn;
            
            // Get product from data
            const matchedProduct = PRODUCTS.find((p) => p.id === feed.productId);

            return (
              <div
                key={feed.id}
                data-feed-id={feed.id}
                className="video-feed-slide flex-shrink-0 w-[280px] sm:w-[320px] snap-start flex flex-col group relative"
              >
                {/* 9:16 Video Container Card */}
                <div 
                  onClick={() => handleVideoClick(feed.id)}
                  className="relative aspect-[9/16] w-full rounded-3xl overflow-hidden bg-black shadow-[0_15px_30px_rgba(0,0,0,0.4)] cursor-pointer group-hover:shadow-brand-green/15 border border-white/10 transition-all duration-300"
                >
                  {/* HTML5 video element */}
                  <video
                    ref={(el) => { videoRefs.current[feed.id] = el; }}
                    src={feed.videoUrl}
                    className="w-full h-full object-cover block"
                    loop
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                  />

                  {/* Play/Pause Center Overlay */}
                  <div className={`absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity duration-300 ${
                    isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                  }`}>
                    <div className="w-16 h-16 rounded-full bg-white/95 text-brand-dark flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                      {isPlaying ? (
                        <Pause className="h-6 w-6 fill-brand-dark text-brand-dark" />
                      ) : (
                        <Play className="h-6 w-6 fill-brand-dark text-brand-dark translate-x-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Top Header overlay for variety name */}
                  <div className="absolute top-0 inset-x-0 p-5 bg-gradient-to-b from-black/80 via-black/30 to-transparent text-left">
                    <span className="text-[10px] tracking-widest font-extrabold text-emerald-400 uppercase font-display block">
                      Field Trial
                    </span>
                    <h3 className="text-lg font-black text-white font-display tracking-tight mt-0.5 drop-shadow-sm">
                      {title}
                    </h3>
                    <p className="text-[11px] text-gray-300 font-medium leading-relaxed mt-1 line-clamp-2">
                      {tagline}
                    </p>
                  </div>

                  {/* Bottom Controls overlay for volume toggle & quick view specs */}
                  <div className="absolute bottom-5 inset-x-5 flex justify-between items-center z-20">
                    <button
                      onClick={(e) => handleViewSpecs(feed.productId, e)}
                      className="bg-brand-dark/80 backdrop-blur-md hover:bg-brand-green/90 text-white font-bold px-3 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t.btnQuickView}
                    </button>

                    <button
                      onClick={(e) => toggleMute(e, feed.id)}
                      className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Toggle mute"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4 animate-bounce" />
                      )}
                    </button>
                  </div>
                </div>

                {/* connected product catalogue row below - clickable to set filter & scroll */}
                {matchedProduct && (
                  <div
                    onClick={() => onSelectProduct(matchedProduct.id, matchedProduct.cropType)}
                    className="mt-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3.5 transition-all text-left cursor-pointer group/card"
                  >
                    {/* Product round visual */}
                    <img
                      src={matchedProduct.image}
                      alt={matchedProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-xl border border-white/10 flex-shrink-0 group-hover/card:scale-105 transition-transform"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-white truncate leading-tight group-hover/card:text-emerald-400 transition-colors">
                        SRA {matchedProduct.name}
                      </h4>
                      <p className="text-[10px] text-emerald-400 font-bold mt-0.5">
                        {matchedProduct.cropType} Seed
                      </p>
                      {/* <p className="text-[11px] font-black text-brand-gold mt-1">
                        {feed.price}
                      </p> */}
                    </div>

                    {/* Right action button */}
                    <span className="w-8 h-8 rounded-xl bg-brand-green group-hover/card:bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 transition-colors">
                      <ArrowRight className="h-4 w-4 group-hover/card:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Quick View Spec sheet Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full text-left relative overflow-hidden shadow-2xl border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-brand-green" />
                  <h3 className="text-lg font-black text-gray-900 font-display">
                    {t.quickSpecs}
                  </h3>
                </div>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="px-3.5 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all cursor-pointer"
                >
                  {t.close}
                </button>
              </div>

              {/* Product Info Summary */}
              <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-2xl">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-xl border border-gray-200 bg-white"
                />
                <div>
                  <h4 className="text-base font-black text-brand-dark">
                    SRA {quickViewProduct.name} ({quickViewProduct.cropType})
                  </h4>
                  <p className="text-xs text-brand-green font-bold mt-0.5">
                    {quickViewProduct.tagline}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100 text-left">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    {t.yield}
                  </span>
                  <span className="text-xs font-black text-brand-green mt-1 block">
                    {quickViewProduct.expectedYield}
                  </span>
                </div>

                <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100 text-left">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    {t.duration}
                  </span>
                  <span className="text-xs font-black text-brand-amber mt-1 block">
                    {quickViewProduct.growthDuration}
                  </span>
                </div>

                <div className="col-span-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-left">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    {t.resistance}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {quickViewProduct.diseaseResistance.map((disease) => (
                      <span key={disease} className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-brand-green" /> {disease}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Full Catalog details CTA */}
              <button
                onClick={() => {
                  onSelectProduct(quickViewProduct.id, quickViewProduct.cropType);
                  setQuickViewProduct(null);
                }}
                className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                {t.viewInCatalog}
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
