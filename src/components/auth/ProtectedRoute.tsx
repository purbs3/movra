import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  onRedirectToLogin?: () => void;
  onRedirectToDashboard?: (role: UserRole) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 bg-slate-50">
        <RefreshCw className="w-6 h-6 text-teal-700 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Verifying clinical authorization...</p>
      </div>
    );
  }

  // Not logged in -> Declaratively navigate to /login without triggering setState during render
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin has full universal access to all routes (Patient, Physio, Admin)
  if (user.role === 'admin') {
    return <>{children}</>;
  }

  // Logged in but incorrect role -> Redirect to their respective dashboard declaratively
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const target = user.role === 'physiotherapist' ? '/physio-dashboard' : '/dashboard';
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
