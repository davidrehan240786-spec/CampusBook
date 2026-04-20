
// coderabbit full review trigger

import { Book, ShoppingBag, Activity, MessageSquare, Settings, Search, User, MapPin, PlusCircle, LogIn } from 'lucide-react';

export const BOOK_CATEGORIES = ['Novels', 'Textbooks', 'Comic Books', 'Study Guides', 'Magazines', 'Other'];

export const CAMPUSES = [
  { short: 'KLE', full: 'KLE Technological University' },
  { short: 'KUD', full: 'Karnatak University Dharwad' },
  { short: 'IIIT', full: 'IIIT Dharwad' },
  { short: 'JCET', full: 'Jain College Of Engineering and Technology' },
  { short: 'SDM', full: 'SDM College of Engineering and Technology' },
  { short: 'BVB', full: 'B.V. B College of Engineering and Technology' },
  { short: 'Other', full: 'Other' }
];

export const DUMMY_BOOKS = [];
export const DUMMY_USERS = [];

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
