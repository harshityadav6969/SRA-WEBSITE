import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, ShieldCheck, HeartHandshake, Award, Search, PhoneCall, CheckCircle2, UserCheck, Microscope, Star, ArrowRight, Sparkles, Send, Volume2, Crop } from 'lucide-react';
import { SUCCESS_STORIES, DEALERS } from '../data';

interface StorySectionsProps {
  currentLang: 'English' | 'Hindi' | 'Punjabi';
  onOpenPortal: () => void;
}


const FARMER_VIDEOS = [
  {
    farmerName: "Suresh Yadav",
    location: "Karnal, Haryana",
    crop: "Maize - SRA 9048",
    yieldInfo: "38 Quintals / Acre",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-farmer-hands-holding-fresh-corn-cobs-41619-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1551754625-7fc5b94523fd?auto=format&fit=crop&w=600&q=80",
    quote: {
      English: "SRA 9048 gave complete tip filling and heavy kernels. Sowing this maize hybrid boosted my profits by 30% compared to ordinary brands!",
      Hindi: "SRA 9048 मक्के में कछुए के आकार के मोटे दाने और पूरी टिप फिलिंग मिली। इसकी वजह से मुझे प्रति एकड़ 30% ज्यादा मुनाफा हुआ!",
      Punjabi: "SRA 9048 ਮੱਕੀ ਦੇ ਮੋਟੇ ਦਾਣੇ ਅਤੇ ਪੂਰੀ ਟਿਪ ਫਿਲਿੰਗ ਮਿਲੀ। ਇਸ ਹਾਈਬ੍ਰਿਡ ਨੇ ਮੇਰੇ ਮੁਨਾਫੇ ਨੂੰ 30% ਤੱਕ ਵਧਾ ਦਿੱਤਾ!"
    }
  },
  {
    farmerName: "Sardara Singh",
    location: "Amritsar, Punjab",
    crop: "Wheat - Super 2967",
    yieldInfo: "26 Quintals / Acre",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-agriculture-fields-at-sunset-drone-shot-41975-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    quote: {
      English: "No Yellow Rust disease in Super 2967. Extremely high tillering and heavy grains. Highly recommended for Punjab farmers.",
      Hindi: "Super 2967 गेहूं में पीला रतुआ का नामोनिशान नहीं मिला। इसकी कल्ले फूटने की क्षमता लाजवाब है और फसल वजनदार रही।",
      Punjabi: "Super 2967 ਕਣਕ ਵਿੱਚ ਪੀਲੀ ਕੁੰਗੀ ਦਾ ਕੋਈ ਨੁਕਸਾਨ ਨਹੀਂ ਹੋਇਆ। ਇਸ ਦਾ ਝਾੜ ਬਹੁਤ ਹੀ ਸ਼ਾਨਦਾਰ ਰਿਹਾ ਹੈ।"
    }
  },
  {
    farmerName: "Ram Avtar",
    location: "Alwar, Rajasthan",
    crop: "Mustard - SRA 4646",
    yieldInfo: "12 Quintals / Acre",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tractor-spraying-a-crop-field-34190-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
    quote: {
      English: "SRA 4646 Mustard had extreme resistance to cold frost. Oil recovery was 42% in the Krishi Mandi, fetching premium prices.",
      Hindi: "SRA 4646 सरसों ने पाले को पूरी तरह सहन किया। मंडी में मुझे 42% तेल की मात्रा मिली, जिससे सबसे ऊंचा भाव मिला।",
      Punjabi: "SRA 4646 ਸਰ੍ਹੋਂ ਨੇ ਕੋਰੇ ਦੇ ਨੁਕਸਾਨ ਨੂੰ ਆਸਾਨੀ ਨਾਲ ਸਹਾਰ ਲਿਆ। ਮੰਡੀ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਧ ਤੇਲ ਦੀ ਰਿਕਵਰੀ ਮਿਲੀ।"
    }
  },
  {
    farmerName: "Anil Reddy",
    location: "Warangal, Telangana",
    crop: "Paddy - Pusa 1847",
    yieldInfo: "32 Quintals / Acre",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-green-seedling-plant-sprout-in-sunlight-41618-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1530076881881-3fbe47be1873?auto=format&fit=crop&w=600&q=80",
    quote: {
      English: "Pusa 1847 is totally secure against bacterial leaf blight. Extremely slender aromatic grains with superb price returns.",
      Hindi: "Pusa 1847 धान में झुलसा रोग नहीं लगा। इसके पतले खुशबूदार दानों ने मंडी में धूम मचा दी और मुझे भरपूर फायदा मिला।",
      Punjabi: "Pusa 1847 ਝੋਨੇ ਵਿੱਚ ਬੈਕਟੀਰੀਅਲ ਬਲਾਈਟ ਦੀ ਬਿਮਾਰੀ ਨਹੀਂ ਆਈ। ਇਸ ਦੇ ਪਤਲੇ ਖੁਸ਼ਬੂਦਾਰ ਦਾਣੇ ਬਹੁਤ ਹੀ ਵਧੀਆ ਵਿਕੇ।"
    }
  }
];

