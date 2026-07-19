import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, MapPin, Search, ThermometerSun, AlertTriangle, UserCheck, HelpCircle, ArrowRight, ArrowRightLeft, DollarSign, CalendarRange, FlaskConical, Droplets } from 'lucide-react';
import { PRODUCTS } from '../data';

interface MapSectionProps {
  currentLang: 'English' | 'Hindi' | 'Punjabi';
}

interface StateAgriData {
  name: string;
  dealers: number;
  suitableCrops: string[];
  climate: string;
  activeAdvisory: string;
  soil: string;
}

const STATE_DATA: Record<string, StateAgriData> = {
  Punjab: {
    name: 'Punjab',
    dealers: 412,
    suitableCrops: ['Wheat', 'Paddy', 'Cotton'],
    climate: 'Semi-arid with hot summers and cool winters. Well-irrigated.',
    activeAdvisory: 'Maintain shallow water levels in Paddy nurseries. Monitor for early rice blast indicators.',
    soil: 'Alluvial soil, clay-loam'
  },
  Haryana: {
    name: 'Haryana',
    dealers: 328,
    suitableCrops: ['Wheat', 'Paddy', 'Cotton', 'Mustard'],
    climate: 'Arid to semi-arid. High irrigation dependency.',
    activeAdvisory: 'Watch out for pink bollworm in Bt Cotton. Maintain light evening watering.',
    soil: 'Sandy-loam, alluvial'
  },
  Rajasthan: {
    name: 'Rajasthan',
    dealers: 520,
    suitableCrops: ['Millet', 'Mustard', 'Cotton'],
    climate: 'Arid, extreme heat, low rainfall. Frost threat in winter.',
    activeAdvisory: 'Optimal sowing window for BG-80 Pearl Millet is active. Ensure basal compost application.',
    soil: 'Light sandy, saline'
  },
  Gujarat: {
    name: 'Gujarat',
    dealers: 285,
    suitableCrops: ['Cotton', 'Millet', 'Mustard'],
    climate: 'Semi-arid, high temperature, medium rainfall.',
    activeAdvisory: 'Cotton bolls showing healthy fluffing. Control late sucking pests.',
    soil: 'Deep black soil, sandy-clay'
  },
  'Uttar Pradesh': {
    name: 'Uttar Pradesh',
    dealers: 645,
    suitableCrops: ['Wheat', 'Paddy', 'Maize', 'Mustard'],
    climate: 'Humid subtropical, wet summers, mild winters.',
    activeAdvisory: 'Wheat Kanak-55 showing outstanding tillering. Supplement with second nitrogen top-dress.',
    soil: 'Deep fertile alluvial, silt loam'
  },
  'Madhya Pradesh': {
    name: 'Madhya Pradesh',
    dealers: 394,
    suitableCrops: ['Wheat', 'Maize', 'Cotton', 'Mustard'],
    climate: 'Subtropical, high temperatures in summer, pleasant winter.',
    activeAdvisory: 'Tejas-99 Maize cobs entering milking stage. Avoid water logging in fields.',
    soil: 'Mixed red & black soil, clayey'
  },
  Bihar: {
    name: 'Bihar',
    dealers: 215,
    suitableCrops: ['Paddy', 'Wheat', 'Maize'],
    climate: 'Humid subtropical, heavy monsoon rainfall.',
    activeAdvisory: 'Ensure complete zinc application in paddy nurseries to prevent Khaira disease.',
    soil: 'Deep rich alluvial, heavy clay'
  }
};

