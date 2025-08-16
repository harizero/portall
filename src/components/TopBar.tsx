import React from 'react';
import { LogOut, User, Menu, Shield, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface TopBarProps {
  onToggleSidebar: () => void;
  isCollapsed: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, isCollapsed }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logout();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Portal Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Insurance Agent Portal</h1>
              <p className="text-sm text-gray-500">Unified platform access</p>
            </div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-4">
          {/* Session Info */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">Active Session</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;