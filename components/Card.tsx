import React from 'react';
import { Post } from '../types';
import { Badge } from './Badge';
import { MapPin, Clock, BadgeCheck, Phone, CheckCircle2, RotateCcw } from 'lucide-react';

interface CardProps {
  post: Post;
  onStatusChange?: (id: string) => void;
}

export const Card: React.FC<CardProps> = ({ post, onStatusChange }) => {
  const isClosed = post.status === 'closed';

  return (
    <div className={`rounded-2xl p-5 shadow-sm border mb-4 transition-all hover:shadow-md relative overflow-hidden flex flex-col ${
      isClosed ? 'bg-gray-50 border-gray-100 opacity-80' : 'bg-white border-gray-100'
    }`}>
      
      {/* Resolved Watermark/Overlay for closed posts */}
      {isClosed && (
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <CheckCircle2 className="w-24 h-24 text-gray-900" />
        </div>
      )}

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex gap-2 items-center flex-wrap">
          <Badge category={post.category} />
          {post.urgent && !isClosed && <Badge category={post.category} urgent={true} />}
          {isClosed && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600 border border-gray-300">
              已解決
            </span>
          )}
        </div>
        {post.verified && (
          <BadgeCheck className="w-5 h-5 text-gray-900" aria-label="Verified Source" />
        )}
      </div>

      <h3 className={`text-lg font-semibold mb-2 leading-snug ${isClosed ? 'text-gray-500 line-through decoration-gray-400' : 'text-gray-900'}`}>
        {post.title}
      </h3>
      
      <p className={`text-sm mb-4 leading-relaxed ${isClosed ? 'text-gray-400' : 'text-gray-600'}`}>
        {post.description}
      </p>

      <div className="flex flex-col gap-3 pt-3 border-t border-gray-100/50">
        <div className="flex items-center justify-between">
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
        </div>
        
        {/* Action Row */}
        <div className="flex flex-wrap gap-2 items-center justify-between mt-1">
          {post.contact && !isClosed ? (
             <a href={`tel:${post.contact}`} className="flex items-center gap-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
               <Phone className="w-3.5 h-3.5" />
               致電: {post.contact}
             </a>
          ) : (
            <div></div> /* Spacer */
          )}

          {/* Close/Reopen Button */}
          {onStatusChange && (
            <button 
              onClick={() => onStatusChange(post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isClosed 
                ? 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800' 
                : 'bg-white border-gray-200 text-gray-400 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
              }`}
            >
              {isClosed ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  重新開啟
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  標記已解決
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};