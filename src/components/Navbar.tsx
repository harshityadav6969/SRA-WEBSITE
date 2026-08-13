import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Globe, Search, User, Menu, X, ArrowRight, ShieldCheck, ChevronDown, Compass, FileText, Sparkles, Gift } from 'lucide-react';

interface NavbarProps {
  currentLang: 'English' | 'Hindi' | 'Punjabi';
  setLang: (lang: 'English' | 'Hindi' | 'Punjabi') => void;
  onNavigate: (sectionId: string) => void;
  onOpenPortalModal: () => void;
  onOpenRewardsModal?: () => void;
}

export default function Navbar({ currentLang, setLang, onNavigate, onOpenPortalModal, onOpenRewardsModal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<'products' | 'ai' | 'tools' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = {
    English: {
      brand: 'SRA SHRIJI',
      subtitle: 'AGRI GENETICS SEEDS',
      navHome: 'Home',
      navProducts: 'Premium Products',
      navAI: 'AI Farm Suite',
      navCalculators: 'Crop Tools',
      navDealer: 'Dealer Center',
      navResearch: 'R&D Innovation',
      loginBtn: 'Dealer Login',
      searchPlh: 'Search premium hybrids...',
    },
    Hindi: {
      brand: 'स्रा श्रीजी',
      subtitle: 'एग्री जेनेटिक्स सीड्स',
      navHome: 'होम',
      navProducts: 'मुख्य उत्पाद',
      navAI: 'एआई फार्म सुइट',
      navCalculators: 'कृषि साधन',
      navDealer: 'डीलर सेंटर',
      navResearch: 'शोध एवं विकास',
      loginBtn: 'डीलर लॉगिन',
      searchPlh: 'बीज खोजें...',
    },
    Punjabi: {
      brand: 'ਸਰਾ ਸ਼੍ਰੀਜੀ',
      subtitle: 'ਐਗਰੀ ਜੈਨੇਟਿਕਸ ਸੀਡਜ਼',
      navHome: 'ਮੁੱਖ ਪੰਨਾ',
      navProducts: 'ਮੁੱਖ ਉਤਪਾਦ',
      navAI: 'ਏਆਈ ਫਾਰਮ ਸੁਇਟ',
      navCalculators: 'ਖੇਤੀਬਾੜੀ ਟੂਲ',
      navDealer: 'ਡੀਲਰ ਕੇਂਦਰ',
      navResearch: 'ਖੋਜ ਅਤੇ ਵਿਕਾਸ',
      loginBtn: 'ਡੀਲਰ ਲੌਗਇਨ',
      searchPlh: 'ਬੀਜ ਖੋਜੋ...',
    }
  }[currentLang];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setMegaMenuOpen(null);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500 p-3 md:p-4"
        id="app-header"
      >
        <div
          className="mx-auto max-w-7xl transition-all duration-500 rounded-2xl glass shadow-[0_10px_30px_rgba(13,92,52,0.08)] py-3 px-6 flex items-center justify-between border border-white/50"
          id="glass-navbar"
        >
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('hero')}
            className="flex cursor-pointer items-center space-x-3"
            id="nav-brand-logo"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-150 flex-shrink-0">
              <img
                src="https://i.ibb.co/4wRykN47/IMG-20260720-031401-157.jpg"
                alt="Sra Shriji Logo"
                referrerPolicy="no-referrer"
                className="h-14 w-14 object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span 
                className="text-xl font-extrabold tracking-tight text-red-600 flex items-center gap-1 leading-none"
                style={{ fontFamily: "'Times New Roman', Times, Baskerville, Georgia, serif" }}
              >
                {t.brand}
              </span>
              <p className="text-[9px] uppercase tracking-[0.12em] text-red-500 font-black mt-1 leading-none">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" id="desktop-nav">
            <button
              onClick={() => handleNav('hero')}
              className="px-3.5 py-2 text-left hover:bg-gray-50 rounded-xl transition-all group flex flex-col justify-center cursor-pointer"
              id="nav-link-home"
            >
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500 group-hover:text-brand-green transition-colors leading-none">
                {t.navHome}
              </span>
              <span className="text-[9px] font-semibold text-gray-400 mt-1 leading-none group-hover:text-brand-green/70">
                Main Portal
              </span>
            </button>

            {/* Products Mega Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen('products')}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button
                onClick={() => handleNav('products')}
                className="px-3.5 py-2 text-left hover:bg-gray-50 rounded-xl transition-all group flex flex-col justify-center cursor-pointer"
                id="nav-link-products"
              >
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500 group-hover:text-brand-green transition-colors flex items-center gap-1 leading-none">
                  {t.navProducts} <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-brand-green transition-colors" />
                </span>
                <span className="text-[9px] font-semibold text-gray-400 mt-1 leading-none group-hover:text-brand-green/70">
                  Certified Seeds
                </span>
              </button>
              <AnimatePresence>
                {megaMenuOpen === 'products' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-80 glass p-5 rounded-2xl shadow-xl mt-1 grid grid-cols-1 gap-3"
                  >
                    <h3 className="text-[10px] uppercase tracking-wider text-brand-green font-black mb-1">
                      Explore Premium Seeds
                    </h3>
                    <div
                      onClick={() => handleNav('products')}
                      className="p-2.5 rounded-xl hover:bg-brand-green/5 transition-all cursor-pointer"
                    >
                      <h4 className="text-xs font-bold text-gray-900">SRA 9048 Maize</h4>
                      <p className="text-[11px] text-gray-500">Elite high-yielding orange-yellow hybrid corn</p>
                    </div>
                    <div
                      onClick={() => handleNav('products')}
                      className="p-2.5 rounded-xl hover:bg-brand-green/5 transition-all cursor-pointer"
                    >
                      <h4 className="text-xs font-bold text-gray-900">Super 2967 Wheat</h4>
                      <p className="text-[11px] text-gray-500">Yellow rust resistant high-tillering variety</p>
                    </div>
                    <div
                      onClick={() => handleNav('products')}
                      className="p-2.5 rounded-xl hover:bg-brand-green/5 transition-all cursor-pointer"
                    >
                      <h4 className="text-xs font-bold text-gray-900">Pusa 1847 Paddy</h4>
                      <p className="text-[11px] text-gray-500">Aromatic leaf blight proof basmati</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Mega Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen('ai')}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button
                onClick={() => handleNav('ai-suite')}
                className="px-3.5 py-2 text-left bg-red-50/40 hover:bg-red-50/70 border border-red-200/50 rounded-xl transition-all group flex flex-col justify-center cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.05)] hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                id="nav-link-ai"
              >
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-red-600 flex items-center gap-1.5 leading-none">
                  <Sparkles className="h-3.5 w-3.5 text-red-500 animate-pulse fill-red-400" /> {t.navAI} <ChevronDown className="h-3 w-3 text-red-500" />
                </span>
                <span className="text-[9px] font-black text-red-500 mt-1 leading-none">
                  Smart Diagnostics
                </span>
              </button>
              <AnimatePresence>
                {megaMenuOpen === 'ai' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-96 glass p-5 rounded-2xl shadow-xl mt-1 grid grid-cols-1 gap-3"
                  >
                    <h3 className="text-[10px] uppercase tracking-wider text-red-600 font-black mb-1 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-red-500 animate-spin" /> AI Precision Tools
                    </h3>
                    <div
                      onClick={() => handleNav('ai-advisor')}
                      className="p-2.5 rounded-xl hover:bg-brand-gold/5 transition-all cursor-pointer"
                    >
                      <h4 className="text-xs font-bold text-gray-900">AI Crop Advisor Chat</h4>
                      <p className="text-[11px] text-gray-500">Ask any farming questions & get solutions</p>
                    </div>
                    <div
                      onClick={() => handleNav('ai-disease')}
                      className="p-2.5 rounded-xl hover:bg-brand-gold/5 transition-all cursor-pointer"
                    >
                      <h4 className="text-xs font-bold text-gray-900">AI Leaf Disease Detector</h4>
                      <p className="text-[11px] text-gray-500">Upload crop image to diagnose disease</p>
                    </div>
                    <div
                      onClick={() => handleNav('ai-ugc')}
                      className="p-2.5 rounded-xl hover:bg-brand-gold/5 transition-all cursor-pointer"
                    >
                      <h4 className="text-xs font-bold text-gray-900">AI Social Poster Generator</h4>
                      <p className="text-[11px] text-gray-500">Instantly generate WhatsApp Statuses</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleNav('calculators')}
              className="px-3.5 py-2 text-left hover:bg-gray-50 rounded-xl transition-all group flex flex-col justify-center cursor-pointer"
              id="nav-link-calc"
            >
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500 group-hover:text-brand-green transition-colors leading-none">
                {t.navCalculators}
              </span>
              <span className="text-[9px] font-semibold text-gray-400 mt-1 leading-none group-hover:text-brand-green/70">
                Sowing Estimators
              </span>
            </button>
            <button
              onClick={() => handleNav('map-section')}
              className="px-3.5 py-2 text-left hover:bg-gray-50 rounded-xl transition-all group flex flex-col justify-center cursor-pointer"
              id="nav-link-map"
            >
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500 group-hover:text-brand-green transition-colors leading-none">
                Dealer Map
              </span>
              <span className="text-[9px] font-semibold text-gray-400 mt-1 leading-none group-hover:text-brand-green/70">
                Find Nearest Store
              </span>
            </button>
            <button
              onClick={() => handleNav('research')}
              className="px-3.5 py-2 text-left hover:bg-gray-50 rounded-xl transition-all group flex flex-col justify-center cursor-pointer"
              id="nav-link-research"
            >
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500 group-hover:text-brand-green transition-colors leading-none">
                {t.navResearch}
              </span>
              <span className="text-[9px] font-semibold text-gray-400 mt-1 leading-none group-hover:text-brand-green/70">
                Lab Innovations
              </span>
            </button>
          </nav>

          {/* Secondary Actions */}
          <div className="hidden lg:flex items-center space-x-3" id="desktop-nav-actions">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-brand-green px-3 py-1.5 rounded-lg border border-gray-200"
                id="lang-selector-btn"
              >
                <Globe className="h-4 w-4" />
                {currentLang}
                <ChevronDown className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-full mt-1.5 w-32 glass rounded-xl shadow-lg p-1.5 z-50 flex flex-col gap-1"
                  >
                    {(['English', 'Hindi', 'Punjabi'] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLang(l);
                          setLangDropdownOpen(false);
                        }}
                        className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                          currentLang === l
                            ? 'bg-brand-green text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rewards Portal Action */}
            {onOpenRewardsModal && (
              <button
                onClick={onOpenRewardsModal}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-[0_4px_12px_rgba(245,158,11,0.25)] border border-amber-300/40 cursor-pointer"
                id="header-rewards-btn"
              >
                <Gift className="h-4 w-4 text-gray-950 animate-bounce" />
                <span>Rewards Portal</span>
              </button>
            )}

            {/* Dealer Login Action */}
            <button
              onClick={onOpenPortalModal}
              className="flex items-center gap-1.5 bg-brand-green hover:bg-brand-green/90 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-[0_4px_12px_rgba(13,92,52,0.15)] cursor-pointer"
              id="header-dealer-login-btn"
            >
              <User className="h-4 w-4" />
              {t.loginBtn}
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex items-center space-x-2 lg:hidden" id="mobile-nav-toggle">
            <a
              href="https://wa.me/919866329911"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center bg-emerald-50/30 shadow-sm"
              title="Chat on WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12.012 2c-5.506 0-9.988 4.47-9.988 9.952 0 1.764.46 3.48 1.334 4.988L2 22l5.24-1.37c1.45.79 3.09 1.21 4.77 1.21 5.51 0 9.99-4.47 9.99-9.95C22 6.47 17.52 2 12.01 2zm0 1.64c4.61 0 8.35 3.73 8.35 8.31 0 4.59-3.74 8.32-8.35 8.32-1.49 0-2.95-.4-4.23-1.15l-.3-.18-3.13.82.84-3.05-.2-.32c-.82-1.3-1.25-2.81-1.25-4.36.01-4.58 3.75-8.31 8.36-8.31s.01 0 0 0zm-3.66 4.75c-.17 0-.45.06-.69.32-.24.25-.92.9-.92 2.19s.94 2.53 1.07 2.71c.13.18 1.84 2.81 4.46 3.94.62.27 1.11.43 1.49.55.63.2 1.2.17 1.65.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.07-.11-.25-.17-.52-.31-.27-.13-1.59-.78-1.84-.87-.24-.09-.42-.13-.6.13-.17.26-.68.87-.84 1.05-.15.17-.31.2-.58.06-.27-.13-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.85-.16-.27-.02-.41.12-.55.12-.12.27-.31.41-.47.13-.15.18-.26.27-.44.09-.18.04-.33-.02-.47-.07-.13-.6-1.44-.82-1.98-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01z"/>
              </svg>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-brand-green border border-gray-200 rounded-lg flex items-center justify-center"
              id="mobile-hamburger-btn"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-50 bg-brand-light flex flex-col p-6 lg:hidden overflow-y-auto"
            id="mobile-drawer-menu"
          >
            {/* Drawer Header with Close button */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-150 flex-shrink-0">
                  <img
                    src="https://i.ibb.co/4wRykN47/IMG-20260720-031401-157.jpg"
                    alt="Sra Shriji Logo"
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-md font-black text-red-600 tracking-tight leading-none" style={{ fontFamily: "'Times New Roman', Times, Baskerville, Georgia, serif" }}>
                    SRA SHRIJI
                  </span>
                  <span className="text-[8px] uppercase tracking-widest font-black text-red-500 mt-1 leading-none">
                    AGRI GENETICS SEEDS
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-sm"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 font-bold" />
              </button>
            </div>

            {/* Quick Language Toggle */}
            <div className="mb-8 border-b border-gray-100 pb-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Select Language</p>
              <div className="flex gap-2">
                {(['English', 'Hindi', 'Punjabi'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${
                      currentLang === l
                        ? 'bg-brand-green text-white border-brand-green'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-4 mb-8 text-lg font-bold text-gray-800">
              <button onClick={() => handleNav('hero')} className="text-left py-2 hover:text-brand-green border-b border-gray-50">
                {t.navHome}
              </button>
              <button onClick={() => handleNav('products')} className="text-left py-2 hover:text-brand-green border-b border-gray-50">
                {t.navProducts}
              </button>
              <button onClick={() => handleNav('ai-suite')} className="text-left py-2 text-red-600 hover:text-red-700 border-b border-gray-50 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-red-500 fill-red-400 animate-pulse" /> {t.navAI} <span className="bg-red-600 text-white font-mono text-[8px] px-1.5 py-0.5 rounded uppercase font-extrabold tracking-widest animate-pulse">New</span>
              </button>
              <button onClick={() => handleNav('calculators')} className="text-left py-2 hover:text-brand-green border-b border-gray-50">
                {t.navCalculators}
              </button>
              <button onClick={() => handleNav('map-section')} className="text-left py-2 hover:text-brand-green border-b border-gray-50">
                Dealer Locator
              </button>
              <button onClick={() => handleNav('research')} className="text-left py-2 hover:text-brand-green border-b border-gray-50">
                {t.navResearch}
              </button>
            </div>

            {onOpenRewardsModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRewardsModal();
                }}
                className="w-full py-3 mb-3 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-black text-sm rounded-xl flex items-center justify-center space-x-2 shadow cursor-pointer"
              >
                <Gift className="h-5 w-5 text-gray-950" />
                <span>🎁 Redeem Coupon Rewards</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortalModal();
              }}
              className="w-full flex items-center justify-center gap-2 bg-brand-green text-white font-bold py-3.5 rounded-xl text-md shadow-lg shadow-brand-green/20"
            >
              <User className="h-5 w-5" />
              {t.loginBtn}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}