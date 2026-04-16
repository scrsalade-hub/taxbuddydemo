import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { assets } from '../assets/assets';
import { 
  LayoutDashboard, 
  Calculator, 
  History, 
  User, 
  LogOut, 
  Menu,
  Crown,
  Gift,
  Headphones,
  Bell
} from 'lucide-react';
import { useState } from 'react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calculator, label: 'Tax Calculator', path: '/calculator' },
  { icon: History, label: 'Tax History', path: '/history' },
  { icon: Bell, label: 'Notifications', path: '/notifications', showBadge: true },
];

const premiumItems = [
  { icon: Headphones, label: 'Consultation', path: '/consultation' },
  { icon: Crown, label: 'Subscription', path: '/subscription' },
  { icon: Gift, label: 'Referral', path: '/referral' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img 
              src={assets.logo} 
              alt="TaxBuddy" 
              className="object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">Main Menu</p>
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive(item.path) 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-primary-light hover:text-primary'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </div>
                {item.showBadge && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="mt-8 space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">Premium</p>
            {premiumItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive(item.path) 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-primary-light hover:text-primary'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">Account</p>
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive('/profile') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-primary-light hover:text-primary'
                }
              `}
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Welcome back, {user?.firstName}!
                </h2>
                <p className="text-sm text-gray-500">
                  {user?.accountType === 'business' ? user.businessName : 'Individual Account'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification Bell in Header */}
              <Link to="/notifications" className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium uppercase
                ${user?.subscription === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                  user?.subscription === 'pro' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'}
              `}>
                {user?.subscription}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
