import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaxCalculator from './pages/TaxCalculator';
import TaxHistory from './pages/TaxHistory';
import TaxHistoryDetail from './pages/TaxHistoryDetail';
import Profile from './pages/Profile';
import Consultation from './pages/Consultation';
import ConsultationDetail from './pages/ConsultationDetail';
import Subscription from './pages/Subscription';
import Referral from './pages/Referral';
import Notifications from './pages/Notifications';
import NotificationDetail from './pages/NotificationDetail';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      
      <Route element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calculator" element={<TaxCalculator />} />
        <Route path="/history" element={<TaxHistory />} />
        <Route path="/history/:id" element={<TaxHistoryDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/consultation/:id" element={<ConsultationDetail />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notifications/:id" element={<NotificationDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
