import { GoogleGenAI } from '@google/genai';

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

  const { message, history } = req.body || {};

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
    return res.status(200).json({ text: reply, isFallback: true });
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

    if (history && history.length > 0) {
      const formattedHistoryPrompt = history.map((h: any) => `${h.role === 'user' ? 'Farmer' : 'Advisor'}: ${h.text}`).join('\n') + `\nFarmer: ${message}\nAdvisor:`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: formattedHistoryPrompt,
      });
      return res.status(200).json({ text: response.text });
    } else {
      const response = await chat.sendMessage({ message });
      return res.status(200).json({ text: response.text });
    }
  } catch (error: any) {
    console.error('Error in crop-advisor API:', error);
    return res.status(500).json({ error: error.message || 'Error executing crop advisor model' });
  }
}
