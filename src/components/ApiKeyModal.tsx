import React, { useState, useEffect } from 'react';
import { X, Key, Check } from 'lucide-react';
import { FORCE_BYOK } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('CUSTOM_GEMINI_API_KEY');
      if (stored) setApiKey(stored);
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('CUSTOM_GEMINI_API_KEY', apiKey.trim());
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      localStorage.removeItem('CUSTOM_GEMINI_API_KEY');
      if (!FORCE_BYOK) {
        setSaved(true);
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    }
  };

  const hasKey = !!localStorage.getItem('CUSTOM_GEMINI_API_KEY');
  const canClose = !FORCE_BYOK || hasKey;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-medium flex items-center gap-2 text-gray-900 dark:text-white">
            <Key size={18} />
            API Settings
          </h2>
          {canClose && (
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm leading-relaxed border border-blue-100 dark:border-blue-800/30">
            <p className="font-semibold mb-1">🔒 Your Privacy is Guaranteed</p>
            <p className="mb-2">
              {FORCE_BYOK 
                ? "This application requires a free Gemini API key to function. For your absolute security, your key is stored exclusively in your browser's local memory. It is never sent to any backend server, and nobody—not even the creator of this app—can see, access, or use your key. It communicates directly with Google."
                : "Enter your own Gemini API key to use your own quota. For your absolute security, your key is stored exclusively in your browser's local memory. It is never sent to any backend server, and nobody—not even the creator of this app—can see, access, or use your key."}
            </p>
            <p className="font-medium">
              ✨ You only need to do this once! Your key will be securely saved for future visits.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Gemini API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-3 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none font-mono text-sm"
            />
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline mt-1"
            >
              Get a free Gemini API key here &rarr;
            </a>
          </div>
          <button
            onClick={handleSave}
            disabled={FORCE_BYOK && !apiKey.trim()}
            className={`w-full py-3 mt-2 rounded-xl font-medium transition-transform flex items-center justify-center gap-2 ${
              FORCE_BYOK && !apiKey.trim()
                ? 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-white/40 cursor-not-allowed'
                : 'bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02]'
            }`}
          >
            {saved ? <><Check size={18} /> Saved</> : 'Save Key'}
          </button>
        </div>
      </div>
    </div>
  );
};
