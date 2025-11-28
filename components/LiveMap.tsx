import React, { useEffect, useRef } from 'react';
import { Post, Category } from '../types';

interface LiveMapProps {
  posts: Post[];
}

// Labels mapping for the popup
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

// Helper to determine marker color based on category
const getMarkerColor = (category: Category, urgent?: boolean): string => {
  if (urgent) return '#EF4444'; // Red-500 (Urgent/Help)
  
  switch (category) {
    case 'help_request':
    case 'medical':
      return '#EF4444'; // Red
    case 'supplies':
    case 'housing':
    case 'business':
    case 'volunteer':
      return '#10B981'; // Emerald-500 (Resources)
    case 'government':
      return '#3B82F6'; // Blue-500 (Info/Roads)
    default:
      return '#6B7280'; // Gray-500 (Others)
  }
};

const createCustomIcon = (color: string) => {
  // Simple SVG circle marker
  const svg = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="white" stroke="${color}" stroke-width="3"/>
      <circle cx="12" cy="12" r="5" fill="${color}"/>
    </svg>
  `;
  
  // @ts-ignore - Leaflet is loaded via CDN
  return L.divIcon({
    className: 'custom-marker',
    html: svg,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -10]
  });
};

export const LiveMap: React.FC<LiveMapProps> = ({ posts }) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not exists
    if (!mapRef.current) {
      // @ts-ignore
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([22.4510, 114.1710], 16); // Center on Tai Po

      // Add OpenStreetMap tiles (CartoDB Voyager for a cleaner look)
      // @ts-ignore
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(map);
      
      // @ts-ignore
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // Add new markers
    posts.forEach(post => {
      if (post.coordinates && post.status !== 'closed') {
        const color = getMarkerColor(post.category, post.urgent);
        const icon = createCustomIcon(color);
        
        // Construct Rich Popup HTML
        const label = CATEGORY_LABELS[post.category] || post.category;
        const phoneHtml = post.contact 
          ? `<a href="tel:${post.contact}" class="mt-2 flex items-center justify-center gap-1.5 w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-1.5 rounded-lg text-xs transition-colors no-underline">
               📞 致電: ${post.contact}
             </a>` 
          : '';

        const popupContent = `
          <div class="font-sans min-w-[200px]">
            <div class="flex items-center justify-between mb-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold border" style="background-color: #f3f4f6; color: #374151; border-color: #e5e7eb;">
                ${label}
              </span>
              ${post.urgent ? '<span class="text-[10px] font-bold text-red-500 animate-pulse">緊急</span>' : ''}
            </div>
            
            <h3 class="font-bold text-sm text-gray-900 mb-1 leading-tight">${post.title}</h3>
            <p class="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-2">${post.description}</p>
            
            <div class="border-t border-gray-100 pt-2 mt-1">
              <div class="text-xs text-gray-500 flex items-center gap-1 mb-1">
                📍 ${post.location}
              </div>
              <div class="text-[10px] text-gray-400 flex items-center gap-1">
                🕒 ${post.timestamp}
              </div>
              ${phoneHtml}
            </div>
          </div>
        `;
        
        // @ts-ignore
        const marker = L.marker([post.coordinates.lat, post.coordinates.lng], { icon })
          .addTo(map)
          .bindPopup(popupContent);
        
        markersRef.current.push(marker);
      }
    });

    // Fit bounds if we have markers
    if (markersRef.current.length > 0) {
      // @ts-ignore
      const group = new L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 17 });
    }

    // Cleanup on unmount or re-render
    return () => {
        // We keep the map instance alive for performance, but clear markers
    };
  }, [posts]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <div ref={mapContainerRef} className="w-full h-full z-0 bg-gray-100" />
        
        {/* Legend Overlay */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-gray-100 text-xs z-[400] space-y-1.5">
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white shadow-sm"></div>
                <span className="text-gray-700 font-medium">求助 / 危機</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm"></div>
                <span className="text-gray-700 font-medium">物資 / 資源</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white shadow-sm"></div>
                <span className="text-gray-700 font-medium">官方 / 資訊</span>
            </div>
        </div>
    </div>
  );
};