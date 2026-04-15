import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaxCalculator from './pages/TaxCalculator';
import TaxHistory from './pages/TaxHistory';
import Profile from './pages/Profile';
import Consultation from './pages/Consultation';
import Subscription from './pages/Subscription';
import Referral from './pages/Referral';

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/referral" element={<Referral />} />
      </Route>
    </Routes>
  );
}

export default App;