export default function MapSection({ currentLang }: MapSectionProps) {
  const [selectedState, setSelectedState] = useState<string>('Punjab');
  
  // Crop Recommender state variables
  const [recState, setRecState] = useState('Punjab');
  const [recSeason, setRecSeason] = useState<'Kharif' | 'Rabi' | 'Zaid'>('Kharif');
  const [recSoil, setRecSoil] = useState('Sandy Loam');
  const [recWater, setRecWater] = useState('Medium');
  const [recPurpose, setRecPurpose] = useState('Grain Yield');
  
  const [recommending, setRecommending] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<any | null>(null);

  const t = {
    English: {
      mapHeader: 'Regional Footprint',
      mapTitle: 'Interactive Dealer Map',
      mapDesc: 'Select any major agricultural state on our vector grid to discover authorized Sra Shriji dealers, regional product matches, climate characteristics, and real-time alerts.',
      stateDealers: 'Authorized Dealers',
      stateClimate: 'Climate Outlook',
      stateAlert: 'Agronomic Alert',
      stateSoil: 'Dominant Soil',
      matchedSeeds: 'Best Seed Hybrids For This Region',
      recommenderHeader: 'AI Agriculture Suite',
      recommenderTitle: 'AI Crop Recommendation Engine',
      recommenderDesc: 'Our smart agronomist engine analyzes your soil type, season, and irrigation options to suggest the highest performing certified hybrid seeds with custom planners.',
      fieldState: 'Select State',
      fieldSeason: 'Farming Season',
      fieldSoil: 'Soil Type',
      fieldWater: 'Water Availability',
      fieldPurpose: 'Farming Goal',
      btnRecommend: 'Calculate Best Seed Selection',
      resultsHeader: 'AI Recommendation Report',
      resultsMatched: 'Best Hybrid Recommendation',
      resultsExpectedProfit: 'Expected Net Returns',
      resultsSowing: 'Sowing Instructions',
      resultsFertilizer: 'Fertilizer Protocol'
    },
    Hindi: {
      mapHeader: 'क्षेत्रीय उपस्थिति',
      mapTitle: 'डीलर एवं कृषि सूचना मैप',
      mapDesc: 'हमारे इंटरएक्टिव ग्रिड पर किसी भी राज्य को चुनें और वहां के अधिकृत बाला जी डीलरों की संख्या, उपयुक्त बीज, जलवायु और तत्काल मौसम चेतावनियों की जानकारी पाएं।',
      stateDealers: 'अधिकृत डीलर्स संख्या',
      stateClimate: 'क्षेत्रीय जलवायु',
      stateAlert: 'कृषि चेतावनी परामर्श',
      stateSoil: 'मिट्टी का प्रकार',
      matchedSeeds: 'इस क्षेत्र के लिए सर्वोत्तम बीज',
      recommenderHeader: 'एआई कृषि सुइट',
      recommenderTitle: 'एआई फसल और बीज चयन परामर्श',
      recommenderDesc: 'हमारा एआई मॉड्यूल आपकी मिट्टी, सीजन, पानी की उपलब्धता और उद्देश्यों का विश्लेषण कर आपके खेत के लिए सर्वोत्तम बीज और उर्वरक अनुसूची की सिफारिश करता है।',
      fieldState: 'राज्य चुनें',
      fieldSeason: 'फसल का सीजन',
      fieldSoil: 'मिट्टी का प्रकार',
      fieldWater: 'सिंचाई की सुविधा',
      fieldPurpose: 'खेती का मुख्य उद्देश्य',
      btnRecommend: 'सर्वोत्तम बीज की गणना करें',
      resultsHeader: 'एआई अनुशंसा रिपोर्ट',
      resultsMatched: 'अनुशंसित हाइब्रिड बीज',
      resultsExpectedProfit: 'अनुमानित शुद्ध लाभ',
      resultsSowing: 'बुवाई के मुख्य निर्देश',
      resultsFertilizer: 'खाद एवं पोषक तत्व कैलेंडर'
    },
    Punjabi: {
      mapHeader: 'ਖੇਤਰੀ ਮੌਜੂਦਗੀ',
      mapTitle: 'ਡੀਲਰ ਅਤੇ ਖੇਤੀਬਾੜੀ ਸੂਚਨਾ ਮੈਪ',
      mapDesc: 'ਸਾਡੇ ਇੰਟਰਐਕਟਿਵ ਗ੍ਰਿਡ ਤੇ ਕਿਸੇ ਵੀ ਰਾਜ ਨੂੰ ਚੁਣੋ ਅਤੇ ਉੱਥੋਂ ਦੇ ਅਧਿਕਾਰਤ ਬਾਲਾ ਜੀ ਡੀਲਰਾਂ ਦੀ ਗਿਣਤੀ, ਢੁਕਵੇਂ ਬੀਜ, ਜਲਵਾਯੂ ਅਤੇ ਤੁਰੰਤ ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ ਦੀ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰੋ।',
      stateDealers: 'ਅਧਿਕਾਰਤ ਡੀਲਰਜ਼',
      stateClimate: 'ਖੇਤਰੀ ਜਲਵਾਯੂ',
      stateAlert: 'ਖੇਤੀਬਾੜੀ ਚੇਤਾਵਨੀ',
      stateSoil: 'ਮਿੱਟੀ ਦੀ ਕਿਸਮ',
      matchedSeeds: 'ਇਸ ਖੇਤਰ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਬੀਜ',
      recommenderHeader: 'ਏਆਈ ਖੇਤੀਬਾੜੀ ਸੁਇਟ',
      recommenderTitle: 'ਏਆਈ ਫਸਲ ਅਤੇ ਬੀਜ ਸਿਫਾਰਸ਼ ਇੰਜਣ',
      recommenderDesc: 'ਸਾਡਾ ਸਮਾਰਟ ਐਗਰੋਨੋਮਿਸਟ ਇੰਜਣ ਤੁਹਾਡੀ ਮਿੱਟੀ ਦੀ ਕਿਸਮ, ਸੀਜ਼ਨ ਅਤੇ ਸਿੰਚਾਈ ਦੇ ਵਿਕਲਪਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਦਾ ਹੈ ਤਾਂ ਜੋ ਵਧੀਆ ਝਾੜ ਦੇਣ ਵਾਲੇ ਬੀਜਾਂ ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾ ਸਕੇ।',
      fieldState: 'ਰਾਜ ਚੁਣੋ',
      fieldSeason: 'ਫਸਲ ਦਾ ਸੀਜ਼ਨ',
      fieldSoil: 'ਮਿੱਟੀ ਦੀ ਕਿਸਮ',
      fieldWater: 'ਸਿੰਚਾਈ ਦੀ ਸਹੂਲਤ',
      fieldPurpose: 'ਖੇਤੀਬਾੜੀ ਦਾ ਮੁੱਖ ਉਦੇਸ਼',
      btnRecommend: 'ਸਭ ਤੋਂ ਵਧੀਆ ਬੀਜ ਦੀ ਗਣਨਾ ਕਰੋ',
      resultsHeader: 'ਏਆਈ ਸਿਫਾਰਸ਼ ਰਿਪੋਰਟ',
      resultsMatched: 'ਸਿਫਾਰਸ਼ੀ ਹਾਈਬ੍ਰਿਡ ਬੀਜ',
      resultsExpectedProfit: 'ਅਨੁਮਾਨਿਤ ਸ਼ੁੱਧ ਲਾਭ',
      resultsSowing: 'ਬੀਜਣ ਦੇ ਮੁੱਖ ਨਿਰਦੇਸ਼',
      resultsFertilizer: 'ਖਾਦ ਅਤੇ ਪੋਸ਼ਕ ਤੱਤ ਕੈਲੰਡਰ'
    }
  }[currentLang];

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecommending(true);
    setRecommendationResult(null);

    try {
      const response = await fetch('/api/recommend-seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: recState,
          season: recSeason,
          soilType: recSoil,
          water: recWater,
          purpose: recPurpose,
        }),
      });
      const data = await response.json();
      
      // Match seed data locally
      const matchedSeed = PRODUCTS.find(p => p.id === data.recommendedSeedId) || PRODUCTS[0];
      setRecommendationResult({
        ...data,
        seed: matchedSeed
      });
    } catch (err) {
      console.error('Recommender fail:', err);
    } finally {
      setRecommending(false);
    }
  };

  const selectedStateData = STATE_DATA[selectedState];
  const matchingStateSeeds = PRODUCTS.filter(p => 
    selectedStateData.suitableCrops.includes(p.cropType)
  );

  return (
    <section className="py-24 bg-white border-y border-gray-100" id="map-section">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Main Grid: Maps on left, AI Recommender on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT: INTERACTIVE MAP COMPONENT */}
          <div className="lg:col-span-6 space-y-8 text-left" id="interactive-dealer-map">
            <div className="space-y-3">
              <span className="text-xs tracking-widest font-bold text-brand-green uppercase font-display block">
                {t.mapHeader}
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 font-display">
                {t.mapTitle}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t.mapDesc}
              </p>
            </div>

            {/* Stylized Vector Grid representing Northern & Central Indian Agricultural states */}
            <div className="relative bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center">
              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                {Object.keys(STATE_DATA).map((stateName) => {
                  const isActive = selectedState === stateName;
                  return (
                    <motion.button
                      key={stateName}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedState(stateName)}
                      className={`p-4 rounded-2xl flex flex-col justify-between h-28 text-left transition-all ${
                        isActive
                          ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20'
                          : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-100'
                      }`}
                    >
                      <span className="text-xs font-bold font-mono tracking-widest uppercase opacity-70">
                        {stateName === 'Uttar Pradesh' ? 'U.P.' : stateName === 'Madhya Pradesh' ? 'M.P.' : stateName}
                      </span>
                      <div>
                        <p className={`text-[10px] font-mono font-bold ${isActive ? 'text-brand-amber' : 'text-brand-green'}`}>
                          Dealers: {STATE_DATA[stateName].dealers}
                        </p>
                        <p className="text-[9px] font-semibold mt-1 opacity-60 leading-none truncate">
                          Crops: {STATE_DATA[stateName].suitableCrops.join(', ')}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">
                👉 Click any state button above to filter regional analytics
              </p>
            </div>

            {/* State details card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedState}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-6 text-left"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-extrabold text-gray-900 font-display">
                    {selectedStateData.name} Agricultural Hub
                  </h4>
                  <div className="flex items-center gap-1.5 bg-brand-green/10 text-brand-green px-3 py-1 rounded-full text-xs font-bold">
                    <UserCheck className="h-4 w-4" />
                    {selectedStateData.dealers} {t.stateDealers}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3.5 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <ThermometerSun className="h-3.5 w-3.5 text-brand-gold" />
                      {t.stateClimate}
                    </p>
                    <p className="text-xs font-semibold text-gray-700 mt-1 leading-relaxed">
                      {selectedStateData.climate}
                    </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sprout className="h-3.5 w-3.5 text-brand-green" />
                      {t.stateSoil}
                    </p>
                    <p className="text-xs font-semibold text-gray-700 mt-1 leading-relaxed">
                      {selectedStateData.soil}
                    </p>
                  </div>
                </div>

                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex gap-3 items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs uppercase tracking-wider font-extrabold text-red-700">
                      {t.stateAlert}
                    </h5>
                    <p className="text-xs text-gray-700 font-medium mt-1 leading-relaxed">
                      {selectedStateData.activeAdvisory}
                    </p>
                  </div>
                </div>

                {/* Regional matching products */}
                <div className="space-y-3">
                  <h5 className="text-xs uppercase tracking-wider font-extrabold text-gray-400">
                    {t.matchedSeeds}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {matchingStateSeeds.map(seed => (
                      <span
                        key={seed.id}
                        className="bg-white border border-gray-200 text-xs font-bold px-3 py-1.5 rounded-xl text-gray-800 flex items-center gap-1 shadow-sm"
                      >
                        <Sprout className="h-3.5 w-3.5 text-brand-green" />
                        {seed.name}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

          {/* RIGHT: CROP RECOMMENDER ENGINE */}
          <div className="lg:col-span-6 space-y-8 text-left" id="crop-recommender">
            <div className="space-y-3">
              <span className="text-xs tracking-widest font-bold text-brand-gold uppercase font-display block">
                {t.recommenderHeader}
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 font-display flex items-center gap-2">
                {t.recommenderTitle}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t.recommenderDesc}
              </p>
            </div>

            {/* Input Selection Form */}
            <form onSubmit={handleRecommend} className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                {/* State select */}
                <div className="flex flex-col text-left">
                  <label className="text-xs font-bold text-gray-500 mb-1">{t.fieldState}</label>
                  <select
                    value={recState}
                    onChange={(e) => setRecState(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  >
                    {Object.keys(STATE_DATA).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Season select */}
                <div className="flex flex-col text-left">
                  <label className="text-xs font-bold text-gray-500 mb-1">{t.fieldSeason}</label>
                  <select
                    value={recSeason}
                    onChange={(e) => setRecSeason(e.target.value as any)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  >
                    <option value="Kharif">Kharif (Summer)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Spring)</option>
                  </select>
                </div>

                {/* Soil type select */}
                <div className="flex flex-col text-left">
                  <label className="text-xs font-bold text-gray-500 mb-1">{t.fieldSoil}</label>
                  <select
                    value={recSoil}
                    onChange={(e) => setRecSoil(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  >
                    <option value="Alluvial Soil">Alluvial / Clay Loam</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Light Sandy">Light Sandy Soil</option>
                    <option value="Deep Black Soil">Deep Black Soil</option>
                  </select>
                </div>

                {/* Irrigation select */}
                <div className="flex flex-col text-left">
                  <label className="text-xs font-bold text-gray-500 mb-1">{t.fieldWater}</label>
                  <select
                    value={recWater}
                    onChange={(e) => setRecWater(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  >
                    <option value="High">High (Assured Canal/Tubewell)</option>
                    <option value="Medium">Medium Irrigation</option>
                    <option value="Very Low">Very Low / Rainfed</option>
                  </select>
                </div>

              </div>

              {/* Farming Goal purpose */}
              <div className="flex flex-col text-left">
                <label className="text-xs font-bold text-gray-500 mb-1">{t.fieldPurpose}</label>
                <select
                  value={recPurpose}
                  onChange={(e) => setRecPurpose(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                >
                  <option value="Grain Yield">Maximum Grain/Lint Yield per Acre</option>
                  <option value="Oil Concentration">Highest Oil Extraction Percentage</option>
                  <option value="Disease Resistance">Disease Immunity & Safe Harvesting</option>
                  <option value="Dual Purpose">Heavy Grain & Palatable Green Fodder</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={recommending}
                className="w-full bg-brand-green hover:bg-brand-green/95 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_8px_16px_rgba(13,92,52,0.15)] flex items-center justify-center gap-2"
                id="recommender-submit-btn"
              >
                {recommending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Querying Sra Shriji Agronomist Engine...
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-4 w-4" />
                    {t.btnRecommend}
                  </>
                )}
              </button>
            </form>

            {/* Recommendation output report */}
            <AnimatePresence>
              {recommendationResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-brand-dark text-white rounded-3xl p-6 border border-emerald-500/20 shadow-2xl relative overflow-hidden text-left"
                >
                  {/* Decorative corner visual */}
                  <div className="absolute top-0 right-0 bg-brand-gold text-brand-dark text-[9px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                    Optimal Selection
                  </div>

                  <h4 className="text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-4 flex items-center gap-1">
                    ✔ {t.resultsHeader}
                  </h4>

                  <div className="flex gap-4 items-center mb-6">
                    <img
                      src={recommendationResult.seed.image}
                      alt={recommendationResult.seed.name}
                      className="w-16 h-16 object-cover rounded-2xl border border-white/10"
                    />
                    <div>
                      <span className="text-[10px] text-brand-gold uppercase font-bold tracking-widest block">
                        {t.resultsMatched}
                      </span>
                      <h5 className="text-lg font-bold text-white">
                        {recommendationResult.seed.name}
                      </h5>
                      <p className="text-xs text-gray-300 font-mono italic mt-0.5">
                        "{recommendationResult.seed.tagline}"
                      </p>
                    </div>
                  </div>

                  {/* Recommendations metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-brand-gold" />
                        {t.resultsExpectedProfit}
                      </p>
                      <p className="text-xs font-bold text-white">
                        {recommendationResult.expectedProfitEstimate}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                        <CalendarRange className="h-3.5 w-3.5 text-emerald-400" />
                        {t.resultsSowing}
                      </p>
                      <p className="text-xs font-bold text-white">
                        {recommendationResult.sowingTips}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                        <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
                        {t.resultsFertilizer}
                      </p>
                      <p className="text-xs text-gray-300">
                        {recommendationResult.fertilizerSchedule}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-brand-gold" />
                        Climatic Advisory
                      </p>
                      <p className="text-xs text-gray-300">
                        {recommendationResult.advisoryNote}
                      </p>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
