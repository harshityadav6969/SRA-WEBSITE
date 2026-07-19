import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../data';
import { Product } from '../types';
import { 
  Star, 
  ShieldCheck, 
  Download, 
  MapPin, 
  Scale, 
  ArrowRightLeft, 
  Sprout, 
  Flame, 
  Droplet, 
  Sun, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Leaf, 
  FileText, 
  ShieldAlert,
  X,
  Printer,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  FileCheck,
  Calendar,
  BookOpen,
  AlertCircle,
  ShoppingCart,
  Settings
} from 'lucide-react';

interface ProductSectionProps {
  currentLang: 'English' | 'Hindi' | 'Punjabi';
  selectedCrop?: string;
  setSelectedCrop?: (crop: string) => void;
  activeProductId?: string;
  setActiveProductId?: (id: string) => void;
}

export default function ProductSection({ 
  currentLang,
  selectedCrop: propSelectedCrop,
  setSelectedCrop: propSetSelectedCrop,
  activeProductId: propActiveProductId,
  setActiveProductId: propSetActiveProductId
}: ProductSectionProps) {
  const [localCrop, setLocalCrop] = useState<string>('All');
  const selectedCrop = propSelectedCrop ?? localCrop;
  const setSelectedCrop = propSetSelectedCrop ?? setLocalCrop;

  const [localActiveProduct, setLocalActiveProduct] = useState<Product>(PRODUCTS[0]);
  
  const activeProduct = propActiveProductId 
    ? (PRODUCTS.find(p => p.id === propActiveProductId) ?? localActiveProduct)
    : localActiveProduct;

  const setActiveProduct = (prod: Product) => {
    if (propSetActiveProductId) {
      propSetActiveProductId(prod.id);
    } else {
      setLocalActiveProduct(prod);
    }
  };

  const [rotationDegree, setRotationDegree] = useState(0);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [downloadedDoc, setDownloadedDoc] = useState<string | null>(null);

  // Advanced Interactive Modal States
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [viewPdfProduct, setViewPdfProduct] = useState<Product | null>(null);
  const [pdfZoom, setPdfZoom] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'sowing' | 'nutrients' | 'irrigation' | 'protection'>('overview');
  
  // Calculator state inside details
  const [acreageInput, setAcreageInput] = useState<string>('5');
  const [calculatorResults, setCalculatorResults] = useState<{ bags: number; yieldMin: number; yieldMax: number } | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  const crops = ['All', 'Maize', 'Paddy', 'Wheat', 'Mustard', 'Millet', 'SSG', 'Urad', 'Moong'];

  const filteredProducts = selectedCrop === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => {
        const cropLower = p.cropType.toLowerCase();
        const selLower = selectedCrop.toLowerCase();
        if (selLower === 'millet' || selLower === 'bajra') {
          return cropLower === 'millet' || cropLower === 'bajra';
        }
        return cropLower === selLower;
      });

  const t = {
    English: {
      header: 'PREMIUM SEED CATALOG & AGRONOMY HUB',
      title: 'Our Elite Hybrids',
      filterTitle: 'Explore Crop Collections',
      btnCompare: 'Compare Seeds',
      btnDownload: 'Download Brochure',
      btnPractice: 'Package of Practices (POP)',
      specYield: 'Expected Yield',
      specDuration: 'Growth Duration',
      specResistance: 'Disease Resistance',
      specGermination: 'Germination rate',
      specSoil: 'Ideal Soil Type',
      specWater: 'Irrigation Need',
      specClimate: 'Climate Suitability',
      specHeight: 'Plant Height',
      specQuality: 'Grain Quality',
      tabOverview: 'Overview & Benefits',
      tabFarming: 'Farming Calendar',
      tabScience: 'Agronomic Specs',
      sowingWin: 'Sowing Window',
      harvestWin: 'Harvest Window',
      compareCap: 'Sra Shriji Hybrid Seed Comparison Matrix',
      compareSelect: 'Select up to 2 seeds to compare performance indexes side-by-side',
      cardTagline: 'Certified Hybrid Seed Pouch',
      viewMoreBtn: 'View Detail & POP Guide',
      catalogViewToggle: 'Browse our highly certified hybrids. Click any product card to open its agronomic Detail Page & view the official package of practices guides.'
    },
    Hindi: {
      header: 'प्रीमियम बीज सूची और कृषि विज्ञान केंद्र',
      title: 'हमारे मुख्य हाइब्रिड उत्पाद',
      filterTitle: 'फसल श्रेणियां खोजें',
      btnCompare: 'तुलना करें',
      btnDownload: 'ब्रोशर डाउनलोड करें',
      btnPractice: 'खेती की विधि (POP)',
      specYield: 'अनुमानित उपज',
      specDuration: 'फसल की अवधि',
      specResistance: 'रोग प्रतिरोधकता',
      specGermination: 'अंकुरण क्षमता',
      specSoil: 'उपयुक्त मिट्टी',
      specWater: 'सिंचाई आवश्यकता',
      specClimate: 'जलवायु अनुकूलता',
      specHeight: 'पौधे की ऊंचाई',
      specQuality: 'अनाज गुणवत्ता',
      tabOverview: 'विवरण और लाभ',
      tabFarming: 'खेती कैलेंडर',
      tabScience: 'कृषि विज्ञान',
      sowingWin: 'बुवाई का समय',
      harvestWin: 'कटाई का समय',
      compareCap: 'स्रा श्रीजी हाइब्रिड बीज प्रदर्शन तुलना चार्ट',
      compareSelect: 'तुलना के लिए अधिकतम 2 बीजों का चयन करें',
      cardTagline: 'प्रमाणित हाइब्रिड बीज पैकेट',
      viewMoreBtn: 'विवरण और POP गाइड देखें',
      catalogViewToggle: 'हमारे प्रमाणित हाइब्रिड बीजों की खोज करें। कृषि संबंधी विवरण और खेती की मार्गदर्शिका (POP PDF) देखने के लिए किसी भी कार्ड पर क्लिक करें।'
    },
    Punjabi: {
      header: 'ਪ੍ਰੀਮੀਅਮ ਬੀਜ ਸੂਚੀ ਅਤੇ ਖੇਤੀਬਾੜੀ ਹੱਬ',
      title: 'ਸਾਡੇ ਪ੍ਰੀਮੀਅਮ ਹਾਈਬ੍ਰਿਡ ਬੀਜ',
      filterTitle: 'ਫਸਲ ਸ਼੍ਰੇਣੀਆਂ',
      btnCompare: 'ਬੀਜਾਂ ਦੀ ਤੁਲਨਾ',
      btnDownload: 'ਬ੍ਰੋਸ਼ਰ ਡਾਊਨਲੋਡ',
      btnPractice: 'ਖੇਤੀ ਦੀ ਵਿਧੀ (POP)',
      specYield: 'ਅਨੁਮਾਨਿਤ ਝਾੜ',
      specDuration: 'ਫਸਲ ਦੀ ਮਿਆਦ',
      specResistance: 'ਬਿਮਾਰੀ ਪ੍ਰਤੀਰੋਧਕਤਾ',
      specGermination: 'ਉਗਣ ਦੀ ਦਰ',
      specSoil: 'ਢੁਕਵੀਂ ਮਿੱਟੀ',
      specWater: 'ਸਿੰਚਾਈ ਲੋੜ',
      specClimate: 'ਮੌਸਮ ਅਨੁਕੂਲਤਾ',
      specHeight: 'ਬੂਟੇ ਦੀ ਉਚਾਈ',
      specQuality: 'ਅਨਾਜ ਗੁਣਵੱਤਾ',
      tabOverview: 'ਵੇਰਵਾ ਅਤੇ ਫਾਇਦੇ',
      tabFarming: 'ਖੇਤੀਬਾੜੀ ਕੈਲੰਡਰ',
      tabScience: 'ਖੇਤੀਬਾੜੀ ਵਿਗਿਆਨ',
      sowingWin: 'ਬੀਜਣ ਦਾ ਸਮਾਂ',
      harvestWin: 'ਕਟਾਈ ਦਾ ਸਮਾਂ',
      compareCap: 'ਸਰਾ ਸ਼੍ਰੇਜੀ ਹਾਈਬ੍ਰਿਡ ਬੀਜ ਤੁਲਨਾ ਚਾਰਟ',
      compareSelect: 'ਤੁਲਨਾ ਕਰਨ ਲਈ 2 ਬੀਜ ਚੁਣੋ',
      cardTagline: 'ਪ੍ਰਮਾਣਿਤ ਹਾਈਬ੍ਰਿਡ ਬੀਜ ਪੈਕੇਟ',
      viewMoreBtn: 'ਵੇਰਵਾ ਅਤੇ POP ਗਾਈਡ ਦੇਖੋ',
      catalogViewToggle: 'ਸਾਡੇ ਪ੍ਰਮਾਣਿਤ ਹਾਈਬ੍ਰਿਡ ਬੀਜ ਦੇਖੋ। ਖੇਤੀ ਸੰਬੰਧੀ ਵੇਰਵੇ ਅਤੇ ਅਧਿਕਾਰਤ ਖੇਤੀ ਦੀ ਗਾਈਡ (POP PDF) ਦੇਖਣ ਲਈ ਕਿਸੇ ਵੀ ਉਤਪਾਦ ਕਾਰਡ ਤੇ ਕਲਿੱਕ ਕਰੋ।'
    }
  }[currentLang];

  const modalT = {
    English: {
      popGuideTitle: 'Package of Practices (POP) Official Guide',
      popSubtitle: 'SRA SHRIJI Certified Agronomy & Cultivation Schedule',
      tabs: {
        overview: 'Agronomic Specs',
        sowing: 'Sowing & Seed Rate',
        nutrient: 'Integrated Nutrients',
        irrigation: 'Irrigation Schedule',
        disease: 'Crop Protection'
      },
      calculator: {
        title: 'Interactive Sowing Planner',
        label: 'Enter your Farm Acreage (Acre):',
        btn: 'Calculate Sowing Needs',
        result: 'Based on official specifications:',
        bagsNeeded: 'Required Seeds:',
        bags: 'Bags of 4Kg each',
        yieldEst: 'Expected Yield:',
        quintals: 'Quintals total harvest'
      },
      downloadPDF: 'Open Interactive PDF Viewer',
      downloadBrochure: 'Download Brochure PDF',
      printGuide: 'Print POP Sheet',
      sowingWin: 'Optimal Sowing Window',
      harvestWin: 'Optimal Harvest Window',
      estimatedYield: 'Expected Yield Potential',
      germination: 'Certified Germination Rate',
      waterNeeds: 'Irrigation Frequency',
      soilCompatibility: 'Recommended Soil Type',
      diseaseResistance: 'Immunities & Protections',
      cropDuration: 'Crop Cycle Duration',
      askAI: 'Ask Sra AI about this hybrid',
      close: 'Close Window',
      viewDealers: 'Locate Nearest Dealer',
      pdfGenerating: 'Generating POP Guide PDF...',
      pdfSuccess: 'POP Guide PDF generated and downloaded successfully!',
      landPrep: 'Land Preparation',
      seedTreatment: 'Seed Treatment Protocol',
      weedControl: 'Weed Control Schedule'
    },
    Hindi: {
      popGuideTitle: 'खेती की उन्नत विधि (POP) आधिकारिक मार्गदर्शिका',
      popSubtitle: 'स्रा श्रीजी प्रमाणित कृषि विज्ञान और खेती कार्यक्रम',
      tabs: {
        overview: 'कृषि संबंधी जानकारी',
        sowing: 'बुवाई और बीज दर',
        nutrient: 'खाद एवं उर्वरक',
        irrigation: 'सिंचाई कार्यक्रम',
        disease: 'फसल सुरक्षा'
      },
      calculator: {
        title: 'इंटरैक्टिव बुवाई योजनाकार',
        label: 'अपने खेत का आकार दर्ज करें (एकड़ में):',
        btn: 'बुवाई की जरूरतों की गणना करें',
        result: 'आधिकारिक विनिर्देशों के आधार पर:',
        bagsNeeded: 'आवश्यक बीज मात्रा:',
        bags: 'बैग (प्रति बैग 4Kg)',
        yieldEst: 'अनुमानित कुल पैदावार:',
        quintals: 'क्विंटल कुल कटाई'
      },
      downloadPDF: 'इंटरैक्टिव पीडीएफ व्यूअर खोलें',
      downloadBrochure: 'विवरण ब्रोशर डाउनलोड करें',
      printGuide: 'खेती गाइड प्रिंट करें',
      sowingWin: 'बुवाई का सर्वोत्तम समय',
      harvestWin: 'कटाई का सर्वोत्तम समय',
      estimatedYield: 'अनुमानित उपज क्षमता',
      germination: 'प्रमाणित अंकुरण दर',
      waterNeeds: 'सिंचाई की आवश्यकता',
      soilCompatibility: 'उपयुक्त मिट्टी का प्रकार',
      diseaseResistance: 'रोग प्रतिरोधकता स्तर',
      cropDuration: 'फसल चक्र की अवधि',
      askAI: 'स्रा एआई से इस हाइब्रिड के बारे में पूछें',
      close: 'खिड़की बंद करें',
      viewDealers: 'निकटतम डीलर खोजें',
      pdfGenerating: 'POP पीडीएफ गाइड तैयार की जा रही है...',
      pdfSuccess: 'POP पीडीएफ गाइड सफलतापूर्वक तैयार और डाउनलोड की गई!',
      landPrep: 'खेत की तैयारी',
      seedTreatment: 'बीज उपचार विधि',
      weedControl: 'खरपतवार नियंत्रण'
    },
    Punjabi: {
      popGuideTitle: 'ਖੇਤੀਬਾੜੀ ਦੀ ਉੱਨਤ ਵਿਧੀ (POP) ਅਧਿਕਾਰਤ ਗਾਈਡ',
      popSubtitle: 'ਸਰਾ ਸ਼੍ਰੀਜੀ ਪ੍ਰਮਾਣਿਤ ਖੇਤੀਬਾੜੀ ਵਿਗਿਆਨ ਅਤੇ ਬਿਜਾਈ ਸਮਾਂ-ਸਾਰਣੀ',
      tabs: {
        overview: 'ਖੇਤੀਬਾੜੀ ਸੰਬੰਧੀ ਵੇਰਵੇ',
        sowing: 'ਬਿਜਾਈ ਅਤੇ ਬੀਜ ਦਰ',
        nutrient: 'ਖਾਦ ਅਤੇ ਪੋਸ਼ਣ',
        irrigation: 'ਸਿੰਚਾਈ ਸਮਾਂ-ਸਾਰਣੀ',
        disease: 'ਫਸਲ ਦੀ ਸੁਰੱਖਿਆ',
      },
      calculator: {
        title: 'ਬਿਜਾਈ ਯੋਜਨਾਕਾਰ',
        label: 'ਆਪਣੇ ਖੇਤ ਦਾ ਆਕਾਰ ਦਰਜ ਕਰੋ (ਏਕੜ):',
        btn: 'ਬਿਜਾਈ ਲੋੜਾਂ ਦੀ ਗਣਨਾ ਕਰੋ',
        result: 'ਅਧਿਕਾਰਤ ਵੇਰਵਿਆਂ ਦੇ ਅਧਾਰ ਤੇ:',
        bagsNeeded: 'ਲੋੜੀਂਦੀ ਬੀਜ ਮਾਤਰਾ:',
        bags: 'ਬੈਗ (ਪ੍ਰਤੀ ਬੈਗ 4Kg)',
        yieldEst: 'ਅਨੁਮਾਨਿਤ ਕੁੱਲ ਝਾੜ:',
        quintals: 'ਕੁਇੰਟਲ ਕੁੱਲ ਵਾਢੀ'
      },
      downloadPDF: 'ਪੀਡੀਐਫ ਵਿਊਅਰ ਖੋਲ੍ਹੋ',
      downloadBrochure: 'ਵੇਰਵਾ ਬ੍ਰੋਸ਼ਰ ਡਾਊਨਲੋਡ ਕਰੋ',
      printGuide: 'ਗਾਈਡ ਪ੍ਰਿੰਟ ਕਰੋ',
      sowingWin: 'ਬਿਜਾਈ ਦਾ ਢੁਕਵਾਂ ਸਮਾਂ',
      harvestWin: 'ਕਟਾਈ ਦਾ ਢੁਕਵਾਂ ਸਮਾਂ',
      estimatedYield: 'ਅਨੁਮਾਨਿਤ ਝਾੜ ਸਮਰੱਥਾ',
      germination: 'ਪ੍ਰਮਾਣਿਤ ਉਗਣ ਦਰ',
      waterNeeds: 'ਸਿੰਚਾਈ ਦੀ ਲੋੜ',
      soilCompatibility: 'ਸਿਫਾਰਸ਼ ਕੀਤੀ ਮਿੱਟੀ',
      diseaseResistance: 'ਬਿਮਾਰੀ ਪ੍ਰਤੀ ਰੋਧਕਤਾ',
      cropDuration: 'ਫਸਲ ਚੱਕਰ ਦੀ ਮਿਆਦ',
      askAI: 'ਇਸ ਹਾਈਬ੍ਰਿਡ ਬਾਰੇ ਸਰਾ ਏਆਈ ਨੂੰ ਪੁੱਛੋ',
      close: 'ਬੰਦ ਕਰੋ',
      viewDealers: 'ਨੇੜਲਾ ਡੀਲਰ ਲੱਭੋ',
      pdfGenerating: 'POP ਪੀਡੀਐਫ ਗਾਈਡ ਤਿਆਰ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...',
      pdfSuccess: 'POP ਪੀਡੀਐਫ ਗਾਈਡ ਸਫਲਤਾਪੂਰਵਕ ਡਾਊਨਲੋਡ ਕੀਤੀ ਗਈ!',
      landPrep: 'ਖੇਤ ਦੀ ਤਿਆਰੀ',
      seedTreatment: 'ਬੀਜ ਸੋਧ ਵਿਧੀ',
      weedControl: 'ਨਦੀਨ ਰੋਕਥਾਮ'
    }
  }[currentLang];

  const handleCompareToggle = (prod: Product) => {
    if (compareList.some(item => item.id === prod.id)) {
      setCompareList(compareList.filter(item => item.id !== prod.id));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[0], prod]);
      } else {
        setCompareList([...compareList, prod]);
      }
    }
  };

  const simulateDownload = (docName: string) => {
    setDownloadedDoc(docName);
    setTimeout(() => {
      setDownloadedDoc(null);
    }, 3000);
  };

  const handleCalculateNeeds = (prod: Product) => {
    const acreage = parseFloat(acreageInput);
    if (isNaN(acreage) || acreage <= 0) return;

    // Standard Maize/Paddy/Wheat calculations
    let seedRatePerAcreInKg = 4; // default
    const crop = prod.cropType.toLowerCase();
    if (crop.includes('maize')) seedRatePerAcreInKg = 8;
    if (crop.includes('paddy')) seedRatePerAcreInKg = 6;
    if (crop.includes('wheat')) seedRatePerAcreInKg = 40;
    if (crop.includes('mustard')) seedRatePerAcreInKg = 2;
    if (crop.includes('millet')) seedRatePerAcreInKg = 1.5;

    const totalKg = acreage * seedRatePerAcreInKg;
    const bags = Math.ceil(totalKg / 4);

    // Parse yield
    // e.g. "34 - 38 Quintals/Acre"
    const numbers = prod.expectedYield.match(/\d+/g);
    let minYield = 30;
    let maxYield = 35;
    if (numbers && numbers.length >= 2) {
      minYield = parseInt(numbers[0]);
      maxYield = parseInt(numbers[1]);
    } else if (numbers && numbers.length === 1) {
      minYield = parseInt(numbers[0]);
      maxYield = minYield + 5;
    }

    setCalculatorResults({
      bags,
      yieldMin: Math.round(acreage * minYield),
      yieldMax: Math.round(acreage * maxYield)
    });
  };

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const openProductDetail = (prod: Product) => {
    setActiveProduct(prod);
    setDetailProduct(prod);
    setActiveTab('overview');
    // Initialize calculator
    setAcreageInput('5');
    setCalculatorResults(null);
  };

  const triggerAIAssistant = (pName: string) => {
    // Scroll to AI chatbot widget or dispatch event
    const prompt = `Can you provide a detailed farming layout, disease prevention calendar, and integrated pest management instructions for SRA ${pName} seeds?`;
    
    // Check if widget is active or just set window global
    const inputEl = document.getElementById('ai-assistant-input') as HTMLTextAreaElement | HTMLInputElement;
    if (inputEl) {
      inputEl.value = prompt;
      inputEl.focus();
    }
    
    const widgetBtn = document.getElementById('ai-widget-trigger');
    if (widgetBtn) {
      widgetBtn.click();
    }
    
    setDetailProduct(null);
  };

  const triggerPrint = () => {
    window.print();
  };

  const filterCategories = [
    { key: 'All', labelEn: 'All Hybrids', labelHi: 'सभी हाइब्रिड', labelPa: 'ਸਾਰੇ ਹਾਈਬ੍ਰਿਡ', icon: <Leaf className="h-4 w-4" /> },
    { key: 'Mustard', labelEn: 'Mustard', labelHi: 'सरसों', labelPa: 'ਸਰ੍ਹੋਂ', icon: <Sun className="h-4 w-4 text-amber-500 animate-pulse" /> },
    { key: 'Millet', labelEn: 'Bajra (Millet)', labelHi: 'बाजरा', labelPa: 'ਬਾਜਰਾ', icon: <Sprout className="h-4 w-4 text-emerald-600" /> },
    { key: 'Paddy', labelEn: 'Paddy', labelHi: 'धान (Paddy)', labelPa: 'ਝੋਨਾ (Paddy)', icon: <Droplet className="h-4 w-4 text-blue-500" /> },
    { key: 'Wheat', labelEn: 'Wheat', labelHi: 'गेहूं (Kanak)', labelPa: 'ਕਣਕ (Kanak)', icon: <Sprout className="h-4 w-4 text-yellow-600" /> },
    { key: 'Maize', labelEn: 'Maize', labelHi: 'मक्का', labelPa: 'ਮੱਕੀ', icon: <Flame className="h-4 w-4 text-orange-500" /> },
    { key: 'SSG', labelEn: 'SSG (Fodder)', labelHi: 'एसएसजी चारा', labelPa: 'ਐਸ.ਐਸ.ਜੀ', icon: <Sprout className="h-4 w-4 text-green-500" /> },
    { key: 'Moong', labelEn: 'Moong', labelHi: 'मूंग', labelPa: 'ਮੂੰਗੀ', icon: <Leaf className="h-4 w-4 text-emerald-500" /> },
    { key: 'Urad', labelEn: 'Urad', labelHi: 'उड़द', labelPa: 'ਮਾਂਹ', icon: <Leaf className="h-4 w-4 text-emerald-700" /> },
  ];

  const getCropCount = (key: string) => {
    if (key === 'All') return PRODUCTS.length;
    const keyLower = key.toLowerCase();
    return PRODUCTS.filter(p => {
      const cropLower = p.cropType.toLowerCase();
      if (keyLower === 'bajra' || keyLower === 'millet') {
        return cropLower === 'millet' || cropLower === 'bajra';
      }
      return cropLower === keyLower;
    }).length;
  };

  return (
    <section className="py-24 bg-[#f8fafc] relative border-b border-gray-100" id="products">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-10">
          <span className="text-xs tracking-widest font-black text-brand-green uppercase font-display block">
            {t.header}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 font-display">
            {t.title}
          </h2>
          <div className="h-1.5 w-24 bg-brand-amber mx-auto rounded-full" />
          <p className="text-sm text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            {t.catalogViewToggle}
          </p>
        </div>

        {/* Type-wise Filter Tabs */}
        <div className="flex flex-col items-center mb-12 w-full" id="crop-filter-tabs-container">
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-4 text-center">
            {currentLang === 'Hindi' ? 'फसल प्रकार के अनुसार फ़िल्टर करें' : currentLang === 'Punjabi' ? 'ਫਸਲ ਦੀ ਕਿਸਮ ਅਨੁਸਾਰ ਫਿਲਟਰ ਕਰੋ' : 'Filter by Crop Type'}
          </p>
          <div className="w-full overflow-x-auto scrollbar-none py-1 flex items-center justify-start md:justify-center gap-2.5 px-4 max-w-full">
            {filterCategories.map((cat) => {
              const label = currentLang === 'Hindi' ? cat.labelHi : currentLang === 'Punjabi' ? cat.labelPa : cat.labelEn;
              const count = getCropCount(cat.key);
              const isActive = selectedCrop === cat.key || 
                (cat.key === 'Millet' && (selectedCrop === 'Millet' || selectedCrop === 'Bajra')) || 
                (cat.key === 'Bajra' && (selectedCrop === 'Millet' || selectedCrop === 'Bajra'));

              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCrop(cat.key)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-black whitespace-nowrap transition-all border shadow-xs hover:scale-102 active:scale-98 cursor-pointer ${
                    isActive
                      ? 'bg-brand-green border-brand-green text-white shadow-md shadow-brand-green/25'
                      : 'bg-white border-gray-150 text-gray-600 hover:text-brand-green hover:border-brand-green/30 hover:bg-brand-green/5'
                  }`}
                >
                  {cat.icon}
                  <span>{label}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold ${isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>



        {/* SECTION: SEED CAROUSEL / SLIDE FORMAT */}
        <div className="relative mb-14" id="packet-carousel-container">
          
          {/* Slide Buttons */}
          <button
            onClick={slideLeft}
            className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-brand-dark p-3.5 rounded-full shadow-xl border border-gray-100 hover:scale-105 active:scale-95 transition-all hidden sm:flex items-center justify-center cursor-pointer"
            aria-label="Slide Left"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>
          
          <button
            onClick={slideRight}
            className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-brand-dark p-3.5 rounded-full shadow-xl border border-gray-100 hover:scale-105 active:scale-95 transition-all hidden sm:flex items-center justify-center cursor-pointer"
            aria-label="Slide Right"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Horizontally scrolling list of elegant white packets */}
          <div
            ref={sliderRef}
            className="flex items-stretch overflow-x-auto gap-6 pb-8 pt-2 scroll-smooth snap-x snap-mandatory no-scrollbar px-2"
            style={{ WebkitOverflowScrolling: 'touch' }}
            id="seed-packets-slider"
          >
            {filteredProducts.map((p) => {
              const isSelectedActive = activeProduct.id === p.id;
              
              // Map name to display format: BAG + name (without SRA if starts with SRA)
              const displaySeedName = p.name.startsWith('SRA') 
                ? p.name.replace('SRA', 'BAG').trim() 
                : `BAG ${p.name}`;

              // Determine default bag weight
              const sizeLabel = p.availableSizes && p.availableSizes.length > 0 
                ? `${p.availableSizes[0].toUpperCase()} Pack`
                : '4Kg Pack';
              
              return (
                <div
                  key={p.id}
                  onClick={() => openProductDetail(p)}
                  className={`flex-shrink-0 w-72 md:w-[310px] snap-start cursor-pointer transition-all duration-300 ${
                    isSelectedActive 
                      ? 'scale-[1.02] shadow-[0_20px_40px_rgba(15,23,42,0.08)]' 
                      : 'hover:shadow-[0_15px_30px_rgba(15,23,42,0.05)] hover:scale-[1.01]'
                  }`}
                  id={`packet-slide-${p.id}`}
                >
                  {/* Clean Elegant White Card conforming to user-uploaded image */}
                  <div className="bg-white rounded-[28px] border border-gray-100 p-5 flex flex-col justify-between h-full shadow-sm relative overflow-hidden group">
                    
                    {/* Centered Image inside light gray frame */}
                    <div className="bg-[#f4f7f6] rounded-[22px] p-5 aspect-square flex items-center justify-center relative overflow-hidden mb-4 border border-gray-50">
                      
                      {/* White inner margin line to frame it neatly like the image */}
                      <div className="absolute inset-2 border border-white/60 rounded-[18px] pointer-events-none" />
                      
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Badge row directly under the image container */}
                    <div className="flex justify-between items-center px-1 mb-2">
                      <span className="text-[10px] tracking-wider font-extrabold text-emerald-700 bg-emerald-50/70 border border-emerald-100/50 px-2.5 py-1 rounded-md uppercase font-sans">
                        {p.cropType}
                      </span>
                      <span className="text-[11px] font-bold text-gray-500">
                        {sizeLabel}
                      </span>
                    </div>

                    {/* Premium Bold Title */}
                    <div className="px-1 text-left">
                      <h4 className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900 font-sans leading-tight">
                        {displaySeedName} Hybrid {p.cropType}
                      </h4>
                      
                      {/* Brief description that clamps perfectly */}
                      <p className="text-xs text-gray-400 font-medium leading-relaxed mt-2 line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    {/* Dynamic micro features preview */}
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between px-1">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold uppercase">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{p.rating} Rating</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-brand-green uppercase tracking-wider flex items-center gap-1 group-hover:text-emerald-500 transition-colors">
                        {t.viewMoreBtn}
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>

                    {/* Highlighted active ring */}
                    {isSelectedActive && (
                      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-brand-green" />
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Comparison Matrix */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-brand-dark font-black px-6 py-3 rounded-full text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <ArrowRightLeft className="h-4 w-4 text-brand-green" />
            {t.btnCompare} ({compareList.length}/2 Selected)
          </button>
        </div>

        {showComparison && (
          <div className="mt-6 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl text-left">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
              <div>
                <h4 className="text-md font-bold text-gray-900 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-brand-green" />
                  {t.compareCap}
                </h4>
                <p className="text-xs text-gray-500">
                  {t.compareSelect}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCompareList([])}
                  className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1 border border-red-100 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {PRODUCTS.map(p => {
                const isCompared = compareList.some(item => item.id === p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => handleCompareToggle(p)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isCompared 
                        ? 'border-brand-green bg-emerald-50/40 text-brand-green' 
                        : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900">BAG {p.name.replace('SRA', '').trim()}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{p.cropType}</p>
                    </div>
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black ${
                      isCompared ? 'bg-brand-green border-brand-green text-white' : 'border-gray-300 text-transparent'
                    }`}>
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>

            {compareList.length > 0 ? (
              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="w-full text-xs text-left text-gray-700">
                  <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <tr>
                      <th className="p-4">Performance Indicators</th>
                      {compareList.map(p => (
                        <th key={p.id} className="p-4 text-brand-green font-black text-sm">
                          BAG {p.name.replace('SRA', '').trim()} ({p.cropType})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    <tr>
                      <td className="p-4 font-semibold text-gray-500 uppercase tracking-wide">Expected Yield</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4 text-emerald-600 font-black text-sm">{p.expectedYield}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-gray-500 uppercase tracking-wide">Germination Rate</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4 font-extrabold text-gray-900">{p.germinationRate}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-gray-500 uppercase tracking-wide">Growth Cycle</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4 text-gray-900">{p.growthDuration}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-gray-500 uppercase tracking-wide">Sowing Schedule</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4 text-gray-900 font-bold text-brand-green">{p.sowingWindow}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-gray-500 uppercase tracking-wide">Disease Protections</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4">
                          <div className="flex flex-col gap-1">
                            {p.diseaseResistance.map((r, i) => (
                              <span key={i} className="text-[10px] text-brand-gold font-black">✔ {r}</span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-gray-500 uppercase tracking-wide">Climatic Resistance</td>
                      {compareList.map(p => (
                        <td key={p.id} className="p-4 text-gray-700">{p.climateSuitability}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-400 italic">
                (Choose 1 or 2 seed products above to compare performance indexes side-by-side)
              </div>
            )}
          </div>
        )}

      </div>

      {/* IMMERSIVE PRODUCT DETAIL PAGE / MODAL OVERLAY */}
      <AnimatePresence>
        {detailProduct && (
          <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[32px] max-w-5xl w-full text-left relative overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh]"
            >
              
              {/* Close Button & Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4.5 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-brand-green animate-pulse" />
                  <span className="text-xs font-black text-brand-green uppercase tracking-widest font-sans">
                    {detailProduct.cropType} Seed Technical Sheet
                  </span>
                </div>
                <button
                  onClick={() => setDetailProduct(null)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all cursor-pointer shadow-inner"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-1">
                
                {/* Hero section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left: Seed Pouch display inside gray card */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="bg-[#f4f7f6] rounded-[24px] p-6 aspect-square w-full max-w-[320px] flex items-center justify-center relative overflow-hidden shadow-inner border border-gray-50">
                      {/* Double frame effect */}
                      <div className="absolute inset-2.5 border border-white/60 rounded-[20px]" />
                      <img 
                        src={detailProduct.image} 
                        alt={detailProduct.name} 
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain drop-shadow-xl"
                      />
                    </div>

                    {/* Size and Weight indicators */}
                    <div className="flex gap-2.5 mt-4">
                      {detailProduct.availableSizes.map(size => (
                        <span key={size} className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                          {size} Size Pack
                        </span>
                      ))}
                    </div>

                    {/* Interactive Sowing Calculator */}
                    <div className="w-full mt-6 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl p-4 text-left">
                      <h4 className="text-xs font-black text-brand-green uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                        <Scale className="h-4 w-4" />
                        {modalT.calculator.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-semibold mb-3">
                        Calculate the recommended seed pouches and potential harvest yield for your acreage.
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                            {modalT.calculator.label}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="1"
                              value={acreageInput}
                              onChange={(e) => setAcreageInput(e.target.value)}
                              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold w-24 outline-none focus:border-brand-green"
                            />
                            <button
                              onClick={() => handleCalculateNeeds(detailProduct)}
                              className="bg-brand-green hover:bg-brand-green/90 text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wide transition-all cursor-pointer"
                            >
                              {modalT.calculator.btn}
                            </button>
                          </div>
                        </div>

                        {calculatorResults && (
                          <div className="p-3 bg-white border border-emerald-100/40 rounded-xl space-y-1.5 text-xs">
                            <p className="text-gray-400 font-semibold text-[10px] uppercase tracking-wider">
                              {modalT.calculator.result}
                            </p>
                            <div className="flex justify-between border-b border-gray-50 pb-1">
                              <span className="text-gray-500 font-semibold">{modalT.calculator.bagsNeeded}</span>
                              <span className="font-extrabold text-brand-green">{calculatorResults.bags} {modalT.calculator.bags}</span>
                            </div>
                            <div className="flex justify-between pt-0.5">
                              <span className="text-gray-500 font-semibold">{modalT.calculator.yieldEst}</span>
                              <span className="font-extrabold text-brand-gold">{calculatorResults.yieldMin} - {calculatorResults.yieldMax} {modalT.calculator.quintals}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Technical Sheet specs */}
                  <div className="md:col-span-7 space-y-5">
                    <div>
                      <span className="text-[10px] tracking-widest font-extrabold text-brand-green bg-emerald-50/70 border border-emerald-100/50 px-2.5 py-1 rounded-md uppercase font-sans">
                        Balaji Agri Seeds Elite Range
                      </span>
                      <h2 className="text-2xl md:text-3.5xl font-black text-gray-900 font-display mt-3 tracking-tight">
                        BAG {detailProduct.name.replace('SRA', '').trim()} Hybrid {detailProduct.cropType}
                      </h2>
                      <p className="text-xs font-serif italic text-brand-gold font-bold mt-1">
                        "{detailProduct.tagline}"
                      </p>
                    </div>

                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      {detailProduct.description}
                    </p>

                    {/* Grid of micro specifications */}
                    <div className="grid grid-cols-2 gap-3.5 pt-2">
                      <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">{modalT.estimatedYield}</span>
                        <span className="text-xs font-extrabold text-gray-900 mt-1 block">{detailProduct.expectedYield}</span>
                      </div>

                      <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">{modalT.cropDuration}</span>
                        <span className="text-xs font-extrabold text-gray-900 mt-1 block">{detailProduct.growthDuration}</span>
                      </div>

                      <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">{modalT.soilCompatibility}</span>
                        <span className="text-[11px] font-extrabold text-gray-900 mt-1 block leading-tight">{detailProduct.soilCompatibility}</span>
                      </div>

                      <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">{modalT.waterNeeds}</span>
                        <span className="text-[11px] font-extrabold text-gray-900 mt-1 block leading-tight">{detailProduct.waterAvailability}</span>
                      </div>
                    </div>

                    {/* Calendar blocks */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-amber-50/20 border border-amber-100/40 p-3 rounded-xl">
                        <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {modalT.sowingWin}
                        </span>
                        <span className="text-xs font-black text-gray-800 mt-1 block">{detailProduct.sowingWindow}</span>
                      </div>
                      <div className="bg-amber-50/20 border border-amber-100/40 p-3 rounded-xl">
                        <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {modalT.harvestWin}
                        </span>
                        <span className="text-xs font-black text-gray-800 mt-1 block">{detailProduct.harvestWindow}</span>
                      </div>
                    </div>

                    {/* Actions and Document Links */}
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <button
                        onClick={() => setViewPdfProduct(detailProduct)}
                        className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                      >
                        <FileText className="h-4 w-4" />
                        {modalT.downloadPDF}
                      </button>

                      <button
                        onClick={() => triggerAIAssistant(detailProduct.name)}
                        className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-black px-4 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <HelpCircle className="h-4 w-4 text-emerald-500" />
                        {modalT.askAI}
                      </button>
                    </div>

                  </div>
                </div>

                {/* TABBED AGRONOMIC SCHEDULES & MANUALS */}
                <div className="border-t border-gray-100 pt-6">
                  
                  {/* Tab Selector */}
                  <div className="flex border-b border-gray-100 gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                    {(Object.keys(modalT.tabs) as Array<keyof typeof modalT.tabs>).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3.5 px-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                          activeTab === tab
                            ? 'border-brand-green text-brand-green'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {modalT.tabs[tab]}
                      </button>
                    ))}
                  </div>

                  {/* Tab contents */}
                  <div className="py-6 min-h-[220px]">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Features */}
                          <div className="space-y-3">
                            <h4 className="text-xs uppercase font-extrabold text-brand-green tracking-wider flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4" />
                              Key Varietal Features
                            </h4>
                            <div className="space-y-2">
                              {detailProduct.features.map((f, i) => (
                                <div key={i} className="flex gap-2 items-start text-xs font-bold text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100/50">
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1.5 flex-shrink-0" />
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Benefits */}
                          <div className="space-y-3">
                            <h4 className="text-xs uppercase font-extrabold text-brand-gold tracking-wider flex items-center gap-1.5">
                              <Sprout className="h-4 w-4" />
                              Farming Benefits
                            </h4>
                            <div className="space-y-2">
                              {detailProduct.benefits.map((b, i) => (
                                <div key={i} className="flex gap-2 items-start text-xs font-bold text-gray-700 bg-amber-50/10 p-2.5 rounded-xl border border-amber-100/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 flex-shrink-0" />
                                  <span>{b}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Extra agronomic facts */}
                        <div className="bg-[#f4f7f6] rounded-2xl p-4.5 border border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div>
                            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest block">{modalT.germination}</span>
                            <span className="text-xs font-extrabold text-gray-800 mt-1 block">{detailProduct.germinationRate}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest block">Plant Average Height</span>
                            <span className="text-xs font-extrabold text-gray-800 mt-1 block">{detailProduct.height || '210 - 230 cm'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest block">Certified Grain Quality</span>
                            <span className="text-xs font-extrabold text-gray-800 mt-1 block">{detailProduct.grainQuality || 'Premium uniform grains'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'sowing' && (
                      <div className="space-y-5 text-xs text-gray-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h5 className="font-extrabold text-gray-900 flex items-center gap-1.5 mb-2">
                              <FileCheck className="h-4 w-4 text-brand-green" />
                              {modalT.landPrep}
                            </h5>
                            <p className="font-medium text-gray-500 leading-relaxed">
                              Deep summer ploughing is recommended. Add 10-15 tonnes of farmyard manure (FYM) per acre during field preparation. Ensure proper drainage channel networks to avoid stagnation during heavy monsoon showers.
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h5 className="font-extrabold text-gray-900 flex items-center gap-1.5 mb-2">
                              <ShieldCheck className="h-4 w-4 text-brand-green" />
                              {modalT.seedTreatment}
                            </h5>
                            <p className="font-medium text-gray-500 leading-relaxed">
                              Seeds are pre-treated. If dressing locally, treat seeds with Carboxin + Thiram at 2g per Kg seed to protect against seed-borne downy mildew and seedling rot diseases. Allow drying in shade before sowing.
                            </p>
                          </div>
                        </div>

                        <div className="bg-emerald-50/20 border border-emerald-100/50 p-4 rounded-xl space-y-2.5">
                          <h5 className="font-extrabold text-brand-green flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                            <Settings className="h-4 w-4" />
                            Sowing Parameters Matrix
                          </h5>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                            <div>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Depth</span>
                              <span className="font-extrabold text-gray-900 text-xs block mt-0.5">3.5 - 5 cm</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Row Spacing</span>
                              <span className="font-extrabold text-gray-900 text-xs block mt-0.5">60 cm</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Plant Spacing</span>
                              <span className="font-extrabold text-gray-900 text-xs block mt-0.5">20 cm</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Acreage Seed Rate</span>
                              <span className="font-extrabold text-gray-900 text-xs block mt-0.5">
                                {detailProduct.cropType.toLowerCase().includes('maize') ? '7.5 - 8 Kg' : '6 - 7 Kg'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'nutrients' && (
                      <div className="space-y-4 text-xs">
                        <div className="bg-emerald-50/10 border border-emerald-100/30 p-4.5 rounded-xl">
                          <h4 className="text-xs uppercase font-extrabold text-brand-green tracking-wider flex items-center gap-1.5 mb-2">
                            <Flame className="h-4 w-4 text-brand-green animate-bounce" />
                            Nitrogen, Phosphorus, and Potassium (N:P:K) Dosing Schedule
                          </h4>
                          <p className="font-bold text-gray-700 leading-relaxed">
                            {detailProduct.fertilizerGuide}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            <h5 className="font-black text-gray-900 mb-1 text-[11px] uppercase tracking-wide">Basal Application</h5>
                            <p className="text-gray-500 font-semibold leading-relaxed">
                              Apply 30% of nitrogen, 100% of phosphorus, and 100% of potassium at the time of sowing. Incorporate thoroughly.
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            <h5 className="font-black text-gray-900 mb-1 text-[11px] uppercase tracking-wide">First Top Dressing</h5>
                            <p className="text-gray-500 font-semibold leading-relaxed">
                              Apply 35% of nitrogen at knee-high stage (approx 25-30 days after sowing) after weeding. Ensure soil moisture.
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            <h5 className="font-black text-gray-900 mb-1 text-[11px] uppercase tracking-wide">Second Top Dressing</h5>
                            <p className="text-gray-500 font-semibold leading-relaxed">
                              Apply remaining 35% of nitrogen at pre-tasseling / flowering stage. Critical for maximum kernel filling.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'irrigation' && (
                      <div className="space-y-4 text-xs text-gray-700">
                        <div className="bg-amber-50/10 border border-amber-100/30 p-4.5 rounded-xl">
                          <h4 className="text-xs uppercase font-extrabold text-brand-gold tracking-wider flex items-center gap-1.5 mb-2">
                            <Droplet className="h-4 w-4 text-brand-gold animate-pulse" />
                            Irrigation Protocols & Moisture Checkpoints
                          </h4>
                          <p className="font-bold text-gray-700 leading-relaxed">
                            {detailProduct.irrigationGuide}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <h5 className="font-extrabold text-gray-900 mb-2">Critical Irrigation Checkpoint Stages:</h5>
                          <ul className="space-y-2 list-disc pl-4 text-gray-500 font-medium">
                            <li><strong className="text-gray-800">Seedling Stage</strong>: First 15 days, critical for establishment (avoid extreme ponding).</li>
                            <li><strong className="text-gray-800">Knee High Stage</strong>: Rapid vegetative expansion, requires stable damp moisture.</li>
                            <li><strong className="text-gray-800">Tasseling & Silking Stage</strong>: Most moisture critical stage, drought stress here decreases grain count by up to 50%.</li>
                            <li><strong className="text-gray-800">Grain Dough / Milk Stage</strong>: Solidifies kernels. Irrigate to maintain grain weight.</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeTab === 'protection' && (
                      <div className="space-y-4 text-xs text-gray-700">
                        <div className="bg-emerald-50/10 border border-emerald-100/30 p-4 rounded-xl flex items-start gap-3">
                          <ShieldCheck className="h-5 w-5 text-brand-green flex-shrink-0 mt-0.5" />
                          <div>
                            <h5 className="font-extrabold text-gray-900 mb-1">Pre-Vaccinated Disease Protections:</h5>
                            <p className="text-gray-500 font-medium leading-relaxed">
                              This hybrid has high genetic protection against {detailProduct.diseaseResistance.join(', ')}. No prophylactic sprays are needed for these specific conditions.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h5 className="font-extrabold text-red-600 flex items-center gap-1.5 mb-2">
                              <ShieldAlert className="h-4 w-4" />
                              Pest Watch: Fall Armyworm (FAW)
                            </h5>
                            <p className="text-gray-500 font-semibold leading-relaxed">
                              Monitor whorls for pin-hole damages. Spray Emamectin Benzoate 5% SG at 0.4g per Litre of water or Spinetoram 11.7% SC at 0.5ml per Litre on early infestation.
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h5 className="font-extrabold text-red-600 flex items-center gap-1.5 mb-2">
                              <ShieldAlert className="h-4 w-4" />
                              Fungal Stem Rot Prevention
                            </h5>
                            <p className="text-gray-500 font-semibold leading-relaxed">
                              Avoid excessive water-logging at roots. Spray Carbendazim + Mancozeb at 2g per Litre if stem wateriness or lower leaves decay is observed during vegetative steps.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-4.5 bg-gray-50 flex items-center justify-between">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  SRA SHRIJI SEEDS CO. © 2026 OFFICIAL POP AGRO REPORT
                </p>
                <button
                  onClick={() => setDetailProduct(null)}
                  className="bg-brand-dark hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  {modalT.close}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CERTIFIED HIGH-FIDELITY PDF VIEWER INTERACTIVE POP SYSTEM */}
      <AnimatePresence>
        {viewPdfProduct && (
          <div className="fixed inset-0 bg-brand-dark/95 backdrop-blur-md flex flex-col justify-between z-50 p-2 sm:p-4 font-sans">
            
            {/* PDF Toolbar */}
            <div className="bg-brand-dark border border-white/10 rounded-2xl p-3.5 mb-4 flex flex-wrap items-center justify-between gap-3 max-w-5xl mx-auto w-full shadow-2xl z-10">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-red-500" />
                <div className="text-left">
                  <h3 className="text-xs font-extrabold text-white leading-tight">
                    POP_GUIDE_SRA_{viewPdfProduct.name.replace('SRA', '').trim()}_HYBRID_{viewPdfProduct.cropType.toUpperCase()}.pdf
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Sra Shriji Certified Cultivation Manual • Secure PDF (Page 1 of 1)
                  </p>
                </div>
              </div>

              {/* Toolbar Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPdfZoom(z => Math.max(0.75, z - 0.1))}
                  className="w-9 h-9 bg-white/10 hover:bg-white/15 text-white rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-xs font-mono text-gray-300 px-1">
                  {Math.round(pdfZoom * 100)}%
                </span>
                <button
                  onClick={() => setPdfZoom(z => Math.min(1.5, z + 0.1))}
                  className="w-9 h-9 bg-white/10 hover:bg-white/15 text-white rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <button
                  onClick={() => {
                    simulateDownload(`POP_Guide_BAG_${viewPdfProduct.name.replace('SRA', '').trim()}`);
                    setViewPdfProduct(null);
                  }}
                  className="flex items-center gap-1.5 bg-brand-green hover:bg-brand-green/90 text-white text-xs font-black px-4 py-2 rounded-lg transition-all cursor-pointer shadow-md"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
                <button
                  onClick={triggerPrint}
                  className="w-9 h-9 bg-white/10 hover:bg-white/15 text-white rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                  title="Print Report"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewPdfProduct(null)}
                  className="w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center cursor-pointer transition-colors ml-2"
                  title="Exit Viewer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Document Body Area */}
            <div className="flex-1 overflow-auto flex justify-center items-start py-4 px-2 select-none">
              <div 
                style={{ transform: `scale(${pdfZoom})`, transformOrigin: 'top center' }}
                className="transition-transform duration-200 bg-white shadow-2xl border border-gray-200/50 p-12 max-w-[800px] w-full aspect-[1/1.414] text-left relative overflow-hidden"
                id="printable-pop-pdf"
              >
                {/* Diagonal stamp background */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 select-none pointer-events-none opacity-[0.03] text-center w-[120%]">
                  <span className="text-[60px] font-black tracking-widest text-brand-green block">SRA SHRIJI HYBRIDS</span>
                  <span className="text-[40px] font-black tracking-widest text-brand-gold block uppercase mt-2">Certified Seed System</span>
                </div>

                {/* PDF Header */}
                <div className="border-b-4 border-brand-green pb-5 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-brand-green tracking-widest uppercase block">
                      OFFICIAL PACKAGE OF PRACTICE DOCUMENT
                    </span>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5 uppercase font-serif">
                      SRA SHRIJI CULTIVATION GUIDE
                    </h1>
                    <p className="text-[11px] text-gray-400 font-bold tracking-wide mt-0.5 uppercase">
                      Approved by Balaji Agri Genetics Labs & Dept. of Plant Breeding
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="bg-brand-amber text-brand-dark text-[8px] font-black tracking-wider px-2 py-1 rounded shadow-sm">
                      GENETICS CO.
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 mt-2 font-mono">CODE: POP-{viewPdfProduct.id.toUpperCase()}</span>
                  </div>
                </div>

                {/* Main Spec Grid */}
                <div className="grid grid-cols-12 gap-8 mt-8">
                  
                  {/* Left Column: Product overview */}
                  <div className="col-span-4 space-y-6 border-r border-gray-100 pr-6">
                    <div className="bg-slate-50 border border-gray-100 rounded-xl p-3 flex justify-center aspect-square">
                      <img 
                        src={viewPdfProduct.image} 
                        alt={viewPdfProduct.name} 
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[11px] font-extrabold text-brand-green uppercase tracking-wider">CERTIFICATE SHEET</h4>
                      <div className="space-y-1.5 text-[10px] font-bold">
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                          <span className="text-gray-400">HYBRID:</span>
                          <span className="text-gray-800 uppercase">BAG {viewPdfProduct.name.replace('SRA', '').trim()}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                          <span className="text-gray-400">GERMINATION:</span>
                          <span className="text-brand-green">{viewPdfProduct.germinationRate} Min</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                          <span className="text-gray-400">PURITY RATE:</span>
                          <span className="text-gray-800">99% Certified</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                          <span className="text-gray-400">MOISTURE WT:</span>
                          <span className="text-gray-800">Below 12%</span>
                        </div>
                        <div className="flex justify-between pt-0.5">
                          <span className="text-gray-400">BAG WEIGHT:</span>
                          <span className="text-gray-800">{viewPdfProduct.availableSizes[0]?.toUpperCase() || '4 KG'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-brand-green/20 bg-emerald-50/20 rounded-xl p-3 text-[10px] text-gray-500 font-medium leading-relaxed">
                      🌱 <strong className="text-brand-green font-bold">Agronomist Seal:</strong> Produced from tested parent lineages, ensuring 100% hybrid vigor index and maximum cob branching potential.
                    </div>
                  </div>

                  {/* Right Column: In-depth schedules */}
                  <div className="col-span-8 space-y-6">
                    <div>
                      <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">
                        CROP CYCLE: {viewPdfProduct.cropType.toUpperCase()} {viewPdfProduct.name}
                      </h2>
                      <p className="text-xs text-brand-gold font-bold italic mt-0.5">
                        "{viewPdfProduct.tagline}"
                      </p>
                    </div>

                    {/* Specifications list */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-3.5 border border-gray-100 text-[11px]">
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Expected Harvest Yield</span>
                        <strong className="text-emerald-700 font-extrabold mt-0.5 block">{viewPdfProduct.expectedYield}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Cycle Duration</span>
                        <strong className="text-gray-900 font-extrabold mt-0.5 block">{viewPdfProduct.growthDuration}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Sowing Interval</span>
                        <strong className="text-gray-900 font-extrabold mt-0.5 block">{viewPdfProduct.sowingWindow}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Harvest Window</span>
                        <strong className="text-brand-gold font-extrabold mt-0.5 block">{viewPdfProduct.harvestWindow}</strong>
                      </div>
                    </div>

                    {/* Sowing and Nutrients POP instructions */}
                    <div className="space-y-4">
                      <div className="text-[11px] leading-relaxed">
                        <h4 className="font-extrabold text-brand-green uppercase tracking-wider border-b border-gray-100 pb-1 mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-green" />
                          1. LAND PREPARATION & SOWING PROTOCOLS
                        </h4>
                        <p className="text-gray-500 font-semibold">
                          Prepare soil to a fine tilth. Incorporate 12 tonnes of well-rotted compost per acre. Sowing depth should be strictly kept between 3.5cm to 5cm. Space rows at 60cm and plants at 20cm intervals to maintain proper solar and nutrient absorption ratios.
                        </p>
                      </div>

                      <div className="text-[11px] leading-relaxed">
                        <h4 className="font-extrabold text-brand-green uppercase tracking-wider border-b border-gray-100 pb-1 mb-1.5 flex items-center gap-1">
                          <Flame className="h-3.5 w-3.5 text-brand-green" />
                          2. INTEGRATED NUTRIENT MANAGEMENT (INM)
                        </h4>
                        <p className="text-gray-700 font-bold mb-1">
                          Recommended Nitrogen-Phosphorus-Potassium Schedule:
                        </p>
                        <p className="text-gray-500 font-semibold bg-slate-50 border border-gray-100 p-2 rounded-lg">
                          {viewPdfProduct.fertilizerGuide}
                        </p>
                      </div>

                      <div className="text-[11px] leading-relaxed">
                        <h4 className="font-extrabold text-brand-green uppercase tracking-wider border-b border-gray-100 pb-1 mb-1.5 flex items-center gap-1">
                          <Droplet className="h-3.5 w-3.5 text-brand-green" />
                          3. IRRIGATION & WATER MANAGEMENT (IWM)
                        </h4>
                        <p className="text-gray-500 font-semibold">
                          Ensure adequate moisture during silking and grain dough stages. Irrigate immediately after sowing and schedule follow-ups at 15-day intervals depending on monsoonal support. Keep root systems moist but prevent prolonged pooling.
                        </p>
                      </div>

                      <div className="text-[11px] leading-relaxed">
                        <h4 className="font-extrabold text-brand-green uppercase tracking-wider border-b border-gray-100 pb-1 mb-1.5 flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-brand-green" />
                          4. CERTIFIED IMMUNITY & PLANT HEALTH SHIELD
                        </h4>
                        <p className="text-gray-500 font-semibold">
                          Strong genetic resilience against <strong className="text-gray-800">{viewPdfProduct.diseaseResistance.join(', ')}</strong>. Monitor fields routinely for minor lepidopteran incursions or grasshoppers; apply targeted sprays as recommended.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Certified Footnote */}
                <div className="absolute bottom-8 inset-x-12 border-t border-gray-200 pt-4 flex justify-between items-center text-[9px] font-bold text-gray-400">
                  <span>© 2026 BALAJI AGRI GENETICS LIMITED • INDIA</span>
                  <span className="flex items-center gap-1 text-brand-green">
                    <ShieldCheck className="h-3.5 w-3.5" /> CERTIFIED AUTHENTIC POP CULTIVATION REPORT
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom notification */}
            <div className="bg-brand-dark border-t border-white/10 p-3.5 text-center text-xs text-gray-400">
              Note: This document is formatted to standard A4 paper size. Press <strong className="text-white">Print Manual</strong> to output a physical copy, or <strong className="text-white">Download PDF</strong> to save it directly to your device.
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* Download Alert toast */}
      <AnimatePresence>
        {downloadedDoc && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-dark text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-black border border-white/10 z-50"
          >
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
            <span>Successfully generated and downloaded {downloadedDoc}!</span>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
