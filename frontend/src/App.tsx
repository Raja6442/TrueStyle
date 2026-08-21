import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './layouts/Navbar';
import { Footer } from './layouts/Footer';
import { Chatbot } from './components/Chatbot';
import { SplashScreen } from './components/SplashScreen';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { HelpCentrePage } from './pages/HelpCentrePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OtpVerificationPage } from './pages/OtpVerificationPage';
import { ProductVerificationPage } from './pages/ProductVerificationPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { FirstSitePage } from './pages/FirstSitePage';
import { TruePricePage } from './pages/TruePricePage';
import { ReviewRatePage } from './pages/ReviewRatePage';

// Scroll to top helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-accent selection:text-foreground">
          {/* Main Navigation */}
          <Navbar />

          {/* Page Routing */}
          <main className="flex-grow">
            <Routes>
              {/* Gated Public Routes */}
              <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
              <Route path="/features" element={<ProtectedRoute><FeaturesPage /></ProtectedRoute>} />
              <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
              <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
              <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
              <Route path="/blog/:id" element={<ProtectedRoute><BlogPostPage /></ProtectedRoute>} />
              <Route path="/terms" element={<ProtectedRoute><TermsPage /></ProtectedRoute>} />
              <Route path="/privacy" element={<ProtectedRoute><PrivacyPolicyPage /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><HelpCentrePage /></ProtectedRoute>} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/firstsite" element={<ProtectedRoute><FirstSitePage /></ProtectedRoute>} />
              <Route path="/trueprice" element={<ProtectedRoute><TruePricePage /></ProtectedRoute>} />
              <Route path="/review-rate" element={<ProtectedRoute><ReviewRatePage /></ProtectedRoute>} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-otp" element={<OtpVerificationPage />} />
              
              {/* Protected User Routes */}
              <Route 
                path="/verify" 
                element={
                  <ProtectedRoute allowedRoles={['user', 'admin']}>
                    <ProductVerificationPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['user', 'admin']}>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback */}
              <Route path="*" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
            </Routes>
          </main>

          {/* Global Floating AI Support Bot */}
          <Chatbot />

          {/* Footer Navigation */}
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
