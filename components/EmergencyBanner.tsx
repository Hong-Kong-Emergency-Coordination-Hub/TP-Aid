import React, { useState } from 'react';
import { Phone, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../constants';

export const EmergencyBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-2">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer active:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full border border-gray-200 shadow-sm">
             <AlertTriangle className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">緊急聯絡</h2>
            <p className="text-xs text-gray-500">撳入去睇重要電話號碼</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </div>
      
      {isExpanded && (
        <div className="p-4 grid grid-cols-1 gap-3 bg-white">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <a 
              key={idx} 
              href={`tel:${contact.number.replace(/\s/g, '')}`}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              <span className="font-medium text-gray-900">{contact.name}</span>
              <span className="flex items-center gap-2 text-gray-900 font-semibold bg-gray-100 px-3 py-1 rounded-lg group-hover:bg-white transition-colors">
                <Phone className="w-3.5 h-3.5" />
                {contact.number}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};