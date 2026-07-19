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

  const { productName, platform, lang, benefitTheme } = req.body || {};

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
    return res.status(200).json({ text: `📺 *FALLBACK ${platform?.toUpperCase() || 'POST'} POST*\n\n${headline}\n\n${body}`, isFallback: true });
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

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Error in ugc-generator API:', error);
    return res.status(500).json({ error: error.message || 'Error generating marketing text' });
  }
}
