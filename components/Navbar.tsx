import React from 'react';
import { Plus, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 h-16 flex items-center justify-center">
      <div className="max-w-2xl w-full px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-1.5 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">
            康福苑互助站
          </h1>
        </div>
        
        <div className="hidden md:block">
           <button 
             onClick={() => document.dispatchEvent(new CustomEvent('open-post-modal'))}
             className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
           >
             新增貼文
           </button>
        </div>
      </div>
    </nav>
  );
};