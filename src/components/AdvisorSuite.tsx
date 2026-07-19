import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Upload, HelpCircle, Bot } from 'lucide-react';

interface AdvisorSuiteProps {
  currentLang: 'English' | 'Hindi' | 'Punjabi';
}

const SAMPLE_LEAF_IMAGES = [
  {
    name: 'Wheat Yellow Rust',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80',
    base64Fake: 'yellow-rust-simulated'
  },
  {
    name: 'Cotton Boll Damage',
    url: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?auto=format&fit=crop&w=400&q=80',
    base64Fake: 'bollworm-simulated'
  },
  {
    name: 'Mustard White Spot',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
    base64Fake: 'white-rust-simulated'
  }
];

export default function AdvisorSuite({ currentLang }: AdvisorSuiteProps) {
  // AI Disease Detector state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    English: {
      header: 'GENETIC INTELLIGENCE FOR FARMLANDS',
      title: 'Leaf Disease Diagnosis Doctor',
      btnUpload: 'Upload Crop Photo',
      btnDiagnose: 'Diagnose Crop Sickness',
      dropzoneText: 'Drag and drop leaf photo, or click to browse local files',
      orSelectSample: 'Or select a preloaded sample leaf to test disease identification:',
    },
    Hindi: {
      header: 'खेतों के लिए एआई इंटेलिजेंस',
      title: 'फसल रोग निदान डॉक्टर',
      btnUpload: 'फसल की फोटो अपलोड करें',
      btnDiagnose: 'बीमारी की जांच करें',
      dropzoneText: 'रोगग्रस्त पत्ती या फसल की फोटो यहां खींचे या ब्राउज़ करें',
      orSelectSample: 'या जांच परीक्षण के लिए नीचे दिए गए पत्ती के नमूनों को चुनें:',
    },
    Punjabi: {
      header: 'ਖੇਤਾਂ ਲਈ ਏਆਈ ਇੰਟੈਲੀਜੈਂਸ',
      title: 'ਫਸਲ ਬਿਮਾਰੀ ਨਿਦਾਨ ਡਾਕਟਰ',
      btnUpload: 'ਫਸਲ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ',
      btnDiagnose: 'ਬਿਮਾਰੀ ਦੀ ਜਾਂਚ ਕਰੋ',
      dropzoneText: 'ਰੋਗਗ੍ਰਸਤ ਪੱਤੇ ਜਾਂ ਫਸਲ ਦੀ ਫੋਟੋ ਇੱਥੇ ਖਿੱਚੋ ਜਾਂ ਬ੍ਰਾਊਜ਼ ਕਰੋ',
      orSelectSample: 'ਜਾਂ ਜਾਂਚ ਲਈ ਹੇਠਾਂ ਦਿੱਤੇ ਪੱਤੇ ਦੇ ਨਮੂਨਿਆਂ ਨੂੰ ਚੁਣੋ:',
    }
  }[currentLang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setDetectionResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSampleImage = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    setDetectionResult(null);
  };

  const handleDiseaseDiagnose = async () => {
    if (!selectedImage || detecting) return;

    setDetecting(true);
    setDetectionResult(null);

    try {
      const response = await fetch('/api/detect-disease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedImage })
      });
      const data = await response.json();
      setDetectionResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetecting(false);
    }
  };

  return (
    <section className="py-24 bg-brand-light relative border-b border-gray-100" id="ai-suite">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header Title */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs tracking-widest font-bold text-brand-green uppercase font-display block flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 animate-spin text-brand-gold" />
            {t.header}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 font-display">
            {t.title}
          </h2>
          <div className="h-1 w-20 bg-brand-amber mx-auto rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 md:p-8" id="ai-disease">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Image upload portal */}
            <div className="md:col-span-5 space-y-6 text-left">
              <h4 className="text-md font-bold text-gray-900">
                {t.btnUpload}
              </h4>

              {/* Upload dragzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 hover:border-brand-green rounded-3xl p-6 text-center cursor-pointer bg-gray-50/50 hover:bg-white transition-all space-y-4"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Crop leaves diagnosis"
                    className="w-full h-40 object-cover rounded-2xl shadow-md border"
                  />
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <div className="h-12 w-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-semibold text-gray-500 leading-relaxed px-4">
                      {t.dropzoneText}
                    </p>
                  </div>
                )}
              </div>

              {/* Simulated Leaf pathology selector */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {t.orSelectSample}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_LEAF_IMAGES.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectSampleImage(img.url)}
                      className={`cursor-pointer rounded-xl overflow-hidden border p-1 transition-all text-center space-y-1 bg-white ${
                        selectedImage === img.url ? 'border-brand-green bg-brand-green/5' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-12 object-cover rounded-lg"
                      />
                      <span className="text-[9px] font-bold text-gray-600 block truncate">
                        {img.name.split(' ')[1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDiseaseDiagnose}
                disabled={!selectedImage || detecting}
                className="w-full bg-brand-green hover:bg-brand-green/95 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_8px_16px_rgba(13,92,52,0.15)] flex items-center justify-center gap-2"
              >
                {detecting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Detecting Leaf pathogens...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4" />
                    {t.btnDiagnose}
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Diagnostic Evaluation Report display */}
            <div className="md:col-span-7">
              <AnimatePresence mode="wait">
                {detectionResult ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-brand-dark text-white rounded-3xl p-6 text-left border border-white/10 space-y-5 shadow-2xl relative"
                  >
                    {/* Corner Badge */}
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-extrabold uppercase px-3.5 py-1 rounded-bl-xl tracking-wider">
                      Pathology Diagnosis
                    </span>

                    {/* Header result */}
                    <div className="border-b border-white/10 pb-4">
                      <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">
                        Leaf Disease Identification Report
                      </span>
                      <h4 className="text-xl font-bold text-white mt-1">
                        {detectionResult.diseaseName}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">Diagnostic Confidence:</span>
                        <span className="text-xs bg-red-500/10 text-red-400 font-bold px-2.5 py-0.5 rounded-full">
                          {(detectionResult.confidence * 100).toFixed(0)}% Accuracy Index
                        </span>
                      </div>
                    </div>

                    {/* Cause and trigger */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                        Disease Origin & Biological Cause
                      </span>
                      <p className="text-xs text-gray-200 font-medium leading-relaxed">
                        {detectionResult.cause}
                      </p>
                    </div>

                    {/* Symptoms */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                        Identified Visual Symptoms
                      </span>
                      <ul className="list-disc list-inside text-xs text-gray-300 font-medium space-y-1 pl-1">
                        {detectionResult.symptoms.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Chem treatments & spray recommended */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block">
                          Preventive Agronomy
                        </span>
                        <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                          {detectionResult.prevention[0]}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-brand-amber font-bold uppercase tracking-wider block">
                          Chemical Treatment Spray
                        </span>
                        <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                          {detectionResult.treatment[0]}
                        </p>
                      </div>
                    </div>

                    {/* Recommended Pesticides and resistant seeds */}
                    <div className="border-t border-white/10 pt-4 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Recommended Pesticide Formulation</span>
                          <span className="text-xs font-bold text-white mt-1 block">
                            {detectionResult.recommendedPesticides.join(', ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Resistant Seeds For Rotation</span>
                          <span className="text-xs font-bold text-brand-gold mt-1 block">
                            {detectionResult.recommendedProducts.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 bg-gray-50 rounded-3xl border border-gray-100 text-center text-gray-400 min-h-[400px]">
                    <HelpCircle className="h-16 w-16 text-gray-300 mb-4 stroke-1" />
                    <h4 className="text-md font-bold text-gray-700">Awaiting Diagnostic Leaf Image</h4>
                    <p className="text-xs max-w-sm mt-1 leading-relaxed">
                      Upload or select a leaf crop sample photo in the left panel to execute advanced computer vision diagnostics.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
