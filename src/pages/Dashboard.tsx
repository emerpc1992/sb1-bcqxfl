import React, { useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Logo } from '../components/Logo';
import { Inventory } from './Inventory';
import { Sales } from './Sales';
import { Expenses } from './Expenses';
import { Credits } from './Credits';
import { Reports } from './Reports';
import { Package2, ShoppingCart, DollarSign, CreditCard, BarChart3, Settings, TrendingUp, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SalesSummaryModal } from '../components/sales/SalesSummaryModal';
import { UserSettingsModal } from '../components/settings/UserSettingsModal';
import { SystemResetModal } from '../components/settings/SystemResetModal';

export const Dashboard: React.FC = () => {
  const [showSalesSummary, setShowSalesSummary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSystemReset, setShowSystemReset] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navigation = user.role === 'admin' 
    ? [
        { name: 'Reportes', href: '/dashboard/reports', icon: BarChart3, color: 'bg-blue-500 hover:bg-blue-600 text-white' },
        { name: 'Inventario', href: '/dashboard/inventory', icon: Package2, color: 'bg-purple-500 hover:bg-purple-600 text-white' },
        { name: 'Ventas', href: '/dashboard/sales', icon: ShoppingCart, color: 'bg-green-500 hover:bg-green-600 text-white' },
        { name: 'Créditos', href: '/dashboard/credits', icon: CreditCard, color: 'bg-pink-500 hover:bg-pink-600 text-white' },
        { name: 'Gastos', href: '/dashboard/expenses', icon: DollarSign, color: 'bg-red-500 hover:bg-red-600 text-white' },
      ]
    : [
        { name: 'Ventas', href: '/dashboard/sales', icon: ShoppingCart, color: 'bg-green-500 hover:bg-green-600 text-white' },
        { name: 'Créditos', href: '/dashboard/credits', icon: CreditCard, color: 'bg-pink-500 hover:bg-pink-600 text-white' },
        { name: 'Gastos', href: '/dashboard/expenses', icon: DollarSign, color: 'bg-red-500 hover:bg-red-600 text-white' },
      ];

  const dashboardStyle = user.role === 'user' ? {
    backgroundImage: 'url("https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative' as const
  } : {};

  const overlayStyle = user.role === 'user' ? {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,192,203,0.7) 100%)',
    zIndex: 0
  } : {};

  const mainContentStyle = user.role === 'user' ? {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
  } : {};

  return (
    <div className="min-h-screen relative" style={dashboardStyle}>
      {user.role === 'user' && <div style={overlayStyle} />}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="flex items-center space-x-4">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        location.pathname === item.href
                          ? item.color
                          : user.role === 'user'
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-1" />
                      {item.name}
                    </Link>
                  );
                })}
                {user.role === 'user' && (
                  <button
                    onClick={() => setShowSalesSummary(true)}
                    className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors duration-200"
                  >
                    <TrendingUp className="h-5 w-5 mr-1" />
                    Resumen
                  </button>
                )}
                {user.role === 'admin' && (
                  <>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-200"
                    >
                      <Settings className="h-5 w-5 mr-1" />
                      Configuración
                    </button>
                    <button
                      onClick={() => setShowSystemReset(true)}
                      className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                    >
                      <Trash2 className="h-5 w-5 mr-1" />
                      Resetear Sistema
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user.username} ({user.role === 'admin' ? 'Administrador' : 'Usuario'})
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-10">
        <div className="px-4 py-6 sm:px-0" style={mainContentStyle}>
          <Routes>
            {user.role === 'admin' && (
              <>
                <Route path="/reports" element={<Reports />} />
                <Route path="/inventory" element={<Inventory />} />
              </>
            )}
            <Route path="/sales" element={<Sales />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route 
              path="/" 
              element={
                <Navigate 
                  to={user.role === 'admin' ? "/dashboard/reports" : "/dashboard/sales"} 
                  replace 
                />
              } 
            />
          </Routes>
        </div>
      </main>

      {showSalesSummary && (
        <SalesSummaryModal onClose={() => setShowSalesSummary(false)} />
      )}

      {showSettings && (
        <UserSettingsModal onClose={() => setShowSettings(false)} />
      )}

      {showSystemReset && (
        <SystemResetModal onClose={() => setShowSystemReset(false)} />
      )}
    </div>
  );
};