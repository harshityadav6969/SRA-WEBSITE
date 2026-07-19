import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of GoogleGenAI
let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
      console.warn('GEMINI_API_KEY not found or holds default placeholder. Running in fallback mode.');
      return null;
    }
    try {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (err) {
      console.error('Failed to initialize GoogleGenAI client:', err);
      return null;
    }
  }
  return aiInstance;
}

// 1. Crop Advisor API (Chat Bot)
app.post('/api/crop-advisor', async (req, res) => {
  const { message, history } = req.body;

  const ai = getAI();
  if (!ai) {
    // Fallback response for offline or unconfigured API key
    const lowMsg = (message || '').toLowerCase();
    let reply = "I am Sra Shriji AI Crop Advisor. ";
    if (lowMsg.includes('maize') || lowMsg.includes('corn') || lowMsg.includes('makka')) {
      reply += "For high maize yields, SRA 9048 offers superior orange-yellow grain density and stay-green silage character. Maintain NPK at 120:60:40 kg/Acre and irrigate at silking and milk stages.";
    } else if (lowMsg.includes('wheat') || lowMsg.includes('rust') || lowMsg.includes('pila rogi')) {
      reply += "For high wheat yields, Super 2967 has exceptional resistance to Yellow (Pila) Rust. Keep soil rich in nitrogen and irrigate at crown root initiation stage (21 days after sowing).";
    } else if (lowMsg.includes('mustard') || lowMsg.includes('oil') || lowMsg.includes('sarso')) {
      reply += "To maximize mustard oil production, sow SRA 4646 in October. It delivers 42-43% oil extraction and features outstanding tolerance to frost and white rust.";
    } else if (lowMsg.includes('paddy') || lowMsg.includes('rice') || lowMsg.includes('dhan')) {
      reply += "For paddy, Pusa 1847 is an aromatic basmati variety with built-in protection against leaf blight and blast. Ideal for rich clay loam soils.";
    } else {
      reply += "To give you precise scientific feedback on soil conditioning, sowing windows, or disease treatment, please set your Gemini API key under AI Studio Secrets. Our recommended hybrids include SRA 9048 Maize, Super 2967 Wheat, Pusa 1847 Paddy, and SRA 4646 Mustard.";
    }
    return res.json({ text: reply, isFallback: true });
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-3.5-flash',
      config: {
        systemInstruction: `You are 'Sra Shriji AI Crop Advisor', an exceptionally knowledgeable senior agricultural scientist and agronomist working for 'SRA SHRIJI AGRI GENETICS SEEDS PVT LTD', India.
Your goal is to provide elite, professional, and scientifically precise farming advisories to farmers, dealers, and agricultural enthusiasts.
Be warm, encouraging, respectful, and highly structured (use neat bullet points, bold headers).
Provide guidance in the requested language (English, Hindi, or Punjabi). If they use Hinglish or write in a simple Indian manner, reply in a warm, accessible style of their choice.
Suggest specific Sra Shriji seeds where applicable:
- SRA 9048 Maize (supreme orange-yellow grains, high test weight, great stay-green silage)
- Super 2967 Wheat (yellow rust resistant, bold grains, maximum tillering)
- Pusa 1847 Paddy (aromatic basmati, bacterial leaf blight proof)
- SRA 4646 Mustard (maximum oil percentage 42-43%, frost & white rust tolerant)
- Tiger 90 Millet (drought resistant, sweet fodder & bold grain profile)
- Malik QUEEN SSG (multi-cut sweet sorghum grass)
- Krishna 303 Urad (pest resistant, uniform bold black seeds)
- ADHA Moong (early maturing, high pods per plant)
Always ground your answers in actual farming practices of India. Avoid general fluffy statements.`,
      },
    });

    // We can rebuild chat history or just send the conversation in messages
    // Since we want standard chats, we can feed the message directly, but if we have history:
    if (history && history.length > 0) {
      // Send message with context
      // Standard chat history has roles 'user' and 'model'
      // We can also just send a single prompt combining history to keep it extremely stable
      const formattedHistoryPrompt = history.map((h: any) => `${h.role === 'user' ? 'Farmer' : 'Advisor'}: ${h.text}`).join('\n') + `\nFarmer: ${message}\nAdvisor:`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: formattedHistoryPrompt,
      });
      return res.json({ text: response.text });
    } else {
      const response = await chat.sendMessage({ message });
      return res.json({ text: response.text });
    }
  } catch (error: any) {
    console.error('Error in crop-advisor API:', error);
    res.status(500).json({ error: error.message || 'Error executing crop advisor model' });
  }
});

