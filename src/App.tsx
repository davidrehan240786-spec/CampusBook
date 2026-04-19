import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Navigate } from 'react-router-dom';
import { MarketplacePage } from './pages/MarketplacePage';
import { SellBooksPage } from './pages/SellBooksPage';
import { ActivityPage } from './pages/ActivityPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminListingsPage } from './pages/AdminListingsPage';
import { AdminActivityPage } from './pages/AdminActivityPage';
import { Sidebar, TopBar } from './components/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { getCurrentUser, isLoggedIn } from './lib/auth';
import { ToastProvider } from './components/Toast';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const user = getCurrentUser();
  const authenticated = isLoggedIn();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/marketplace" replace />;
  }

  return <>{children}</>;
};

const AppLayout = ({ children, title }: { children: React.ReactNode, title: string }) => {
  return (
    <div className="flex min-h-screen bg-background text-dark">
      <Sidebar />
      <main className="flex-1 ml-72 flex flex-col">
        <TopBar title={title} />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.02, y: -10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const user = getCurrentUser();

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/marketplace" element={
            <ProtectedRoute>
              <AppLayout title={user.role === 'admin' ? 'Marketplace (Admin View)' : 'Marketplace'}>
                <PageTransition><MarketplacePage /></PageTransition>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/sell" element={
            <ProtectedRoute>
              <AppLayout title="Sell Books">
                <PageTransition><SellBooksPage /></PageTransition>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/my-listings" element={
            <ProtectedRoute>
              <AppLayout title="My Listings">
                <PageTransition><MyListingsPage /></PageTransition>
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes - FIXED: Using actual components instead of placeholders */}
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly>
              <AppLayout title="Users Management">
                <PageTransition><AdminUsersPage /></PageTransition>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/listings" element={
            <ProtectedRoute adminOnly>
              <AppLayout title="All Listings">
                <PageTransition><AdminListingsPage /></PageTransition>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/activity" element={
            <ProtectedRoute adminOnly>
              <AppLayout title="Platform Activity">
                <PageTransition><AdminActivityPage /></PageTransition>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/activity" element={
            <ProtectedRoute>
              <AppLayout title="Activity">
                <PageTransition><ActivityPage /></PageTransition>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <AppLayout title="Chatbox">
                <PageTransition><ChatPage /></PageTransition>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <AppLayout title="Profile Settings">
                <PageTransition><ProfilePage /></PageTransition>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <AppLayout title="Student Profile">
                <PageTransition><ProfilePage /></PageTransition>
              </AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
