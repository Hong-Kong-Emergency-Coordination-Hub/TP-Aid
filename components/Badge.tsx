import React from 'react';
import { Category } from '../types';

interface BadgeProps {
  category: Category;
  urgent?: boolean;
}

const CATEGORY_LABELS: Record<Category, string> = {
  government: '政府資訊',
  business: '商鋪資訊',
  organization: '組織資訊',
  social_worker: '社工支援',
  housing: '安置 / 房屋',
  volunteer: '義工招募',
  supplies: '物資供應',
  help_request: '求助',
  medical: '醫療支援'
};

export const Badge: React.FC<BadgeProps> = ({ category, urgent }) => {
  if (urgent) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-white animate-pulse">
        緊急
      </span>
    );
  }

  // Keeping the palette minimal/grayscale as originally requested, 
  // but using slight shade variations or borders to distinguish.
  const styles: Record<Category, string> = {
    government: 'bg-gray-800 text-white border-gray-800', // Stand out as official
    business: 'bg-white text-gray-800 border-gray-400',
    organization: 'bg-gray-100 text-gray-900 border-gray-300 font-medium',
    social_worker: 'bg-gray-100 text-gray-800 border-gray-200',
    housing: 'bg-gray-100 text-gray-800 border-gray-200',
    volunteer: 'bg-gray-100 text-gray-800 border-gray-200',
    supplies: 'bg-gray-100 text-gray-800 border-gray-200',
    help_request: 'bg-gray-100 text-gray-800 border-gray-200',
    medical: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[category]}`}>
      {CATEGORY_LABELS[category]}
    </span>
  );
};