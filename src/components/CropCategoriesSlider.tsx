import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Sprout } from 'lucide-react';

interface CropCategoriesSliderProps {
  currentLang: 'English' | 'Hindi' | 'Punjabi';
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
}

interface CropCategory {
  id: string;
  nameEn: string;
  nameHi: string;
  namePa: string;
  image: string;
}

const CROP_CATEGORIES: CropCategory[] = [
  {
    id: 'All',
    nameEn: 'All Crops',
    nameHi: 'सभी फसलें',
    namePa: 'ਸਾਰੀਆਂ ਫਸਲਾਂ',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'Maize',
    nameEn: 'Maize (Makka)',
    nameHi: 'मक्का (Makka)',
    namePa: 'ਮੱਕੀ (Makki)',
    image: 'https://cdn.phototourl.com/free/2026-07-19-4808ad06-8ec6-45a7-8f34-06bf030baa24.jpg',
  },
  {
    id: 'Paddy',
    nameEn: 'Paddy (Basmati)',
    nameHi: 'धान (Paddy)',
    namePa: 'ਝੋਨਾ (Paddy)',
    image: 'https://cdn.phototourl.com/free/2026-07-19-eb7e575b-26e4-44ec-82a6-8c4c18328af2.jpg',
  },
  {
    id: 'Wheat',
    nameEn: 'Wheat (Kanak)',
    nameHi: 'गेहूं (Kanak)',
    namePa: 'ਕਣਕ (Kanak)',
    image: 'https://cdn.phototourl.com/free/2026-07-19-75a3694b-5a92-4569-98ae-20aa55ba9444.jpg',
  },
  {
    id: 'Mustard',
    nameEn: 'Mustard (Sarson)',
    nameHi: 'सरसों (Sarson)',
    namePa: 'ਸਰ੍ਹੋਂ (Sarson)',
    image: 'https://cdn.phototourl.com/free/2026-07-19-524f78ec-7241-45ac-b26d-885def7b7439.jpg',
  },
  {
    id: 'Millet',
    nameEn: 'Pearl Millet (Bajra)',
    nameHi: 'बाजरा (Bajra)',
    namePa: 'ਬਾਜਰਾ (Bajra)',
    image: 'https://cdn.phototourl.com/free/2026-07-19-6e11769d-9e8c-424f-abd3-5abbf0960599.jpg',
  },
  {
    id: 'Moong',
    nameEn: 'Pulses (Moong/Urad)',
    nameHi: 'दालें (Moong/Urad)',
    namePa: 'ਦਾਲਾਂ (Moong/Urad)',
    image: 'https://cdn.phototourl.com/free/2026-07-19-6fb3ee56-1605-407f-82ee-48eae90f00fb.jpg',
  }
];

export default function CropCategoriesSlider({ currentLang, selectedCrop, setSelectedCrop }: CropCategoriesSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const t = {
    English: {
      sectionHeader: 'CHOOSE YOUR TARGETED HARVEST',
      sectionTitle: 'Shop by Category',
      hint: 'Click a crop group to instantly filter our premium seed catalog below.',
    },
    Hindi: {
      sectionHeader: 'अपनी लक्षित फसल चुनें',
      sectionTitle: 'श्रेणी के अनुसार खरीदारी करें',
      hint: 'नीचे हमारे मुख्य हाइब्रिड उत्पाद सूची को फ़िल्टर करने के लिए किसी फसल पर क्लिक करें।',
    },
    Punjabi: {
      sectionHeader: 'ਆਪਣੀ ਲੋੜੀਂਦੀ ਫਸਲ ਚੁਣੋ',
      sectionTitle: 'ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਖਰੀਦੋ',
      hint: 'ਹੇਠਾਂ ਸਾਡੇ ਮੁੱਖ ਹਾਈਬ੍ਰਿਡ ਬੀਜਾਂ ਦੀ ਸੂਚੀ ਨੂੰ ਫਿਲਟਰ ਕਰਨ ਲਈ ਕਿਸੇ ਫਸਲ ਤੇ ਕਲਿੱਕ ਕਰੋ।',
    }
  }[currentLang];

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (cropId: string) => {
    setSelectedCrop(cropId);
    // Smooth scroll down to the products section
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-12 bg-gray-50 border-b border-gray-100 relative" id="crop-categories">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center justify-center mb-10 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] tracking-widest font-black text-brand-green uppercase font-poppins flex items-center gap-1.5 justify-center">
              <Sprout className="h-3.5 w-3.5 text-brand-gold animate-pulse" />
              {t.sectionHeader}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 font-poppins">
              {t.sectionTitle}
            </h2>
            <div className="h-1 w-16 bg-brand-gold mx-auto rounded-full mt-2" />
            <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xl mx-auto">
              {t.hint}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => handleScroll('left')}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-brand-green hover:text-white hover:border-brand-green transition-all shadow-sm flex items-center justify-center text-gray-600 cursor-pointer"
              aria-label="Previous crops"
              id="category-prev-btn"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-brand-green hover:text-white hover:border-brand-green transition-all shadow-sm flex items-center justify-center text-gray-600 cursor-pointer"
              aria-label="Next crops"
              id="category-next-btn"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories Sliding Tray */}
        <div 
          ref={sliderRef}
          className="flex items-start gap-6 md:gap-8 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 px-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {CROP_CATEGORIES.map((category) => {
            const isSelected = selectedCrop.toLowerCase() === category.id.toLowerCase();
            const label = currentLang === 'Hindi' ? category.nameHi : currentLang === 'Punjabi' ? category.namePa : category.nameEn;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="flex flex-col items-center space-y-3.5 focus:outline-none flex-shrink-0 snap-start text-center cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                id={`crop-cat-${category.id}`}
              >
                {/* Circular image with gold glowing ring on selection */}
                <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-3 transition-all duration-300 ${
                  isSelected 
                    ? 'border-brand-gold shadow-[0_0_15px_rgba(235,166,42,0.4)] scale-105' 
                    : 'border-white group-hover:border-brand-green/30 shadow-sm'
                }`}>
                  <img
                    src={category.image}
                    alt={label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Subtle inner shadow / tint */}
                  <div className={`absolute inset-0 transition-all ${
                    isSelected ? 'bg-black/10' : 'bg-black/5 group-hover:bg-black/0'
                  }`} />
                </div>

                {/* Crop Name */}
                <span className={`text-xs md:text-sm font-bold tracking-tight transition-colors ${
                  isSelected 
                    ? 'text-brand-green font-extrabold border-b-2 border-brand-gold pb-0.5' 
                    : 'text-gray-700 group-hover:text-brand-green'
                }`}>
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
