import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Layout & UI
import { Preloader } from './components/layout/Preloader';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderLookupPage } from './pages/OrderLookupPage';
import { ReservationPage } from './pages/ReservationPage';
import { ReservationLookupPage } from './pages/ReservationLookupPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Portal Pages
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboardPage } from './admin/AdminDashboardPage';
import { AdminMenuPage } from './admin/AdminMenuPage';
import { AdminOrdersPage } from './admin/AdminOrdersPage';
import { AdminReservationsPage } from './admin/AdminReservationsPage';
import { AdminReviewsPage } from './admin/AdminReviewsPage';
import { AdminSettingsPage } from './admin/AdminSettingsPage';

// Utility: Automatically scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Customer Layout Wrapper
const StorefrontLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <CartDrawer />
      <FloatingWhatsApp />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Preloader />

          <Routes>
            {/* Customer Storefront Routes */}
            <Route element={<StorefrontLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:reference" element={<OrderConfirmationPage />} />
              <Route path="/order-lookup" element={<OrderLookupPage />} />
              <Route path="/reservations" element={<ReservationPage />} />
              <Route path="/reservation-lookup" element={<ReservationLookupPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin-login" element={<AdminLoginPage />} />

            {/* Protected Staff & Admin Portal */}
            <Route path="/admin-dashboard" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="menu" element={<AdminMenuPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="reservations" element={<AdminReservationsPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </CartProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;
