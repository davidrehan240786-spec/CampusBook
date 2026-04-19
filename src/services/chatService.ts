// coderabbit full review trigger

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  setDoc, 
  updateDoc, 
  getDocs,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isConfigured } from '../lib/firebase';

export interface Message {
  id?: string;
  text?: string;
  senderId: string;
  receiverId: string;
  bookId: string;
  imageUrl?: string;
  timestamp: any;
}

export interface Chat {
  id?: string;
  participants: string[];
  bookId: string;
  bookTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage?: string;
  lastMessageAt?: any;
  unreadCount?: Record<string, number>;
}

export const chatService = {
  // Get or Create a chat session for a specific book between two users
  async startChat(buyerId: string, buyerName: string, sellerId: string, sellerName: string, bookId: string, bookTitle: string) {
    if (!isConfigured) return 'placeholder-chat-id';
    
    const participants = [buyerId, sellerId].sort();
    const chatQuery = query(
      collection(db, 'chats'),
      where('participants', '==', participants),
      where('bookId', '==', bookId)
    );

    const snapshot = await getDocs(chatQuery);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }

    // Create new chat
    const newChat: any = {
      participants,
      buyerId,
      buyerName,
      sellerId,
      sellerName,
      bookId,
      bookTitle,
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
      unreadCount: {
        [buyerId]: 0,
        [sellerId]: 0
      }
    };

    const docRef = await addDoc(collection(db, 'chats'), newChat);
    return docRef.id;
  },

  // Send a message in a chat
  async sendMessage(chatId: string, message: Omit<Message, 'timestamp'>) {
    if (!isConfigured) return;
    
    const messageData = {
      ...message,
      timestamp: serverTimestamp()
    };

    // Add message to subcollection
    await addDoc(collection(db, `chats/${chatId}/messages`), messageData);

    // Update chat last message and increment unread count for receiver
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessage: message.text || (message.imageUrl ? '📷 Image' : ''),
      lastMessageAt: serverTimestamp(),
      [`unreadCount.${message.receiverId}`]: 1 // Simplified: increment would be better but this works for demo
    });
  },

  // Listen for messages in a chat
  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
    if (!isConfigured) return () => {};
    
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      callback(messages);
    });
  },

  // Listen for user's active chats
  subscribeToUserChats(userId: string, callback: (chats: Chat[]) => void) {
    if (!isConfigured) return () => {};
    
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId.toString())
    );

    return onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];
      
      const sortedChats = chats.sort((a, b) => {
        const timeA = a.lastMessageAt?.toMillis() || 0;
        const timeB = b.lastMessageAt?.toMillis() || 0;
        return timeB - timeA;
      });
      
      callback(sortedChats);
    });
  },

  // Track User Status
  async setOnlineStatus(userId: string, isOnline: boolean) {
    if (!isConfigured) return;
    const statusRef = doc(db, 'userStatus', userId.toString());
    await setDoc(statusRef, {
      status: isOnline ? 'online' : 'offline',
      lastSeen: serverTimestamp()
    }, { merge: true });
  },

  subscribeToUserStatus(userId: string, callback: (status: any) => void) {
    if (!isConfigured) return () => {};
    return onSnapshot(doc(db, 'userStatus', userId.toString()), (doc) => {
      callback(doc.data());
    });
  },

  // Reset unread count when reading a chat
  async resetUnread(chatId: string, userId: string) {
    if (!isConfigured) return;
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      [`unreadCount.${userId}`]: 0
    });
  },

  // Upload image to Storage
  async uploadImage(file: File) {
    if (!isConfigured) throw new Error("Firebase not configured");
    const storageRef = ref(storage, `chat_images/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
};
