import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  onRedirectToLogin: () => void;
  onRedirectToDashboard: (role: UserRole) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  onRedirectToLogin,
  onRedirectToDashboard,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-6 h-6 text-teal-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Verifying authorization...</p>
      </div>
    );
  }

  // Not logged in -> Redirect to /login
  if (!isAuthenticated || !user) {
    onRedirectToLogin();
    return null;
  }

  // Logged in but incorrect role -> Redirect to their respective dashboard
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    onRedirectToDashboard(user.role);
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
