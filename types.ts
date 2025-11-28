export type Category = 
  | 'government'    // 政府資訊
  | 'business'      // 商鋪資訊
  | 'organization'  // 組織資訊
  | 'social_worker' // 社工支援
  | 'housing'       // 安置 / 房屋
  | 'volunteer'     // 義工
  | 'supplies'      // 物資
  | 'help_request'  // 求助
  | 'medical';      // 醫療

export type TabType = 'all' | Category;

export type PostStatus = 'open' | 'closed';

// New type for the main bottom navigation views
export type PageType = 'info' | 'aid';

export interface Post {
  id: string;
  category: Category;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  urgent?: boolean;
  verified?: boolean; // For NGO/Government posts
  contact?: string;
  status?: PostStatus;
}

export interface EmergencyContact {
  name: string;
  number: string;
  description?: string;
}