// 2. AI Disease Detector API (Image upload)
app.post('/api/detect-disease', async (req, res) => {
  const { image } = req.body; // base64 string

  if (!image) {
    return res.status(400).json({ error: 'Image base64 data is required' });
  }

  const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, '');

  const ai = getAI();
  if (!ai) {
    // Return high-quality mock data for simulation if API is unconfigured
    return res.json({
      detected: true,
      diseaseName: "Early Yellow Rust (Puccinia striiformis) Simulation",
      confidence: 0.94,
      cause: "Fungal pathogen favored by cool, moist weather (12-20°C) with persistent leaf wetness, common in North India wheat zones.",
      symptoms: [
        "Incipient bright yellow pustules (uredinia) arranged in narrow linear stripes along leaf veins",
        "Chlorotic streaks on younger foliage leading to premature leaf drying",
        "Loss of green leaf area leading to shriveled grains"
      ],
      prevention: [
        "Sow certified rust-resistant hybrids like Kanak-55 Premium Wheat",
        "Avoid late sowing to bypass late-season spore bursts",
        "Sra Shrijince nitrogen applications; excessive N promotes disease severity"
      ],
      treatment: [
        "Spray Propiconazole 25% EC (e.g., Tilt) at 1 ml per liter of water immediately upon spotting symptoms",
        "Apply Tebuconazole or Triadimefon in case of heavy infestation",
        "Ensure spray uniform coverage across all plant canopies"
      ],
      recommendedPesticides: [
        "Propiconazole 25% EC (Tilt)",
        "Tebuconazole 250 EC",
        "Mancozeb 75% WP (as preventive cover)"
      ],
      recommendedProducts: [
        "Kanak-55 Wheat (Genetically immune to common Yellow Rust races)",
        "BP-22 Paddy (for rotation to break the rust cycle)"
      ],
      isFallback: true
    });
  }

  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: `Analyze this agricultural crop leaf or plant image for any visible diseases, fungal pathogens, pest damage, insect vectors, or nutritional deficiencies.
Provide a highly rigorous scientific diagnostic evaluation.

You must reply with a structured JSON object. Adhere strictly to this JSON model and do not include any other markdown formatting outside of JSON.
{
  "detected": boolean (true if disease/deficiency is found, false if completely healthy),
  "diseaseName": "string (Common scientific and common Indian name)",
  "confidence": number (fraction between 0.0 and 1.0),
  "cause": "string (Precise biological cause and environmental trigger factors)",
  "symptoms": ["string (Detailed symptom description 1)", "string (2)", "string (3)"],
  "prevention": ["string (Preventive agronomic practices 1)", "string (2)"],
  "treatment": ["string (Chemical or active control actions 1)", "string (2)"],
  "recommendedPesticides": ["string (Pesticide chemical compound names and recommended spray dilution)"],
  "recommendedProducts": ["string (Which Sra Shriji Seeds hybrid varieties show strong resistance or are highly recommended for rotation)"]
}`
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detected: { type: Type.BOOLEAN },
            diseaseName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            cause: { type: Type.STRING },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
            treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedPesticides: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedProducts: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["detected", "diseaseName", "confidence", "cause", "symptoms", "prevention", "treatment", "recommendedPesticides", "recommendedProducts"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in detect-disease API:', error);
    res.status(500).json({ error: error.message || 'Error processing crop image' });
  }
});

