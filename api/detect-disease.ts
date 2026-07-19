import { GoogleGenAI, Type } from '@google/genai';

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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { image } = req.body || {};

  if (!image) {
    return res.status(400).json({ error: 'Image base64 data is required' });
  }

  const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, '');

  const ai = getAI();
  if (!ai) {
    // Return high-quality mock data for simulation if API is unconfigured
    return res.status(200).json({
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
    return res.status(200).json(parsedData);
  } catch (error: any) {
    console.error('Error in detect-disease API:', error);
    return res.status(500).json({ error: error.message || 'Error processing crop image' });
  }
}
