import React from 'react';
import { Post } from '../types';
import { Badge } from './Badge';
import { MapPin, Clock, BadgeCheck, Phone } from 'lucide-react';

interface CardProps {
  post: Post;
}

export const Card: React.FC<CardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2 items-center">
          <Badge category={post.category} />
          {post.urgent && <Badge category={post.category} urgent={true} />}
        </div>
        {post.verified && (
          <BadgeCheck className="w-5 h-5 text-gray-900" aria-label="Verified Source" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">
        {post.title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {post.description}
      </p>

      <div className="flex flex-col gap-2 pt-3 border-t border-gray-50">
        <div className="flex items-center text-xs text-gray-500 gap-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{post.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.timestamp}</span>
          </div>
        </div>
        
        {post.contact && (
           <div className="mt-2 flex">
             <a href={`tel:${post.contact}`} className="flex items-center gap-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
               <Phone className="w-3.5 h-3.5" />
               致電: {post.contact}
             </a>
           </div>
        )}
      </div>
    </div>
  );
};