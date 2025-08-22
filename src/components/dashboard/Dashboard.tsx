import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserProfile from '../profile/UserProfile';
import BusinessProfile from '../business/BusinessProfile';
import SuperAdminDashboard from '../admin/SuperAdminDashboard';
import { Loader2, Shield, Building, User, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to access your dashboard</p>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    
    case 'business_owner':
      return <BusinessProfile />;
    
    case 'user':
      return <UserProfile />;
    
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unknown Role</h2>
            <p className="text-gray-600">Your account has an unrecognized role. Please contact support.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;
