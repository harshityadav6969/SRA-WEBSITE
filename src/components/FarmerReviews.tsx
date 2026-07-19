import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle, Search, SlidersHorizontal, MessageSquare, Plus, X, Sprout, ArrowUpDown } from 'lucide-react';
import { PRODUCTS } from '../data';

interface FarmerReviewsProps {
  currentLang: 'English' | 'Hindi' | 'Punjabi';
}

interface Review {
  id: string;
  farmerName: string;
  location: string;
  cropType: string;
  seedVariety: string;
  yieldInfo: string;
  rating: number;
  reviewText: string;
  date: string;
  isVerified: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    farmerName: 'Suresh Yadav',
    location: 'Karnal, Haryana',
    cropType: 'Maize',
    seedVariety: 'SRA 9048',
    yieldInfo: '38 Quintals/Acre',
    rating: 5,
    reviewText: 'SRA 9048 hybrid gave complete tip filling and heavy kernels. Sowing this maize hybrid boosted my profits by 30% compared to ordinary brands. The stay-green plant character was also excellent for silage fodder after harvesting cobs.',
    date: '3 days ago',
    isVerified: true,
  },
  {
    id: 'rev-2',
    farmerName: 'Sardara Singh',
    location: 'Amritsar, Punjab',
    cropType: 'Wheat',
    seedVariety: 'Super 2967',
    yieldInfo: '26 Quintals/Acre',
    rating: 5,
    reviewText: 'No Yellow Rust disease seen in Super 2967 this season. Extremely high tillering and heavy grains. Highly recommended for Punjab farmers who want maximum crop safety and heavy market weight.',
    date: '1 week ago',
    isVerified: true,
  },
  {
    id: 'rev-3',
    farmerName: 'Ram Avtar',
    location: 'Alwar, Rajasthan',
    cropType: 'Mustard',
    seedVariety: 'SRA 4646',
    yieldInfo: '12 Quintals/Acre',
    rating: 5,
    reviewText: 'SRA 4646 Mustard had extreme resistance to cold frost. Oil recovery was 42% in the local Krishi Mandi, fetching premium prices. Sra Shriji seed genetics are unmatched in terms of frost tolerance.',
    date: '2 weeks ago',
    isVerified: true,
  },
  {
    id: 'rev-4',
    farmerName: 'Gurmeet Dhillon',
    location: 'Bathinda, Punjab',
    cropType: 'Paddy',
    seedVariety: 'Pusa 1509',
    yieldInfo: '31 Quintals/Acre',
    rating: 5,
    reviewText: 'Pusa 1509 Premium Paddy Seeds produced superb long aromatic grains. Got a bumper harvest of 31 Quintals per acre with minimal lodging. Our local dealer provided great support. Highest price rate achieved at mandi!',
    date: '3 weeks ago',
    isVerified: true,
  },
  {
    id: 'rev-5',
    farmerName: 'Rajesh Patel',
    location: 'Indore, Madhya Pradesh',
    cropType: 'Bajra',
    seedVariety: 'Tiger 90',
    yieldInfo: '18 Quintals/Acre',
    rating: 4,
    reviewText: 'Tiger 90 Hybrid Bajra seeds are highly drought-tolerant. The massive earheads had completely uniform grain setting from base to top. It grew very well in sandy soils with less irrigation.',
    date: '1 month ago',
    isVerified: true,
  }
];