export default function StorySections({ currentLang, onOpenPortal }: StorySectionsProps) {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  
  // Farmer Video Modal State
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoFarmer, setActiveVideoFarmer] = useState("");
  const [activeVideoSubtitle, setActiveVideoSubtitle] = useState("");
  const [dealerSearch, setDealerSearch] = useState('');
  
  // Contact form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [crop, setCrop] = useState('Cotton');
  const [submitted, setSubmitted] = useState(false);

  // Application form state
  const [applyName, setApplyName] = useState('');
  const [applyState, setApplyState] = useState('Punjab');
  const [applied, setApplied] = useState(false);

  const t = {
    English: {
      aboutHeader: 'THE BENCHMARK OF AGRONOMY',
      aboutTitle: 'Empowering India’s Farmers with Genetic Excellence',
      aboutText: 'For over two decades, SRA SHRIJI AGRI GENETICS SEEDS PVT LTD has stood as a pioneer in hybrid seed engineering. Our state-of-the-art research centers, field trials, and deep agronomic expertise help us deliver premium seeds with incredible yield capacities, drought resistance, and robust pathogen protection.',
      whyHeader: 'UNCOMPROMISING SEED ARCHITECTURE',
      whyTitle: 'Why Farmers Rely on Sra Shriji',
      trustGrate: '99.2% Germination rate',
      trustGrateDesc: 'Ensuring maximum seedling survival in diverse field soils.',
      trustYield: '25-30% Yield Boost',
      trustYieldDesc: 'Proven bumper weight profiles across crops.',
      trustPath: 'Climate & Pest Defense',
      trustPathDesc: 'Engineered immunity to yellow rust, cotton pink bollworm, and drought.',
      rdHeader: 'THE FRONTIERS OF SCIENCE',
      rdTitle: 'Pioneering Research & Development Labs',
      rdDesc: 'We maintain over 500 acres of dedicated agricultural breeding farms, scientific hybridization labs, and germination climate testing chambers. Every single batch of seed undergoes 16 separate quality testing checks before reaching your local mandi shop.',
      achieveAcre: 'Acres Cultivated',
      achieveDealers: 'Authorized Dealers',
      achieveStates: 'Agricultural States',
      achieveFarmers: 'Prosperous Farmers',
      testimonialHeader: 'STORIES OF HARVEST PROSPERITY',
      testimonialTitle: 'Voices from the Golden Fields',
      videoHeader: '🌱 FARMER VIDEO EXPERIENCE',
      videoTitle: 'Real Stories of Bumper Yields',
      dealerHeader: 'OUR GROUND NETWORK',
      dealerTitle: 'Authorized Sra Shriji Dealer Directory',
      dealerPlaceholder: 'Search your city, town or state...',
      contactHeader: 'REQUEST EXPERT CROP ADVICE',
      contactTitle: 'Get in Touch with our Agronomists',
      btnSubmit: 'Request Advisory Callback',
      successMsg: 'Thank you! An authorized agronomist will call you shortly on your mobile.',
      applyTitle: 'Apply to Become a Dealer',
      btnApply: 'Submit Dealership Application',
    },
    Hindi: {
      aboutHeader: 'कृषि अनुसंधान का वैश्विक मानक',
      aboutTitle: 'वैज्ञानिक उत्कृष्टता से समृद्ध भारत के अन्नदाता',
      aboutText: 'पिछले दो दशकों से अधिक समय से, स्रा श्रीजी एग्री जेनेटिक्स सीड्स प्राइवेट लिमिटेड हाइब्रिड बीज इंजीनियरिंग में एक अग्रणी नाम रहा है। हमारे अत्याधुनिक अनुसंधान केंद्रों, व्यावहारिक क्षेत्र परीक्षणों और गहरी कृषि विशेषज्ञता की मदद से हम असाधारण उपज क्षमता, सूखा प्रतिरोध और उत्कृष्ट रोग प्रतिरोधकता वाले प्रीमियम गुणवत्ता के बीज उपलब्ध कराते हैं।',
      whyHeader: 'अत्याधुनिक बीज वास्तुकला',
      whyTitle: 'किसान क्यों करते हैं स्रा श्रीजी पर भरोसा',
      trustGrate: '99.2% अंकुरण सफलता दर',
      trustGrateDesc: 'विविध प्रकार की मिट्टी में पौधों के अधिकतम जीवित रहने की गारंटी।',
      trustYield: '25-30% अतिरिक्त पैदावार',
      trustYieldDesc: 'फसलों में सर्वाधिक वजनदार और टिकाऊ फसल परिणाम।',
      trustPath: 'मौसम एवं कीटों से पूर्ण सुरक्षा',
      trustPathDesc: 'पीला रतुआ, कपास के गुलाबी सुंडी और सूखे के खिलाफ वैज्ञानिक प्रतिरक्षा।',
      rdHeader: 'विज्ञान का नया सवेरा',
      rdTitle: 'अत्याधुनिक अनुसंधान एवं बीज विकास प्रयोगशालाएं',
      rdDesc: 'हम 500 एकड़ से अधिक समर्पित ब्रीडिंग फार्मों, वैज्ञानिक संकरण प्रयोगशालाओं और अंकुरण परीक्षण कक्षों का संचालन करते हैं। बीज का प्रत्येक बैच आपके स्थानीय मंडी केंद्र तक पहुंचने से पहले 16 कड़े गुणवत्ता परीक्षणों से गुजरता है।',
      achieveAcre: 'कुल कृषि एकड़ क्षेत्र',
      achieveDealers: 'अधिकृत डीलर संख्या',
      achieveStates: 'सक्रिय कृषि राज्य',
      achieveFarmers: 'खुशहाल किसान परिवार',
      testimonialHeader: 'समृद्ध फसल की अनमोल कहानियां',
      testimonialTitle: 'सुनहरे खेतों से किसानों की आवाज़',
      videoHeader: '🌱 किसान वीडियो अनुभव',
      videoTitle: 'सच्चा अनुभव, बेमिसाल पैदावार की दास्तान',
      dealerHeader: 'हमारा जमीनी नेटवर्क',
      dealerTitle: 'अधिकृत स्रा श्रीजी डीलर निर्देशिका',
      dealerPlaceholder: 'अपने शहर, जिला या राज्य का नाम लिखें...',
      contactHeader: 'विशेषज्ञ कृषि परामर्श का अनुरोध करें',
      contactTitle: 'हमारे कृषि वैज्ञानिकों से सीधा संपर्क',
      btnSubmit: 'कृषि परामर्श हेतु कॉल बैक अनुरोध करें',
      successMsg: 'धन्यवाद! हमारे अधिकृत कृषि वैज्ञानिक शीघ्र ही आपके मोबाइल नंबर पर संपर्क करेंगे।',
      applyTitle: 'अधिकृत डीलर बनने हेतु आवेदन करें',
      btnApply: 'डीलरशिप आवेदन जमा करें',
    },
    Punjabi: {
      aboutHeader: 'ਖੇਤੀਬਾੜੀ ਖੋਜ ਦਾ ਗਲੋਬਲ ਮਿਆਰ',
      aboutTitle: 'ਵਿਗਿਆਨਕ ਉੱਤਮਤਾ ਨਾਲ ਕਿਸਾਨਾਂ ਦੀ ਖੁਸ਼ਹਾਲੀ',
      aboutText: 'ਪਿਛਲੇ ਦੋ ਦਹਾਕਿਆਂ ਤੋਂ ਵੱਧ ਸਮੇਂ ਤੋਂ, ਸਰਾ ਸ਼੍ਰੀਜੀ ਐਗਰੀ ਜੈਨੇਟਿਕਸ ਸੀਡਜ਼ ਪ੍ਰਾਈਵੇਟ ਲਿਮਟਿਡ ਹਾਈਬ੍ਰਿਡ ਬੀਜ ਇੰਜੀਨੀਅਰਿੰਗ ਵਿੱਚ ਇੱਕ ਮੋਹਰੀ ਨਾਮ ਰਿਹਾ ਹੈ। ਸਾਡੇ ਆਧੁਨਿਕ ਖੋਜ ਕੇਂਦਰਾਂ ਅਤੇ ਵਿਗਿਆਨਕ ਮੁਲਾਂਕਣਾਂ ਦੀ ਮਦਦ ਨਾਲ ਅਸੀਂ ਉੱਚ ਗੁਣਵੱਤਾ ਅਤੇ ਬਿਮਾਰੀ ਪ੍ਰਤੀਰੋਧਕ ਸਮਰੱਥਾ ਵਾਲੇ ਪ੍ਰੀਮੀਅਮ ਬੀਜ ਉਪਲਬਧ ਕਰਵਾਉਂਦੇ ਹਾਂ।',
      whyHeader: 'ਬੀਜਾਂ ਦੀ ਅਤਿ-ਆਧੁਨਿਕ ਗੁਣਵੱਤਾ',
      whyTitle: 'ਕਿਸਾਨ ਕਿਉਂ ਕਰਦੇ ਹਨ ਸਰਾ ਸ਼੍ਰੀਜੀ ਤੇ ਭਰੋਸਾ',
      trustGrate: '99.2% ਉਗਣ ਦੀ ਦਰ',
      trustGrateDesc: 'ਵੱਖ-ਵੱਖ ਮਿੱਟੀਆਂ ਵਿੱਚ ਬੂਟਿਆਂ ਦੇ ਬਚਣ ਦੀ ਪੂਰੀ ਗਾਰੰਟੀ।',
      trustYield: '25-30% ਵਾਧੂ ਝਾੜ',
      trustYieldDesc: 'ਫਸਲਾਂ ਵਿੱਚ ਸਭ ਤੋਂ ਵਧੀਆ ਭਾਰੀ ਫਸਲ ਦੇ ਨਤੀਜੇ।',
      trustPath: 'ਮੌਸਮ ਅਤੇ ਕੀੜਿਆਂ ਤੋਂ ਸੁਰੱਖਿਆ',
      trustPathDesc: 'ਪੀਲਾ ਕੁੰਗੀ, ਨਰਮੇ ਦੇ ਗੁਲਾਬੀ ਸੁੰਡੀ ਅਤੇ ਸੋਕੇ ਦੇ ਖਿਲਾਫ ਵਿਗਿਆਨਕ ਪ੍ਰਤੀਰੋਧਕਤਾ।',
      rdHeader: 'ਵਿਗਿਆਨ ਦਾ ਨਵਾਂ ਸਵੇਰਾ',
      rdTitle: 'ਅਤਿ-ਆਧੁਨਿਕ ਖੋਜ ਅਤੇ ਵਿਗਿਆਨਕ ਲੈਬਾਂ',
      rdDesc: 'ਅਸੀਂ 500 ਏਕੜ ਤੋਂ ਵੱਧ ਸਮਰਪਿਤ ਬਰੀਡਿੰਗ ਫਾਰਮਾਂ ਅਤੇ ਉਗਣ ਟੈਸਟਿੰਗ ਲੈਬਾਂ ਦਾ ਸੰਚਾਲਨ ਕਰਦੇ ਹਾਂ। ਹਰ ਬੈਚ ਮੰਡੀ ਤੱਕ ਪਹੁੰਚਣ ਤੋਂ ਪਹਿਲਾਂ 16 ਵੱਖ-ਵੱਖ ਟੈਸਟਾਂ ਵਿੱਚੋਂ ਲੰਘਦਾ ਹੈ।',
      achieveAcre: 'ਕੁਲ ਖੇਤੀਬਾੜੀ ਰਕਬਾ',
      achieveDealers: 'ਅਧਿਕਾਰਤ ਡੀਲਰ',
      achieveStates: 'ਸਰਗਰਮ ਰਾਜ',
      achieveFarmers: 'ਖੁਸ਼ਹਾਲ ਕਿਸਾਨ',
      testimonialHeader: 'ਸਮ੍ਰਿੱਧੀ ਦੀਆਂ ਅਨਮੋਲ ਕਹਾਣੀਆਂ',
      testimonialTitle: 'ਸੁਨਹਿਰੇ ਖੇਤਾਂ ਤੋਂ ਕਿਸਾਨਾਂ ਦੀ ਆਵਾਜ਼',
      dealerHeader: 'ਸਾਡਾ ਜ਼ਮੀਨੀ ਨੈੱਟਵਰਕ',
      dealerTitle: 'ਅਧਿਕਾਰਤ ਸਰਾ ਸ਼੍ਰੀਜੀ ਡੀਲਰ ਡਾਇਰੈਕਟਰੀ',
      dealerPlaceholder: 'ਆਪਣੇ ਸ਼ਹਿਰ, ਜ਼ਿਲ੍ਹਾ ਜਾਂ ਰਾਜ ਦਾ ਨਾਮ ਲਿਖੋ...',
      contactHeader: 'ਮਾਹਿਰ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਲਈ ਬੇਨਤੀ ਕਰੋ',
      contactTitle: 'ਸਾਡੇ ਖੇਤੀਬਾੜੀ ਵਿਗਿਆਨੀਆਂ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ',
      btnSubmit: 'ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਲਈ ਕਾਲ ਬੈਕ ਦੀ ਬੇਨਤੀ ਕਰੋ',
      successMsg: 'ਧੰਨਵਾਦ! ਸਾਡੇ ਅਧਿਕਾਰਤ ਖੇਤੀਬਾੜੀ ਮਾਹਿਰ ਜਲਦੀ ਹੀ ਤੁਹਾਡੇ ਮੋਬਾਈਲ ਨੰਬਰ ਤੇ ਸੰਪਰਕ ਕਰਨਗੇ।',
      applyTitle: 'ਡੀਲਰ ਬਣਨ ਲਈ ਅਪਲਾਈ ਕਰੋ',
      btnApply: 'ਡੀਲਰਸ਼ਿਪ ਬੇਨਤੀ ਜਮ੍ਹਾਂ ਕਰੋ',
    }
  }[currentLang];
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setPhone('');
      }, 5000);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyName.trim()) {
      setApplied(true);
      setTimeout(() => {
        setApplied(false);
        setApplyName('');
      }, 5000);
    }
  };

  const currentStory = SUCCESS_STORIES[activeStoryIdx];

  return (
    <div className="bg-white">
      
      {/* 1. WHO WE ARE (ABOUT SECTION) */}
      <section className="py-24 bg-white relative overflow-hidden" id="about">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image grid representing modern farming & premium crop engineering */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-green/10 rounded-full blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80"
                alt="Agricultural fields"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl relative z-10 border border-gray-100"
              />
              <div className="absolute bottom-4 right-4 bg-brand-dark text-white p-4 rounded-2xl z-20 shadow-xl border border-white/10 text-left">
                <Microscope className="h-6 w-6 text-emerald-400 mb-2" />
                <p className="text-xs font-extrabold">20+ Years</p>
                <p className="text-[10px] text-gray-400 font-medium">Genetic Quality Leadership</p>
              </div>
            </div>

            {/* Right text panel */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="text-xs tracking-widest font-bold text-brand-green uppercase font-display block">
                {t.aboutHeader}
              </span>
              <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 font-display leading-tight">
                {t.aboutTitle}
              </h3>
              <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                {t.aboutText}
              </p>

              {/* Core capabilities list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-brand-green flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-gray-900">National ISO Certified</h5>
                    <p className="text-[10px] text-gray-400 font-medium">Fully matching federal seed testing acts.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-brand-green flex items-center justify-center flex-shrink-0">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-gray-900">Prestigious Innovation Award</h5>
                    <p className="text-[10px] text-gray-400 font-medium">Awarded for high-yield Bt Cotton research.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHY FARMERS TRUST US (BENTO GRID STYLE) */}
      <section className="py-24 bg-brand-light relative" id="why-trust-us">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs tracking-widest font-bold text-brand-green uppercase font-display block">
              {t.whyHeader}
            </span>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 font-display">
              {t.whyTitle}
            </h3>
            <div className="h-1 w-20 bg-brand-amber mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Box 1 */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl space-y-4 relative overflow-hidden">
              <div className="h-12 w-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                <Sprout className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-extrabold text-gray-900 font-display">
                {t.trustGrate}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                {t.trustGrateDesc}
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl space-y-4 relative overflow-hidden">
              <div className="h-12 w-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-extrabold text-gray-900 font-display">
                {t.trustYield}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                {t.trustYieldDesc}
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl space-y-4 relative overflow-hidden">
              <div className="h-12 w-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-extrabold text-gray-900 font-display">
                {t.trustPath}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                {t.trustPathDesc}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. INNOVATION & SCIENCE */}
      <section className="py-24 bg-white relative overflow-hidden" id="innovation">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left descriptive text */}
            <div className="lg:col-span-6 text-left space-y-6">
              <span className="text-xs tracking-widest font-bold text-brand-gold uppercase font-display block">
                {t.rdHeader}
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 font-display leading-tight">
                {t.rdTitle}
              </h3>
              <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                {t.rdDesc}
              </p>

              {/* Diagnostic checking items list */}
              <div className="space-y-3 pt-2">
                {[
                  'Advanced Seed Polymer film-coating for insect deterrence',
                  'High humidity chambers testing survival indexes at 45°C+',
                  'DNA purity markers verification at molecular lab levels',
                  'Rigorous cold germination performance tests for Rabi crop varieties'
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center text-xs font-bold text-gray-800">
                    <CheckCircle2 className="h-4.5 w-4.5 text-brand-green flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right graphic visual */}
            <div className="lg:col-span-6 relative">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"
                alt="Genetics plant labs"
                className="w-full h-80 object-cover rounded-3xl shadow-2xl border"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 4. ACHIEVEMENTS & MILESTONES (STAT COUNTERS) */}
      <section className="py-16 bg-brand-dark text-white relative">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="text-3xl md:text-5xl font-extrabold text-brand-gold block font-display">
              10M+
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-2 block">
              {t.achieveAcre}
            </span>
          </div>
          <div>
            <span className="text-3xl md:text-5xl font-extrabold text-emerald-400 block font-display">
              1,500+
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-2 block">
              {t.achieveDealers}
            </span>
          </div>
          <div>
            <span className="text-3xl md:text-5xl font-extrabold text-brand-gold block font-display">
              7+
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-2 block">
              {t.achieveStates}
            </span>
          </div>
          <div>
            <span className="text-3xl md:text-5xl font-extrabold text-emerald-400 block font-display">
              2.5M+
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-2 block">
              {t.achieveFarmers}
            </span>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS (SUCCESS STORIES OF PROSPEROUS FARMERS) */}
      <section className="py-24 bg-brand-light relative" id="testimonials">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs tracking-widest font-bold text-brand-green uppercase font-display block">
              {t.testimonialHeader}
            </span>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 font-display">
              {t.testimonialTitle}
            </h3>
            <div className="h-1 w-20 bg-brand-amber mx-auto rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-2xl text-left relative overflow-hidden">
            
            {/* Top decorative quotation mark */}
            <div className="absolute top-4 right-10 text-[120px] font-serif text-brand-green/5 select-none leading-none">
              “
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStoryIdx}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
                
                {/* Farmer Image */}
                <div className="md:col-span-4">
                  <img
                    src={currentStory.imageUrl}
                    alt={currentStory.farmerName}
                    className="w-full h-56 object-cover rounded-2xl border shadow"
                  />
                </div>

                {/* Farmer Quote details */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex items-center gap-1 text-brand-amber">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-xs text-gray-400 font-bold ml-1">5.0 Star Verified Harvest</span>
                  </div>

                  <p className="text-sm md:text-md italic font-serif text-gray-800 leading-relaxed font-semibold">
                    "{currentStory.quote}"
                  </p>

                  <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                    <div className="text-left">
                      <h4 className="text-md font-extrabold text-gray-900">{currentStory.farmerName}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{currentStory.location}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block">Acquired Yield Output</span>
                      <span className="text-md font-extrabold text-brand-green block">{currentStory.yieldAfter}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="flex justify-center gap-1.5 mt-8 border-t border-gray-100 pt-6">
              {SUCCESS_STORIES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStoryIdx(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeStoryIdx === i ? 'w-8 bg-brand-green' : 'w-2.5 bg-gray-200'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>


      {/* FARMER VIDEO TESTIMONIALS SECTION */}
      <section className="py-24 bg-brand-dark text-white relative overflow-hidden" id="farmer-videos">
        {/* Decorative backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_50%)]" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs tracking-widest font-extrabold text-emerald-400 uppercase font-display block">
              {t.videoHeader || "🌱 FARMER VIDEO EXPERIENCE"}
            </span>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-display">
              {t.videoTitle || "Real Stories of Bumper Yields"}
            </h3>
            <div className="h-1 w-20 bg-brand-amber mx-auto rounded-full" />
          </div>

          {/* Video Cards Grid - styled in slide format like on mobile/desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FARMER_VIDEOS.map((video, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl group text-left"
              >
                {/* Video Cover & Play Trigger */}
                <div className="relative h-48 overflow-hidden bg-black">
                  <img
                    src={video.thumbnail}
                    alt={video.farmerName}
                    className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Glass Card Blur overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 to-transparent" />

                  {/* Play Button */}
                  <div
                    onClick={() => {
                      setActiveVideoUrl(video.videoUrl);
                      setActiveVideoFarmer(video.farmerName);
                      setActiveVideoSubtitle(video.quote[currentLang]);
                    }}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  >
                    <div className="h-14 w-14 rounded-full bg-brand-amber text-brand-dark flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white transition-all duration-300 relative">
                      <div className="absolute inset-0 rounded-full border-2 border-brand-amber/40 animate-ping group-hover:border-brand-green/40" />
                      <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Badges */}
                  <span className="absolute top-4 left-4 bg-emerald-500 text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-lg tracking-wider">
                    {video.crop}
                  </span>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{video.farmerName}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{video.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-gray-400 font-bold uppercase block">Yield Output</span>
                      <span className="text-xs font-black text-brand-gold">{video.yieldInfo}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 font-medium leading-relaxed italic line-clamp-2">
                    "{video.quote[currentLang]}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Cinematic Fulscreen Video Testimonial Modal */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 p-4 sm:p-6 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-brand-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[550px] md:h-[450px]"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveVideoUrl(null);
                  setActiveVideoFarmer("");
                  setActiveVideoSubtitle("");
                }}
                className="absolute top-4 right-4 z-10 p-2 bg-brand-dark/75 hover:bg-red-600 rounded-full text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Video Player Column */}
              <div className="flex-1 bg-black relative flex items-center justify-center">
                <video
                  src={activeVideoUrl}
                  autoPlay
                  controls
                  loop
                  muted
                  playsInline
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Subtitles & Agronomic Narration Column */}
              <div className="w-full md:w-80 p-6 md:p-8 bg-brand-dark text-left flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10">
                <div className="space-y-4">
                  <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded">
                    Farmer Video Diaries
                  </span>
                  <h4 className="text-xl font-extrabold text-white font-display">
                    {activeVideoFarmer}
                  </h4>
                  <div className="h-0.5 w-12 bg-emerald-500 rounded-full" />
                </div>

                {/* Real-time Subtitles */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 my-4 flex-1 flex flex-col justify-center">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                    Live Subtitles:
                  </span>
                  <p className="text-sm font-semibold italic text-brand-amber font-serif leading-relaxed">
                    "{activeVideoSubtitle}"
                  </p>
                </div>

                <div className="text-xs text-gray-400 font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Verified Sra Shriji Farmer Testimonial</span>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* 6. DEALER LOCATOR GRID NETWORK */}
      <section className="py-24 bg-white border-y border-gray-100" id="dealer-locator">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side dealer searching portal */}
            <div className="lg:col-span-8 text-left space-y-6">
              <span className="text-xs tracking-widest font-bold text-brand-green uppercase font-display block">
                {t.dealerHeader}
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 font-display">
                {t.dealerTitle}
              </h3>

              {/* Search bar input */}
              <div className="flex gap-2 bg-gray-50 p-2 border border-gray-200 rounded-2xl w-full max-w-lg">
                <Search className="h-5 w-5 text-gray-400 mt-2.5 ml-2" />
                <input
                  type="text"
                  value={dealerSearch}
                  onChange={(e) => setDealerSearch(e.target.value)}
                  placeholder={t.dealerPlaceholder}
                  className="bg-transparent flex-1 outline-none text-xs font-semibold text-gray-800 p-2.5"
                />
              </div>

              {/* Directory display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                {DEALERS
                  .filter(d => 
                    d.name.toLowerCase().includes(dealerSearch.toLowerCase()) ||
                    d.address.toLowerCase().includes(dealerSearch.toLowerCase()) ||
                    d.state.toLowerCase().includes(dealerSearch.toLowerCase())
                  )
                  .map(d => (
                    <div
                      key={d.id}
                      className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-brand-green/20 hover:shadow-lg transition-all space-y-3 relative"
                    >
                      <span className="absolute top-2 right-2 bg-brand-green/10 text-brand-green text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                        {d.state}
                      </span>
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-900">{d.name}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{d.contact}</p>
                      </div>
                      <p className="text-[11px] font-semibold text-gray-600 leading-relaxed font-serif">
                        📍 {d.address}
                      </p>
                      <div className="border-t border-gray-100/80 pt-2 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400 font-bold">Authorized Center</span>
                        <a href={`tel:${d.phone}`} className="text-[10px] font-extrabold text-brand-green hover:underline flex items-center gap-0.5">
                          📞 Call Dealer
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Right side dealer application board */}
            <div className="lg:col-span-4 bg-gray-50 border border-gray-100 p-6 rounded-3xl text-left space-y-4">
              <h4 className="text-md font-extrabold text-gray-900 font-display">
                {t.applyTitle}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Apply to become an authorized seed distributor. Unlock premium wholesale margins, incentive rebates, and AI social marketing tools.
              </p>

              <form onSubmit={handleApplySubmit} className="space-y-3">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Applicant Name / Firm</label>
                  <input
                    type="text"
                    value={applyName}
                    onChange={(e) => setApplyName(e.target.value)}
                    placeholder="e.g. Haryana Krishi Center..."
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">State Division</label>
                  <select
                    value={applyState}
                    onChange={(e) => setApplyState(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-2.5 rounded-xl text-xs uppercase transition-all shadow"
                >
                  {t.btnApply}
                </button>
              </form>

              {applied && (
                <p className="text-[10px] font-bold text-brand-green bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                  ✔ Dealership request logged successfully! Our state manager will contact you for compliance verification shortly.
                </p>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 7. CONTACT / CALLBACK ADVISORY INQUIRY FORM */}
      <section className="py-24 bg-brand-light relative" id="contact-us">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-12 border border-gray-100 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left callbacks text */}
            <div className="md:col-span-5 text-left space-y-4">
              <span className="text-xs tracking-widest font-bold text-brand-green uppercase font-display block">
                {t.contactHeader}
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-display">
                {t.contactTitle}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Have inquiries about crop sickness, seedling density, or our hybrid seed availability? Submit your callback request below.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-700 font-bold">
                  <PhoneCall className="h-4.5 w-4.5 text-brand-green" />
                  <span>Crop Helpline: +91 9866329911</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700 font-bold">
                  <CheckCircle2 className="h-4.5 w-4.5 text-brand-green" />
                  <span>Free advisory diagnostic report</span>
                </div>
              </div>
            </div>

            {/* Right Callback form */}
            <div className="md:col-span-7">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-3"
                  >
                    <CheckCircle2 className="h-12 w-12 text-brand-green mx-auto animate-bounce" />
                    <h4 className="text-md font-extrabold text-gray-900">Request Registered Successfully!</h4>
                    <p className="text-xs font-semibold text-gray-600 leading-relaxed">
                      {t.successMsg}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1">Farmer Full Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rajesh Kumar..."
                          className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1">Mobile Mobile Number</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 94160..."
                          className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-gray-400 uppercase mb-1">Target Crop Group</label>
                      <select
                        value={crop}
                        onChange={(e) => setCrop(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green"
                      >
                        <option value="Cotton">Cotton Crop</option>
                        <option value="Wheat">Wheat Crop</option>
                        <option value="Millet">Millet Crop</option>
                        <option value="Mustard">Mustard Crop</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-green hover:bg-brand-green/95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_8px_16px_rgba(13,92,52,0.15)] flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {t.btnSubmit}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
