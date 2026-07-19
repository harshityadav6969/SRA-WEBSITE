import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Send, Mic, Volume2, Bot, User, X, Leaf, HelpCircle, ChevronRight, Minimize2 } from 'lucide-react';

interface AIAssistantWidgetProps {
  currentLang: 'English' | 'Hindi' | 'Punjabi';
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIAssistantWidget({ currentLang }: AIAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I am 'Sra Shriji AI Crop Advisor'. Ask me anything about soil testing, crop selection, fertilizer scheduling, or managing pests. I can reply in English, Hindi, or Punjabi!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chats
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  const t = {
    English: {
      advisorTitle: 'Sra Shriji AI Advisor',
      advisorSubtitle: 'Elite Agronomic Intelligence',
      placeholder: 'Ask about seeds, fertilizers, pests...',
      voiceListening: 'Listening to voice...',
      greeting: "Hello! I am 'Sra Shriji AI Crop Advisor'. Ask me anything about soil testing, crop selection, fertilizer scheduling, or managing pests. I can reply in English, Hindi, or Punjabi!",
    },
    Hindi: {
      advisorTitle: 'स्रा श्रीजी एआई सलाहकार',
      advisorSubtitle: 'उत्कृष्ट कृषि वैज्ञानिक एआई',
      placeholder: 'बीज, खाद या फसल रोगों के बारे में पूछें...',
      voiceListening: 'आवाज सुन रहा है...',
      greeting: "नमस्ते! मैं 'स्रा श्रीजी एआई फसल सलाहकार' हूँ। मिट्टी परीक्षण, बीज चयन, खाद कार्यक्रम या कीट प्रबंधन के बारे में कुछ भी पूछें। मैं हिंदी, अंग्रेजी या पंजाबी में उत्तर दे सकता हूँ!",
    },
    Punjabi: {
      advisorTitle: 'ਸਰਾ ਸ਼੍ਰੀਜੀ ਏਆਈ ਸਲਾਹਕਾਰ',
      advisorSubtitle: 'ਉੱਤਮ ਖੇਤੀਬਾੜੀ ਵਿਗਿਆਨਕ ਏਆਈ',
      placeholder: 'ਬੀਜ, ਖਾਦ ਜਾਂ ਬਿਮਾਰੀਆਂ ਬਾਰੇ ਪੁੱਛੋ...',
      voiceListening: 'ਆਵਾਜ਼ ਸੁਣ ਰਿਹਾ ਹੈ...',
      greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ 'ਸਰਾ ਸ਼੍ਰੀਜੀ ਏਆਈ ਫਸਲ ਸਲਾਹਕਾਰ' ਹਾਂ। ਮਿੱਟੀ ਦੀ ਪਰਖ, ਬੀਜ ਦੀ ਚੋਣ, ਖਾਦ ਦੇ ਸਮੇਂ ਜਾਂ ਕੀੜਿਆਂ ਦੇ ਪ੍ਰਬੰਧਨ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ। ਮੈਂ ਪੰਜਾਬੀ, ਹਿੰਦੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਜਵਾਬ ਦੇ ਸਕਦਾ ਹਾਂ!",
    }
  }[currentLang];

  // If language changes, update greeting if it is the only message
  useEffect(() => {
    if (chatMessages.length === 1) {
      setChatMessages([{ role: 'model', text: t.greeting }]);
    }
  }, [currentLang]);

  const handleSendMessage = async (msgText?: string) => {
    const textToSend = msgText || inputValue;
    if (!textToSend.trim() || sendingChat) return;

    setInputValue('');
    const updatedMessages = [...chatMessages, { role: 'user' as const, text: textToSend }];
    setChatMessages(updatedMessages);
    setSendingChat(true);

    try {
      const response = await fetch('/api/crop-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: updatedMessages.slice(0, -1)
        })
      });
      const data = await response.json();
      setChatMessages([...updatedMessages, { role: 'model', text: data.text }]);
    } catch (err) {
      console.error(err);
      setChatMessages([...updatedMessages, { role: 'model', text: "Apologies, I encountered a connection issue. Please make sure your Gemini API key is configured or retry shortly." }]);
    } finally {
      setSendingChat(false);
    }
  };

  const speakText = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      if (voicePlaying === text) {
        window.speechSynthesis.cancel();
        setVoicePlaying(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[\*\#\`]/g, ''));
      if (/[\u0900-\u097F]/.test(text)) {
        utterance.lang = 'hi-IN';
      } else if (/[\u0A00-\u0A7F]/.test(text)) {
        utterance.lang = 'pa-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      utterance.onend = () => setVoicePlaying(null);
      setVoicePlaying(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeechInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = currentLang === 'Hindi' ? 'hi-IN' : currentLang === 'Punjabi' ? 'pa-IN' : 'en-IN';
      setIsListening(true);
      
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.start();
    } else {
      alert("Voice speech-to-text dictation is not fully supported in this browser viewport.");
    }
  };

  const presetQueries = [
    { label: '🌽 SRA 9048 Maize Guide', text: 'Tell me about SRA 9048 Hybrid Maize' },
    { label: '🐛 Pink Bollworm Control', text: 'How to control Pink Bollworm in Cotton?' },
    { label: '🌾 Super 2967 Wheat Rust', text: 'What are the features of Super 2967 Wheat and its rust resistance?' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="floating-ai-assistant">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="w-[360px] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(13,92,52,0.15)] flex flex-col overflow-hidden mb-4"
          >
            {/* Widget Header */}
            <div className="bg-brand-dark p-4 text-white flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-green to-emerald-500 flex items-center justify-center shadow-lg shadow-brand-green/20">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold tracking-tight uppercase text-brand-amber">AI Farm Expert</h4>
                  <p className="text-sm font-bold text-white font-display leading-tight">{t.advisorTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all cursor-pointer"
                  title="Minimize"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chats scrolling viewport */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'
                  }`}
                >
                  {/* Avatar bubble */}
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                      msg.role === 'user' ? 'bg-brand-green text-white' : 'bg-brand-dark text-brand-gold'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>

                  {/* Body text bubble */}
                  <div className="space-y-1">
                    <div
                      className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed relative ${
                        msg.role === 'user'
                          ? 'bg-brand-green text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      
                      {/* Speaker Read-Aloud Trigger */}
                      {msg.role === 'model' && (
                        <button
                          onClick={(e) => speakText(msg.text, e)}
                          className={`absolute bottom-1 right-1 p-1 rounded hover:bg-gray-100 transition-all ${
                            voicePlaying === msg.text ? 'text-red-500 animate-pulse' : 'text-gray-400'
                          }`}
                          title={voicePlaying === msg.text ? 'Stop audio' : 'Listen aloud'}
                        >
                          <Volume2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {sendingChat && (
                <div className="flex gap-2.5 max-w-[85%] mr-auto text-left">
                  <div className="h-7 w-7 rounded-lg bg-brand-dark text-emerald-400 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1 items-center justify-center py-1">
                      <span className="h-1.5 w-1.5 bg-brand-green rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 bg-brand-green rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 bg-brand-green rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick chips footer inside drawer */}
            <div className="px-4 py-2 bg-white border-t border-gray-100 overflow-x-auto flex gap-1.5 whitespace-nowrap scrollbar-none">
              {presetQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.text)}
                  className="px-2.5 py-1.5 bg-gray-50 hover:bg-brand-green/5 border border-gray-150 rounded-full text-[10px] font-bold text-gray-600 hover:text-brand-green transition-all"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Message input footer */}
            <div className="bg-white p-3 border-t border-gray-100 flex items-center gap-1.5">
              <button
                onClick={handleSpeechInput}
                className={`p-2.5 border rounded-xl transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-500 border-red-500 text-white animate-pulse'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-500 hover:text-brand-green'
                }`}
                title="Voice Dictation"
              >
                <Mic className="h-4.5 w-4.5" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isListening ? t.voiceListening : t.placeholder}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 outline-none focus:border-brand-green transition-colors"
                disabled={isListening}
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-brand-green hover:bg-brand-green/95 text-white p-2.5 rounded-xl transition-colors shadow-lg shadow-brand-green/10 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-green to-emerald-600 text-white shadow-[0_10px_30px_rgba(13,92,52,0.3)] hover:shadow-[0_15px_35px_rgba(13,92,52,0.4)] flex items-center justify-center transition-all relative cursor-pointer"
        id="ai-widget-trigger"
      >
        <div className="absolute inset-0 rounded-full border border-brand-green/30 animate-ping opacity-60" style={{ animationDuration: '3s' }} />
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Leaf className="h-6 w-6 text-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle notifications badge */}
        {!isOpen && (
          <span className="absolute top-0 right-0 h-3.5 w-3.5 bg-brand-gold border-2 border-white rounded-full animate-bounce" />
        )}
      </motion.button>
    </div>
  );
}
