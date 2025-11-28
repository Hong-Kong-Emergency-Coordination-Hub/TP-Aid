import React from 'react';
import { Category } from '../types';

interface BadgeProps {
  category: Category;
  urgent?: boolean;
}

const CATEGORY_LABELS: Record<Category, string> = {
  volunteer: '義工招募',
  supplies: '物資供應',
  help_request: '求助',
  official: '官方發佈',
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

  const styles = {
    volunteer: 'bg-gray-100 text-gray-800 border-gray-200',
    supplies: 'bg-gray-100 text-gray-800 border-gray-200',
    help_request: 'bg-gray-100 text-gray-800 border-gray-200',
    official: 'bg-gray-200 text-gray-900 border-gray-300 font-semibold',
    medical: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[category] || styles.volunteer}`}>
      {CATEGORY_LABELS[category]}
    </span>
  );
};