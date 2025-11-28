import React from 'react';
import { Newspaper, HeartHandshake } from 'lucide-react';
import { PageType } from '../types';

interface BottomNavProps {
  activePage: PageType;
  onPageChange: (page: PageType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, onPageChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-1 px-6 h-[80px] z-50 flex items-start justify-center gap-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      
      <button 
        onClick={() => onPageChange('info')}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-20 ${
          activePage === 'info' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <div className={`p-1.5 rounded-full transition-all ${
           activePage === 'info' ? 'bg-blue-50' : 'bg-transparent'
        }`}>
          <Newspaper className={`w-6 h-6 ${activePage === 'info' ? 'fill-blue-600 text-blue-600' : ''}`} />
        </div>
        <span className="text-[11px] font-medium tracking-wide">資訊台</span>
      </button>

      <button 
        onClick={() => onPageChange('aid')}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-20 ${
          activePage === 'aid' ? 'text-rose-600' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <div className={`p-1.5 rounded-full transition-all ${
           activePage === 'aid' ? 'bg-rose-50' : 'bg-transparent'
        }`}>
          <HeartHandshake className={`w-6 h-6 ${activePage === 'aid' ? 'fill-rose-600 text-rose-600' : ''}`} />
        </div>
        <span className="text-[11px] font-medium tracking-wide">互助區</span>
      </button>

    </div>
  );
};