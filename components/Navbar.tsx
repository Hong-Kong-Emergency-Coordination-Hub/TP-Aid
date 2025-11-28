import React from 'react';
import { Type, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  isLargeText?: boolean;
  onToggleFont?: () => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isLargeText, onToggleFont, onLoginClick }) => {
  const { user, signOut, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 h-16 flex items-center justify-center">
      <div className="max-w-2xl w-full px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Logo removed as requested */}
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">
            康福苑互助站
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
           {onToggleFont && (
             <button 
               onClick={onToggleFont}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                 isLargeText 
                 ? 'bg-gray-200 text-black' 
                 : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
               }`}
               aria-label="切換字體大小"
             >
               <Type className="w-4 h-4" />
               <span className="hidden sm:inline">長者模式</span>
               <span className="sm:hidden">{isLargeText ? '大' : '中'}</span>
             </button>
           )}

           <div className="hidden md:block">
             <button 
               onClick={() => document.dispatchEvent(new CustomEvent('open-post-modal'))}
               className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
             >
               新增貼文
             </button>
           </div>

           {!loading && (
             user ? (
               <button
                 onClick={signOut}
                 className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                 title="登出"
               >
                 <LogOut className="w-5 h-5" />
               </button>
             ) : (
               <button
                 onClick={onLoginClick}
                 className="p-2 text-black hover:bg-gray-100 rounded-full"
                 title="登入"
               >
                 <LogIn className="w-5 h-5" />
               </button>
             )
           )}
        </div>
      </div>
    </nav>
  );
};