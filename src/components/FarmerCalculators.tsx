import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Sprout, TrendingUp, DollarSign, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';
import { PRODUCTS } from '../data';

interface FarmerCalculatorsProps {
  currentLang: 'English' | 'Hindi' | 'Punjabi';
}

export default function FarmerCalculators({ currentLang }: FarmerCalculatorsProps) {
  const [activeCalculator, setActiveCalculator] = useState<'seed' | 'fertilizer' | 'yield'>('seed');

  // 1. Seed rate calc states
  const [seedCrop, setSeedCrop] = useState('Wheat');
  const [seedAcres, setSeedAcres] = useState<number>(2);
  const [seedMethod, setSeedMethod] = useState('Line Sowing');

  // 2. Fertilizer calc states
  const [fertCrop, setFertCrop] = useState('Paddy');
  const [fertAcres, setFertAcres] = useState<number>(3);

  // 3. Yield / Profit states
  const [yieldProduct, setYieldProduct] = useState(PRODUCTS[0].id);
  const [yieldAcres, setYieldAcres] = useState<number>(2);
  const [mandiPrice, setMandiPrice] = useState<number>(7200); // Standard cotton rate

  const t = {
    English: {
      header: 'ACCURATE PRECISION MEASUREMENT',
      title: 'Farmer Calculators & Yield Planners',
      tabSeed: 'Seed Rate Calculator',
      tabFert: 'Fertilizer Estimator',
      tabYield: 'Yield & Profit Predictor',
      acres: 'Acreage (Acres)',
      crop: 'Select Crop Group',
      method: 'Sowing Method',
      btnCalculate: 'Evaluate Calculation',
      resultTitle: 'Calculation Estimate Output',
    },
    Hindi: {
      header: 'सटीक कृषि गणना यंत्र',
      title: 'किसान कैलक्यूलेटर एवं उपज योजनाकार',
      tabSeed: 'बीज दर कैलक्यूलेटर',
      tabFert: 'उर्वरक/खाद आकलन',
      tabYield: 'फसल उपज एवं लाभ पूर्वानुकूलक',
      acres: 'खेत का क्षेत्रफल (एकड़)',
      crop: 'फसल का प्रकार चुनें',
      method: 'बुवाई की विधि',
      btnCalculate: 'परिणाम की गणना करें',
      resultTitle: 'आकलन गणना रिपोर्ट',
    },
    Punjabi: {
      header: 'ਸਟੀਕ ਖੇਤੀਬਾੜੀ ਗਣਨਾ ਯੰਤਰ',
      title: 'ਕਿਸਾਨ ਕੈਲਕੁਲੇਟਰ ਅਤੇ ਝਾੜ ਯੋਜਨਾਕਾਰ',
      tabSeed: 'ਬੀਜ ਦਰ ਕੈਲਕੁਲੇਟਰ',
      tabFert: 'ਖਾਦ ਅਨੁਮਾਨਕ',
      tabYield: 'ਝਾੜ ਅਤੇ ਮੁਨਾਫਾ ਅਨੁਮਾਨਕ',
      acres: 'ਖੇਤ ਦਾ ਰਕਬਾ (ਏਕੜ)',
      crop: 'ਫਸਲ ਦੀ ਚੋਣ ਕਰੋ',
      method: 'ਬੀਜਣ ਦਾ ਤਰੀਕਾ',
      btnCalculate: 'ਗਣਨਾ ਕਰੋ',
      resultTitle: 'ਅਨੁਮਾਨ ਰਿਪੋਰਟ',
    }
  }[currentLang];

  // Logic: Seed rate requirements per acre (standard values)
  const calculateSeedRate = () => {
    let ratePerAcre = 40; // Wheat default kg/acre
    if (seedCrop === 'Cotton') ratePerAcre = 1.8; // Bt Cotton is very light bags
    else if (seedCrop === 'Millet') ratePerAcre = 1.5;
    else if (seedCrop === 'Paddy') ratePerAcre = 6;
    else if (seedCrop === 'Maize') ratePerAcre = 8;
    else if (seedCrop === 'Mustard') ratePerAcre = 1.5;

    // Adjust based on sowing method
    let multiplier = 1.0;
    if (seedMethod === 'Broadcasting') multiplier = 1.15;
    else if (seedMethod === 'Dibbling') multiplier = 0.85;

    return (seedAcres * ratePerAcre * multiplier).toFixed(1);
  };

  // Logic: Fertilizer requirements per acre (Bags)
  const calculateFertilizer = () => {
    let ureaBags = 2; // Bags per acre
    let dapBags = 1;
    let mopBags = 0.5;

    if (fertCrop === 'Cotton') {
      ureaBags = 1.5; dapBags = 1.2; mopBags = 0.5;
    } else if (fertCrop === 'Millet') {
      ureaBags = 1.2; dapBags = 0.8; mopBags = 0.4;
    } else if (fertCrop === 'Paddy') {
      ureaBags = 2.5; dapBags = 1.5; mopBags = 0.8;
    } else if (fertCrop === 'Maize') {
      ureaBags = 3; dapBags = 1.8; mopBags = 1;
    } else if (fertCrop === 'Mustard') {
      ureaBags = 1; dapBags = 1; mopBags = 0.5;
    }

    return {
      urea: (ureaBags * fertAcres).toFixed(1),
      dap: (dapBags * fertAcres).toFixed(1),
      mop: (mopBags * fertAcres).toFixed(1)
    };
  };

  // Logic: Yield / Profit predictor
  const calculateYieldProfit = () => {
    const seed = PRODUCTS.find(p => p.id === yieldProduct) || PRODUCTS[0];
    
    // Extract yield range numbers e.g. "12 - 15" -> 13.5 avg
    const yieldRange = seed.expectedYield.match(/\d+/g);
    let avgYieldPerAcre = 15;
    if (yieldRange && yieldRange.length >= 2) {
      avgYieldPerAcre = (parseFloat(yieldRange[0]) + parseFloat(yieldRange[1])) / 2;
    }

    const totalYield = avgYieldPerAcre * yieldAcres;
    const grossRevenue = totalYield * mandiPrice;
    
    // Seed and fertilizer costs average
    const costPerAcre = seed.cropType === 'Cotton' ? 4500 : seed.cropType === 'Paddy' ? 6000 : 5000;
    const totalCost = costPerAcre * yieldAcres;
    const netProfit = grossRevenue - totalCost;

    return {
      totalYield: totalYield.toFixed(1),
      grossRevenue: grossRevenue.toLocaleString('en-IN'),
      totalCost: totalCost.toLocaleString('en-IN'),
      netProfit: netProfit.toLocaleString('en-IN')
    };
  };

  const selectedSeedData = PRODUCTS.find(p => p.id === yieldProduct) || PRODUCTS[0];
  const fertDataResult = calculateFertilizer();
  const yieldResult = calculateYieldProfit();

  return (
    <section className="py-24 bg-white border-b border-gray-100" id="calculators">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs tracking-widest font-bold text-brand-green uppercase font-display block">
            {t.header}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 font-display">
            {t.title}
          </h2>
          <div className="h-1 w-20 bg-brand-amber mx-auto rounded-full" />
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 bg-gray-50 p-1.5 rounded-2xl max-w-2xl mx-auto border border-gray-100">
          <button
            onClick={() => setActiveCalculator('seed')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all ${
              activeCalculator === 'seed'
                ? 'bg-brand-green text-white shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calculator className="h-4 w-4" />
            {t.tabSeed}
          </button>
          <button
            onClick={() => setActiveCalculator('fertilizer')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all ${
              activeCalculator === 'fertilizer'
                ? 'bg-brand-green text-white shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sprout className="h-4 w-4" />
            {t.tabFert}
          </button>
          <button
            onClick={() => setActiveCalculator('yield')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all ${
              activeCalculator === 'yield'
                ? 'bg-brand-green text-white shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            {t.tabYield}
          </button>
        </div>

        {/* CALC VIEW: SEED RATE */}
        {activeCalculator === 'seed' && (
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center" id="calculator-seed">
            <div className="space-y-4 text-left">
              <h4 className="text-xl font-extrabold text-gray-900 font-display">
                Seed Rate Estimation Calculator
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Determine the correct volume of seed packs required for planting based on acreage, specific crop species guidelines, and crop spacing arrangements.
              </p>

              <div className="space-y-3 pt-2">
                {/* Crop */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1">{t.crop}</label>
                  <select
                    value={seedCrop}
                    onChange={(e) => setSeedCrop(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  >
                    <option value="Cotton">Cotton Seeds</option>
                    <option value="Wheat">Wheat Seeds</option>
                    <option value="Millet">Millet (Bajra) Seeds</option>
                    <option value="Paddy">Paddy Seeds</option>
                    <option value="Maize">Maize Seeds</option>
                    <option value="Mustard">Mustard Seeds</option>
                  </select>
                </div>

                {/* Sowing Method */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1">{t.method}</label>
                  <select
                    value={seedMethod}
                    onChange={(e) => setSeedMethod(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  >
                    <option value="Line Sowing">Line Sowing (Recommended)</option>
                    <option value="Broadcasting">Broadcasting / Manual Spread</option>
                    <option value="Dibbling">Dibbling / Hand Planting</option>
                  </select>
                </div>

                {/* Acreage */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1">{t.acres}</label>
                  <input
                    type="number"
                    value={seedAcres}
                    onChange={(e) => setSeedAcres(parseFloat(e.target.value) || 0)}
                    min="1"
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>

            {/* Result block */}
            <div className="bg-brand-dark text-white rounded-3xl p-6 text-left shadow-xl border border-white/5 space-y-4">
              <span className="text-[10px] text-brand-amber font-extrabold uppercase tracking-widest block">
                🌱 {t.resultTitle}
              </span>

              <div className="border-b border-white/10 pb-4">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Certified Seed Needed</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-extrabold text-emerald-400">
                    {calculateSeedRate()}
                  </span>
                  <span className="text-xs font-bold text-white">Kilograms</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Selected Species:</span>
                  <span className="font-bold text-white">{seedCrop} Hybrid</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Plotted Area:</span>
                  <span className="font-bold text-white">{seedAcres} Acres</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Sowing Spacing:</span>
                  <span className="font-bold text-white">{seedMethod}</span>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-3 flex gap-2 items-start mt-2">
                <ShieldAlert className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-300 font-medium leading-relaxed">
                  Calculations represent average certified trials. For extremely sandy soils, keep seed count slightly higher (10-15% increase) to ensure stable canopy distribution.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CALC VIEW: FERTILIZER */}
        {activeCalculator === 'fertilizer' && (
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center" id="calculator-fertilizer">
            <div className="space-y-4 text-left">
              <h4 className="text-xl font-extrabold text-gray-900 font-display">
                Balanced NPK & Fertilizer Estimator
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Enter your field size to estimate standard recommended basal and top-dressing fertilizer needs (Urea, DAP, and MOP) for optimal growth.
              </p>

              <div className="space-y-3 pt-2">
                {/* Crop */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1">{t.crop}</label>
                  <select
                    value={fertCrop}
                    onChange={(e) => setFertCrop(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  >
                    <option value="Cotton">Bt Cotton</option>
                    <option value="Wheat">Premium Wheat</option>
                    <option value="Millet">Pearl Millet</option>
                    <option value="Paddy">Hybrid Paddy</option>
                    <option value="Maize">Hybrid Maize</option>
                    <option value="Mustard">Mustard</option>
                  </select>
                </div>

                {/* Acreage */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1">{t.acres}</label>
                  <input
                    type="number"
                    value={fertAcres}
                    onChange={(e) => setFertAcres(parseFloat(e.target.value) || 0)}
                    min="1"
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-brand-dark text-white rounded-3xl p-6 text-left shadow-xl border border-white/5 space-y-4">
              <span className="text-[10px] text-brand-amber font-extrabold uppercase tracking-widest block">
                🌱 {t.resultTitle}
              </span>

              <div className="space-y-3 border-b border-white/10 pb-4">
                {/* Urea */}
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">Urea (Nitrogen Source)</p>
                    <p className="text-[10px] text-gray-400">Total bags (50kg bag size)</p>
                  </div>
                  <span className="text-xl font-extrabold text-emerald-400">{fertDataResult.urea} Bags</span>
                </div>

                {/* DAP */}
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">DAP (Phosphorus Source)</p>
                    <p className="text-[10px] text-gray-400">Total bags (50kg bag size)</p>
                  </div>
                  <span className="text-xl font-extrabold text-brand-amber">{fertDataResult.dap} Bags</span>
                </div>

                {/* MOP */}
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">MOP (Potassium Source)</p>
                    <p className="text-[10px] text-gray-400">Total bags (50kg bag size)</p>
                  </div>
                  <span className="text-xl font-extrabold text-white">{fertDataResult.mop} Bags</span>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-3 flex gap-2 items-start">
                <ShieldAlert className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-300 font-medium leading-relaxed">
                  For Oilseeds like Mustard, incorporating Elemental Sulphur (15-20 kg/acre) during basal preparation is highly recommended to maximize commercial oil percentages.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CALC VIEW: YIELD / PROFIT PREDICTOR */}
        {activeCalculator === 'yield' && (
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center" id="calculator-yield">
            <div className="space-y-4 text-left">
              <h4 className="text-xl font-extrabold text-gray-900 font-display">
                Commercial Yield & Net Profit Predictor
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Estimate your total crop harvest output and financial income based on selected premium Sra Shriji hybrid varieties, acreage, and the average prevailing mandi market price.
              </p>

              <div className="space-y-3 pt-2">
                {/* Seed variety select */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1">Select Seed Variety</label>
                  <select
                    value={yieldProduct}
                    onChange={(e) => setYieldProduct(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  >
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Acreage */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1">{t.acres}</label>
                  <input
                    type="number"
                    value={yieldAcres}
                    onChange={(e) => setYieldAcres(parseFloat(e.target.value) || 0)}
                    min="1"
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  />
                </div>

                {/* Mandi Price */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1">Mandi Price (₹ per Quintal)</label>
                  <input
                    type="number"
                    value={mandiPrice}
                    onChange={(e) => setMandiPrice(parseInt(e.target.value) || 0)}
                    min="1000"
                    step="100"
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-brand-dark text-white rounded-3xl p-6 text-left shadow-xl border border-white/5 space-y-4">
              <span className="text-[10px] text-brand-amber font-extrabold uppercase tracking-widest block">
                🌱 {t.resultTitle}
              </span>

              <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Harvest Yield</p>
                  <p className="text-2xl font-extrabold text-white mt-0.5">{yieldResult.totalYield} <span className="text-xs font-normal">Quintals</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gross Revenue</p>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">₹ {yieldResult.grossRevenue}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Crop Expenses</p>
                  <p className="text-lg font-bold text-white mt-0.5">₹ {yieldResult.totalCost}</p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">Estimated Net Profit</p>
                  <p className="text-2xl font-extrabold text-brand-amber mt-0.5">₹ {yieldResult.netProfit}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1.5 text-xs text-gray-300">
                <p>📊 Performance metrics based on variety <span className="font-bold text-white">{selectedSeedData.name}</span>.</p>
                <p>✅ Certified typical germination: <span className="font-bold text-emerald-400">{selectedSeedData.germinationRate}</span>.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
