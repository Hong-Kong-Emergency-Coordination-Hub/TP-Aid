import React, { useState } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { getSafetyAdvice } from '../services/geminiService';

export const SmartAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    
    const answer = await getSafetyAdvice(query);
    
    setResponse(answer);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-white border border-gray-200 text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all flex items-center gap-2"
      >
        <Sparkles className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium pr-1 hidden md:block">智能助手</span>
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 shadow-xl rounded-2xl w-80 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gray-600" />
            <span className="font-semibold text-sm text-gray-900">安全助手</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 bg-white min-h-[100px] text-sm">
        {loading ? (
            <div className="space-y-2 animate-pulse">
                <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                <div className="h-2 bg-gray-100 rounded w-1/2"></div>
            </div>
        ) : response ? (
            <p className="text-gray-800 leading-relaxed">{response}</p>
        ) : (
            <p className="text-gray-400">查詢安全貼士、庇護中心位置、急救資訊...</p>
        )}
      </div>

      <form onSubmit={handleAsk} className="p-2 border-t border-gray-100 flex gap-2">
        <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="輸入問題..."
            className="flex-1 text-sm bg-gray-50 border-transparent focus:bg-white focus:ring-0 focus:border-gray-200 rounded-lg px-3 py-2 transition-colors"
        />
        <button 
            type="submit"
            disabled={loading || !query}
            className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
            <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};