// 3. AI UGC Post & Poster Creator API
app.post('/api/ugc-generator', async (req, res) => {
  const { productName, platform, lang, benefitTheme } = req.body;

  const ai = getAI();
  if (!ai) {
    // Premium fallback response
    let headline = `🌾 क्रांति! स्रा श्रीजी ${productName} के साथ उपज दोगुनी करें! 🌾`;
    let body = `✅ मुख्य विशेषता: ${benefitTheme}\n✅ जर्मिनेशन दर: 98% सुनिश्चित!\n🌟 आज ही अपने नजदीकी अधिकृत स्रा श्रीजी डीलर से संपर्क करें या कॉल करें।`;
    if (lang === 'English') {
      headline = `🌾 Revolutionize Farming with Sra Shriji ${productName}! 🌾`;
      body = `✅ High Performance: ${benefitTheme}\n✅ Certified Germination: 98% guarantee!\n🌟 Empower your harvest. Contact your nearest Sra Shriji Dealer today or call our support lines!`;
    } else if (lang === 'Punjabi') {
      headline = `🌾 ਸਰਾ ਸ਼੍ਰੀਜੀ ${productName} ਨਾਲ ਫਸਲ ਦੀ ਬੰਪਰ ਪੈਦਾਵਾਰ! 🌾`;
      body = `✅ ਵੱਡੀ ਵਿਸ਼ੇਸ਼ਤਾ: ${benefitTheme}\n✅ ਉਗਣ ਦੀ ਦਰ: 98% ਗਾਰੰਟੀ!\n🌟 ਅੱਜ ਹੀ ਆਪਣੇ ਨੇੜਲੇ ਸਰਾ ਸ਼੍ਰੀਜੀ ਡੀਲਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।`;
    }
    return res.json({ text: `📺 *FALLBACK ${platform.toUpperCase()} POST*\n\n${headline}\n\n${body}`, isFallback: true });
  }

  try {
    const prompt = `Generate a highly premium, conversion-optimized marketing post or WhatsApp Status in ${lang} promoting SRA SHRIJI AGRI GENETICS SEEDS PVT LTD product: "${productName}".
The marketing theme must center on: "${benefitTheme}".
Platform target: ${platform} (e.g. WhatsApp Status, Facebook post, Instagram caption, or Pamphlet).

Guidelines:
- Include eye-catching emojis suitable for Indian farming culture (e.g., tractors, crops, sun, medals, seeds).
- Add highly structured, scannable formatting with clear sections: bold headline, key product advantages, farmer profit appeal, and call to action.
- Add a neat dealer incentive line or encouragement to contact SRA SHRIJI AGRI GENETICS SEEDS PVT LTD helpline.
- Use a professional, highly persuasive, and authoritative tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in ugc-generator API:', error);
    res.status(500).json({ error: error.message || 'Error generating marketing text' });
  }
});

// 4. Crop Recommendation / Seed Finder Engine API
app.post('/api/recommend-seed', async (req, res) => {
  const { state, district, season, soilType, water, purpose } = req.body;

  const ai = getAI();
  // We can do a smart local match first to provide immediate robust recommendations
  let suggestedSeedId = 'super-2967';
  let reasoning = '';

  const cropLower = (purpose || '').toLowerCase();
  const seasonLower = (season || '').toLowerCase();

  if (seasonLower === 'rabi') {
    if (soilType.includes('Sand') || soilType.includes('Sandy')) {
      suggestedSeedId = 'sra-4646'; // Mustard loves sandy, well-drained loams in Rabi
    } else {
      suggestedSeedId = 'super-2967'; // Wheat is king in rabi clay/loam
    }
  } else if (seasonLower === 'kharif') {
    if (water === 'High' || soilType.includes('Clay')) {
      suggestedSeedId = 'pusa-1847'; // Rice loves high water / clay
    } else if (water === 'Very Low' || state === 'Rajasthan') {
      suggestedSeedId = 'tiger-90'; // Millet for arid areas
    } else {
      suggestedSeedId = 'sra-9048'; // Maize has wide adaptability
    }
  } else {
    // Zaid or default
    suggestedSeedId = 'sra-9048'; // Maize grows well in spring/zaid as well
  }

  if (!ai) {
    // High-quality local generator
    return res.json({
      recommendedSeedId: suggestedSeedId,
      sowingTips: `Optimum sowing window: October - November. Standard spacing: 22.5cm rows. Seed depth: 3-5 cm. Apply elemental sulphur (40 kg/ha) to maximize performance.`,
      fertilizerSchedule: `Basal dose of 50kg DAP, 25kg MOP during planting. Top dress Urea during the first irrigation (30 days).`,
      expectedProfitEstimate: `Estimated gross revenue of ₹45,000 - ₹55,000 per acre with an investment of ₹12,000, yielding up to ₹43,000 net profit.`,
      advisoryNote: `Weather patterns indicate stable conditions for the upcoming weeks. Ideal time to proceed with nursery bedding.`,
      isFallback: true
    });
  }

  try {
    const prompt = `You are a crop recommendation engine for SRA SHRIJI AGRI GENETICS SEEDS PVT LTD, India.
Given these farmer parameters:
- State: ${state}
- District: ${district}
- Season: ${season}
- Soil Type: ${soilType}
- Irrigation Water Availability: ${water}
- Primary Farming Purpose: ${purpose}

Recommended seed choices:
- SRA 9048 (Maize)
- Super 2967 (Wheat)
- Tiger 90 (Pearl Millet / Bajra)
- Pusa 1847 (Paddy / Rice)
- SRA 4646 (Mustard)
- Malik QUEEN (SSG)

Your task:
1. Select the absolute best seed from the list above. Provide its recommendedSeedId matching the exact IDs ('sra-9048', 'super-2967', 'tiger-90', 'pusa-1847', 'sra-4646', 'malik-queen').
2. Provide elite, tailored agronomic instructions (Sowing tips, spacing, fertilizer recommendations, expected profit estimate, and climatic alert advisory).

Return ONLY a structured JSON block:
{
  "recommendedSeedId": "string",
  "sowingTips": "string (Concise, practical sowing window and seed spacing guide)",
  "fertilizerSchedule": "string (Precise NPK and secondary nutrient calendar)",
  "expectedProfitEstimate": "string (Realistic financial yield and profit per acre in Rupees)",
  "advisoryNote": "string (Meteorological or pest advisory tailored to this regional climate)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedSeedId: { type: Type.STRING },
            sowingTips: { type: Type.STRING },
            fertilizerSchedule: { type: Type.STRING },
            expectedProfitEstimate: { type: Type.STRING },
            advisoryNote: { type: Type.STRING }
          },
          required: ["recommendedSeedId", "sowingTips", "fertilizerSchedule", "expectedProfitEstimate", "advisoryNote"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in recommend-seed API:', error);
    // Graceful fallback on crash
    return res.json({
      recommendedSeedId: suggestedSeedId,
      sowingTips: `Standard spacing: 22.5cm rows. Seed depth: 3-5 cm.`,
      fertilizerSchedule: `Basal dose of 50kg DAP, 25kg MOP during planting.`,
      expectedProfitEstimate: `Estimated premium returns based on historical trials.`,
      advisoryNote: `Please consult our toll-free customer support for direct soil testing assistance.`,
      isFallback: true
    });
  }
});

// Setup Vite Dev server middleware or Production Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SRA SHRIJI AGRI GENETICS SEEDS PVT LTD Server running on http://localhost:${PORT}`);
  });
}

startServer();
