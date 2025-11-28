import { Post, EmergencyContact } from './types';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    category: 'official',
    title: '臨時庇護中心已開放',
    description: '大窩邨社區中心現已開放予受火災影響嘅居民暫避。現場提供食水同毛氈。',
    location: '大窩鄰里社區中心',
    timestamp: '10 分鐘前',
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
    contact: '6789-0123'
  },
  {
    id: '4',
    category: 'volunteer',
    title: '結構工程師義工',
    description: '註冊結構工程師，可協助評估低層單位結構安全，有需要請聯絡。',
    location: '現場',
    timestamp: '1 小時前',
    verified: true
  },
  {
    id: '5',
    category: 'medical',
    title: '臨時急救站',
    description: '紅十字會已喺籃球場附近設立臨時急救站，處理輕傷同吸入濃煙不適。',
    location: '籃球場',
    timestamp: '2 小時前',
    verified: true
  },
  {
    id: '6',
    category: 'supplies',
    title: '提供蒸餾水',
    description: '有一批蒸餾水畀冇水電嘅家庭，請自備容器。',
    location: 'A座 大堂',
    timestamp: '3 小時前'
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { name: '消防處', number: '999' },
  { name: '大埔民政處', number: '2654 1262' },
  { name: '社會福利署', number: '2343 2255' },
];