export default function FarmerReviews({ currentLang }: FarmerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'verified'>('recent');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCrop, setFormCrop] = useState('Paddy');
  const [formVariety, setFormVariety] = useState('');
  const [formYield, setFormYield] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formText, setFormText] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Load reviews from initial list + localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sra_shriji_farmer_reviews');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReviews([...parsed, ...INITIAL_REVIEWS]);
      } catch (e) {
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
    }
  }, []);

  const t = {
    English: {
      sectionHeader: 'TESTED BY THE SOIL, TRUSTED BY THE LAND',
      sectionTitle: 'Top Farmer Reviews & Ratings',
      writeReviewBtn: 'Share Your Harvest Experience',
      overallRating: 'Overall Rating',
      basedOn: 'based on verified feedback',
      searchPlaceholder: 'Search reviews, crops or villages...',
      allCrops: 'All Crops',
      filterTitle: 'Filter by Crop',
      sortByLabel: 'Sort By',
      sortRecent: 'Most Recent',
      sortHighest: 'Highest Rating',
      sortVerified: 'Verified Sra Shriji Farmers',
      formTitle: 'Submit Your Harvest Success Story',
      formNameLabel: 'Farmer Full Name',
      formLocationLabel: 'Village, State',
      formCropLabel: 'Select Crop Category',
      formVarietyLabel: 'Seed Variety Name (e.g. Suveer, Pusa 1509)',
      formYieldLabel: 'Harvest Yield (e.g. 32 Quintals/Acre)',
      formRatingLabel: 'Rate Your Experience',
      formTextLabel: 'Write your detailed review (growth, crop shine, disease resistance, etc.)',
      submitBtn: 'Submit Verified Review',
      successMessage: 'Thank you! Your verified harvest review has been submitted successfully and added to the top reviews.',
      emptyResults: 'No farmer reviews found matching your selected filters.',
      yieldLabel: 'Yield Output:',
      verifiedFarmer: 'Verified Sra Shriji Farmer',
      requiredError: 'Please fill out all fields to submit your review.',
    },
    Hindi: {
      sectionHeader: 'मिट्टी द्वारा परीक्षित, धरती का अटूट विश्वास',
      sectionTitle: 'शीर्ष किसान समीक्षाएं और रेटिंग',
      writeReviewBtn: 'अपने फसल उत्पादन का अनुभव साझा करें',
      overallRating: 'औसत रेटिंग',
      basedOn: 'सत्यापित किसानों के फीडबैक पर आधारित',
      searchPlaceholder: 'समीक्षाएं, फसल या गांव खोजें...',
      allCrops: 'सभी फसलें',
      filterTitle: 'फसल श्रेणी',
      sortByLabel: 'क्रमबद्ध करें',
      sortRecent: 'नवीनतम समीक्षाएं',
      sortHighest: 'उच्चतम रेटिंग',
      sortVerified: 'सत्यापित स्रा श्रीजी किसान',
      formTitle: 'अपनी समृद्ध फसल की कहानी दर्ज करें',
      formNameLabel: 'किसान का पूरा नाम',
      formLocationLabel: 'ग्राम, राज्य',
      formCropLabel: 'फसल की श्रेणी चुनें',
      formVarietyLabel: 'बीज की विविधता का नाम (जैसे सुवीर, पूसा 1509)',
      formYieldLabel: 'फसल पैदावार (जैसे 32 क्विंटल/एकड़)',
      formRatingLabel: 'अपना रेटिंग स्कोर चुनें',
      formTextLabel: 'विस्तृत समीक्षा लिखें (फसल वृद्धि, चमक, रोग प्रतिरोधक क्षमता, आदि)',
      submitBtn: 'समीक्षा जमा करें',
      successMessage: 'धन्यवाद! आपकी सत्यापित फसल समीक्षा सफलतापूर्वक सबमिट हो गई है और सूची में जोड़ दी गई है।',
      emptyResults: 'चयनित फिल्टर के अनुसार कोई समीक्षा नहीं मिली।',
      yieldLabel: 'कुल पैदावार:',
      verifiedFarmer: 'सत्यापित स्रा श्रीजी किसान',
      requiredError: 'कृपया समीक्षा सबमिट करने के लिए सभी फ़ील्ड भरें।',
    },
    Punjabi: {
      sectionHeader: 'ਮਿੱਟੀ ਦੁਆਰਾ ਪਰਖਿਆ, ਧਰਤੀ ਦਾ ਅਟੁੱਟ ਵਿਸ਼ਵਾਸ',
      sectionTitle: 'ਚੋਟੀ ਦੀਆਂ ਕਿਸਾਨ ਸਮੀਖਿਆਵਾਂ ਅਤੇ ਰੇਟਿੰਗਾਂ',
      writeReviewBtn: 'ਆਪਣੇ ਫਸਲ ਉਤਪਾਦਨ ਦਾ ਅਨੁਭਵ ਸਾਂਝਾ ਕਰੋ',
      overallRating: 'ਔਸਤ ਰੇਟਿੰਗ',
      basedOn: 'ਪ੍ਰਮਾਣਿਤ ਕਿਸਾਨਾਂ ਦੇ ਫੀਡਬੈਕ ਤੇ ਅਧਾਰਤ',
      searchPlaceholder: 'ਸਮੀਖਿਆਵਾਂ, ਫਸਲਾਂ ਜਾਂ ਪਿੰਡ ਲੱਭੋ...',
      allCrops: 'ਸਾਰੀਆਂ ਫਸਲਾਂ',
      filterTitle: 'ਫਸਲ ਸ਼੍ਰੇਣੀ',
      sortByLabel: 'ਤਰਤੀਬ ਦਿਓ',
      sortRecent: 'ਨਵੀਨਤਮ ਸਮੀਖਿਆਵਾਂ',
      sortHighest: 'ਉੱਚਤਮ ਰੇਟਿੰਗ',
      sortVerified: 'ਪ੍ਰਮਾਣਿਤ ਸਰਾ ਸ਼੍ਰੀਜੀ ਕਿਸਾਨ',
      formTitle: 'ਆਪਣੀ ਫਸਲ ਦੀ ਸਫਲਤਾ ਦੀ ਕਹਾਣੀ ਦਰਜ ਕਰੋ',
      formNameLabel: 'ਕਿਸਾਨ ਦਾ ਪੂਰਾ ਨਾਂ',
      formLocationLabel: 'ਪਿੰਡ, ਰਾਜ',
      formCropLabel: 'ਫਸਲ ਦੀ ਸ਼੍ਰੇਣੀ ਚੁਣੋ',
      formVarietyLabel: 'ਬੀਜ ਦੀ ਕਿਸਮ ਦਾ ਨਾਂ (ਜਿਵੇਂ ਸੁਵੀਰ, ਪੂਸਾ 1509)',
      formYieldLabel: 'ਫਸਲ ਦਾ ਝਾੜ (ਜਿਵੇਂ 32 ਕੁਇੰਟਲ/ਏਕੜ)',
      formRatingLabel: 'ਆਪਣਾ ਰੇਟਿੰਗ ਸਕੋਰ ਚੁਣੋ',
      formTextLabel: 'ਵਿਸਤ੍ਰਿਤ ਸਮੀਖਿਆ ਲਿਖੋ (ਫਸਲ ਦਾ ਵਾਧਾ, ਚਮਕ, ਬਿਮਾਰੀ ਪ੍ਰਤੀ ਰੋਧਕਤਾ, ਆਦਿ)',
      submitBtn: 'ਸਮੀਖਿਆ ਜਮ੍ਹਾਂ ਕਰੋ',
      successMessage: 'ਧੰਨਵਾਦ! ਤੁਹਾਡੀ ਪ੍ਰਮਾਣਿਤ ਫਸਲ ਸਮੀਖਿਆ ਸਫਲਤਾਪੂਰਵਕ ਸਬਮਿਟ ਹੋ ਗਈ ਹੈ ਅਤੇ ਸੂਚੀ ਵਿੱਚ ਜੋੜ ਦਿੱਤੀ ਗਈ ਹੈ।',
      emptyResults: 'ਚੁਣੇ ਗਏ ਫਿਲਟਰਾਂ ਦੇ ਅਨੁਸਾਰ ਕੋਈ ਸਮੀਖਿਆ ਨਹੀਂ ਮਿਲੀ।',
      yieldLabel: 'ਕੁੱਲ ਝਾੜ:',
      verifiedFarmer: 'ਪ੍ਰਮਾਣਿਤ ਸਰਾ ਸ਼੍ਰੀਜੀ ਕਿਸਾਨ',
      requiredError: 'ਕਿਰਪਾ ਕਰਕੇ ਸਮੀਖਿਆ ਸਬਮਿਟ ਕਰਨ ਲਈ ਸਾਰੇ ਖੇਤਰ ਭਰੋ।',
    }
  }[currentLang];

  // Dynamic distribution stats
  const totalReviewsCount = reviews.length;
  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1);
  const fiveStarsCount = reviews.filter(r => r.rating === 5).length;
  const fourStarsCount = reviews.filter(r => r.rating === 4).length;
  const threeStarsCount = reviews.filter(r => r.rating <= 3).length;

  const fiveStarPct = totalReviewsCount ? Math.round((fiveStarsCount / totalReviewsCount) * 100) : 0;
  const fourStarPct = totalReviewsCount ? Math.round((fourStarsCount / totalReviewsCount) * 100) : 0;
  const threeStarPct = totalReviewsCount ? Math.round((threeStarsCount / totalReviewsCount) * 100) : 0;

  // Handling review creation
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formLocation.trim() || !formVariety.trim() || !formYield.trim() || !formText.trim()) {
      setFormError(t.requiredError);
      return;
    }

    setFormError('');

    const newReview: Review = {
      id: `custom-rev-${Date.now()}`,
      farmerName: formName,
      location: formLocation,
      cropType: formCrop,
      seedVariety: formVariety,
      yieldInfo: formYield,
      rating: formRating,
      reviewText: formText,
      date: 'Just now',
      isVerified: true
    };

    // Save custom reviews only to localStorage
    const stored = localStorage.getItem('sra_shriji_farmer_reviews');
    let updatedStored: Review[] = [];
    if (stored) {
      try {
        updatedStored = JSON.parse(stored);
      } catch (e) {}
    }
    updatedStored = [newReview, ...updatedStored];
    localStorage.setItem('sra_shriji_farmer_reviews', JSON.stringify(updatedStored));

    // Update state
    setReviews([newReview, ...reviews]);
    setFormSuccess(true);

    // Reset Form
    setTimeout(() => {
      setFormName('');
      setFormLocation('');
      setFormVariety('');
      setFormYield('');
      setFormText('');
      setFormRating(5);
      setFormSuccess(false);
      setIsFormOpen(false);
    }, 3000);
  };

  // Distinct crop types for tab filtering
  const cropCategories = ['All', 'Paddy', 'Wheat', 'Maize', 'Bajra', 'Mustard'];

  // Filtering & Sorting Logic
  const filteredReviews = reviews.filter(r => {
    const matchesCrop = selectedCrop === 'All' || r.cropType.toLowerCase() === selectedCrop.toLowerCase();
    const matchesSearch = r.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.seedVariety.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCrop && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'highest') {
      return b.rating - a.rating;
    }
    if (sortBy === 'verified') {
      return (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0);
    }
    // Default 'recent': custom reviews at top, then date order
    return b.date === 'Just now' ? 1 : a.date === 'Just now' ? -1 : 0;
  });

  return (
    <section className="py-24 bg-white relative border-b border-gray-100" id="farmer-reviews">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs tracking-widest font-bold text-brand-green uppercase font-display block flex items-center justify-center gap-1.5">
            <Sprout className="h-4 w-4 text-brand-gold" />
            {t.sectionHeader}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 font-display">
            {t.sectionTitle}
          </h2>
          <div className="h-1 w-20 bg-brand-amber mx-auto rounded-full" />
        </div>

        {/* Stats Grid Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
          
          {/* Average Score block */}
          <div className="lg:col-span-4 bg-gray-50 rounded-3xl p-8 border border-gray-100 text-center space-y-3 shadow-sm h-full flex flex-col justify-center">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider block">
              {t.overallRating}
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl font-black text-gray-900 font-display">
                {averageRating}
              </span>
              <span className="text-lg font-bold text-gray-400">/ 5.0</span>
            </div>
            
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= Math.round(Number(averageRating)) ? 'text-brand-gold fill-brand-gold' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-gray-500 font-semibold">
              ⭐ {totalReviewsCount} {t.basedOn}
            </p>
          </div>

          {/* Detailed distribution bar chart */}
          <div className="lg:col-span-5 bg-gray-50 rounded-3xl p-8 border border-gray-100 space-y-4 h-full flex flex-col justify-center">
            {/* 5 Star */}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-12 text-right font-bold text-gray-600">5 Star</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-green rounded-full" style={{ width: `${fiveStarPct}%` }} />
              </div>
              <span className="w-8 text-left font-bold text-gray-500">{fiveStarPct}%</span>
            </div>

            {/* 4 Star */}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-12 text-right font-bold text-gray-600">4 Star</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${fourStarPct}%` }} />
              </div>
              <span className="w-8 text-left font-bold text-gray-500">{fourStarPct}%</span>
            </div>

            {/* 3 Star & less */}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-12 text-right font-bold text-gray-600">≤ 3 Star</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-amber rounded-full" style={{ width: `${threeStarPct}%` }} />
              </div>
              <span className="w-8 text-left font-bold text-gray-500">{threeStarPct}%</span>
            </div>
          </div>

          {/* CTA Write a review */}
          <div className="lg:col-span-3 text-center lg:text-left space-y-4 flex flex-col items-center lg:items-start justify-center h-full">
            <h4 className="text-lg font-bold text-gray-900 leading-tight">
              Had a Bumper Harvest with Sra Shriji?
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              Submit your production output, grain weight, and rating to inspire other farming families.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full lg:w-auto bg-brand-green hover:bg-brand-green/95 text-white font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_8px_16px_rgba(13,92,52,0.15)] flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t.writeReviewBtn}
            </button>
          </div>

        </div>

        {/* Search, Filter Tabs and Sorting Bar */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Crop filters tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {cropCategories.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCrop === crop
                    ? 'bg-brand-green text-white shadow-md'
                    : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {crop === 'All' ? t.allCrops : crop}
              </button>
            ))}
          </div>

          {/* Search bar & Sort selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:border-brand-green focus:outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-200 rounded-xl pl-10 pr-8 py-2.5 text-xs font-bold text-gray-600 outline-none focus:border-brand-green cursor-pointer"
              >
                <option value="recent">{t.sortRecent}</option>
                <option value="highest">{t.sortHighest}</option>
                <option value="verified">{t.sortVerified}</option>
              </select>
            </div>
          </div>

        </div>

        {/* Filtered reviews grid */}
        <AnimatePresence mode="popLayout">
          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {filteredReviews.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-gray-100 hover:border-gray-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
                >
                  {/* Verification Badge */}
                  {review.isVerified && (
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 self-start px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide">
                      <CheckCircle className="h-3.5 w-3.5 fill-emerald-600 text-white" />
                      {t.verifiedFarmer}
                    </div>
                  )}

                  {/* Seed and crop type */}
                  <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Seed Variety Used</span>
                      <span className="text-xs font-black text-brand-dark flex items-center gap-1 mt-0.5">
                        <Sprout className="h-3.5 w-3.5 text-brand-green" /> {review.seedVariety} ({review.cropType})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">{t.yieldLabel}</span>
                      <span className="text-xs font-extrabold text-brand-green mt-0.5 block">{review.yieldInfo}</span>
                    </div>
                  </div>

                  {/* Rating & Review comment */}
                  <div className="space-y-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? 'text-brand-gold fill-brand-gold' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                      "{review.reviewText}"
                    </p>
                  </div>

                  {/* Reviewer signature info */}
                  <div className="pt-2 flex justify-between items-center text-xs font-semibold text-gray-400">
                    <div>
                      <span className="font-extrabold text-gray-800 block text-xs">{review.farmerName}</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{review.location}</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-400">{review.date}</span>
                  </div>

                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 text-gray-400 space-y-2"
            >
              <MessageSquare className="h-12 w-12 mx-auto stroke-1 text-gray-300" />
              <p className="text-xs font-semibold text-gray-500">{t.emptyResults}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal: Write a Review Form */}
        <AnimatePresence>
          {isFormOpen && (
            <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 md:p-8 max-w-xl w-full text-left relative max-h-[90vh] overflow-y-auto"
              >
                
                {/* Close Button */}
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>

                <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-4 mb-5 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-brand-green" />
                  {t.formTitle}
                </h3>

                {formSuccess ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-bold text-gray-700 leading-relaxed px-6">
                      {t.successMessage}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleAddReview} className="space-y-4">
                    
                    {/* Error block */}
                    {formError && (
                      <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                        ⚠️ {formError}
                      </div>
                    )}

                    {/* Farmer Name & Location Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1.5">{t.formNameLabel}</label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Gurpreet Singh"
                          className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1.5">{t.formLocationLabel}</label>
                        <input
                          type="text"
                          required
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          placeholder="e.g. Karnal, Haryana"
                          className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                        />
                      </div>
                    </div>

                    {/* Crop selection dropdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1.5">{t.formCropLabel}</label>
                        <select
                          value={formCrop}
                          onChange={(e) => setFormCrop(e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                        >
                          <option value="Paddy">Paddy</option>
                          <option value="Wheat">Wheat</option>
                          <option value="Maize">Maize</option>
                          <option value="Bajra">Bajra</option>
                          <option value="Mustard">Mustard</option>
                          <option value="Urad">Urad</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1.5">{t.formYieldLabel}</label>
                        <input
                          type="text"
                          required
                          value={formYield}
                          onChange={(e) => setFormYield(e.target.value)}
                          placeholder="e.g. 34 Quintals/Acre"
                          className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                        />
                      </div>
                    </div>

                    {/* Variety & Star rating */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1.5">{t.formVarietyLabel}</label>
                        <input
                          type="text"
                          required
                          value={formVariety}
                          onChange={(e) => setFormVariety(e.target.value)}
                          placeholder="e.g. SRA 9048 / Super 2967"
                          className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1.5">{t.formRatingLabel}</label>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setFormRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="p-1 text-gray-300 hover:scale-110 transition-all outline-none"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  star <= (hoverRating ?? formRating) ? 'text-brand-gold fill-brand-gold' : 'text-gray-200'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review text comment */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-gray-400 uppercase mb-1.5">{t.formTextLabel}</label>
                      <textarea
                        required
                        rows={4}
                        value={formText}
                        onChange={(e) => setFormText(e.target.value)}
                        placeholder="Detail grain shine, weight, resistance, etc."
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green resize-none"
                      />
                    </div>

                    {/* Form action submission */}
                    <button
                      type="submit"
                      className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_8px_16px_rgba(13,92,52,0.15)] flex items-center justify-center gap-2 mt-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t.submitBtn}
                    </button>

                  </form>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
