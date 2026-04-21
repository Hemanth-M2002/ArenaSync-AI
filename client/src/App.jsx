import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './pages/Landing';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import ContextSelection from './pages/ContextSelection';
import TicketVerification from './pages/TicketVerification';
import ComingSoon from './pages/ComingSoon';
import Assistant from './pages/Assistant';
import QueueIntel from './pages/QueueIntel';
import LiveMap from './pages/LiveMap';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminGuard from './components/AdminGuard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import SplashScreen from './components/SplashScreen';
import AdminSimulator from './components/AdminSimulator';
import { useAuth } from './context/AuthContext';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 1.02, y: -10 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="h-full w-full overflow-hidden"
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  const { loading, isAuthenticated, user } = useAuth();

  // If we're loading the initial session, just show the splash
  if (loading) return <SplashScreen isVisible={true} />;

  return (
    <>
      <SplashScreen isVisible={false} />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <PageWrapper><Landing /></PageWrapper>
              </PublicRoute>
            } 
          />
          <Route 
            path="/select-context" 
            element={
              <ProtectedRoute>
                <PageWrapper><ContextSelection /></PageWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ticket-verification" 
            element={
              <ProtectedRoute>
                <PageWrapper><TicketVerification /></PageWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <PageWrapper><Register /></PageWrapper>
              </PublicRoute>
            } 
          />
          <Route 
            path="/signin" 
            element={
              <PublicRoute>
                <PageWrapper><SignIn /></PageWrapper>
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <PageWrapper><Dashboard /></PageWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/map" 
            element={
              <ProtectedRoute>
                <PageWrapper><LiveMap /></PageWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/queues" 
            element={
              <ProtectedRoute>
                <PageWrapper><QueueIntel /></PageWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assistant" 
            element={
              <ProtectedRoute>
                <PageWrapper><Assistant /></PageWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <PageWrapper><Settings /></PageWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <PageWrapper><Profile /></PageWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-login" 
            element={
              <PageWrapper><AdminLogin /></PageWrapper>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminGuard>
                <PageWrapper><AdminDashboard /></PageWrapper>
              </AdminGuard>
            } 
          />
        </Routes>
      </AnimatePresence>
      <SplashScreen />
      <AdminSimulator />
    </>
  );
}

export default App;