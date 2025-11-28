import { Post, EmergencyContact, Category } from './types';

// Grouping definitions
export const INFO_CATEGORIES: Category[] = [
  'government', 
  'medical',
  'housing', 
  'social_worker', 
  'organization', 
  'business'
];

export const AID_CATEGORIES: Category[] = [
  'help_request', 
  'volunteer', 
  'supplies' // Assuming personal supplies sharing fits here, or official supplies fit info. 
             // Based on user prompt "Request / Support", supplies usually goes with Support.
];

// Coordinates center around Tai Po: 22.4508, 114.1642 (approx)

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    category: 'government',
    title: '臨時庇護中心已開放',
    description: '大窩邨社區中心現已開放予受火災影響嘅居民暫避。現場提供食水同毛氈。',
    location: '大窩鄰里社區中心',
    timestamp: '10 分鐘前',
    coordinates: { lat: 22.4550, lng: 114.1620 },
    urgent: true,
    verified: true
  },
  {
    id: 'road_block_1',
    category: 'government',
    title: '【封路資訊】廣福道往大埔中心方向',
    description: '因火警救援車輛出入，廣福道近康福苑一段慢線已封閉，請駕駛人士改道。',
    location: '廣福道 / 寶鄉街交界',
    timestamp: '15 分鐘前',
    coordinates: { lat: 22.4495, lng: 114.1680 },
    urgent: true,
    verified: true
  },
  {
    id: '2',
    category: 'help_request',
    title: '急需輪椅協助',
    description: 'B座14樓有長者需要落樓，𨋢壞咗行唔到樓梯，急需人手幫忙。',
    location: 'B座 14樓 1405室',
    timestamp: '25 分鐘前',
    coordinates: { lat: 22.4510, lng: 114.1715 },
    urgent: true,
    contact: '9123-4567'
  },
  {
    id: '3',
    category: 'supplies',
    title: '派發 N95 口罩',
    description: '我有 5 盒 N95 口罩畀受濃煙影響嘅街坊，可以嚟大堂免費攞。',
    location: '康福苑大堂入口',
    timestamp: '45 分鐘前',
    coordinates: { lat: 22.4512, lng: 114.1710 },
    contact: '6789-0123'
  },
  {
    id: '4',
    category: 'social_worker',
    title: '情緒支援熱線',
    description: '我哋機構有社工提供即時情緒支援，如果感到驚慌或不安，請隨時搵我哋。',
    location: '網上 / 電話',
    timestamp: '50 分鐘前',
    // No coordinates for online services usually, or set to center
    verified: true,
    contact: '2345-6789'
  },
  {
    id: '5',
    category: 'volunteer',
    title: '結構工程師義工',
    description: '註冊結構工程師，可協助評估低層單位結構安全，有需要請聯絡。',
    location: '現場',
    timestamp: '1 小時前',
    coordinates: { lat: 22.4508, lng: 114.1708 },
    verified: true
  },
  {
    id: '6',
    category: 'medical',
    title: '臨時急救站',
    description: '紅十字會已喺籃球場附近設立臨時急救站，處理輕傷同吸入濃煙不適。',
    location: '籃球場',
    timestamp: '2 小時前',
    coordinates: { lat: 22.4515, lng: 114.1705 },
    verified: true
  },
  {
    id: '7',
    category: 'housing',
    title: '提供短期住宿',
    description: '我有個吉單位喺附近大埔中心，可以暫時畀受影響家庭住兩三日，有水電。',
    location: '大埔中心',
    timestamp: '2 小時前',
    coordinates: { lat: 22.4530, lng: 114.1720 },
    contact: '9876-5432'
  },
  {
    id: '8',
    category: 'business',
    title: '免費提供飯盒',
    description: '我哋茶餐廳準備咗 100 個飯盒，受影響居民可以憑住址證明免費領取。',
    location: '翠樂街 8 號地舖',
    timestamp: '3 小時前',
    coordinates: { lat: 22.4560, lng: 114.1650 },
    verified: true
  },
  {
    id: '9',
    category: 'organization',
    title: '物資收集站',
    description: '關愛隊已設立物資收集站，目前急需樽裝水、乾糧同尿片。',
    location: '屋苑管理處外',
    timestamp: '3 小時前',
    coordinates: { lat: 22.4511, lng: 114.1712 },
    verified: true
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { name: '消防處', number: '999' },
  { name: '大埔民政處', number: '2654 1262' },
  { name: '社會福利署', number: '2343 2255' },
];