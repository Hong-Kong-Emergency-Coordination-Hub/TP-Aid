import React from 'react';
import { TabType, Category } from '../types';
import { Search } from 'lucide-react';

interface FilterBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allowedCategories: Category[];
}

const ALL_TABS: { id: Category; label: string }[] = [
  { id: 'government', label: '政府資訊' },
  { id: 'business', label: '商鋪資訊' },
  { id: 'organization', label: '組織資訊' },
  { id: 'social_worker', label: '社工支援' },
  { id: 'housing', label: '安置 / 房屋' },
  { id: 'medical', label: '醫療' },
  { id: 'help_request', label: '求助' },
  { id: 'volunteer', label: '義工' },
  { id: 'supplies', label: '物資' },
];

export const FilterBar: React.FC<FilterBarProps> = ({ 
  activeTab, 
  onTabChange, 
  searchQuery, 
  onSearchChange,
  allowedCategories
}) => {
  // Filter tabs based on the current page context
  const visibleTabs = [
    { id: 'all' as TabType, label: '全部' },
    ...ALL_TABS.filter(tab => allowedCategories.includes(tab.id))
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Search Input */}
      <div className="relative mx-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜尋物資、地點..."
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 sm:text-sm transition-all shadow-sm"
        />
      </div>

      {/* Filter Chips - Horizontal Scroll */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 px-1 pb-1">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className={`
                whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                ${isActive 
                  ? 'bg-black text-white border-black shadow-md' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};