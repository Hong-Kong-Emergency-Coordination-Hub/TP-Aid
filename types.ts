export type Category = 'volunteer' | 'supplies' | 'help_request' | 'official' | 'medical';

export type TabType = 'all' | Category;

export interface Post {
  id: string;
  category: Category;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  urgent?: boolean;
  verified?: boolean; // For NGO/Official posts
  contact?: string;
}

export interface EmergencyContact {
  name: string;
  number: string;
  description?: string;
}