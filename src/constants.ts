import { Book, ShoppingBag, Activity, MessageSquare, Settings, Search, User, MapPin, PlusCircle, LogIn } from 'lucide-react';

export const BOOK_CATEGORIES = ['Novels', 'Textbooks', 'Comic Books', 'Study Guides', 'Magazines', 'Other'];

export const CAMPUSES = [
  'SJCE',
  'NIE',
  'VVCE',
  'MIT Mysore',
  'JSS Science College',
  'ATME College',
  'Other'
];

export const DUMMY_BOOKS = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Novels',
    price: 12,
    campus: 'SJCE',
    coordinates: { lat: 40.7128, lng: -74.0060 }, // New York
    status: 'Available',
    image: 'https://picsum.photos/seed/gatsby/400/500',
    images: [
      'https://picsum.photos/seed/gatsby1/400/500',
      'https://picsum.photos/seed/gatsby2/400/500',
      'https://picsum.photos/seed/gatsby3/400/500'
    ],
    condition: 'Like New',
    purchaseDate: '2023-09-15',
    description: 'A classic novel in excellent condition. No highlights or torn pages. Perfect for literature students.',
    sellerName: 'Alex Rivera',
    sellerContact: 'alex.rivera@campus.edu'
  },
  {
    id: '2',
    title: 'Introduction to Algorithms',
    author: 'CLRS',
    category: 'Textbooks',
    price: 45,
    campus: 'NIE',
    coordinates: { lat: 40.7178, lng: -74.0431 },
    status: 'Available',
    image: 'https://picsum.photos/seed/algorithms/400/500',
    images: [
      'https://picsum.photos/seed/algorithms1/400/500',
      'https://picsum.photos/seed/algorithms2/400/500'
    ],
    condition: 'Good',
    purchaseDate: '2024-01-10',
    description: 'The "bible" of algorithms. Some pencil marks on the first few chapters but overall very clean.',
    sellerName: 'Sarah Chen',
    sellerContact: 'sarah.chen@campus.edu'
  },
  {
    id: '3',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'Novels',
    price: 18,
    campus: 'VVCE',
    coordinates: { lat: 40.7357, lng: -74.1724 },
    status: 'Sold',
    image: 'https://picsum.photos/seed/sapiens/400/500',
    images: [
      'https://picsum.photos/seed/sapiens1/400/500'
    ],
    condition: 'Fair',
    purchaseDate: '2023-05-20',
    description: 'Interesting read. The cover is a bit worn out but the content is perfectly readable.',
    sellerName: 'Jordan Smith',
    sellerContact: 'jordan.smith@campus.edu'
  },
  {
    id: '4',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Textbooks',
    price: 30,
    campus: 'MIT Mysore',
    coordinates: { lat: 40.5795, lng: -74.1502 },
    status: 'Available',
    image: 'https://picsum.photos/seed/cleancode/400/500',
    images: [
      'https://picsum.photos/seed/cleancode1/400/500',
      'https://picsum.photos/seed/cleancode2/400/500'
    ],
    condition: 'New',
    purchaseDate: '2024-03-01',
    description: 'Brand new, never used. Bought it for a course but decided to drop it.',
    sellerName: 'Mike Ross',
    sellerContact: 'mike.ross@campus.edu'
  },
  {
    id: '5',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Novels',
    price: 15,
    campus: 'JSS Science College',
    coordinates: { lat: 41.0340, lng: -73.7629 },
    status: 'Available',
    image: 'https://picsum.photos/seed/habits/400/500',
    images: [
      'https://picsum.photos/seed/habits1/400/500'
    ],
    condition: 'Good',
    purchaseDate: '2023-11-12',
    description: 'Life-changing book. In good condition, just a small coffee stain on the back cover.',
    sellerName: 'Emily Blunt',
    sellerContact: 'emily.blunt@campus.edu'
  },
  {
    id: '6',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Novels',
    price: 10,
    campus: 'ATME College',
    coordinates: { lat: 39.9526, lng: -75.1652 },
    status: 'Available',
    image: 'https://picsum.photos/seed/alchemist/400/500',
    images: [
      'https://picsum.photos/seed/alchemist1/400/500'
    ],
    condition: 'Like New',
    purchaseDate: '2023-12-05',
    description: 'Beautiful story. Read it once and kept it safely on the shelf.',
    sellerName: 'Chris Evans',
    sellerContact: 'chris.evans@campus.edu'
  }
];

export const DUMMY_USERS = [
  { id: '1', name: 'Rehan Busters', campus: 'SJCE', role: 'user', email: 'rehan@campus.edu', phone: '+91 98765 43210' },
  { id: '2', name: 'Alex Rivera', campus: 'SJCE', role: 'user', email: 'alex@campus.edu', phone: '+91 98765 43211' },
  { id: '3', name: 'Sarah Chen', campus: 'NIE', role: 'user', email: 'sarah@campus.edu', phone: '+91 98765 43212' },
  { id: '4', name: 'Admin Master', campus: 'SJCE', role: 'admin', email: 'admin@campus.edu', phone: '+91 98765 43213' },
];

export const NAV_ITEMS = [
  { label: 'Marketplace', icon: ShoppingBag, path: '/marketplace', roles: ['user', 'admin'] },
  { label: 'Sell Books', icon: PlusCircle, path: '/sell', roles: ['user'] },
  { label: 'My Listings', icon: Book, path: '/my-listings', roles: ['user'] },
  { label: 'All Listings', icon: Book, path: '/admin/listings', roles: ['admin'] },
  { label: 'Manage Users', icon: User, path: '/admin/users', roles: ['admin'] },
  { label: 'Activity', icon: Activity, path: '/activity', roles: ['user'] },
  { label: 'Platform Activity', icon: Activity, path: '/admin/activity', roles: ['admin'] },
  { label: 'Chatbox', icon: MessageSquare, path: '/chat', roles: ['user'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['user', 'admin'] },
];

export const DUMMY_CHATS = [
  { id: '1', name: 'Alex Rivera', lastMessage: 'Is the Algorithms book still available?', time: '2m ago', online: true },
  { id: '2', name: 'Sarah Chen', lastMessage: 'I can meet at the library at 4pm.', time: '1h ago', online: false },
  { id: '3', name: 'Jordan Smith', lastMessage: 'Thanks for the book!', time: 'Yesterday', online: false },
];

export const DUMMY_ACTIVITY = {
  sent: [
    { id: '1', book: 'The Great Gatsby', status: 'Pending', date: 'Mar 18' },
    { id: '2', book: 'Sapiens', status: 'Accepted', date: 'Mar 15' },
  ],
  received: [
    { id: '3', user: 'Mike Ross', book: 'Clean Code', status: 'New Request', date: 'Mar 18' },
  ],
  sold: [
    { id: '4', book: 'Psychology 101', price: 25, date: 'Mar 10' },
  ]
};
